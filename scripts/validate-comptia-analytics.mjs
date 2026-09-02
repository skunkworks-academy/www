import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const analyticsPath = path.join(root, 'assets', 'comptia-analytics.js');
const hubPath = path.join(root, 'comptia', 'index.html');

const fail = (message) => {
  console.error(`CompTIA analytics validation failed: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(analyticsPath)) fail('assets/comptia-analytics.js is missing.');
if (!fs.existsSync(hubPath)) fail('comptia/index.html is missing.');

if (process.exitCode) process.exit(process.exitCode);

const analytics = fs.readFileSync(analyticsPath, 'utf8');
const hub = fs.readFileSync(hubPath, 'utf8');

const requiredTokens = [
  "measurementId: 'G-NWBW8HWEDR'",
  "track('page_view'",
  "track('view_item_list'",
  "track('select_item'",
  "track('generate_lead'",
  "'utm_source'",
  "'utm_medium'",
  "'utm_campaign'",
  "'utm_content'",
  "'utm_term'",
  "'utm_id'",
  "'skw_asset_id'",
  "'skw_content_id'",
  "cookie_domain: 'skunkworksacademy.com'"
];

for (const token of requiredTokens) {
  if (!analytics.includes(token)) fail(`analytics contract is missing ${token}`);
}

if (!hub.includes('/assets/comptia-analytics.js?v=2026.08.26.1')) {
  fail('CompTIA hub does not load the versioned analytics contract.');
}

if (/\b(email|phone|name|full_name|first_name|last_name)\s*:\s*(?:document|window|localStorage)/i.test(analytics)) {
  fail('analytics contract appears to collect direct personal identifiers.');
}

if (analytics.includes('mailto:training@skunkworks.africa?')) {
  fail('analytics contract must not persist or send mailto recipient/query content.');
}

const cardCount = (hub.match(/class="card"/g) || []).length;
if (cardCount < 10) fail(`expected at least 10 catalogue cards, found ${cardCount}.`);

if (process.exitCode) process.exit(process.exitCode);
console.log(`CompTIA analytics validation passed for ${cardCount} catalogue cards.`);
