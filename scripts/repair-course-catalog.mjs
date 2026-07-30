import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';

const root = process.cwd();
const catalogPath = join(root, 'assets/course-catalog.generated.js');
const upstreamUrl = 'https://raw.githubusercontent.com/skunkworks-academy/course-catalog/74dbd798668a22baee275237252f2594929e2c63/data/generated-courses.cjs';
const assetVersion = '2026.07.30.2';
const publicFields = ['courseId', 'title', 'deliveryMode', 'category', 'level', 'estimatedEffort', 'courseUrl'];

const establishedCourses = [
  ['ART-101', 'Professional Articulation and Executive Communication', 'Self-Paced', 'Professional & Business Skills', 'Foundation to advanced', '36–40 hours', 'https://skunkworks-academy.github.io/course-catalog/courses/professional-articulation'],
  ['SHP-UPA-101', 'Shopify User Permissions', 'Self-Paced', 'Commerce Administration', 'Beginner to intermediate', '4–6 hours', 'https://skunkworks-academy.github.io/course-catalog/courses/shopify-user-permissions'],
  ['GHP-DOM-101', 'GitHub Pages Setup', 'Self-Paced', 'Web Deployment', 'Beginner to intermediate', '5–7 hours', 'https://skunkworks-academy.github.io/course-catalog/courses/github-pages-setup'],
  ['M365-LIC-101', 'Microsoft 365 Licenses', 'Self-Paced', 'Microsoft Technologies', 'Intermediate', '5–8 hours', 'https://skunkworks-academy.github.io/course-catalog/courses/microsoft-365-licenses']
];

function validatePublicPayload(payload) {
  if (!payload || !Array.isArray(payload.fields) || !Array.isArray(payload.courses)) return false;
  if (payload.fields.join('|') !== publicFields.join('|')) return false;
  if (payload.courses.length !== 180) return false;
  const deliveryIndex = payload.fields.indexOf('deliveryMode');
  const ids = new Set();
  const counts = {SelfPaced: 0, InstructorLed: 0};
  for (const row of payload.courses) {
    if (!Array.isArray(row) || row.length !== payload.fields.length) return false;
    if (!row[0] || ids.has(row[0])) return false;
    ids.add(row[0]);
    if (row[deliveryIndex] === 'Self-Paced') counts.SelfPaced += 1;
    if (row[deliveryIndex] === 'Instructor-led') counts.InstructorLed += 1;
  }
  return counts.SelfPaced === 34 && counts.InstructorLed === 146;
}

async function readExistingPayload() {
  try {
    const source = readFileSync(catalogPath, 'utf8');
    const sandbox = {window: {}};
    vm.runInNewContext(source, sandbox, {filename: catalogPath, timeout: 2000});
    const payload = await sandbox.window.SKUNKWORKS_COURSE_CATALOG_PROMISE;
    return validatePublicPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

async function fetchUpstreamRegistry() {
  const response = await fetch(upstreamUrl, {
    headers: {'User-Agent': 'Skunkworks-Academy-Catalog-Build/1.0'},
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Upstream catalogue returned HTTP ${response.status}.`);
  const source = await response.text();
  const match = source.match(/const\s+encoded\s*=\s*['"]([A-Za-z0-9+/=]+)['"]/);
  if (!match) throw new Error('Upstream catalogue did not contain an encoded registry.');
  const registry = JSON.parse(gunzipSync(Buffer.from(match[1], 'base64')).toString('utf8'));
  if (registry.schema !== 'skunkworks-academy/generated-course-catalog/v1') {
    throw new Error(`Unexpected upstream schema: ${registry.schema ?? 'missing'}.`);
  }
  if (!Array.isArray(registry.fields) || !Array.isArray(registry.courses) || registry.courses.length !== 176) {
    throw new Error('Upstream registry does not contain the expected 176 courses.');
  }
  return registry;
}

function transformRegistry(registry) {
  const index = Object.fromEntries(registry.fields.map((field, position) => [field, position]));
  const required = ['courseId', 'title', 'slug', 'deliveryMode', 'category', 'level', 'estimatedEffort'];
  for (const field of required) {
    if (!(field in index)) throw new Error(`Upstream registry is missing ${field}.`);
  }

  const generatedCourses = registry.courses.map((row) => [
    row[index.courseId],
    row[index.title],
    row[index.deliveryMode],
    row[index.category],
    row[index.level],
    row[index.estimatedEffort],
    `https://skunkworks-academy.github.io/course-catalog/courses/catalog/${row[index.slug]}`
  ]);

  const payload = {
    schema: 'skunkworks-academy/public-course-listing/v2',
    generatedOn: new Date().toISOString().slice(0, 10),
    source: {
      repository: 'skunkworks-academy/course-catalog',
      commit: '74dbd798668a22baee275237252f2594929e2c63',
      registry: 'data/generated-courses.cjs'
    },
    fields: publicFields,
    courseCount: 180,
    courses: [...establishedCourses, ...generatedCourses]
  };

  if (!validatePublicPayload(payload)) throw new Error('Transformed public catalogue failed validation.');
  return payload;
}

function writeBrowserAsset(payload) {
  const json = JSON.stringify(payload);
  const output = `window.SKUNKWORKS_COURSE_CATALOG_DATA = ${json};\nwindow.SKUNKWORKS_COURSE_CATALOG_PROMISE = Promise.resolve(window.SKUNKWORKS_COURSE_CATALOG_DATA);\n`;
  writeFileSync(catalogPath, output, 'utf8');
  console.log(`Course catalogue asset generated: ${payload.courses.length} courses (34 Self-Paced, 146 Instructor-led).`);
}

function updatePageAssetVersions() {
  for (const relativePath of ['self-paced/index.html', 'instructor-led/index.html']) {
    const path = join(root, relativePath);
    const current = readFileSync(path, 'utf8');
    const updated = current
      .replace(/\/assets\/course-catalog\.generated\.js\?v=[0-9.]+/g, `/assets/course-catalog.generated.js?v=${assetVersion}`)
      .replace(/\/assets\/course-catalog-renderer\.js\?v=[0-9.]+/g, `/assets/course-catalog-renderer.js?v=${assetVersion}`);
    if (updated !== current) writeFileSync(path, updated, 'utf8');
  }
  console.log(`Catalogue page asset references set to ${assetVersion}.`);
}

const existing = await readExistingPayload();
if (existing) {
  console.log('Course catalogue asset is already valid and complete.');
} else {
  console.log('Rebuilding the course catalogue from the immutable upstream registry.');
  writeBrowserAsset(transformRegistry(await fetchUpstreamRegistry()));
}
updatePageAssetVersions();
