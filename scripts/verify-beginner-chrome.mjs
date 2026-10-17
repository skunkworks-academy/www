import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Guarantees that each canonical beginner lesson has the shared Academy
// chrome, accessible SSR practice content, and locally mounted illustration.
const root=process.cwd();
const slugs=['ai','cyber','it-support','microsoft-productivity','cloud'];
let checked=0;
for(const slug of slugs){
  const courseDir=path.join(root,'digital-platform-courses','beginner',slug);
  for(const rel of ['index.html','course-guide/index.html','modules/01/index.html',
    'modules/02/index.html','modules/03/index.html','modules/04/index.html',
    'modules/05/index.html','modules/06/index.html',
    'labs/lab-01/index.html','labs/lab-02/index.html','labs/lab-03/index.html',
    'assessment/knowledge-check/index.html','assessment/capstone/index.html',
    'assessment/rubric/index.html','references/index.html']){
    const file=path.join(courseDir,rel);
    assert.ok(fs.existsSync(file),'Missing course page: '+file);
    const html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes('assets/skunkworks-ui.js'),'Academy header not loaded: '+file);
    assert.ok(html.includes('assets/skunkworks-footer.js'),'Academy footer not loaded: '+file);
    assert.ok(html.includes('studioFlip'),'Flip-card practice missing from server-rendered page: '+file);
    assert.ok(html.includes('studioHeroArt'),'Illustrated learning studio missing from page: '+file);
    assert.ok(html.includes('aria-label'),'Accessible lesson labels missing: '+file);
    assert.ok(!/rel=["']canonical["'][^>]*github\.io/i.test(html),'External canonical source leaked: '+file);
    checked++;
  }
  const art=path.join(root,'digital-platform-courses','img','learning-studio',slug+'.svg');
  assert.ok(fs.statSync(art).size>1000,'Original illustration missing or too small: '+art);
}
const loader=fs.readFileSync('assets/academy-navigation.js','utf8');
assert.ok(loader.includes('pathname.startsWith("/digital-platform-courses/")'),
  'Legacy DOM-mutating navigation must not load inside Docusaurus React pages');
console.log('Beginner course quality gate passed: '+checked+' rendered learning pages, five illustrations, Academy global header/footer.');
