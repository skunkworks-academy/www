import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

const requiredFiles = [
  'index.html',
  'ads.txt',
  'privacy.html',
  'cookie-policy.html',
  'terms.html',
  'about.html',
  'contact.html',
  'editorial-policy.html',
  'advertising-disclosure.html',
  'authors/raydo-matthee.html',
  'guides/index.html',
  'guides/ai-enabled-learning-path.html',
  'guides/zero-trust-lab-controls.html',
  'guides/cloud-certification-roadmap.html',
  'guides/learning-readiness-canvas.html',
  'assets/publisher.css',
  'assets/publisher.js'
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing required publisher file: ${file}`);
}

function read(file) {
  return readFileSync(resolve(root, file), 'utf8');
}

function plainText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script(?:\s+[^>]*)?\s*>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style(?:\s+[^>]*)?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

if (existsSync(resolve(root, 'ads.txt'))) {
  const ads = read('ads.txt').trim();
  const expected = 'google.com, pub-9270041066336676, DIRECT, f08c47fec0942fa0';
  if (ads !== expected) errors.push('ads.txt does not contain the expected authorised seller record.');
}

const trustPages = [
  'privacy.html', 'cookie-policy.html', 'terms.html', 'about.html',
  'contact.html', 'editorial-policy.html', 'advertising-disclosure.html'
];

for (const file of trustPages) {
  if (!existsSync(resolve(root, file))) continue;
  const html = read(file);
  if (!html.includes('meta name="description"')) errors.push(`${file} is missing a meta description.`);
  if (!html.includes('rel="canonical"')) errors.push(`${file} is missing a canonical URL.`);
  if (!html.includes('google-adsense-account')) errors.push(`${file} is missing the AdSense account meta tag.`);
  if (!html.includes('data-ad-inventory=')) errors.push(`${file} is missing explicit ad-inventory classification.`);
}

const ineligiblePages = ['privacy.html', 'cookie-policy.html', 'terms.html', 'contact.html', '404.html'];
for (const file of ineligiblePages) {
  if (!existsSync(resolve(root, file))) continue;
  const html = read(file);
  if (!html.includes('data-ad-inventory="ineligible"')) {
    errors.push(`${file} must be classified as ineligible advertising inventory.`);
  }
  if (html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) {
    errors.push(`${file} hard-codes Google ad delivery on an ineligible page.`);
  }
}

const contentPages = [
  ['index.html', 450],
  ['guides/ai-enabled-learning-path.html', 900],
  ['guides/zero-trust-lab-controls.html', 900],
  ['guides/cloud-certification-roadmap.html', 800],
  ['guides/learning-readiness-canvas.html', 600]
];

for (const [file, minimumWords] of contentPages) {
  if (!existsSync(resolve(root, file))) continue;
  const html = read(file);
  const words = plainText(html).split(/\s+/).filter(Boolean).length;
  if (!html.includes('data-ad-inventory="eligible"')) {
    errors.push(`${file} must be explicitly classified as eligible publisher content.`);
  }
  if (words < minimumWords) {
    errors.push(`${file} contains approximately ${words} words; expected at least ${minimumWords} words of substantive content.`);
  }
  if (!html.includes('editorial-policy.html') && file !== 'index.html') {
    warnings.push(`${file} does not link directly to the editorial policy.`);
  }
}

if (existsSync(resolve(root, 'assets/publisher.js'))) {
  const script = read('assets/publisher.js');
  for (const requirement of [
    'dataset.adInventory',
    "inventory !== 'eligible'",
    'ca-pub-9270041066336676',
    'Google-certified CMP',
    'Privacy & messaging'
  ]) {
    if (!script.includes(requirement)) errors.push(`publisher.js is missing required control: ${requirement}`);
  }
  if (script.includes('localStorage') || script.includes('TCString')) {
    errors.push('publisher.js must not invent local consent records or IAB TCF consent strings.');
  }
  if (/dataset\.skunkworksAdsense|data-skunkworks-adsense/i.test(script)) {
    errors.push('publisher.js must not add custom data-* attributes to the Google AdSense loader tag.');
  }
  if (!script.includes("src.hostname === 'pagead2.googlesyndication.com'")) {
    errors.push('publisher.js must detect an existing AdSense loader by its Google script URL rather than a custom script attribute.');
  }
}

for (const file of ['privacy.html', 'cookie-policy.html']) {
  if (!existsSync(resolve(root, file))) continue;
  const html = read(file);
  if (!/certified CMP|Privacy & messaging/i.test(html)) {
    errors.push(`${file} must explain the certified CMP / Privacy & messaging consent mechanism.`);
  }
}

if (existsSync(resolve(root, 'index.html'))) {
  const home = read('index.html');
  for (const link of [
    '/privacy.html', '/cookie-policy.html', '/terms.html', '/editorial-policy.html',
    '/advertising-disclosure.html', '/about.html', '/contact.html'
  ]) {
    if (!home.includes(link)) errors.push(`Homepage is missing trust link: ${link}`);
  }
}

if (warnings.length) {
  console.warn('Publisher readiness warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error('Publisher readiness validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Publisher readiness validation passed for ${requiredFiles.length} required files.`);
