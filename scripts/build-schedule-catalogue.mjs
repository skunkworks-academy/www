import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const read = p => readFileSync(join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const write = (p, value) => { mkdirSync(resolve(root, p, '..'), {recursive:true}); writeFileSync(join(root,p), JSON.stringify(value,null,2)+'\n'); };
const normal = s => s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
function array(source, pattern) {
  const match = source.match(pattern);
  if (!match) throw Error('Catalogue source array changed; review adapter.');
  return JSON.parse(JSON.stringify(vm.runInNewContext('('+match[1]+')', {}, {timeout:1000})));
}
const arg = process.argv.indexOf('--catalog-root');
if (arg !== -1) {
  const upstream = resolve(process.argv[arg+1]);
  const file = p => readFileSync(join(upstream,p),'utf8');
  const encoded = file('data/generated-courses.cjs').match(/const encoded = '([^']+)'/)[1];
  const registry = JSON.parse(gunzipSync(Buffer.from(encoded,'base64')));
  const generated = registry.courses.map(row => {
    const c = Object.fromEntries(registry.fields.map((f,i)=>[f,row[i]]));
    return {...c,courseUrl:'/courses/catalog/'+c.slug};
  });
  const published = array(file('src/pages/courses.tsx'),/const publishedCourses[^=]*=\s*(\[[\s\S]*?\n\]);/);
  const manifest = JSON.parse(file('static/course-manifest.json')).courses;
  const curated = JSON.parse(file('data/ai-curated-additions.json')).courses;
  // Only public catalogue fields are copied; source documents and learner data are excluded.
  const pick = c => ({courseId:c.courseId||c.id,title:c.title,category:c.category||'',deliveryMode:c.deliveryMode||'',estimatedEffort:c.estimatedEffort||c.duration||'',courseUrl:c.courseUrl||c.route||c.path||c.overviewUrl,contentStatus:c.contentStatus||c.reviewStatus||''});
  write('data/schedule/upstream-catalogue.json',{source:'skunkworks-academy/course-catalog',commit:execFileSync('git',['rev-parse','HEAD'],{cwd:upstream,encoding:'utf8'}).trim(),generated:generated.map(pick),published:published.map(pick),manifest:manifest.map(pick),curated:curated.map(pick)});
}
const upstream = json('data/schedule/upstream-catalogue.json');
const rows = [], counts = {};
function add(source, courses) { counts[source]=courses.length; courses.forEach(c=>rows.push({...c,source})); }
const main = new Map();
for(const c of [...upstream.generated,...upstream.published]) main.set(c.courseId,c);
add('central-catalogue',[...main.values()]);
add('central-manifest',upstream.manifest);
add('curated-learning-paths',upstream.curated);
const sandbox={window:{}};
vm.runInNewContext(read('assets/course-catalog.generated.js'),sandbox,{timeout:1000});
const legacy=sandbox.window.SKUNKWORKS_COURSE_CATALOG_DATA;
add('website-catalogue',legacy.courses.map(row=>Object.fromEntries(legacy.fields.map((f,i)=>[f,row[i]]))));
add('website-self-paced',json('self-paced/catalog.json').courses.map(c=>({courseId:c.code,title:c.title,category:c.category,deliveryMode:c.delivery,courseUrl:c.href})));
const cisco = array(read('cisco/catalogue.js'),/const OFFERINGS = Object.freeze\((\[[\s\S]*?\n\s*\])\);/);
add('cisco-netacad',cisco.map(c=>({courseId:'netacad:'+normal(c.title).replaceAll(' ','-'),title:c.title,vendor:'Cisco',category:c.subject,courseUrl:'/cisco/',platformIds:['cisco-netacad']})));
const comptia=[...read('comptia/index.html').matchAll(/<h3>(CompTIA[^<]+)<\/h3>/g)].map(m=>m[1]);
add('comptia-offerings',comptia.map(title=>({courseId:'comptia:'+normal(title).replaceAll(' ','-'),title,vendor:'CompTIA',courseUrl:'/comptia/',contentStatus:'Certification / voucher listing; training scope requires confirmation'})));
const ibm=array(read('ibm/index.html'),/const courses\s*=\s*(\[[\s\S]*?\n\s*\]);/);
add('ibm-offerings',ibm.map(c=>({courseId:'ibm:'+normal(c.title).replaceAll(' ','-'),title:c.title,vendor:'IBM',courseUrl:c.link,deliveryMode:c.duration==='Self-Paced'?'Self-Paced':'',contentStatus:'Partner listing; current availability requires confirmation'})));
const courses=[], byId=new Map(),byTitle=new Map();
const ibmFeed=json('data/schedule/ibm-catalogue.json');
add('ibm-reference-feed',ibmFeed.courses);
for(const row of rows){
  if(!row.courseId||!row.title||!row.courseUrl) throw Error('Incomplete source record: '+JSON.stringify(row));
  const key=normal(row.title);
  // IBM course codes distinguish delivery variants even when their titles match.
  const existing=byId.get(row.courseId)||(row.source==='ibm-reference-feed'?undefined:byTitle.get(key));
  if(existing){
    if(row.partnerMetadata){existing.partnerMetadata=row.partnerMetadata;existing.schedulingEligibility=row.schedulingEligibility;}
    if(!existing.sources.includes(row.source)) existing.sources.push(row.source);
    if(!existing.aliases.includes(row.courseId)&&existing.courseId!==row.courseId) existing.aliases.push(row.courseId);
    byId.set(row.courseId,existing);
    continue;
  }
  const vendor=row.vendor || (/^Microsoft Technologies$/.test(row.category)?'Microsoft':/^IBM Technologies$/.test(row.category)?'IBM':/^CompTIA Certification$/.test(row.category)?'CompTIA':(/\b(Microsoft|IBM|Cisco|CompTIA|SAP|Adobe|Avaya|Red Hat|Salesforce|Shopify|GitHub)\b/i.exec(row.title)?.[1]||'Skunkworks Academy'));
  const course={courseId:row.courseId,title:row.title,vendor,category:row.category||'Partner training',deliveryMode:row.deliveryMode||'To be confirmed',estimatedEffort:row.estimatedEffort||'',courseUrl:new URL(row.courseUrl,'https://www.skunkworksacademy.com').href,platformIds:row.platformIds||[],contentStatus:row.contentStatus||'Delivery and enrolment requirements to be confirmed',sources:[row.source],aliases:[]};
  courses.push(course);byId.set(row.courseId,course);byTitle.set(key,course);
  course.catalogueScope=row.catalogueScope||'academy-listing';
  course.schedulingEligibility=row.schedulingEligibility||'staff-review';
  if(row.partnerMetadata)course.partnerMetadata=row.partnerMetadata;
}
courses.sort((a,b)=>a.title.localeCompare(b.title));
const payload={schema:'academy-schedule-catalogue/v1',sourceCommit:upstream.commit,counts:{sources:counts,centralCatalogue:main.size,websiteSnapshot:legacy.courses.length,uniqueOfferings:courses.length,additionalToCentral:courses.filter(c=>!c.sources.includes('central-catalogue')).length},courses};
payload.ibmFeed={url:ibmFeed.sourceUrl,retrievedAt:ibmFeed.retrievedAt,sha256:ibmFeed.sha256};
payload.counts.academyListings=courses.filter(c=>c.catalogueScope==='academy-listing').length;
payload.counts.partnerReferenceOnly=courses.filter(c=>c.catalogueScope==='partner-reference').length;
write('data/schedule/catalogue.json',payload);
if(process.argv.includes('--api-root')) {
  const dest=resolve(process.argv[process.argv.indexOf('--api-root')+1],'data/schedule');mkdirSync(dest,{recursive:true});
  writeFileSync(join(dest,'catalogue.json'),JSON.stringify(payload,null,2)+'\n');
}
console.log(JSON.stringify(payload.counts,null,2));
