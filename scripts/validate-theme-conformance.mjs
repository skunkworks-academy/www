#!/usr/bin/env node
/*
  Validates the shared Academy theme layer rather than attempting to police
  every page's authored layout. Public HTML is normalised by the existing
  global page contract; this gate ensures that contract has a complete,
  accessible, page-safe theme layer to load.
*/

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const VERSION = '2026.08.23.1';

const files = {
  shell: 'assets/academy-navigation.js',
  brand: 'assets/academy-brand-theme.css',
  design: 'assets/skunkworks-design-system.css',
  conformance: 'assets/academy-theme-conformance.css',
};

const source = {};
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const [name, relative] of Object.entries(files)) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    fail('Missing required theme asset: ' + relative);
    continue;
  }
  source[name] = fs.readFileSync(absolute, 'utf8');
}

function requireText(file, fragment, label) {
  if (!source[file]?.includes(fragment)) fail(files[file] + ' is missing ' + label + '.');
}

requireText('conformance', 'Version: ' + VERSION, 'the conformance version banner');
requireText('conformance', '--swa-content-max:', 'the content-width token');
requireText('conformance', '--swa-control-height:', 'the control-height token');
requireText('conformance', '--swa-action:', 'the semantic action token');
requireText('conformance', '--swa-focus:', 'the focus token');
requireText('conformance', ':root[data-theme="dark"]', 'the explicit dark-theme contract');
requireText('conformance', '@media (prefers-color-scheme: dark)', 'the OS dark-theme fallback');
requireText('conformance', '@media (prefers-reduced-motion: reduce)', 'the reduced-motion contract');
requireText('conformance', '[data-sk-component="button"]', 'the opt-in button component selector');
requireText('conformance', '[data-sk-component="card"]', 'the opt-in card component selector');
requireText('conformance', '[data-sk-component="field"]', 'the opt-in field component selector');
requireText('conformance', '[data-sk-component="notice"]', 'the opt-in notice component selector');
requireText('conformance', '[data-sk-component="prose"]', 'the opt-in prose component selector');

const pageCanvasReset = /(?:^|[}\n])\s*(?:html\s*,\s*)?body\s*\{[^}]*\bbackground(?:-color)?\s*:/im;
if (pageCanvasReset.test(source.conformance || '')) {
  fail(files.conformance + ' must not take ownership of the page canvas; use semantic surfaces only.');
}

for (const token of [
  '--sw-ink-navy: #03033a',
  '--sw-skunk-blue: #1e6bd0',
  '--sw-signal-orange: #f24208',
  '--sk-bg:',
  '--sk-text-primary:',
  '--sk-interactive:',
  '--sk-focus:',
]) {
  const file = token.startsWith('--sw-') ? 'brand' : 'design';
  requireText(file, token, 'the canonical token ' + token);
}

requireText('shell', 'THEME_CONFORMANCE_VERSION = "' + VERSION + '"', 'the conformance asset version');
requireText('shell', 'function installThemeConformance()', 'the conformance loader');
requireText('shell', 'academy-theme-conformance.css', 'the conformance stylesheet reference');
requireText('shell', 'data-skunkworks-theme-conformance', 'the conformance marker');
requireText('shell', 'installThemeConformance(true)', 'deterministic conformance stylesheet ordering');

if (failures.length) {
  console.error('Theme conformance validation failed:\n');
  for (const message of failures) console.error('- ' + message);
  process.exit(1);
}

console.log('Theme conformance validation passed (v' + VERSION + ').');
console.log('Validated canonical tokens, light/dark semantic surfaces, opt-in components, motion handling, and the global-shell loader.');
