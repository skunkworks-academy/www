import {readFileSync, existsSync} from 'node:fs';
const root = process.cwd();
const dataPath = root + '/ai/ai-master-catalog.json';
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const errors = [];
if (data.schema !== 'skunkworks-academy/ai-master-catalog/v1') errors.push('Invalid AI catalogue schema');
if (data.courses.length !== 26) errors.push('Expected 26 AI records');
if (data.courses.filter(x => x.kind === 'generated-foundation').length !== 19) errors.push('Expected 19 generated AI records');
const ids = new Set();
for (const c of data.courses) {
  if (ids.has(c.id)) errors.push('Duplicate ID: ' + c.id);
  ids.add(c.id);
  if (!c.title || !c.sourceUrl || !c.reviewStatus || !c.availability) errors.push('Missing required course fields: ' + c.id);
  if (c.checkoutUrl && (c.id !== 'SKW-BEG-AI-101' || c.enrolmentStatus !== 'portal-allowlisted')) errors.push('Unapproved checkout: ' + c.id);
  for (const key of ['overviewUrl', 'sourceUrl']) {
    if (!/^https:\/\//.test(c[key] || '')) errors.push('Invalid URL ' + key + ' for ' + c.id);
  }
}
for (const path of ['ai/index.html', 'ai/ai-catalog.css', 'ai/ai-catalog.js', 'scripts/sync-ai-catalog.mjs']) {
  if (!existsSync(root + '/' + path)) errors.push('Missing AI directory asset: ' + path);
}
const html = readFileSync(root + '/ai/index.html', 'utf8');
for (const marker of ['id="ai-search"', 'id="ai-category"', 'id="ai-delivery"', 'id="ai-level"', '/ai/ai-catalog.js', '/assets/academy-navigation.js']) {
  if (!html.includes(marker)) errors.push('Missing page marker: ' + marker);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('AI directory validated: 26 entries, 19 generated, checkout allowlist, source and asset contracts.');
