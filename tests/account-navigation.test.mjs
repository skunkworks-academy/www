import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';
const { JSDOM } = createRequire(new URL('./shell-dom/package.json', import.meta.url))('jsdom');

const sources = ['skunkworks-ui.js', 'academy-navigation-v11.js', 'skunkworks-footer.js']
  .map(name => fs.readFileSync(new URL('../assets/' + name, import.meta.url), 'utf8'));

function fixture(t, { url = 'https://portal.skunkworksacademy.com/', account = {}, signedIn = true } = {}) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><main><button id="outside">Outside</button></main></body></html>', {
    url, runScripts: 'outside-only', pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  const { document } = window;
  Object.defineProperty(document, 'readyState', { value: 'complete' });
  let signOuts = 0;
  let toggles = 0;
  let readyEvents = 0;
  let themeListeners = 0;
  window.matchMedia = () => ({ matches: false, addEventListener: () => themeListeners++ });
  window.addEventListener('skunkworksacademy:portal-menu-toggle', () => toggles++);
  window.addEventListener('skunkworksacademy:navigation-ready', () => readyEvents++);
  window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT = signedIn ? {
    source: 'portal', authenticated: true, workspaceNavigation: 'sidebar', userName: 'Raydo Smith', workspaceRole: 'Staff',
    profileUrl: '/?account=profile', settingsUrl: '/?account=settings', signOut: () => signOuts++, ...account,
  } : undefined;
  sources.forEach(source => window.eval(source));
  const query = selector => document.querySelector(selector);
  const key = key => document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  const update = fields => {
    window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT = fields == null ? undefined : { ...window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT, ...fields };
    window.dispatchEvent(new window.Event('skunkworksacademy:account-change'));
  };
  return { window, document, query, key, update, signOuts: () => signOuts, toggles: () => toggles, readyEvents: () => readyEvents, themeListeners: () => themeListeners };
}

test('older portal keeps navigation until the portal explicitly supports the sidebar', t => {
  const f = fixture(t, { account: { workspaceNavigation: undefined } });
  assert.ok(f.query('.swa-global-nav__top-menu'));
  assert.equal(f.query('.swa-global-footer').dataset.skunkworksFooterMode, 'public');
  assert.equal(f.query('.swa-global-nav__toggle').getAttribute('aria-controls'), 'swa-global-nav-links');
});

test('workspace labels follow the authorized bridge without changing links; public row returns on sign-out', t => {
  const f = fixture(t);
  const brand = f.query('.swa-global-nav__brand');
  const href = brand.href;
  for (const [workspaceRole, label] of [['Staff', 'Staff portal'], ['Instructor', 'Instructor portal'], ['Student', 'Learner portal'], ['invalid', 'Learner portal']]) {
    f.update({ workspaceRole });
    assert.equal(f.query('.swa-global-nav__brand-text').textContent, label);
    assert.equal(f.query('.swa-global-nav__brand-text').dataset.skunkworksSectionLabel, label);
    assert.equal(brand.href, href);
    assert.equal(f.query('.swa-global-nav__top-menu'), null);
    assert.ok(!f.document.body.classList.contains('swa-has-top-menu'));
  }
  f.update(null);
  assert.ok(f.query('.swa-global-nav__top-menu'));
  assert.equal(f.query('.swa-global-nav__brand-text').textContent, 'Learner portal');
  assert.equal(f.query('.swa-global-nav__account').hidden, true);
});

for (const [path, label] of [['/connections/', 'Connections'], ['/reports/', 'Reports']]) {
  test(`${label} path retains its own label`, t => {
    const f = fixture(t, { url: 'https://portal.skunkworksacademy.com' + path });
    assert.equal(f.query('.swa-global-nav__brand-text').textContent, label);
    f.update({ workspaceRole: 'Instructor' });
    assert.equal(f.query('.swa-global-nav__brand-text').textContent, label);
  });
}

test('account menu exposes safe destinations, initials and one existing sign-out action', t => {
  const f = fixture(t);
  const toggle = f.query('.swa-global-nav__account-toggle');
  const menu = f.query('#swa-global-nav-account-menu');
  assert.equal(toggle.tagName, 'BUTTON');
  assert.equal(toggle.type, 'button');
  assert.equal(toggle.getAttribute('aria-haspopup'), 'menu');
  assert.equal(toggle.getAttribute('aria-label'), 'Account menu for Raydo Smith');
  assert.equal(f.query('.swa-global-nav__account-avatar').textContent, 'RS');
  assert.equal(f.query('.swa-global-nav__sign-in').hidden, true);
  assert.equal(f.query('.swa-global-nav__account-name').hidden, true);
  toggle.click();
  const items = [...menu.querySelectorAll('[role=menuitem]')];
  assert.deepEqual(items.map(item => item.textContent), ['Profile', 'Settings', 'Sign out']);
  assert.equal(items[0].href, 'https://portal.skunkworksacademy.com/?account=profile');
  assert.equal(items[1].href, 'https://portal.skunkworksacademy.com/?account=settings');
  assert.equal(f.document.activeElement, items[0]);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  items[2].click();
  assert.equal(f.signOuts(), 1);
  assert.equal(menu.hidden, true);
  assert.equal(f.document.activeElement, toggle);
});

test('menu arrow, Home/End and Escape controls manage focus; outside focus closes it', t => {
  const f = fixture(t);
  const toggle = f.query('.swa-global-nav__account-toggle');
  const items = [...f.query('#swa-global-nav-account-menu').children];
  toggle.focus();
  f.key('ArrowDown');
  assert.equal(f.document.activeElement, items[0]);
  f.key('ArrowDown');
  assert.equal(f.document.activeElement, items[1]);
  f.key('End');
  assert.equal(f.document.activeElement, items[2]);
  f.key('ArrowDown');
  assert.equal(f.document.activeElement, items[0]);
  f.key('ArrowUp');
  assert.equal(f.document.activeElement, items[2]);
  f.key('Home');
  assert.equal(f.document.activeElement, items[0]);
  f.key('Escape');
  assert.equal(f.document.activeElement, toggle);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  f.key('ArrowUp');
  assert.equal(f.document.activeElement, items[2]);
  f.query('#outside').focus();
  f.query('#outside').click();
  assert.equal(f.query('#swa-global-nav-account-menu').hidden, true);
  assert.equal(f.document.activeElement, f.query('#outside'));
});

test('missing, cross-origin, credential and script URLs never become account destinations', t => {
  const f = fixture(t);
  for (const value of [undefined, '', 'https://evil.example/?account=profile', 'javascript:alert(1)', '//evil.example/path', 'https://name:secret@portal.skunkworksacademy.com/']) {
    f.update({ profileUrl: value, settingsUrl: value });
    const items = [...f.query('#swa-global-nav-account-menu').children];
    for (const item of items.slice(0, 2)) {
      assert.equal(item.hidden, true);
      assert.equal(item.hasAttribute('href'), false);
    }
    f.query('.swa-global-nav__account-toggle').click();
    assert.equal(f.document.activeElement, items[2]);
  }
});

test('late bridge updates work, text is not HTML and avatar exposes no account photo request', t => {
  const f = fixture(t, { signedIn: false });
  f.update({ source: 'portal', authenticated: true, workspaceNavigation: 'sidebar', workspaceRole: 'Instructor', userName: '<img src=x onerror=alert(1)> Long Name', signOut() {}, profileUrl: '/?account=profile', settingsUrl: '/?account=settings' });
  assert.equal(f.query('.swa-global-nav__brand-text').textContent, 'Instructor portal');
  assert.equal(f.query('.swa-global-nav__account').hidden, false);
  assert.equal(f.query('.swa-global-nav__account-label').textContent, '<img src=x onerror=alert(1)> Long Name');
  assert.equal(f.query('.swa-global-nav__account img'), null);
});

test('other origins and account sources keep existing public navigation and account actions', t => {
  const f = fixture(t, { url: 'https://www.skunkworksacademy.com/' });
  assert.equal(f.query('.swa-global-nav__account').hidden, true);
  assert.equal(f.query('.swa-global-nav__sign-in').hidden, false);
  assert.equal(f.query('.swa-global-nav__sign-in').textContent, 'Sign out');
  assert.ok(f.query('.swa-global-nav__top-menu'));
  f.query('.swa-global-nav__sign-in').click();
  assert.equal(f.signOuts(), 1);
  const other = fixture(t, { account: { source: 'another-app' } });
  assert.equal(other.query('.swa-global-nav__account').hidden, true);
  assert.ok(other.query('.swa-global-nav__top-menu'));
});

test('portal hamburger uses the existing sidebar event contract; search survives content updates', async t => {
  const f = fixture(t);
  const toggle = f.query('.swa-global-nav__toggle');
  assert.equal(toggle.getAttribute('aria-controls'), 'academy-portal-sidebar');
  toggle.click();
  assert.equal(f.toggles(), 1);
  assert.ok(!f.query('.swa-global-nav').classList.contains('swa-menu-open'));
  f.window.dispatchEvent(new f.window.CustomEvent('skunkworksacademy:portal-menu-state', { detail: { open: true } }));
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(toggle.getAttribute('aria-label'), 'Close workspace navigation');
  f.update({ workspaceRole: 'Instructor' });
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  f.query('.swa-global-nav__search').click();
  assert.equal(f.document.activeElement, f.query('.swa-global-nav__search-input'));
  assert.ok(f.query('.swa-global-nav__search-results a'));
  // Updating results or the page content triggers the canonical chrome observer.
  f.query('main').appendChild(f.document.createElement('p'));
  await new Promise(resolve => f.window.setTimeout(resolve, 0));
  assert.ok(f.query('.swa-global-nav').classList.contains('swa-search-open'));
  assert.equal(f.query('.swa-global-nav__search').getAttribute('aria-expanded'), 'true');
  assert.equal(f.document.activeElement, f.query('.swa-global-nav__search-input'));
});

test('an account reset does not leave keyboard focus in a hidden menu', t => {
  const f = fixture(t);
  f.query('.swa-global-nav__account-toggle').click();
  f.update(null);
  assert.equal(f.document.activeElement, f.query('.swa-global-nav__sign-in'));
  assert.equal(f.query('.swa-global-nav__sign-in').hidden, false);
});

test('canonical groups are published once per notification and retain the existing public destinations', t => {
  const f = fixture(t);
  const groups = f.window.SKUNKWORKS_ACADEMY_SHELL.menuGroups;
  assert.ok(groups.length >= 8);
  assert.equal(groups[0].label, 'Learn');
  assert.ok(groups.every(group => group.items.length && group.items.every(item => new URL(item.url).protocol === 'https:')));
  const before = JSON.stringify(groups);
  assert.equal(f.readyEvents(), 1);
  f.update({ workspaceRole: 'Student' });
  assert.equal(f.readyEvents(), 2);
  assert.equal(JSON.stringify(f.window.SKUNKWORKS_ACADEMY_SHELL.menuGroups), before);
});

test('all authenticated portal roles get one compact footer and public mode is restored cleanly', t => {
  const f = fixture(t);
  for (const workspaceRole of ['Staff', 'Instructor', 'Student']) {
    f.update({ workspaceRole });
    const footer = f.query('.swa-global-footer');
    assert.equal(footer.dataset.skunkworksFooterMode, 'portal-workspace');
    assert.deepEqual([...footer.querySelectorAll('a')].map(a => [a.textContent, a.href]), [
      ['Support', 'https://skunkworksacademy.com/contact.html'],
      ['Privacy', 'https://skunkworksacademy.com/privacy.html'],
      ['Terms', 'https://skunkworksacademy.com/terms.html'],
    ]);
    assert.equal(footer.querySelector('.swa-global-footer__social'), null);
    assert.equal(f.document.querySelectorAll('.swa-global-footer').length, 1);
  }
  f.update(null);
  assert.equal(f.query('.swa-global-footer').dataset.skunkworksFooterMode, 'public');
  assert.equal(f.document.querySelectorAll('.swa-global-footer__social-link').length, 7);
  assert.equal(f.document.querySelectorAll('.swa-global-footer a').length, 17);
  assert.equal(f.themeListeners(), 1);
});

test('public footer and explicit theme remain intact on other hosts', t => {
  const f = fixture(t, { url: 'https://www.skunkworksacademy.com/' });
  assert.equal(f.query('.swa-global-footer').dataset.skunkworksFooterMode, 'public');
  f.query('[data-theme-value=dark]').click();
  assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
  f.update({ workspaceRole: 'Instructor' });
  assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
  assert.equal(f.document.querySelectorAll('.swa-global-footer__social-link').length, 7);
});

test('navigation and footer dependency cache revisions change without changing stable theme contract', t => {
  const f = fixture(t);
  assert.match(f.query('script[data-skunkworks-ui]').src, /rev=2026\.11\.05\.2/);
  assert.match(f.query('script[data-skunkworks-global-footer]').src, /rev=2026\.11\.05\.1/);
  assert.match(f.query('link[data-skunkworks-brand-theme]').href, /v=2026\.09\.08\.3&rev=2026\.11\.05\.2/);
});
