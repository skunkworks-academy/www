#!/usr/bin/env node
/**
 * Merge the canonical Docusaurus course sitemap into the Academy root sitemap,
 * create extensionless GitHub Pages deep-link aliases and verify publication.
 *
 * Before staging: node scripts/publish-course-contract.mjs
 * After staging:  node scripts/publish-course-contract.mjs --verify --root _site
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const position = args.indexOf(name);
  return position === -1 ? fallback : args[position + 1];
}
const verify = args.includes('--verify');
const root = path.resolve(arg('--root', '.'));
const sourceSitemap = path.resolve(arg('--source-sitemap', '.course-catalog/build/sitemap.xml'));
const host = 'https://www.skunkworksacademy.com';
const manifestFile = path.join(root, 'course-manifest.json');
const sitemapFile = path.join(root, 'sitemap.xml');

function mustRead(location) {
  if (!fs.existsSync(location)) throw new Error('Missing course publishing artifact: ' + location);
  return fs.readFileSync(location, 'utf8');
}
function urlEntries(xml) {
  const result = [];
  for (const item of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)) {
    const match = /<loc>([^<]+)<\/loc>/i.exec(item[1]);
    if (!match) throw new Error('A sitemap URL entry has no <loc>.');
    const loc = match[1].replaceAll('&amp;', '&');
    let url;
    try { url = new URL(loc); }
    catch { throw new Error('Invalid sitemap URL: ' + loc); }
    result.push({loc, url, xml: item[0]});
  }
  return result;
}
function courseEntry(entry) {
  return entry.url.origin === host &&
    (entry.url.pathname === '/courses' || entry.url.pathname.startsWith('/courses/'));
}
function pathOf(entry) {
  return entry.url.pathname.replace(/\/$/, '') || '/';
}
function ensureHtml(pathname) {
  if (!/^\/courses(?:\/[a-z0-9][a-z0-9/-]*)?\/?$/.test(pathname) ||
      pathname.includes('//') || pathname.includes('..')) {
    throw new Error('Unsafe course route: ' + pathname);
  }
  const relative = pathname.replace(/^\/+|\/+$/g, '');
  if (!relative || relative === 'courses') {
    const index = path.join(root, 'courses/index.html');
    if (!fs.existsSync(index)) throw new Error('Course index missing: ' + index);
    return index;
  }
  const html = path.join(root, relative + '.html');
  const alias = path.join(root, relative, 'index.html');
  if (fs.existsSync(html)) return html;
  if (fs.existsSync(alias)) return alias;
  throw new Error('Course URL has no deployed HTML: ' + pathname);
}
function ensureAlias(pathname) {
  if (pathname === '/courses' || pathname === '/courses/') return;
  const relative = pathname.replace(/^\/+|\/+$/g, '');
  const html = path.join(root, relative + '.html');
  const alias = path.join(root, relative, 'index.html');
  if (!fs.existsSync(html) || fs.existsSync(alias)) return;
  fs.mkdirSync(path.dirname(alias), {recursive: true});
  fs.copyFileSync(html, alias);
}
function verifyHtml(entry) {
  const html = mustRead(ensureHtml(pathOf(entry)));
  if (!html.includes('<html') || !html.includes('academy-navigation.js')) {
    throw new Error('Academy shell missing in ' + entry.loc);
  }
  if (!html.includes('rel="canonical"') || !html.includes(entry.loc)) {
    throw new Error('Canonical course URL missing in HTML: ' + entry.loc);
  }
}

const manifest = JSON.parse(mustRead(manifestFile));
if (!Array.isArray(manifest.courses) || !manifest.courses.length) {
  throw new Error('A populated course-manifest.json is mandatory.');
}
const expectedCourses = new Map();
for (const course of manifest.courses) {
  if (!course.courseId || !course.path || !course.path.startsWith('/courses/')) {
    throw new Error('Malformed course manifest entry: ' + JSON.stringify(course));
  }
  if (expectedCourses.has(course.path)) throw new Error('Duplicate manifest path: ' + course.path);
  expectedCourses.set(course.path, course.courseId);
}
function verifyRootSitemap() {
  const xml = mustRead(sitemapFile);
  if (!/<urlset\b/i.test(xml) || !/<\/urlset>\s*$/i.test(xml)) {
    throw new Error('Academy root sitemap is not an XML urlset.');
  }
  const entries = urlEntries(xml);
  const seen = new Set();
  const courseUrls = [];
  for (const entry of entries) {
    if (seen.has(entry.loc)) throw new Error('Duplicate sitemap URL: ' + entry.loc);
    seen.add(entry.loc);
    if (courseEntry(entry)) courseUrls.push(entry);
  }
  for (const [route, id] of expectedCourses) {
    if (!seen.has(host + route)) throw new Error(id + ' is missing from the Academy root sitemap: ' + route);
  }
  if (!seen.has(host + '/courses') && !seen.has(host + '/courses/')) {
    throw new Error('Course catalog landing is missing from the root sitemap.');
  }
  if (!fs.existsSync(path.join(root, 'course-registration/index.html'))) {
    throw new Error('Academy course registration route is missing.');
  }
  if (!fs.existsSync(path.join(root, 'assets/academy-navigation.js')) ||
      !fs.existsSync(path.join(root, 'assets/skunkworks-footer.js'))) {
    throw new Error('Canonical header/footer assets are missing.');
  }
  for (const entry of courseUrls) {
    ensureHtml(pathOf(entry));
    verifyHtml(entry);
  }
  console.log('Course release gate passed: ' + expectedCourses.size + ' manifested courses, ' +
    courseUrls.length + ' indexed /courses routes, shared shell, footer assets and registration route.');
}
if (verify) {
  verifyRootSitemap();
} else {
  const source = mustRead(sourceSitemap);
  const upstream = urlEntries(source).filter(courseEntry);
  if (!upstream.length) throw new Error('Upstream Docusaurus sitemap has no Academy course URLs.');
  const addedPaths = new Set(upstream.map(item => pathOf(item)));
  for (const [route, id] of expectedCourses) {
    if (!addedPaths.has(route)) throw new Error(id + ' missing from Docusaurus sitemap: ' + route);
  }
  if (!addedPaths.has('/courses')) throw new Error('Docusaurus sitemap lacks /courses landing.');
  for (const entry of upstream) {
    if (entry.url.search || entry.url.hash) throw new Error('Non-canonical sitemap query/fragment: ' + entry.loc);
    ensureHtml(pathOf(entry));
    ensureAlias(pathOf(entry));
  }
  const existing = mustRead(sitemapFile);
  if (!/<\/urlset>\s*$/i.test(existing)) throw new Error('Root sitemap must end in </urlset>.');
  // Recomposition is idempotent: replace the previous /courses cohort so
  // retired routes disappear and URLs are not duplicated.
  const retained = urlEntries(existing).filter(item => !courseEntry(item));
  const originalUrlBlocks = [...existing.matchAll(/<url\b[^>]*>[\s\S]*?<\/url>/gi)];
  const withoutCourses = existing.replace(/<url\b[^>]*>[\s\S]*?<\/url>/gi, '');
  const allEntries = [...retained, ...upstream].sort((a, b) => a.loc.localeCompare(b.loc));
  const distinct = new Map();
  for (const entry of allEntries) {
    if (distinct.has(entry.loc)) throw new Error('Duplicate canonical URL across sitemaps: ' + entry.loc);
    distinct.set(entry.loc, entry.xml);
  }
  const output = withoutCourses.replace(/<\/urlset>\s*$/i,
    '  ' + [...distinct.values()].join('\n  ') + '\n</urlset>\n');
  if (originalUrlBlocks.length === 0) throw new Error('Root sitemap unexpectedly has no published URLs.');
  fs.writeFileSync(sitemapFile, output);
  console.log('Merged ' + upstream.length + ' Docusaurus course URLs into Academy sitemap, creating extensionless route aliases.');
  verifyRootSitemap();
}
