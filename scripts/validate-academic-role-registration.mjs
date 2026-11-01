import fs from 'node:fs';
const page=fs.readFileSync('course-registration/index.html','utf8');
const ids=['EDU-SWE-201','EDU-MAT-201','EDU-EDT-201','EDU-ITL-201','EDU-ROB-201','EDU-NET-201','EDU-HWS-201','EDU-PYT-201'];
for(const id of ids){
  if(page.split(`value="${id}"`).length!==2) throw new Error(`Expected exactly one registration option for ${id}`);
}
const script=fs.readFileSync('assets/course-registration.js','utf8');
if(!script.includes('params.get("course")') || !script.includes('option.value === requestedCourse')) throw new Error('Course-specific prefill contract missing');
console.log('Eight academic role registration enquiries retain stable course IDs. No entitlement or payment is granted by an enquiry.');
