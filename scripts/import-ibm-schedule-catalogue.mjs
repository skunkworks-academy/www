import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
export const sourceUrl='https://www.ibm.com/training/files/GTPjson/CourseFeed_Global.json';
const plain=value=>String(value??'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
export function transformIbmFeed(records,asOf){
  if(!Array.isArray(records)||records.length===0)throw Error('IBM feed must be a nonempty array');
  const ids=new Set();
  return records.map(row=>{
    const code=plain(row.COURSECODE),title=plain(row.TITLE);if(!code||!title||ids.has(code))throw Error('Missing or duplicate IBM course code');ids.add(code);
    const availability=plain(row.CONTENT_AVAILABILITY),expires=plain(row.EXPIREDATE).slice(0,10),replacedBy=plain(row.REPLACED_BY_COURSE),retireReason=plain(row.RETIRE_REASON);
    const eligible=availability==='Content Available'&&/^\d{4}-\d{2}-\d{2}$/.test(expires)&&expires>asOf&&!replacedBy&&!retireReason;
    return {courseId:code,title,vendor:'IBM',category:plain(row.PRODUCT_NAME)||'IBM training',deliveryMode:'To be confirmed',estimatedEffort:row.DURATION_LENGTH?`${row.DURATION_LENGTH} ${row.DURATION_UNIT==='H'?'hours':plain(row.DURATION_UNIT)}`:'',courseUrl:'https://www.ibm.com/training/search?query='+encodeURIComponent(code),catalogueScope:'partner-reference',contentStatus:availability+'; Academy delivery approval required',schedulingEligibility:eligible?'requires-delivery-approval':'reference-only',partnerMetadata:{availability,expires,replacedBy,retireReason,modality:plain(row.MODALITY),sourceUrl},platformIds:[]};
  });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)){
  const response=await fetch(sourceUrl,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('IBM feed HTTP '+response.status);
  const raw=await response.text(),retrievedAt=new Date().toISOString(),courses=transformIbmFeed(JSON.parse(raw),retrievedAt.slice(0,10));
  const payload={sourceUrl,retrievedAt,sha256:createHash('sha256').update(raw).digest('hex'),recordCount:courses.length,semantics:'Partner reference metadata only. Content Available does not establish delivery rights, trainer/lab readiness, tuition or a scheduled session. Unknown, expired, replaced or retired records cannot be confirmed.',courses};
  const dest=resolve(import.meta.dirname,'../data/schedule');mkdirSync(dest,{recursive:true});writeFileSync(resolve(dest,'ibm-catalogue.json'),JSON.stringify(payload,null,2)+'\n');
  console.log(JSON.stringify({records:courses.length,contentAvailable:courses.filter(c=>c.partnerMetadata.availability==='Content Available').length,referenceOnly:courses.filter(c=>c.schedulingEligibility==='reference-only').length,retrievedAt}));
}
