#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const VERSION = '2026.08.20.3';
const PUBLIC_ROOT = 'https://www.skunkworksacademy.com/';
const FAVICON_LIGHT = `${PUBLIC_ROOT}images/favicon-black.png?v=${VERSION}`;
const FAVICON_DARK = `${PUBLIC_ROOT}images/favicon-white.png?v=${VERSION}`;
const CONTRACT_CSS = `${PUBLIC_ROOT}assets/academy-page-contract.css?v=${VERSION}`;
const CONTRACT_JS = `${PUBLIC_ROOT}assets/academy-page-contract.js?v=${VERSION}`;

const FAVICON_TAGS = [
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_LIGHT}" data-skunkworks-favicon="canonical" />`,
  `<link rel="shortcut icon" type="image/png" href="${FAVICON_LIGHT}" data-skunkworks-favicon="canonical" />`,
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_LIGHT}" media="(prefers-color-scheme: light)" data-skunkworks-favicon="canonical" />`,
  `<link rel="icon" type="image/png" sizes="32x32" href="${FAVICON_DARK}" media="(prefers-color-scheme: dark)" data-skunkworks-favicon="canonical" />`,
];
const CSS_TAG = `<link rel="stylesheet" href="${CONTRACT_CSS}" data-skunkworks-page-contract="css" />`;
const JS_TAG = `<script defer src="${CONTRACT_JS}" data-skunkworks-page-contract="runtime"></script>`;
const FAVICON_INJECTION = FAVICON_TAGS.map((line) => `  ${line}`).join('\n');
const CONTRACT_INJECTION = [CSS_TAG, JS_TAG].map((line) => `  ${line}`).join('\n');

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

function stripIconLinks(html) {
  return html.replace(/<link\b[^>]*>/gi, (tag) => {
    const match = tag.match(/\brel\s*=\s*(["'])(.*?)\1/i);
    if (!match) return tag;
    const rel = match[2].trim().toLowerCase();
    const tokens = rel.split(/\s+/);
    return tokens.includes('icon') ? '' : tag;
  });
}

function stripContractAssets(html) {
  let previous;
  let next = html;
  do {
    previous = next;
    next = next
      .replace(/<link\b[^>]*(?:academy-page-contract\.css|data-skunkworks-page-contract\s*=\s*["']css["'])[^>]*>\s*/gi, '')
      .replace(/<script\b[^>]*(?:academy-page-contract\.js|data-skunkworks-page-contract\s*=\s*["']runtime["'])[^>]*>\s*<\/script>\s*/gi, '');
  } while (next !== previous);
  return next;
}

function normalize(html, file) {
  let next = stripContractAssets(stripIconLinks(html));

  if (/<\/title\s*>/i.test(next)) {
    next = next.replace(/<\/title\s*>/i, (match) => `${match}\n${FAVICON_INJECTION}`);
  } else if (/<head\b[^>]*>/i.test(next)) {
    next = next.replace(/<head\b[^>]*>/i, (match) => `${match}\n${FAVICON_INJECTION}`);
  } else {
    throw new Error(`Malformed HTML document cannot receive canonical favicon: ${file}`);
  }

  if (/<\/head\s*>/i.test(next)) {
    next = next.replace(/<\/head\s*>/i, `${CONTRACT_INJECTION}\n</head>`);
  } else if (/<\/body\s*>/i.test(next)) {
    next = next.replace(/<\/body\s*>/i, `${CONTRACT_INJECTION}\n</body>`);
  } else {
    throw new Error(`Malformed HTML document cannot receive global page contract: ${file}`);
  }
  return next;
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function validate(html, file) {
  const failures = [];
  if (count(html, 'data-skunkworks-favicon="canonical"') !== 4) failures.push('canonical favicon set');
  if (count(html, FAVICON_LIGHT) !== 3) failures.push('default/light favicon');
  if (count(html, FAVICON_DARK) !== 1) failures.push('dark favicon');
  if (count(html, 'rel="shortcut icon"') !== 1) failures.push('shortcut favicon');
  if (count(html, 'sizes="32x32"') < 3) failures.push('32x32 favicon sizing');
  if (count(html, 'data-skunkworks-page-contract="css"') !== 1) failures.push('page-contract CSS');
  if (count(html, 'data-skunkworks-page-contract="runtime"') !== 1) failures.push('page-contract runtime');
  if (count(html, CONTRACT_CSS) !== 1) failures.push('canonical page-contract CSS URL');
  if (count(html, CONTRACT_JS) !== 1) failures.push('canonical page-contract runtime URL');
  if (failures.length) throw new Error(`${file}: missing or duplicate ${failures.join(', ')}`);
}

const assetChecks = [
  path.join(root, 'images', 'favicon-black.png'),
  path.join(root, 'images', 'favicon-white.png'),
  path.join(root, 'assets', 'academy-page-contract.css'),
  path.join(root, 'assets', 'academy-page-contract.js'),
];
for (const asset of assetChecks) {
  if (!fs.existsSync(asset)) throw new Error(`Required global page-contract asset is missing: ${path.relative(root, asset)}`);
}

const files = walk(root);
let documents = 0;
let fragments = 0;
let changed = 0;

for (const file of files) {
  const current = fs.readFileSync(file, 'utf8');
  if (!isHtmlDocument(current)) {
    fragments += 1;
    continue;
  }

  documents += 1;
  if (mode === 'write') {
    const next = normalize(current, path.relative(root, file));
    if (next !== current) {
      fs.writeFileSync(file, next, 'utf8');
      changed += 1;
    }
    validate(next, path.relative(root, file));
  } else {
    validate(current, path.relative(root, file));
  }
}

console.log(`Global page contract ${mode === 'write' ? 'applied to' : 'verified on'} ${documents} HTML document(s).`);
if (mode === 'write') console.log(`Updated ${changed} document(s).`);
console.log(`Skipped ${fragments} non-document HTML fragment(s).`);
console.log(`Canonical favicons: ${FAVICON_LIGHT} / ${FAVICON_DARK}`);
console.log('Body contract: white canvas. Surface contract: dark text on light backgrounds, light text on dark backgrounds.');
