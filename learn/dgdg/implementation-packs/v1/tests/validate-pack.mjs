import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const dir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const get = path => readFileSync(resolve(dir, path), "utf8");
const courses = JSON.parse(get("dgdg-course-features.json"));
const lessons = JSON.parse(get("dgdg-lesson-visual-map.json"));
const html = get("prototype/index.html");
const css = get("prototype/interactive.css");
const js = get("prototype/interactive.js");
const spec = get("DGDG_Visual_Interactive_Enhancement_Pack_v1.md");

assert.equal(courses.length, 10, "Exactly ten courses");
assert.equal(lessons.length, 40, "Exactly forty lesson mappings");
assert.deepEqual(courses.map(c => c.id), Array.from({length:10},(_,i)=>"DGDG-"+(101+i)));
assert.equal(new Set(courses.map(c=>c.slug)).size, 10, "Unique course slugs");
assert.equal(new Set(lessons.map(l=>l.sourceUrl)).size, 40, "Unique lesson pages");

for (const c of courses) {
  assert.equal(c.lessons.length, 4, c.id+" has four lessons");
  assert.ok(c.flagship && c.labDeliverable && c.diagramTitle, c.id+" feature brief");
  assert.ok(c.canonical.endsWith("/learn/dgdg/courses/"+c.slug+"/"));
  assert.ok(c.diagram.startsWith("diagrams/"));
  const diagramPath = "prototype/"+c.diagram;
  assert.ok(existsSync(resolve(dir,diagramPath)), c.id+" SVG missing");
  const svg=get(diagramPath);
  for (const term of ['xmlns="http://www.w3.org/2000/svg"','viewBox="0 0 1200 600"','<title','<desc','</svg>']) {
    assert.ok(svg.includes(term), c.id+" SVG missing "+term);
  }
  for(const node of c.nodes)assert.ok(svg.includes(node),c.id+" SVG missing stage "+node);
  for(let i=1;i<=4;i++) {
    const page="/learn/dgdg/courses/"+c.slug+"/lesson-0"+i+"/";
    const map=lessons.find(l=>l.sourceUrl===page);
    assert.ok(map,c.id+" lesson map missing "+i);
    assert.equal(map.widgetId,c.lessons[i-1].activity);
    assert.ok(map.visualAlt && map.visualFocus && map.experience.length===4);
  }
}

assert.ok(html.includes('src="./interactive.js"'), "Prototype JS linked");
assert.ok(html.includes('href="./interactive.css"'), "Prototype CSS linked");
assert.ok(!/<section[^>]*role="tabpanel"[^>]*hidden>/.test(html), "No-JS fallback: no hidden panels in source");
assert.equal((html.match(/role="tab" /g)||[]).length, 4, "Four tab roles");
for(const id of ["saveDevice","eraseLocal","compute","calcResult","hotspotDetail","decisionResult","notes","exportNotes","taskProgress"])assert.ok(html.includes('id="'+id+'"'),"Missing control "+id);
assert.ok(css.includes("prefers-reduced-motion"), "Reduced motion control");
assert.ok(css.includes(".dgdg-enhanced"), "Styles are scoped");
assert.ok(js.includes("localStorage.removeItem"),"Learner can erase device state");
assert.ok(!js.includes("fetch(")&&!js.includes("XMLHttpRequest"),"No networked learner telemetry");
assert.ok(!spec.includes("undefined"),"No missing spec feature");
console.log("PASS: 10 courses, 40 lessons, 10 diagrams, usable no-JS content, scoped CSS, prototype controls.");
