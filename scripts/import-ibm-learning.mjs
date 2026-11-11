import {readFileSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const sourceUrl='https://www.ibm.com/training/files/GTPjson/CourseFeed_Global.json';
export const plain=value=>String(value??'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<\/(?:p|li|div)>|<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim();
function family(text){
  if(/maximo|tririga|envizi/i.test(text))return 'Asset management';
  if(/qradar|guardium|security|safer payments|verify/i.test(text))return 'Security';
  if(/watson|spss|cognos|data|db2|netezza|informix|planning analytics|infosphere/i.test(text))return 'Data & AI';
  if(/mq|websphere|integration|app connect|datapower|api connect|baw|automation|instana|turbonomic|business process/i.test(text))return 'Automation & integration';
  if(/cloud|openshift|kubernetes/i.test(text))return 'Cloud';
  return 'Infrastructure';
}
export function transform(records){
  if(!Array.isArray(records)||!records.length)throw Error('Expected a nonempty IBM course feed');
  const ids=new Set();
  return records.map(r=>{
    const code=plain(r.COURSECODE),title=plain(r.TITLE);
    if(!/^[\w.-]+$/.test(code)||!title||ids.has(code))throw Error('Missing or duplicate course identity');ids.add(code);
    const skill=plain(r.SKILLLEVEL).toLowerCase();
    return {code,title,product:plain(r.PRODUCT_NAME),family:family(title+' '+plain(r.PRODUCT_NAME)),level: /basic|beginner|intro|fundamental/.test(skill)?'Foundational':/intermediate/.test(skill)?'Intermediate':/advanced/.test(skill)?'Advanced':'Not specified',sourceLevel:plain(r.SKILLLEVEL),duration: r.DURATION_LENGTH?`${plain(r.DURATION_LENGTH)} ${r.DURATION_UNIT==='H'?'hours':r.DURATION_UNIT==='D'?'days':plain(r.DURATION_UNIT)}`:'Confirm duration',overview:plain(r.OVERVIEW),audience:plain(r.AUDIENCE_TEXT),prerequisites:plain(r.PREREQUISITS),objectives:plain(r.OBJECTIVE),topics:plain(r.TOPIC),availability:plain(r.CONTENT_AVAILABILITY),expires:plain(r.EXPIREDATE).slice(0,10),replacedBy:plain(r.REPLACED_BY_COURSE),retireReason:plain(r.RETIRE_REASON),url:'https://www.ibm.com/training/search?query='+encodeURIComponent(code)};
  }).sort((a,b)=>a.title.localeCompare(b.title));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const raw=process.argv[2]?readFileSync(process.argv[2],'utf8'):await fetch(sourceUrl,{signal:AbortSignal.timeout(30000)}).then(r=>{if(!r.ok)throw Error('IBM HTTP '+r.status);return r.text()});
 const courses=transform(JSON.parse(raw));
 const payload={sourceUrl,retrievedAt:new Date().toISOString(),sha256:createHash('sha256').update(raw).digest('hex'),recordCount:courses.length,courses};
 const dest=resolve(import.meta.dirname,'../data/ibm-learning');mkdirSync(dest,{recursive:true});
 writeFileSync(resolve(dest,'catalogue.json.tmp'),JSON.stringify(payload)+'\n');renameSync(resolve(dest,'catalogue.json.tmp'),resolve(dest,'catalogue.json'));
 console.log(`Imported ${courses.length} IBM reference courses. Delivery and dates require confirmation.`);
}
