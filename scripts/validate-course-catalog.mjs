import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const root = process.cwd();
const errors = [];
const generatedPath = join(root, 'assets/course-catalog.generated.js');
const rendererPath = join(root, 'assets/course-catalog-renderer.js');
const pages = ['self-paced/index.html', 'instructor-led/index.html'];

function fail(message) {
  errors.push(message);
}

if (!existsSync(generatedPath)) fail('Missing assets/course-catalog.generated.js.');
if (!existsSync(rendererPath)) fail('Missing assets/course-catalog-renderer.js.');

let payload;
if (existsSync(generatedPath)) {
  try {
    const source = readFileSync(generatedPath, 'utf8');
    const match = source.match(/const\s+encoded\s*=\s*['"]([A-Za-z0-9+/=]+)['"]/);
    if (!match) throw new Error('compressed base64 payload was not found');
    payload = JSON.parse(gunzipSync(Buffer.from(match[1], 'base64')).toString('utf8'));
  } catch (error) {
    fail(`Generated catalogue could not be decoded: ${error.message}`);
  }
}

if (payload) {
  if (!Array.isArray(payload.fields)) fail('Catalogue fields must be an array.');
  if (!Array.isArray(payload.courses)) fail('Catalogue courses must be an array.');

  const requiredFields = ['courseId', 'title', 'deliveryMode', 'category', 'level', 'courseUrl'];
  for (const field of requiredFields) {
    if (!payload.fields?.includes(field)) fail(`Catalogue is missing required field: ${field}`);
  }

  if (Array.isArray(payload.fields) && Array.isArray(payload.courses)) {
    const deliveryIndex = payload.fields.indexOf('deliveryMode');
    const idIndex = payload.fields.indexOf('courseId');
    const ids = new Set();
    const counts = new Map();

    for (const [index, row] of payload.courses.entries()) {
      if (!Array.isArray(row)) {
        fail(`Course row ${index + 1} is not an array.`);
        continue;
      }
      if (row.length !== payload.fields.length) fail(`Course row ${index + 1} does not match the field count.`);

      const id = String(row[idIndex] ?? '').trim();
      if (!id) fail(`Course row ${index + 1} has no courseId.`);
      else if (ids.has(id)) fail(`Duplicate courseId found: ${id}`);
      else ids.add(id);

      const mode = String(row[deliveryIndex] ?? '').trim();
      counts.set(mode, (counts.get(mode) ?? 0) + 1);
    }

    if (!(counts.get('Self-Paced') > 0)) fail('Catalogue contains no Self-Paced courses.');
    if (!(counts.get('Instructor-led') > 0)) fail('Catalogue contains no Instructor-led courses.');
  }
}

if (existsSync(rendererPath)) {
  const renderer = readFileSync(rendererPath, 'utf8');
  const requiredTokens = [
    'recoverGeneratedPayload',
    'Native catalogue decompression failed',
    'tokens.every',
    'validatePayload',
    "cache: 'reload'"
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
  if (!html.includes('/assets/course-catalog.generated.js?v=2026.07.30.1')) fail(`${page} does not use the current generated catalogue cache key.`);
  if (!html.includes('/assets/course-catalog-renderer.js?v=2026.07.30.1')) fail(`${page} does not use the current renderer cache key.`);
}

if (errors.length) {
  console.error(`Course catalogue validation failed with ${errors.length} error(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const selfPaced = payload.courses.filter((row) => row[payload.fields.indexOf('deliveryMode')] === 'Self-Paced').length;
const instructorLed = payload.courses.filter((row) => row[payload.fields.indexOf('deliveryMode')] === 'Instructor-led').length;
console.log(`Course catalogue validation passed: ${payload.courses.length} courses (${selfPaced} Self-Paced, ${instructorLed} Instructor-led).`);
