import {readFileSync, writeFileSync} from 'node:fs';
const target = new URL('../ai/ai-master-catalog.json', import.meta.url);
const remote = 'https://raw.githubusercontent.com/skunkworks-academy/course-catalog/main/static/ai-master-catalog.json';
const response = await fetch(remote);
if (!response.ok) throw new Error('Canonical AI catalogue fetch failed with HTTP ' + response.status);
const data = await response.json();
if (data.schema !== 'skunkworks-academy/ai-master-catalog/v1' || data.courses?.length !== 26) throw new Error('Unexpected upstream catalogue schema/count');
if (data.courses.some(c => c.checkoutUrl && c.enrolmentStatus !== 'portal-allowlisted')) throw new Error('Unapproved checkout URL');
const expected = JSON.stringify(data, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== expected) throw new Error('AI snapshot differs from upstream; run npm run sync:ai-catalog and commit the result.');
  console.log('AI snapshot is current.');
} else {
  writeFileSync(target, expected);
  console.log('AI snapshot updated from canonical course-catalog repository.');
}
