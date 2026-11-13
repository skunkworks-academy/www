import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const partners = readFileSync(new URL('../partners/index.html', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../assets/academy-partnerships.css', import.meta.url), 'utf8');

test('homepage contains all seven featured learning and partner cards and routes to their partnership detail cards', () => {
  const section = home.match(/<ul class="swa-partnerships__grid">([\s\S]*?)<\/ul>/)?.[1];
  assert.ok(section, 'homepage partnership grid exists');
  for (const [name, anchor] of [
    ['Google for Education', 'google-cloud'],
    ['Microsoft', 'microsoft'],
    ['IBM', 'ibm'],
    ['Red Hat', 'red-hat'],
    ['CompTIA', 'comptia'],
    ['Cisco Networking Academy', 'cisco-netacad'],
    ['Linux Foundation', 'linux-foundation'],
  ]) {
    assert.match(section, new RegExp('href="/partners/#' + anchor + '"'), name + ' links to partner details');
    assert.match(section, new RegExp('<h3>' + name + '</h3>'), name + ' is prominently named');
    assert.match(partners, new RegExp('id="' + anchor + '"'), name + ' detail target exists');
  }
  assert.equal((section.match(/class="swa-partner swa-partner--summary"/g) || []).length, 7);
});

test('Microsoft designation, badge and official directory link agree with the Partners page', () => {
  for (const markup of [home, partners]) {
    assert.match(markup, /Microsoft in Education Global Training Partner/);
    assert.match(markup, /images\.credly\.com\/images\/b5533d2d-f332-4868-8c2a-83fd22b3caac\/blob/);
  }
  assert.match(partners, /https:\/\/learn\.microsoft\.com\/en-us\/training\/educator-center\/programs\/global-training-partner\/find-global-training-partner/);
});

test('partner grid retains desktop and tablet/mobile breakpoints for seven cards', () => {
  assert.match(styles, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*1000px\)[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*580px\)[\s\S]*?minmax\(0, 1fr\)/);
});

test('Google for Education is prominent without asserting an unverified programme designation', () => {
  for (const markup of [home, partners]) {
    assert.match(markup, /<h3(?: id="google-cloud-heading")?>Google for Education<\/h3>/);
    assert.match(markup, /Google Cloud Partner · Education-focused learning/);
    assert.match(markup, /alt="Google Cloud Partner badge"/);
  }
  assert.match(partners, /Google Workspace for Education/);
});

test('Linux Foundation learning resources are linked without claiming authorized partnership status', () => {
  for (const markup of [home, partners]) {
    assert.match(markup, /href="\/partners\/#linux-foundation"/.test(markup) ? /Linux Foundation/ : /id="linux-foundation"/);
    assert.match(markup, /Training &amp; certification resources/);
    assert.match(markup, /The Linux Foundation/);
  }
  assert.match(partners, /https:\/\/training\.linuxfoundation\.org\/learning-paths\//);
  assert.match(partners, /https:\/\/training\.linuxfoundation\.org\/certification-catalog\//);
  assert.match(partners, /do not imply Skunkworks holds an Authorized Training Partner designation/);
  assert.match(styles, /\.swa-partner__nameplate/);
});
