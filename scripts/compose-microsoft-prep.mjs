#!/usr/bin/env node
/** Mount the explicitly versioned public MB-800 practice guide without copying authoring/private files. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const GUIDE_PATH = '/courses/mb-800-exam-preparation/';
export const GUIDE_ID = 'MB-800-PREP';
export function compose({root, source, expectedCommit, upstreamSitemap}) {
  if (!/^[a-f0-9]{40}$/.test(expectedCommit || '')) throw new Error('A full immutable Microsoft commit is required.');
  const actual = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  if (actual !== expectedCommit) throw new Error('Microsoft source does not match the reviewed commit.');
  const sourceCourse = path.join(source, GUIDE_PATH);
  const manifest = JSON.parse(fs.readFileSync(path.join(sourceCourse, 'manifest.json'), 'utf8'));
  const course = manifest.courses?.find(item => item.courseId === GUIDE_ID);
  if (manifest.courses?.length !== 1 || !course || course.path !== GUIDE_PATH || course.contentAccess !== 'public') {
    throw new Error('The Microsoft guide manifest has an unexpected identity, route or access policy.');
  }
  if (course.registrationPath !== '/course-registration/?course=MB-800-PREP') throw new Error('Guide registration must use the Academy enquiry route.');
  const expectedRoutes = [course.path, ...(course.modules || []).map(item => item.path), GUIDE_PATH+'mock-exam/', GUIDE_PATH+'study-plan/'];
  if (!course.modules?.length || new Set(expectedRoutes).size !== expectedRoutes.length) throw new Error('Guide routes are missing or duplicated.');
  const output = path.join(root, GUIDE_PATH);
  fs.rmSync(output, {recursive:true, force:true});
  fs.mkdirSync(output, {recursive:true});
  for (const route of expectedRoutes) {
    if (!route.startsWith(GUIDE_PATH) || !/^\/courses\/mb-800-exam-preparation\/(?:[a-z0-9-]+\/)?$/.test(route)) throw new Error('Unsafe guide route: '+route);
    const relative = route.slice(GUIDE_PATH.length);
    const file = path.join(sourceCourse, relative, 'index.html');
    const html = fs.readFileSync(file,'utf8');
    if (!html.includes('https://www.skunkworksacademy.com'+route)) throw new Error('Guide canonical URL is missing: '+route);
    for (const token of ['data-swa-owned-course-shell="MB-800-PREP"', 'skunkworks-ui.js', 'skunkworks-footer.js']) {
      if (!html.includes(token)) throw new Error('Guide shared shell missing '+token+' on '+route);
    }
    const destination = path.join(output, relative, 'index.html');
    fs.mkdirSync(path.dirname(destination), {recursive:true});
    fs.copyFileSync(file,destination);
  }
  const assetRoot = path.join(sourceCourse,'assets');
  for (const entry of fs.readdirSync(assetRoot,{withFileTypes:true})) {
    if (!entry.isFile() || !/^[a-z0-9.-]+\.(css|js|mjs|json|svg|png|pdf)$/.test(entry.name)) throw new Error('Unsupported guide asset: '+entry.name);
    fs.mkdirSync(path.join(output,'assets'),{recursive:true});
    fs.copyFileSync(path.join(assetRoot,entry.name),path.join(output,'assets',entry.name));
  }
  fs.copyFileSync(path.join(sourceCourse,'manifest.json'),path.join(output,'manifest.json'));
  fs.writeFileSync(path.join(output,'release.json'),JSON.stringify({repository:'skunkworks-academy/microsoft',commit:expectedCommit,version:manifest.version,courseId:GUIDE_ID},null,2)+'\n');
  const rootManifestFile = path.join(root,'course-manifest.json');
  const rootManifest = JSON.parse(fs.readFileSync(rootManifestFile,'utf8'));
  if (rootManifest.courses.some(item => item.courseId === GUIDE_ID && item.path !== GUIDE_PATH)) throw new Error('The guide ID conflicts with an existing course.');
  rootManifest.courses = [...rootManifest.courses.filter(item => item.courseId !== GUIDE_ID), course];
  fs.writeFileSync(rootManifestFile,JSON.stringify(rootManifest,null,2)+'\n');
  const sitemap = fs.readFileSync(path.join(sourceCourse,'sitemap.xml'),'utf8');
  const guideEntries = [...sitemap.matchAll(/<url\b[^>]*>[\s\S]*?<\/url>/g)].map(item=>item[0]);
  if (guideEntries.length !== expectedRoutes.length) throw new Error('Guide sitemap does not cover exactly the published routes.');
  for(const route of expectedRoutes) if(!sitemap.includes('<loc>https://www.skunkworksacademy.com'+route+'</loc>')) throw new Error('Missing guide sitemap route: '+route);
  let upstream = fs.readFileSync(upstreamSitemap,'utf8');
  upstream = upstream.replace(/<url\b[^>]*>[\s\S]*?<\/url>/g,item => item.includes('https://www.skunkworksacademy.com'+GUIDE_PATH) ? '' : item);
  if (!/<\/urlset>\s*$/.test(upstream)) throw new Error('The upstream sitemap must be an XML urlset.');
  fs.writeFileSync(upstreamSitemap,upstream.replace(/<\/urlset>\s*$/,guideEntries.join('\n')+'\n</urlset>\n'));
  // This section sits outside the React root so hydration cannot erase it.
  const section = '<section id="mb800-preparation-discovery" aria-labelledby="mb800-preparation-title" style="max-width:75rem;margin:2rem auto;padding:1.5rem;background:var(--sk-layer-01);color:var(--sk-text-primary);border:1px solid var(--sk-border-subtle)"><h2 id="mb800-preparation-title">Microsoft certification preparation</h2><p><a href="'+GUIDE_PATH+'">MB-800 Business Central Certification Exam Preparation</a></p><p>Eight learning modules, practical exercises, a 100-minute original practice exam and a review of every answer. Public formative preparation with results saved on this device.</p><a href="/course-registration/?course=MB-800-PREP">Ask about guided MB-800 preparation</a></section>';
  for(const name of ['courses.html','courses/index.html']) {
    const file = path.join(root,name);
    let html = fs.readFileSync(file,'utf8').replace(/<section id="mb800-preparation-discovery"[\s\S]*?<\/section>/,'');
    if (!/<\/body>/i.test(html)) throw new Error('Course catalogue document has no body: '+name);
    fs.writeFileSync(file,html.replace(/<\/body>/i,section+'\n</body>'));
  }
  return {courseId:GUIDE_ID, routes:expectedRoutes.length, commit:expectedCommit};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2);
  const arg=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
  console.log(compose({root:path.resolve(arg('--root','.')),source:path.resolve(arg('--source','.microsoft-course')),expectedCommit:arg('--commit',''),upstreamSitemap:path.resolve(arg('--upstream-sitemap','.course-catalog/build/sitemap.xml'))}));
}
