#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const VERSION = '2026.08.25.1';
const THEME_VERSION = '2026.08.22.2';
const THEME_CONFORMANCE_VERSION = '2026.08.23.2';
const FORMS_VERSION = '2026.08.20.1';
const PUBLIC_ROOT = 'https://www.skunkworksacademy.com/';
const FAVICON_LIGHT = `${PUBLIC_ROOT}images/favicon-black.png?v=${VERSION}`;
const FAVICON_DARK = `${PUBLIC_ROOT}images/favicon-white.png?v=${VERSION}`;
const CONTRACT_CSS = `${PUBLIC_ROOT}assets/academy-page-contract.css?v=${VERSION}`;
const CONTRACT_JS = `${PUBLIC_ROOT}assets/academy-page-contract.js?v=${VERSION}`;
const BRAND_THEME = `${PUBLIC_ROOT}assets/academy-brand-theme.css?v=${THEME_VERSION}`;
const THEME_CONFORMANCE = `${PUBLIC_ROOT}assets/academy-theme-conformance.css?v=${THEME_CONFORMANCE_VERSION}`;
const DESIGN_SYSTEM = `${PUBLIC_ROOT}assets/skunkworks-design-system.css?v=2026.08.20.1&rev=2026.08.20.1`;
const FORMS_CSS = `${PUBLIC_ROOT}assets/academy-forms.css?v=${FORMS_VERSION}`;
const GLOBAL_NAV = `${PUBLIC_ROOT}assets/academy-navigation.js?v=2026.08.25.2&rev=2026.08.25.2`;

const FAVICON_TAGS = [
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_LIGHT}" data-skunkworks-favicon="canonical" />`,
  `<link rel="shortcut icon" type="image/png" href="${FAVICON_LIGHT}" data-skunkworks-favicon="canonical" />`,
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_LIGHT}" media="(prefers-color-scheme: light)" data-skunkworks-favicon="canonical" />`,
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_DARK}" media="(prefers-color-scheme: dark)" data-skunkworks-favicon="canonical" />`,
];
const FAVICON_INJECTION = FAVICON_TAGS.map((line) => `  ${line}`).join('\n');
const COLOR_SCHEME = '<meta name="color-scheme" content="light dark" data-skunkworks-color-scheme="canonical" />';

const args = process.argv.slice(2);
const mode = args.includes('--write') ? 'write' : 'check';
const rootArg = args.find((arg) => !arg.startsWith('--')) || '.';
const root = path.resolve(rootArg);

const skipDirectories = new Set(['.git', 'node_modules', '.course-catalog']);

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, output);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) output.push(absolute);
  }
  return output;
}

function isHtmlDocument(html) {
  return /<!doctype\s+html|<html\b|<head\b|<body\b/i.test(html);
}

function normalizedRelative(file) {
  return String(file).replace(/\\/g, '/').replace(/^\.\//, '');
}

function isFormsDocument(file) {
  return normalizedRelative(file).startsWith('forms/');
}

function stripIconLinks(html) {
  return html.replace(/<link\b[^>]*>/gi, (tag) => {
    const match = tag.match(/\brel\s*=\s*(["'])(.*?)\1/i);
    if (!match) return tag;
    const rel = match[2].trim().toLowerCase();
    const tokens = rel.split(/\s+/);
    return tokens.includes('icon') ? '' : tag;
  });
}

function stripManagedAssets(html) {
  const replaceToFixpoint = (input, pattern) => {
    let previous;
    let next = input;
    do {
      previous = next;
      next = next.replace(pattern, '');
    } while (next !== previous);
    return next;
  };

  let previous;
  let next = html;
  do {
    previous = next;
    next = replaceToFixpoint(next, /<link\b[^>]*(?:academy-page-contract\.css|data-skunkworks-page-contract\s*=\s*["']css["'])[^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<script\b[^>]*(?:academy-page-contract\.js|data-skunkworks-page-contract\s*=\s*["']runtime["'])[^>]*>\s*<\/script>\s*/gi);
    next = replaceToFixpoint(next, /<link\b[^>]*(?:academy-brand-theme\.css|data-skunkworks-brand-theme\s*=\s*["']canonical["'])[^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<link\b[^>]*(?:academy-theme-conformance\.css|data-skunkworks-theme-conformance\s*=\s*["']canonical["'])[^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<meta\b[^>]*(?:name\s*=\s*["']color-scheme["']|data-skunkworks-color-scheme\s*=\s*["']canonical["'])[^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<link\b[^>]*(?:academy-forms\.css|data-skunkworks-forms-style\s*=\s*["']canonical["'])[^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<link\b[^>]*data-skunkworks-design-system\s*=\s*["']forms-canonical["'][^>]*>\s*/gi);
    next = replaceToFixpoint(next, /<script\b[^>]*data-skunkworks-global-nav\s*=\s*["']forms-canonical["'][^>]*>\s*<\/script>\s*/gi);
  } while (next !== previous);
  return next;
}

function managedInjection(file) {
  const lines = [];

  if (isFormsDocument(file)) {
    lines.push(`<link rel="stylesheet" href="${DESIGN_SYSTEM}" data-skunkworks-design-system="forms-canonical" />`);
  }

  lines.push(`<link rel="stylesheet" href="${CONTRACT_CSS}" data-skunkworks-page-contract="css" />`);

  if (isFormsDocument(file)) {
    lines.push(`<link rel="stylesheet" href="${FORMS_CSS}" data-skunkworks-forms-style="canonical" />`);
    lines.push(`<script defer src="${GLOBAL_NAV}" data-skunkworks-global-nav="forms-canonical"></script>`);
  }

  lines.push(`<link rel="stylesheet" href="${BRAND_THEME}" data-skunkworks-brand-theme="canonical" />`);
  lines.push(`<link rel="stylesheet" href="${THEME_CONFORMANCE}" data-skunkworks-theme-conformance="canonical" />`);
  lines.push(`<script defer src="${CONTRACT_JS}" data-skunkworks-page-contract="runtime"></script>`);
  return lines.map((line) => `  ${line}`).join('\n');
}

function normalize(html, file) {
  let next = stripManagedAssets(stripIconLinks(html));

  if (/<\/title\s*>/i.test(next)) {
    next = next.replace(/<\/title\s*>/i, (match) => `${match}\n  ${COLOR_SCHEME}\n${FAVICON_INJECTION}`);
  } else if (/<head\b[^>]*>/i.test(next)) {
    next = next.replace(/<head\b[^>]*>/i, (match) => `${match}\n  ${COLOR_SCHEME}\n${FAVICON_INJECTION}`);
  } else {
    throw new Error(`Malformed HTML document cannot receive canonical favicon: ${file}`);
  }

  const injection = managedInjection(file);
  if (/<\/head\s*>/i.test(next)) {
    next = next.replace(/<\/head\s*>/i, `${injection}\n</head>`);
  } else if (/<\/body\s*>/i.test(next)) {
    next = next.replace(/<\/body\s*>/i, `${injection}\n</body>`);
  } else {
    throw new Error(`Malformed HTML document cannot receive global page contract: ${file}`);
  }
  return next;
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function canonicalFaviconTags(html) {
  return (html.match(/<link\b[^>]*data-skunkworks-favicon\s*=\s*["']canonical["'][^>]*>/gi) || []);
}

function tagHasAttributeValue(tag, attribute, value) {
  const pattern = new RegExp(`\\b${attribute}\\s*=\\s*(["'])${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'i');
  return pattern.test(tag);
}

function validate(html, file) {
  const failures = [];
  const faviconTags = canonicalFaviconTags(html);
  const lightFaviconTags = faviconTags.filter((tag) => tagHasAttributeValue(tag, 'href', FAVICON_LIGHT));
  const darkFaviconTags = faviconTags.filter((tag) => tagHasAttributeValue(tag, 'href', FAVICON_DARK));
  const shortcutFaviconTags = faviconTags.filter((tag) => tagHasAttributeValue(tag, 'rel', 'shortcut icon'));
  const sizedFaviconTags = faviconTags.filter((tag) => tagHasAttributeValue(tag, 'sizes', '32x32'));

  if (faviconTags.length !== 4) failures.push('canonical favicon set');
  if (lightFaviconTags.length !== 3) failures.push('default/light favicon');
  if (darkFaviconTags.length !== 1) failures.push('dark favicon');
  if (shortcutFaviconTags.length !== 1) failures.push('shortcut favicon');
  if (sizedFaviconTags.length < 3) failures.push('32x32 favicon sizing');
  if (count(html, 'data-skunkworks-page-contract="css"') !== 1) failures.push('page-contract CSS');
  if (count(html, 'data-skunkworks-page-contract="runtime"') !== 1) failures.push('page-contract runtime');
  if (count(html, 'data-skunkworks-brand-theme="canonical"') !== 1) failures.push('canonical brand theme');
  if (count(html, 'data-skunkworks-theme-conformance="canonical"') !== 1) failures.push('canonical theme foundation');
  if (count(html, 'data-skunkworks-color-scheme="canonical"') !== 1) failures.push('canonical colour-scheme metadata');
  if (count(html, CONTRACT_CSS) !== 1) failures.push('canonical page-contract CSS URL');
  if (count(html, CONTRACT_JS) !== 1) failures.push('canonical page-contract runtime URL');
  if (count(html, BRAND_THEME) !== 1) failures.push('canonical brand-theme URL');
  if (count(html, THEME_CONFORMANCE) !== 1) failures.push('canonical theme-conformance URL');
  if (!html.includes('name="color-scheme" content="light dark"')) failures.push('light/dark colour-scheme metadata');

  if (isFormsDocument(file)) {
    if (count(html, 'data-skunkworks-design-system="forms-canonical"') !== 1) failures.push('forms design system');
    if (count(html, DESIGN_SYSTEM) !== 1) failures.push('canonical design-system URL');
    if (count(html, 'data-skunkworks-forms-style="canonical"') !== 1) failures.push('forms theme stylesheet');
    if (count(html, FORMS_CSS) !== 1) failures.push('canonical forms stylesheet URL');
    if (count(html, 'data-skunkworks-global-nav="forms-canonical"') !== 1) failures.push('forms global shell');
    if (count(html, GLOBAL_NAV) !== 1) failures.push('canonical forms global-shell URL');
  }

  if (failures.length) throw new Error(`${file}: missing or duplicate ${failures.join(', ')}`);
}

const assetChecks = [
  path.join(root, 'images', 'favicon-black.png'),
  path.join(root, 'images', 'favicon-white.png'),
  path.join(root, 'assets', 'academy-page-contract.css'),
  path.join(root, 'assets', 'academy-page-contract.js'),
  path.join(root, 'assets', 'academy-brand-theme.css'),
  path.join(root, 'assets', 'academy-theme-conformance.css'),
  path.join(root, 'assets', 'academy-forms.css'),
  path.join(root, 'assets', 'skunkworks-design-system.css'),
  path.join(root, 'assets', 'academy-navigation.js'),
];
for (const asset of assetChecks) {
  if (!fs.existsSync(asset)) throw new Error(`Required global page-contract asset is missing: ${path.relative(root, asset)}`);
}

const files = walk(root);
let documents = 0;
let formsDocuments = 0;
let fragments = 0;
let changed = 0;

for (const file of files) {
  const current = fs.readFileSync(file, 'utf8');
  if (!isHtmlDocument(current)) {
    fragments += 1;
    continue;
  }

  const relative = path.relative(root, file);
  documents += 1;
  if (isFormsDocument(relative)) formsDocuments += 1;

  if (mode === 'write') {
    const next = normalize(current, relative);
    if (next !== current) {
      fs.writeFileSync(file, next, 'utf8');
      changed += 1;
    }
    validate(next, relative);
  } else {
    validate(current, relative);
  }
}

console.log(`Global page contract ${mode === 'write' ? 'applied to' : 'verified on'} ${documents} HTML document(s).`);
console.log(`Canonical Academy brand theme ${mode === 'write' ? 'applied to' : 'verified on'} ${documents} HTML document(s).`);
console.log(`Academy forms design/theme contract ${mode === 'write' ? 'applied to' : 'verified on'} ${formsDocuments} /forms/ HTML document(s).`);
if (mode === 'write') console.log(`Updated ${changed} document(s).`);
console.log(`Skipped ${fragments} non-document HTML fragment(s).`);
console.log(`Canonical favicons: ${FAVICON_LIGHT} / ${FAVICON_DARK}`);
console.log(`Brand theme: ${BRAND_THEME}`);
console.log(`Academy theme foundation: ${THEME_CONFORMANCE}`);
console.log('Canvas contract: Academy-owned. Contrast contract: dark text on light surfaces, light text on dark surfaces.');
console.log('Brand contract: Ink Navy + Graphite neutrals, Skunk Blue actions, Signal Orange restrained accents/focus.');
console.log('Forms contract: canonical Academy design system, global shell, responsive layout, and inverse light/dark document colours.');
