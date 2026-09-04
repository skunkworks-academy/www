#!/usr/bin/env node
/*
  Validates the consolidated Skunkworks Academy public theme contract.
  The brand theme is now the single authored source for palette, typography,
  conformance and runtime surface-contrast CSS, including the base design
  system, WCAG safeguards and homepage hero contrast contract.
*/

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const VERSION = '2026.09.04.2';
const PAGE_CONTRACT_VERSION = '2026.09.04.2';

const files = {
  shell: 'assets/academy-navigation.js',
  brand: 'assets/academy-brand-theme.css',
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

requireText('brand', 'Version: ' + VERSION, 'the consolidated theme version banner');
requireText('brand', '--swa-theme-contract-version: "' + VERSION + '"', 'the theme contract version token');
requireText('brand', '--sw-ink-navy: #03033a', 'Ink Navy');
requireText('brand', '--sw-skunk-blue: #1e6bd0', 'Skunk Blue');
requireText('brand', '--sw-signal-orange: #f24208', 'Signal Orange');
requireText('brand', '--sk-font-display: "Inter"', 'Inter display typography');
requireText('brand', '--sk-font-sans: "Open Sans"', 'Open Sans body/UI typography');
requireText('brand', '--swa-content-max:', 'the content-width token');
requireText('brand', '--swa-control-height:', 'the control-height token');
requireText('brand', '--swa-action:', 'the semantic action token');
requireText('brand', '--swa-focus:', 'the focus token');
requireText('brand', ':root[data-theme="dark"]', 'the explicit dark-theme contract');
requireText('brand', ':root[data-swa-theme="dark"]', 'the footer dark-theme contract');
requireText('brand', '@media (prefers-color-scheme: dark)', 'the OS dark-theme fallback');
requireText('brand', '@media (prefers-reduced-motion: reduce)', 'the reduced-motion contract');
requireText('brand', 'Academy-wide foundation', 'the global page foundation');
requireText('brand', 'body:not([data-swa-theme-scope="isolated"])', 'the governed body selector');
requireText('brand', '--bg: var(--sk-bg) !important', 'the legacy background token bridge');
requireText('brand', ':where(.card, .panel, .tile, .surface, .box', 'the legacy content-surface bridge');
requireText('brand', 'data-swa-theme-scope="isolated"', 'the documented isolated-app escape hatch');
requireText('brand', '[data-sk-component="button"]', 'the opt-in button component selector');
requireText('brand', '[data-sk-component="card"]', 'the opt-in card component selector');
requireText('brand', '[data-sk-component="field"]', 'the opt-in field component selector');
requireText('brand', '[data-sk-component="notice"]', 'the opt-in notice component selector');
requireText('brand', '[data-sk-component="prose"]', 'the opt-in prose component selector');
requireText('brand', '[data-swa-surface-tone="light"]', 'the light runtime surface contract');
requireText('brand', '[data-swa-surface-tone="dark"]', 'the dark runtime surface contract');
requireText('brand', '.swa-global-nav {', 'the canonical shell brand override');
requireText('brand', '.swa-global-footer {', 'the canonical footer brand override');

requireText('brand', 'Base design-system primitives', 'the base design-system layer');
requireText('brand', 'WCAG contrast and publisher surface safeguards', 'the accessibility layer');
requireText('brand', 'Homepage split-hero contrast contract', 'the homepage hero layer');

requireText('shell', 'BRAND_THEME_VERSION = "' + VERSION + '"', 'the consolidated brand asset version');
requireText('shell', 'PAGE_CONTRACT_VERSION = "' + PAGE_CONTRACT_VERSION + '"', 'the page-contract cache version');
requireText('shell', 'academy-brand-theme.css', 'the consolidated theme stylesheet reference');

if (failures.length) {
  console.error('Theme conformance validation failed:\n');
  for (const message of failures) console.error('- ' + message);
  process.exit(1);
}

console.log('Theme conformance validation passed (v' + VERSION + '; page contract ' + PAGE_CONTRACT_VERSION + ').');
console.log('Validated the consolidated Academy palette, typography, base design system, WCAG safeguards, light/dark modes, common components, runtime surface contrast and shell styling.');
