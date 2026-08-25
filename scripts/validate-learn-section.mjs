#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const failures = [];

function read(relative) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    failures.push(`Missing required Learn asset: ${relative}`);
    return '';
  }
  return fs.readFileSync(absolute, 'utf8');
}

function requireText(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`Missing ${label}: ${fragment}`);
}

const learnPage = read('learn/index.html');
const learnCss = read('assets/academy-learn.css');
const shell = read('assets/academy-navigation.js');

for (const file of [
  'learning-paths/index.html',
  'self-paced/index.html',
  'instructor-led/index.html',
  'comptia/index.html',
  'cisco/index.html',
]) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing Learn destination page: ${file}`);
}

requireText(learnPage, '<link rel="canonical" href="https://www.skunkworksacademy.com/learn/"', 'Learn canonical URL');
requireText(learnPage, 'name="robots" content="index, follow', 'indexable robots metadata');
requireText(learnPage, '"@type": "CollectionPage"', 'CollectionPage structured data');
requireText(learnPage, '"@type": "ItemList"', 'learning destination ItemList structured data');
requireText(learnPage, 'data-swa-section="learn"', 'Learn section marker');
requireText(learnPage, 'Build practical technology capability — not just course completion.', 'canonical Learn hero message');

for (const destination of [
  'https://www.skunkworksacademy.com/courses',
  'https://www.skunkworksacademy.com/learning-paths/',
  'https://www.skunkworksacademy.com/self-paced/',
  'https://www.skunkworksacademy.com/instructor-led/',
  'https://microsoft.skunkworksacademy.com/',
  'https://ibm.skunkworksacademy.com/',
  'https://www.skunkworksacademy.com/comptia/',
  'https://www.skunkworksacademy.com/cisco/',
  'https://security.skunkworksacademy.com/',
]) {
  requireText(learnPage, destination, `Learn destination ${destination}`);
}

requireText(learnCss, 'body[data-swa-section="learn"]', 'shared Learn scope');
requireText(learnCss, '.swa-learn-heading--float', 'floating Learn heading component');
requireText(learnCss, '@keyframes swaLearnFloatY', 'floating heading animation');
requireText(learnCss, '@media (prefers-reduced-motion: reduce)', 'reduced-motion accessibility contract');
requireText(learnCss, '.swa-learn-subnav', 'shared Learn sub-navigation styling');

requireText(shell, 'LEARN_THEME_VERSION = "2026.08.25.2"', 'Learn theme version');
requireText(shell, 'function isLearnSurface()', 'Learn route classifier');
requireText(shell, 'function installLearnTheme(', 'Learn theme loader');
requireText(shell, 'function markLearnSurface()', 'Learn runtime marker');
requireText(shell, 'academy-learn.css', 'Learn stylesheet reference');
requireText(shell, 'microsoft.skunkworksacademy.com', 'Microsoft Learn property classification');
requireText(shell, 'ibm.skunkworksacademy.com', 'IBM Learn property classification');
requireText(shell, 'security.skunkworksacademy.com', 'Security Learn property classification');
requireText(shell, 'learning-paths', 'learning-path route classification');
requireText(shell, 'self-paced', 'self-paced route classification');
requireText(shell, 'instructor-led', 'instructor-led route classification');
requireText(shell, 'comptia', 'CompTIA route classification');
requireText(shell, 'cisco', 'Cisco route classification');

if (failures.length) {
  console.error('Learn section validation failed.');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Learn section validation passed.');
console.log('Validated SEO/indexability, shared Learn styling, motion accessibility, navigation destinations and route coverage.');
