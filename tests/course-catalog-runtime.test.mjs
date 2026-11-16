import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function runtime(){
 const sandbox={window:{},document:{readyState:'complete',querySelectorAll(){return [];}}};
 vm.runInNewContext(fs.readFileSync(new URL('../assets/course-catalog.generated.js',import.meta.url),'utf8'),sandbox,{timeout:1000});
 const source=fs.readFileSync(new URL('../assets/course-catalog-renderer.js',import.meta.url),'utf8');
 vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, 'window.testCatalog = {validatePayload, normaliseCourse};})();'),sandbox,{timeout:1000});
 return sandbox.window;
}
test('the current catalogue including MB-800 loads through the actual browser runtime validator',()=>{
 const window=runtime();const data=window.SKUNKWORKS_COURSE_CATALOG_DATA;
 assert.equal(data.courses.length,184);assert.equal(window.testCatalog.validatePayload(data),data);
 const row=data.courses.find(row=>row[data.fields.indexOf('courseId')]==='MB-800-PREP');assert.ok(row);
 const course=window.testCatalog.normaliseCourse(data.fields,row);
 assert.equal(course.enrollUrl,'/course-registration/?course=MB-800-PREP');
 assert.equal(course.courseUrl,'https://www.skunkworksacademy.com/courses/mb-800-exam-preparation/');
});
test('browser runtime rejects mismatched counts and duplicate identities',()=>{
 const window=runtime(),data=window.SKUNKWORKS_COURSE_CATALOG_DATA;
 assert.throws(()=>window.testCatalog.validatePayload({...data,courseCount:data.courseCount-1}),/count or schema/);
 const rows=[...data.courses];rows[0]=rows[1];assert.throws(()=>window.testCatalog.validatePayload({...data,courses:rows}),/duplicate/);
});
