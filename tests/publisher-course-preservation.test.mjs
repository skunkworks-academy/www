import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalPublisher = path.join(repoRoot, 'scripts', 'apply-publisher-policy.mjs');
const origin = 'https://www.skunkworksacademy.com';

function run(root, check = false) {
  const script = path.join(root, 'scripts', 'apply-publisher-policy.mjs');
  const output = spawnSync(process.execPath, [script, ...(check ? ['--check'] : [])], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(output.status, 0, [output.stdout, output.stderr].join('\n'));
}

function fixture(withCourse) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'academy-publisher-test-'));
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.copyFileSync(originalPublisher, path.join(root, 'scripts', 'apply-publisher-policy.mjs'));
  fs.writeFileSync(path.join(root, 'publisher-policy.json'), JSON.stringify({
    canonicalOrigin: origin, publisherId: 'ca-pub-example', lastModified: '2026-11-01',
    indexablePages: ['index.html'], adsenseEligiblePages: [],
  }));
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><html><head><title>Home</title></head><body><h1>Home</h1></body></html>');
  const home = '<url><loc>' + origin + '/</loc><lastmod>2026-11-01</lastmod></url>';
  const sample = '<url><loc>' + origin + '/courses/sample</loc><lastmod>2026-11-01</lastmod></url>';
  const catalog = '<url><loc>' + origin + '/courses</loc><lastmod>2026-11-01</lastmod></url>';
  fs.writeFileSync(path.join(root, 'sitemap.xml'),
    '<?xml version="1.0"?><urlset>' + home + (withCourse ? catalog + sample : '') + '</urlset>');
  if (withCourse) {
    fs.mkdirSync(path.join(root, 'courses', 'sample'), {recursive: true});
    fs.writeFileSync(path.join(root, 'course-manifest.json'), JSON.stringify({
      courses: [{courseId: 'TEST-101', path: '/courses/sample'}],
    }));
    fs.writeFileSync(path.join(root, 'courses', 'index.html'),
      '<!doctype html><html><head><link rel="canonical" href="' + origin + '/courses"></head><body>Catalogue</body></html>');
    fs.writeFileSync(path.join(root, 'courses', 'sample', 'index.html'),
      '<!doctype html><html><head><meta name="robots" content="index,follow"><link rel="canonical" href="' + origin + '/courses/sample"></head><body>Course</body></html>');
  }
  return root;
}

test('publisher policy leaves canonical composed course HTML and sitemap intact', () => {
  const root = fixture(true);
  try {
    const coursePage = path.join(root, 'courses', 'sample', 'index.html');
    const original = fs.readFileSync(coursePage, 'utf8');
    run(root);
    run(root);
    run(root, true);
    assert.equal(fs.readFileSync(coursePage, 'utf8'), original);
    const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    assert.equal(xml.split('<loc>' + origin + '/courses/sample</loc>').length - 1, 1);
    assert.equal(xml.split('<loc>' + origin + '/courses</loc>').length - 1, 1);
    assert.ok(xml.includes('<loc>' + origin + '/</loc>'));
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('source publisher policy remains deterministic without a course artifact', () => {
  const root = fixture(false);
  try {
    run(root);
    run(root, true);
    const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    assert.ok(!xml.includes('/courses'));
    assert.ok(xml.includes('<loc>' + origin + '/</loc>'));
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});
