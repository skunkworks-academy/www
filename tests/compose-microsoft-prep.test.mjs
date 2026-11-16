import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {compose,GUIDE_PATH,GUIDE_ID} from '../scripts/compose-microsoft-prep.mjs';
function fixture() {
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'mb800-compose-'));
  const source=path.join(temporary,'microsoft'),root=path.join(temporary,'www');
  const courseDir=path.join(source,GUIDE_PATH);
  fs.mkdirSync(path.join(courseDir,'assets'),{recursive:true});
  fs.mkdirSync(root,{recursive:true});
  const course={courseId:GUIDE_ID,path:GUIDE_PATH,title:'MB-800 preparation',contentAccess:'public',registrationPath:'/course-registration/?course=MB-800-PREP',modules:[{path:GUIDE_PATH+'module-01-foundations/',title:'Foundations'}]};
  const routes=[GUIDE_PATH,course.modules[0].path,GUIDE_PATH+'mock-exam/',GUIDE_PATH+'study-plan/'];
  for(const route of routes){const file=path.join(source,route,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'<!doctype html><html data-swa-owned-course-shell="MB-800-PREP"><head><link rel="canonical" href="https://www.skunkworksacademy.com'+route+'"><script src="/assets/skunkworks-ui.js"></script><script src="/assets/skunkworks-footer.js"></script></head><body>Public original practice</body></html>');}
  fs.writeFileSync(path.join(courseDir,'manifest.json'),JSON.stringify({version:'1',courses:[course]}));
  fs.writeFileSync(path.join(courseDir,'assets/questions.json'),'[]');
  fs.writeFileSync(path.join(courseDir,'sitemap.xml'),'<urlset>'+routes.map(route=>'<url><loc>https://www.skunkworksacademy.com'+route+'</loc></url>').join('')+'</urlset>');
  fs.mkdirSync(path.join(courseDir,'content'),{recursive:true});fs.writeFileSync(path.join(courseDir,'content/facilitator.md'),'Authoring material must never be copied.');
  fs.writeFileSync(path.join(root,'course-manifest.json'),JSON.stringify({courses:[{courseId:'EXISTING',path:'/courses/existing'}]}));
  fs.writeFileSync(path.join(root,'courses.html'),'<html><body><div id="__docusaurus"></div></body></html>');
  fs.mkdirSync(path.join(root,'courses'),{recursive:true});fs.copyFileSync(path.join(root,'courses.html'),path.join(root,'courses/index.html'));
  const upstreamSitemap=path.join(temporary,'sitemap.xml');fs.writeFileSync(upstreamSitemap,'<urlset><url><loc>https://www.skunkworksacademy.com/courses/existing</loc></url></urlset>');
  execFileSync('git',['init','--quiet',source]);execFileSync('git',['-C',source,'add','.']);execFileSync('git',['-C',source,'-c','user.name=Test','-c','user.email=test@example.test','commit','--quiet','-m','fixture']);
  const expectedCommit=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
  return {root,source,expectedCommit,upstreamSitemap,temporary,courseDir};
}
function using(fn){const f=fixture();try{fn(f);}finally{fs.rmSync(f.temporary,{recursive:true,force:true});}}
test('composes only public artifacts, keeps existing courses and creates discovery',()=>using(f=>{
  const report=compose(f);assert.equal(report.routes,4);
  const target=path.join(f.root,GUIDE_PATH);assert.ok(fs.existsSync(path.join(target,'mock-exam/index.html')));assert.ok(!fs.existsSync(path.join(target,'content')));
  assert.equal(JSON.parse(fs.readFileSync(path.join(target,'release.json'))).commit,f.expectedCommit);
  const manifest=JSON.parse(fs.readFileSync(path.join(f.root,'course-manifest.json')));assert.equal(manifest.courses.length,2);assert.equal(manifest.courses[0].courseId,'EXISTING');
  const html=fs.readFileSync(path.join(f.root,'courses/index.html'),'utf8');assert.match(html,/mb800-preparation-discovery/);assert.match(html,/course-registration\/\?course=MB-800-PREP/);
  assert.match(html,/<article><p>MB-800-PREP<\/p>[\s\S]*?<a href="\/course-registration\/\?course=MB-800-PREP">Enquire about facilitation<\/a><\/article>/);
}));
test('composition is idempotent for manifest, sitemap and discovery',()=>using(f=>{
  compose(f);compose(f);
  const manifest=JSON.parse(fs.readFileSync(path.join(f.root,'course-manifest.json')));assert.equal(manifest.courses.filter(c=>c.courseId===GUIDE_ID).length,1);
  assert.equal((fs.readFileSync(f.upstreamSitemap,'utf8').match(/<loc>/g)||[]).length,5);
  assert.equal((fs.readFileSync(path.join(f.root,'courses.html'),'utf8').match(/id="mb800-preparation-discovery"/g)||[]).length,1);
}));
test('rejects an unreviewed source revision',()=>using(f=>assert.throws(()=>compose({...f,expectedCommit:'a'.repeat(40)}),/reviewed commit/)));
test('rejects unsafe module routes',()=>using(f=>{
  const file=path.join(f.courseDir,'manifest.json');const manifest=JSON.parse(fs.readFileSync(file));manifest.courses[0].modules[0].path=GUIDE_PATH+'../leak/';fs.writeFileSync(file,JSON.stringify(manifest));assert.throws(()=>compose(f),/Unsafe guide route/);
}));
test('rejects missing shared shell and missing sitemap route',()=>using(f=>{
  const html=path.join(f.courseDir,'mock-exam/index.html');const original=fs.readFileSync(html,'utf8');fs.writeFileSync(html,original.replace('skunkworks-footer.js','bad.js'));assert.throws(()=>compose(f),/shared shell missing/);fs.writeFileSync(html,original);
  const map=path.join(f.courseDir,'sitemap.xml');fs.writeFileSync(map,fs.readFileSync(map,'utf8').replace(/<url><loc>[^<]+mock-exam\/<\/loc><\/url>/,''));assert.throws(()=>compose(f),/sitemap does not cover/);
}));
test('rejects a conflicting existing course identity',()=>using(f=>{
  fs.writeFileSync(path.join(f.root,'course-manifest.json'),JSON.stringify({courses:[{courseId:GUIDE_ID,path:'/courses/other'}]}));assert.throws(()=>compose(f),/conflicts/);
}));

test('the reviewed generated guide composes with the website contract', {skip: !process.env.SKW_MICROSOFT_SOURCE}, () => {
  const f=fixture();
  try {
    const source=path.resolve(process.env.SKW_MICROSOFT_SOURCE);
    const expectedCommit=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
    const result=compose({...f,source,expectedCommit});
    assert.ok(result.routes>=11);
    const manifest=JSON.parse(fs.readFileSync(path.join(f.root,'course-manifest.json')));
    const guide=manifest.courses.find(c=>c.courseId===GUIDE_ID);
    assert.equal(guide.modules.length,8);
    assert.ok(fs.existsSync(path.join(f.root,GUIDE_PATH,'mock-exam/index.html')));
  } finally {fs.rmSync(f.temporary,{recursive:true,force:true});}
});

test('the guide enquiry query selects the real registration option without submitting or granting access', async () => {
  const vm=await import('node:vm');
  const html=fs.readFileSync(new URL('../course-registration/index.html',import.meta.url),'utf8');
  const selectHtml=/<select id="course"[^>]*>([\s\S]*?)<\/select>/.exec(html)?.[1];
  assert.ok(selectHtml,'Real registration course select exists');
  const options=[...selectHtml.matchAll(/<option(?: value="([^"]*)")?>([^<]+)<\/option>/g)].map(m=>({value:m[1]??m[2],text:m[2]}));
  const select={options,value:'',appendChild(){throw Error('The guide enquiry must use its registered option.');}};
  let submitted=false;const form={addEventListener(){},submit(){submitted=true;}};
  const document={readyState:'complete',getElementById(id){return id==='course'?select:id==='courseRegistrationForm'?form:null;}};
  const sandbox={document,window:{location:{search:'?course=MB-800-PREP',origin:'https://www.skunkworksacademy.com'}},URLSearchParams,Date};
  vm.runInNewContext(fs.readFileSync(new URL('../assets/course-registration.js',import.meta.url),'utf8'),sandbox,{timeout:1000});
  assert.equal(select.value,'MB-800-PREP');
  assert.equal(options.filter(o=>o.value==='MB-800-PREP').length,1);
  assert.equal(submitted,false);
});

test('the real guide passes the final combined course publication gate', {skip: !process.env.SKW_MICROSOFT_SOURCE}, () => {
  const f=fixture();
  try {
    const source=path.resolve(process.env.SKW_MICROSOFT_SOURCE);
    const expectedCommit=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
    const host='https://www.skunkworksacademy.com';
    const shell=route=>'<!doctype html><html><head><link rel="canonical" href="'+host+route+'"><script src="/assets/academy-navigation.js"></script></head><body><main><h1>Fixture catalogue</h1></main></body></html>';
    for(const name of ['courses/index.html','courses.html']) fs.writeFileSync(path.join(f.root,name),shell('/courses'));
    fs.writeFileSync(path.join(f.root,'courses/existing.html'),shell('/courses/existing'));
    fs.mkdirSync(path.join(f.root,'course-registration'),{recursive:true});fs.writeFileSync(path.join(f.root,'course-registration/index.html'),'<html>Fixture registration</html>');
    fs.mkdirSync(path.join(f.root,'assets'));for(const name of ['academy-navigation.js','skunkworks-footer.js'])fs.writeFileSync(path.join(f.root,'assets',name),'// Fixture shell asset');
    fs.writeFileSync(path.join(f.root,'sitemap.xml'),'<urlset><url><loc>'+host+'/</loc></url></urlset>');
    fs.writeFileSync(f.upstreamSitemap,fs.readFileSync(f.upstreamSitemap,'utf8').replace('</urlset>','<url><loc>'+host+'/courses</loc></url></urlset>'));
    compose({...f,source,expectedCommit});
    const script=new URL('../scripts/publish-course-contract.mjs',import.meta.url);
    const output=execFileSync(process.execPath,[script.pathname,'--root',f.root,'--source-sitemap',f.upstreamSitemap],{encoding:'utf8'});
    assert.match(output,/Course release gate passed/);
    const map=fs.readFileSync(path.join(f.root,'sitemap.xml'),'utf8');
    assert.equal((map.match(/<loc>/g)||[]).length,14);
    assert.ok(fs.existsSync(path.join(f.root,'courses/existing/index.html')));
  } finally {fs.rmSync(f.temporary,{recursive:true,force:true});}
});
