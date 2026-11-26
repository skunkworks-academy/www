import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../assets/academy-sign-in-return.js', import.meta.url), 'utf8');

function setup(href = 'https://www.skunkworksacademy.com/guides/?q=azure#labs') {
  const listeners = new Map();
  let mutation;
  class Element {
    querySelectorAll() { return []; }
    closest() { return this; }
  }
  class Anchor extends Element {
    constructor(label, href = 'https://portal.skunkworksacademy.com/') { super(); this.textContent = label; this.href = href; this.attrs = new Set(); }
    hasAttribute(name) { return this.attrs.has(name); }
  }
  const signIn = new Anchor('Sign in');
  const portal = new Anchor('Portal');
  const explicit = new Anchor('Continue securely'); explicit.attrs.add('data-academy-sign-in');
  const links = [signIn, portal, explicit];
  const document = {
    readyState: 'complete', documentElement: {},
    querySelectorAll: () => links,
    addEventListener: (type, fn) => listeners.set(type, fn)
  };
  const window = { location: new URL(href), addEventListener: (type, fn) => listeners.set(type, fn) };
  class MutationObserver { constructor(fn) { mutation = fn; } observe() {} }
  const context = { window, document, Element, HTMLAnchorElement: Anchor, MutationObserver, URL, URLSearchParams };
  vm.runInNewContext(source, context);
  return { window, links, signIn, portal, explicit, listeners, Anchor, context, added: node => mutation([{ addedNodes: [node] }]) };
}

test('keeps original path, query and anchor on Sign in only', () => {
  const s = setup();
  assert.equal(new URL(s.signIn.href).searchParams.get('returnTo'), s.window.location.href);
  assert.equal(s.portal.href, 'https://portal.skunkworksacademy.com/');
  assert.equal(new URL(s.explicit.href).searchParams.get('returnTo'), s.window.location.href);
});
test('supports Connections and approved vendor hosts', () => {
  for (const href of ['https://portal.skunkworksacademy.com/connections/#planner', 'https://microsoft.skunkworksacademy.com/paths/data/']) {
    const s = setup(href); assert.equal(new URL(s.signIn.href).searchParams.get('returnTo'), href);
  }
});
for (const href of [
  'https://evil.example/', 'https://unapproved.skunkworksacademy.com/', 'http://www.skunkworksacademy.com/',
  'https://portal.skunkworksacademy.com/', 'https://portal.skunkworksacademy.com/reports/',
  'https://www.skunkworksacademy.com/auth/login', 'https://www.skunkworksacademy.com/?code=secret',
  'https://www.skunkworksacademy.com/#access_token=secret', 'https://www.skunkworksacademy.com/?next=https://evil.example/'
]) test(`does not propagate unsafe context: ${href}`, () => assert.equal(setup(href).signIn.href, 'https://portal.skunkworksacademy.com/'));
test('handles late-loaded navigation without moving DOM nodes', () => {
  const s = setup(); const link = new s.Anchor('Sign in to Portal'); s.added(link);
  assert.equal(new URL(link.href).searchParams.get('returnTo'), s.window.location.href);
});
test('refreshes stale hrefs on activation without preventing default or modified clicks', () => {
  const s = setup();
  for (const type of ['click', 'pointerdown', 'focusin', 'contextmenu']) {
    s.signIn.href = 'https://portal.skunkworksacademy.com/';
    let prevented = false;
    s.listeners.get(type)({ target: s.signIn, ctrlKey: true, metaKey: true, preventDefault: () => { prevented = true; } });
    assert.equal(new URL(s.signIn.href).searchParams.get('returnTo'), s.window.location.href);
    assert.equal(prevented, false);
  }
});
test('tracks client-side navigation and clears unsafe stale context', () => {
  const s = setup(); s.window.location = new URL('https://www.skunkworksacademy.com/courses/?q=security#outline');
  s.listeners.get('popstate')();
  assert.equal(new URL(s.signIn.href).searchParams.get('returnTo'), s.window.location.href);
  s.window.location = new URL('https://www.skunkworksacademy.com/#code=secret'); s.listeners.get('hashchange')();
  assert.equal(new URL(s.signIn.href).searchParams.has('returnTo'), false);
});
test('does not rewrite third-party authentication, portal subroutes or account links', () => {
  const s = setup();
  for (const [label, href] of [['Sign in', 'https://login.microsoftonline.com/'], ['Sign in', 'https://portal.skunkworksacademy.com/reports/'], ['My account', 'https://portal.skunkworksacademy.com/']]) {
    const link = new s.Anchor(label, href); s.added(link); assert.equal(link.href, href);
  }
});
test('is idempotent when the compatibility shell is loaded twice', () => {
  const s = setup(); const callback = s.listeners.get('click'); vm.runInNewContext(source, s.context);
  assert.equal(s.listeners.get('click'), callback);
});
