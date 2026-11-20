import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const partners = readFileSync(new URL('../partners/index.html', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../assets/academy-partnerships.css', import.meta.url), 'utf8');

test('homepage contains all eight featured learning and partner cards and routes to their partnership detail cards', () => {
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
    ['GitHub', 'github'],
  ]) {
    assert.match(section, new RegExp('href="/partners/#' + anchor + '"'), name + ' links to partner details');
    assert.match(section, new RegExp('<h3>' + name + '</h3>'), name + ' is prominently named');
    assert.match(partners, new RegExp('id="' + anchor + '"'), name + ' detail target exists');
  }
  assert.equal((section.match(/class="swa-partner swa-partner--summary"/g) || []).length, 8);
});

test('Microsoft designation, badge and official directory link agree with the Partners page', () => {
  for (const markup of [home, partners]) {
    assert.match(markup, /Microsoft in Education Global Training Partner/);
    assert.match(markup, /images\.credly\.com\/images\/b5533d2d-f332-4868-8c2a-83fd22b3caac\/blob/);
  }
  assert.match(partners, /https:\/\/learn\.microsoft\.com\/en-us\/training\/educator-center\/programs\/global-training-partner\/find-global-training-partner/);
});

test('partner grid retains desktop and tablet/mobile breakpoints for eight cards', () => {
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

test('Linux Foundation uses the specified Wikimedia image in every featured card without claiming partner status', () => {
  assert.ok(home.includes('href="/partners/#linux-foundation"'));
  assert.ok(partners.includes('id="linux-foundation"'));
  const image = 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Linux_Foundation_logo.png';
  for (const markup of [home, partners]) {
    assert.ok(markup.includes('Training &amp; certification resources'));
    assert.ok(markup.includes(`src="${image}" alt="The Linux Foundation logo" width="1750" height="532"`), 'correct original image with descriptive alt text');
    assert.ok(markup.includes('swa-partner__art--linux-foundation'));
    assert.doesNotMatch(markup, /swa-partner__nameplate|swa-partner__art--text/);
  }
  assert.ok(partners.includes('https://commons.wikimedia.org/wiki/File:Linux_Foundation_logo.png'));
  assert.ok(partners.includes('Linux Foundation, public domain, via Wikimedia Commons'));
  assert.ok(partners.includes('registered trademarks of The Linux Foundation'));
  assert.ok(partners.includes('https://training.linuxfoundation.org/learning-paths/'));
  assert.ok(partners.includes('https://training.linuxfoundation.org/certification-catalog/'));
  assert.ok(partners.includes('do not imply Skunkworks holds an Authorized Training Partner designation'));
  assert.ok(styles.includes('.swa-partner__art--linux-foundation img'));
});

test('GitHub is discoverable via the existing logo and official educational pathways, without unverified designation', () => {
  assert.match(home, /href="\/partners\/#github"/);
  assert.match(partners, /id="github"/);
  for (const markup of [home, partners]) {
    assert.match(markup, /<h3(?: id="github-heading")?>GitHub<\/h3>/);
    assert.match(markup, /src="\/partners\/images\/gh-logo\.png" alt="GitHub logo" width="3840" height="2160"/);
    assert.match(markup, /Education, learning &amp; certification resources/);
  }
  assert.match(partners, /https:\/\/github\.com\/education"/);
  assert.match(partners, /https:\/\/github\.com\/education\/teachers\/toolbox"/);
  assert.match(partners, /https:\/\/learn\.github\.com\/certifications"/);
  assert.match(partners, /not a claim that Skunkworks is an authorized GitHub Education or training partner/);
});
