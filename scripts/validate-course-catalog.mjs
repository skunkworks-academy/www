import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const errors = [];
const generatedPath = join(root, 'assets/course-catalog.generated.js');
const rendererPath = join(root, 'assets/course-catalog-renderer.js');
const pages = ['self-paced/index.html', 'instructor-led/index.html'];
const expectedAssetVersion = '2026.07.30.2';

function fail(message) {
  errors.push(message);
}

if (!existsSync(generatedPath)) fail('Missing assets/course-catalog.generated.js.');
if (!existsSync(rendererPath)) fail('Missing assets/course-catalog-renderer.js.');

let payload;
if (existsSync(generatedPath)) {
  try {
    const source = readFileSync(generatedPath, 'utf8');
    const sandbox = {window: {}};
    vm.runInNewContext(source, sandbox, {filename: generatedPath, timeout: 2000});
    payload = await sandbox.window.SKUNKWORKS_COURSE_CATALOG_PROMISE;
    if (!payload) throw new Error('window.SKUNKWORKS_COURSE_CATALOG_PROMISE was not created');
  } catch (error) {
    fail(`Generated catalogue could not be evaluated: ${error.message}`);
  }
}

if (payload) {
  if (payload.schema !== 'skunkworks-academy/public-course-listing/v2') {
    fail(`Unexpected catalogue schema: ${payload.schema ?? 'missing'}.`);
  }
  if (!Array.isArray(payload.fields)) fail('Catalogue fields must be an array.');
  if (!Array.isArray(payload.courses)) fail('Catalogue courses must be an array.');

  const requiredFields = ['courseId', 'title', 'deliveryMode', 'category', 'level', 'estimatedEffort', 'courseUrl'];
  for (const field of requiredFields) {
    if (!payload.fields?.includes(field)) fail(`Catalogue is missing required field: ${field}`);
  }

  if (Array.isArray(payload.fields) && Array.isArray(payload.courses)) {
    if (payload.courses.length !== 183) fail(`Expected 183 courses, found ${payload.courses.length}.`);
    if (payload.courseCount !== payload.courses.length) fail('courseCount does not match the course array length.');

    const deliveryIndex = payload.fields.indexOf('deliveryMode');
    const idIndex = payload.fields.indexOf('courseId');
    const titleIndex = payload.fields.indexOf('title');
    const urlIndex = payload.fields.indexOf('courseUrl');
    const ids = new Set();
    const counts = new Map();

    for (const [index, row] of payload.courses.entries()) {
      if (!Array.isArray(row)) {
        fail(`Course row ${index + 1} is not an array.`);
        continue;
      }
      if (row.length !== payload.fields.length) fail(`Course row ${index + 1} does not match the field count.`);

      const id = String(row[idIndex] ?? '').trim();
      const title = String(row[titleIndex] ?? '').trim();
      const url = String(row[urlIndex] ?? '').trim();
      if (!id) fail(`Course row ${index + 1} has no courseId.`);
      else if (ids.has(id)) fail(`Duplicate courseId found: ${id}`);
      else ids.add(id);
      if (!title) fail(`Course ${id || index + 1} has no title.`);
      if (!/^https:\/\//.test(url)) fail(`Course ${id || index + 1} has an invalid courseUrl.`);

      const mode = String(row[deliveryIndex] ?? '').trim();
      counts.set(mode, (counts.get(mode) ?? 0) + 1);
    }

    if (counts.get('Self-Paced') !== 37) fail(`Expected 37 Self-Paced courses, found ${counts.get('Self-Paced') ?? 0}.`);
    if (counts.get('Instructor-led') !== 146) fail(`Expected 146 Instructor-led courses, found ${counts.get('Instructor-led') ?? 0}.`);
  }
}

if (existsSync(rendererPath)) {
  const renderer = readFileSync(rendererPath, 'utf8');
  const requiredTokens = [
    'loadCatalogPayload',
    'recoverGeneratedPayload',
    'transformUpstreamRegistry',
    'tokens.every',
    'validatePayload',
    'syncQueryString'
  ];
  for (const token of requiredTokens) {
    if (!renderer.includes(token)) fail(`Catalogue renderer is missing resilience/search token: ${token}`);
  }
}

for (const page of pages) {
  const path = join(root, page);
  if (!existsSync(path)) {
    fail(`Missing catalogue page: ${page}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (!html.includes('data-course-catalog')) fail(`${page} is missing the catalogue root.`);
  if (!html.includes(`/assets/course-catalog.generated.js?v=${expectedAssetVersion}`)) fail(`${page} does not use the current generated catalogue cache key.`);
  if (!html.includes(`/assets/course-catalog-renderer.js?v=${expectedAssetVersion}`)) fail(`${page} does not use the current renderer cache key.`);
}

if (errors.length) {
  console.error(`Course catalogue validation failed with ${errors.length} error(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const deliveryIndex = payload.fields.indexOf('deliveryMode');
const selfPaced = payload.courses.filter((row) => row[deliveryIndex] === 'Self-Paced').length;
const instructorLed = payload.courses.filter((row) => row[deliveryIndex] === 'Instructor-led').length;
console.log(`Course catalogue validation passed: ${payload.courses.length} courses (${selfPaced} Self-Paced, ${instructorLed} Instructor-led).`);
