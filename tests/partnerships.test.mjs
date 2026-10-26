import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const partners = readFileSync(new URL('../partners/index.html', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../assets/academy-partnerships.css', import.meta.url), 'utf8');

test('homepage contains all five featured partners and routes to their partnership detail cards', () => {
  const section = home.match(/<ul class="swa-partnerships__grid">([\s\S]*?)<\/ul>/)?.[1];
  assert.ok(section, 'homepage partnership grid exists');
  for (const [name, anchor] of [
    ['Google Cloud', 'google-cloud'],
    ['Microsoft', 'microsoft'],
    ['IBM', 'ibm'],
    ['Red Hat', 'red-hat'],
    ['CompTIA', 'comptia'],
  ]) {
    assert.match(section, new RegExp('href="/partners/#' + anchor + '"'), name + ' links to partner details');
    assert.match(section, new RegExp('<h3>' + name + '</h3>'), name + ' is prominently named');
    assert.match(partners, new RegExp('id="' + anchor + '"'), name + ' detail target exists');
  }
  assert.equal((section.match(/class="swa-partner swa-partner--summary"/g) || []).length, 5);
});

test('Microsoft designation, badge and official directory link agree with the Partners page', () => {
  for (const markup of [home, partners]) {
    assert.match(markup, /Microsoft in Education Global Training Partner/);
    assert.match(markup, /images\.credly\.com\/images\/b5533d2d-f332-4868-8c2a-83fd22b3caac\/blob/);
  }
  assert.match(partners, /https:\/\/learn\.microsoft\.com\/en-us\/training\/educator-center\/programs\/global-training-partner\/find-global-training-partner/);
});

test('partner grid fits five desktop cards and retains tablet/mobile breakpoints', () => {
  assert.match(styles, /grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*1000px\)[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*580px\)[\s\S]*?minmax\(0, 1fr\)/);
});
