import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { JSDOM } = createRequire(new URL('./shell-dom/package.json', import.meta.url))('jsdom');

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const bootstrap = read('assets/academy-navigation.js');
const runtime = read('assets/academy-navigation-v11.js');
const ui = read('assets/skunkworks-ui.js');
const staticThemeTag = read('index.html').match(/<link\b[^>]*data-skunkworks-brand-theme="canonical"[^>]*>/)?.[0];
assert.ok(staticThemeTag, 'homepage provides the stylesheet before scripts run');

function fixture(t, url, { stale = false, missing = false } = {}) {
  const origin = new URL(url).origin;
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname);
  // Match the release workflow's localization of first-party HTML assets.
  let tag = local ? staticThemeTag.replace('https://www.skunkworksacademy.com', origin) : staticThemeTag;
  if (stale) tag = tag.replace(/&rev=[^"]+/, '');
  const dom = new JSDOM('<!doctype html><html><head>' + (missing ? '' : tag) + '</head><body><main>Content</main></body></html>', {
    url, runScripts: 'outside-only', pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  Object.defineProperty(window.document, 'readyState', { value: 'complete' });
  window.matchMedia = () => ({ matches: false, addEventListener() {} });
  const hrefWrites = [];
  const originalSetAttribute = window.Element.prototype.setAttribute;
  window.Element.prototype.setAttribute = function (name, value) {
    if (name === 'href' && this.matches('link[data-skunkworks-brand-theme="canonical"]')) hrefWrites.push(value);
    return originalSetAttribute.call(this, name, value);
  };
  const expectedTheme = (local ? origin : 'https://www.skunkworksacademy.com') +
    '/assets/academy-brand-theme.css?v=2026.09.08.3&rev=2026.11.05.2';
  return { window, hrefWrites, expectedTheme, query: selector => window.document.querySelector(selector) };
}

for (const url of [
  'https://www.skunkworksacademy.com/', 'https://skunkworksacademy.com/',
  'https://portal.skunkworksacademy.com/', 'http://localhost:4173/',
  'http://127.0.0.1:4173/', 'http://[::1]:4173/',
]) {
  for (const order of ['bootstrap-first', 'runtime-first']) {
    test('static theme remains loaded without URL changes: ' + url + ' ' + order, t => {
      const f = fixture(t, url);
      const link = f.query('link[data-skunkworks-brand-theme="canonical"]');
      assert.equal(link.href, f.expectedTheme);
      for (const source of order === 'bootstrap-first' ? [bootstrap, runtime] : [runtime, bootstrap]) f.window.eval(source);
      // Exercise the asynchronous load callback and a repeated bootstrap too.
      f.query('script[data-skunkworks-global-nav-runtime="v11"]')?.dispatchEvent(new f.window.Event('load'));
      f.window.eval(bootstrap);
      assert.equal(f.query('link[data-skunkworks-brand-theme="canonical"]'), link);
      assert.equal(link.href, f.expectedTheme);
      assert.deepEqual(f.hrefWrites, [], 'a correct stylesheet must not be replaced while the shell loads');
      assert.equal(f.window.document.querySelectorAll('link[data-skunkworks-brand-theme="canonical"]').length, 1);
    });
  }
}

test('an older theme URL upgrades once without bouncing between loader revisions', t => {
  const f = fixture(t, 'https://portal.skunkworksacademy.com/', { stale: true });
  f.window.eval(bootstrap);
  f.window.eval(runtime);
  f.window.eval(bootstrap);
  assert.deepEqual(f.hrefWrites, [f.expectedTheme]);
});

test('a page without a static theme receives one shared stylesheet', t => {
  const f = fixture(t, 'https://portal.skunkworksacademy.com/', { missing: true });
  f.window.eval(runtime);
  f.window.eval(bootstrap);
  assert.equal(f.window.document.querySelectorAll('link[data-skunkworks-brand-theme="canonical"]').length, 1);
  assert.equal(f.query('link[data-skunkworks-brand-theme="canonical"]').href, f.expectedTheme);
  assert.deepEqual(f.hrefWrites, []);
});

for (const url of ['http://localhost:4173/', 'http://127.0.0.1:4173/', 'http://[::1]:4173/', 'https://portal.skunkworksacademy.com/']) {
  test('header images use the preview origin without changing navigation: ' + url, t => {
    const f = fixture(t, url);
    f.window.eval(ui);
    const local = new URL(url).protocol === 'http:';
    const imageRoot = local ? new URL(url).origin : 'https://skunkworksacademy.com';
    for (const image of f.window.document.querySelectorAll('.swa-logo-light')) {
      assert.equal(image.src, imageRoot + '/images/favicon-black.png?v=2026.09.08.3');
    }
    const dark = [...f.window.document.querySelectorAll('.swa-logo-dark')];
    assert.ok(dark.length, 'official white header artwork is present');
    for (const image of dark) assert.equal(image.src, imageRoot + '/images/logo-white.svg?v=2026.09.08.3');
    assert.equal(f.query('.swa-global-nav__brand').href, 'https://skunkworksacademy.com/');
    assert.equal(f.query('.swa-global-nav__crest').href, 'https://skunkworksacademy.com/');
  });
}

test('the HTML contract rejects lookalike favicon hosts and data-href substitutes', t => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const work = path.dirname(path.resolve(root));
  const scratch = fs.mkdtempSync(path.join(work, 'page-contract-security-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(scratch)), work);
    fs.rmSync(scratch, { recursive: true });
  });
  for (const relative of ['images/favicon-search.png', 'images/favicon-search-dark.png',
    'assets/academy-page-contract.js', 'assets/academy-brand-theme.css', 'assets/academy-forms.css', 'assets/academy-navigation.js']) {
    fs.mkdirSync(path.dirname(path.join(scratch, relative)), { recursive: true });
    fs.copyFileSync(path.join(root, relative), path.join(scratch, relative));
  }
  const page = path.join(scratch, 'index.html');
  fs.writeFileSync(page, '<!doctype html><html><head><title>Contract fixture</title></head><body></body></html>');
  const enforce = mode => execFileSync(process.execPath, [path.join(root, 'scripts/enforce-global-page-contract.mjs'), mode, scratch], { stdio: 'pipe' });
  enforce('--write');
  enforce('--check');
  const valid = fs.readFileSync(page, 'utf8');
  const href = 'href="https://www.skunkworksacademy.com/images/favicon-search.png?v=2026.11.05.2"';
  for (const replacement of [
    href.replace('www.skunkworksacademy.com', 'wwwXskunkworksacademy.com'),
    'data-' + href + ' href="https://untrusted.example/icon.png"',
  ]) {
    fs.writeFileSync(page, valid.replace(href, replacement));
    assert.throws(() => enforce('--check'), /default\/light favicon/);
  }
});

test('Python exercise exceptions are displayed as text, never interpreted as markup', t => {
  const html = read('python/activities.html');
  const dom = new JSDOM(html, { url: 'https://www.skunkworksacademy.com/python/activities.html', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const inline = [...dom.window.document.querySelectorAll('script:not([src])')]
    .map(script => script.textContent).find(source => source.includes('function runPythonCode'));
  assert.ok(inline);
  const message = '<img src=x onerror="window.injected=true">';
  dom.window.__BRYTHON__ = { py2js() { throw new Error(message); } };
  dom.window.eval(inline);
  dom.window.runPythonCode();
  assert.equal(dom.window.document.querySelector('#output').textContent, 'Error: ' + message);
  assert.equal(dom.window.document.querySelector('#output img'), null);
  assert.equal(dom.window.injected, undefined);
});
