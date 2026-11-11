import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterCourses,dayInZone,requestUrl} from '../assets/schedule-model.mjs';
import {transformIbmFeed} from '../scripts/import-ibm-schedule-catalogue.mjs';
const catalogue=JSON.parse(readFileSync(new URL('../data/schedule/catalogue.json',import.meta.url)));
const defaults={query:'',vendor:'',format:'',from:'',to:'',status:'',timezone:'Africa/Johannesburg',mode:'all'};
test('every central source course is discoverable, with no fixed catalogue size',()=>{
  const upstream=JSON.parse(readFileSync(new URL('../data/schedule/upstream-catalogue.json',import.meta.url)));
  for(const row of [...upstream.generated,...upstream.published,...upstream.manifest,...upstream.curated])assert.ok(catalogue.courses.some(c=>c.courseId===row.courseId||c.aliases.includes(row.courseId)),row.courseId);
  assert.equal(filterCourses(catalogue.courses,[],defaults).length,catalogue.courses.length);
});
test('every IBM feed code survives including different delivery codes sharing a title',()=>{
  const feed=JSON.parse(readFileSync(new URL('../data/schedule/ibm-catalogue.json',import.meta.url)));
  for(const row of feed.courses)assert.ok(catalogue.courses.some(c=>c.courseId===row.courseId||c.aliases.includes(row.courseId)),row.courseId);
  assert.notEqual(catalogue.courses.find(c=>c.courseId==='0A069G'),catalogue.courses.find(c=>c.courseId==='0E069G'));
});
test('filters vendor, words, dates and formats and retains undated catalogue in default mode',()=>{
  const c=catalogue.courses.find(c=>c.vendor==='Microsoft');const s={id:'test',courseId:c.courseId,format:'online',status:'proposed',slots:[{start:'2099-01-01T23:00:00Z',end:'2099-01-02T01:00:00Z'}]};
  assert.equal(filterCourses([c],[s],{...defaults,from:'2099-01-02',to:'2099-01-02',format:'online'}).length,1);
  assert.equal(filterCourses([c],[s],{...defaults,vendor:'Cisco'}).length,0);
  assert.equal(filterCourses([c],[],{...defaults,mode:'scheduled'}).length,0);
  assert.equal(filterCourses([c],[],defaults).length,1);assert.equal(dayInZone(s.slots[0].start,'Africa/Johannesburg'),'2099-01-02');
});
test('training request carries course, session and timezone safely',()=>{const c=catalogue.courses[0];const url=new URL(requestUrl(c,{id:'a&b',format:'online',slots:[{start:'2099-01-01T00:00:00Z'}]},'Africa/Johannesburg','all'),'https://example.org');assert.equal(url.searchParams.get('course'),c.title);assert.equal(url.searchParams.get('session'),'a&b');assert.equal(url.pathname,'/course-registration/');});
test('IBM import strips markup, excludes prices and blocks uncertain/expired/replaced records',()=>{
  const row={COURSECODE:'TEST',TITLE:'<b>Test</b><script>alert(1)</script>',CONTENT_AVAILABILITY:'Content Available',EXPIREDATE:'2099-01-01 00:00:00',PRICE:999};
  const result=transformIbmFeed([row],'2026-11-11')[0];assert.equal(result.title,'Test');assert.equal(result.PRICE,undefined);assert.equal(result.schedulingEligibility,'requires-delivery-approval');
  for(const delta of [{EXPIREDATE:'2020-01-01'},{CONTENT_AVAILABILITY:'No Content Available'},{REPLACED_BY_COURSE:'NEW'},{RETIRE_REASON:'Unsupported product'}])assert.equal(transformIbmFeed([{...row,...delta}],'2026-11-11')[0].schedulingEligibility,'reference-only');
});
