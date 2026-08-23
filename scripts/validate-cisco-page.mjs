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

function requireText(text, value, label) {
  if (!text.includes(value)) failures.push(`Missing ${label}.`);
}

requireText(html, '<title>Cisco Networking Academy Courses | Skunkworks Academy</title>', 'descriptive title');
requireText(html, 'name="description"', 'meta description');
requireText(html, 'rel="canonical" href="https://www.skunkworksacademy.com/cisco/"', 'canonical URL');
requireText(html, 'href="cisco.css"', 'local scoped stylesheet');
requireText(html, 'src="catalogue.js"', 'current course catalogue runtime');
requireText(html, 'academy-navigation.js?v=2026.08.23.1', 'current Academy shell');
requireText(html, 'data-skunkworks-global-nav="v10"', 'current Academy shell marker');
requireText(html, '<main id="cisco-main"', 'main landmark');
requireText(html, 'Skip to Cisco learning content', 'skip link');
requireText(html, 'data-sk-component="card"', 'Academy card component');
requireText(html, 'Cisco and Cisco Networking Academy are trademarks of Cisco Systems, Inc.', 'trademark clarification');
requireText(html, 'Browse 89 offerings', 'current offering count');
requireText(html, 'id="cisco-course-results"', 'course catalogue results landmark');

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
  if (html.includes(legacyReference)) failures.push(`Legacy Cisco page reference remains: ${legacyReference}`);
}

for (const requiredCss of ['.cisco-page', '.cisco-catalogue__results', '.cisco-course-card', '@media (max-width: 840px)', '@media (prefers-reduced-motion: reduce)']) {
  requireText(css, requiredCss, `Cisco CSS contract ${requiredCss}`);
}

if (failures.length) {
  console.error('Cisco landing-page validation failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Cisco landing-page validation passed.');
console.log('Validated canonical shell, accessible page structure, scoped responsive CSS, 89 current course offerings across nine subjects, and removal of legacy framework dependencies.');
