#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const page = join(root, 'cisco', 'index.html');
const stylesheet = join(root, 'cisco', 'cisco.css');
const catalogueFile = join(root, 'cisco', 'catalogue.js');
const failures = [];

if (!existsSync(page)) failures.push('Missing cisco/index.html.');
if (!existsSync(stylesheet)) failures.push('Missing cisco/cisco.css.');
if (!existsSync(catalogueFile)) failures.push('Missing cisco/catalogue.js.');

const html = existsSync(page) ? readFileSync(page, 'utf8') : '';
const css = existsSync(stylesheet) ? readFileSync(stylesheet, 'utf8') : '';
const catalogue = existsSync(catalogueFile) ? readFileSync(catalogueFile, 'utf8') : '';
const cssCode = css.replace(/\/\*[\s\S]*?\*\//g, '');

function requireText(text, value, label) {
  if (!text.includes(value)) failures.push(`Missing ${label}.`);
}

function requirePattern(text, pattern, label) {
  if (!pattern.test(text)) failures.push(`Missing ${label}.`);
}

function requireCss(value, label) {
  if (!cssCode.includes(value)) failures.push(`Missing ${label}.`);
}

requirePattern(html, /<title>\s*Cisco Networking Academy Courses \| Skunkworks Academy\s*<\/title>/i, 'descriptive title');
requirePattern(html, /<meta\b(?=[^>]*\bname="description")(?=[^>]*\bcontent="[^"\r\n]*\S[^"\r\n]*")[^>]*>/i, 'non-empty meta description');
requirePattern(html, /<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="https:\/\/www\.skunkworksacademy\.com\/cisco\/")[^>]*>/i, 'canonical URL');
requirePattern(html, /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="cisco\.css")[^>]*>/i, 'local scoped stylesheet');
requirePattern(html, /<script\b(?=[^>]*\bsrc="catalogue\.js")[^>]*><\/script>/i, 'current course catalogue runtime');
requirePattern(html, /<script\b(?=[^>]*academy-navigation\.js\?v=2026\.08\.23\.1)(?=[^>]*\bdata-skunkworks-global-nav="v10")[^>]*><\/script>/i, 'current Academy shell');
requirePattern(html, /<main\b(?=[^>]*\bid="cisco-main")[^>]*>/i, 'main landmark');
requirePattern(html, /<a\b(?=[^>]*\bclass="cisco-skip-link")(?=[^>]*\bhref="#cisco-main")[^>]*>Skip to Cisco learning content<\/a>/i, 'skip link');
requirePattern(html, /data-sk-component="card"/i, 'Academy card component');
requirePattern(html, /Cisco and Cisco Networking Academy are trademarks of Cisco Systems, Inc\./i, 'trademark clarification');
requirePattern(html, />Browse 89 offerings</i, 'current offering count');
requirePattern(html, /<div\b(?=[^>]*\bid="cisco-course-results")(?=[^>]*\bclass="cisco-catalogue__results")[^>]*><\/div>/i, 'course catalogue results landmark');
if (/<div\b(?=[^>]*\bid="cisco-course-results")(?=[^>]*\baria-live=)[^>]*>/i.test(html)) {
  failures.push('The course results container must not be an ARIA live region; the summary provides result updates.');
}

const titles = [...catalogue.matchAll(/\btitle:\s*'([^']+)'/g)].map((match) => match[1]);
if (titles.length !== 89) failures.push(`Expected 89 current Cisco Networking Academy offerings; found ${titles.length}.`);
if (new Set(titles).size !== titles.length) failures.push('The Cisco course catalogue contains duplicate course titles.');

for (const requiredOffering of [
  'CCNA: Introduction to Networks',
  'CCNA: Switching, Routing, and Wireless Essentials',
  'CCNP Enterprise: Core Networking (v9)',
  'DevNet Associate',
  'Getting Started with Cisco Packet Tracer',
  'Ethical Hacker',
  'AI Fundamentals with IBM SkillsBuild'
]) {
  requireText(catalogue, requiredOffering, `current offering ${requiredOffering}`);
}

const subjects = [...new Set([...catalogue.matchAll(/\bsubject:\s*'([^']+)'/g)].map((match) => match[1]))];
if (subjects.length !== 9) failures.push(`Expected nine Cisco Networking Academy subject areas; found ${subjects.length}.`);
requireText(catalogue, 'Current Cisco Networking Academy offerings, refreshed from the Academy export on 2026-08-23.', 'catalogue source refresh marker');

for (const legacyReference of [
  'carbon-components',
  'font-awesome',
  'bootstrap@',
  'tailwindcss',
  'Cisco.png',
  'Search courses...',
  '2024-'
]) {
  if ([html, css, catalogue].some((asset) => asset.includes(legacyReference))) {
    failures.push(`Legacy Cisco page reference remains: ${legacyReference}`);
  }
}

for (const requiredCss of ['.cisco-page', '.cisco-catalogue__results', '.cisco-course-card', '@media (max-width: 840px)', '@media (prefers-reduced-motion: reduce)']) {
  requireCss(requiredCss, `Cisco CSS contract ${requiredCss}`);
}

if (failures.length) {
  console.error('Cisco landing-page validation failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Cisco landing-page validation passed.');
console.log('Validated canonical shell, accessible page structure, scoped responsive CSS, 89 current course offerings across nine subjects, and removal of legacy framework dependencies.');
