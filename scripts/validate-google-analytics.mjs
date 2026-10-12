import fs from 'node:fs';

const file = 'index.html';
const html = fs.readFileSync(file, 'utf8');
const measurementId = 'G-NWBW8HWEDR';
const errors = [];

const loaderPattern = new RegExp('https://www\\.googletagmanager\\.com/gtag/js\\?id=' + measurementId.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&'));
const configPattern = new RegExp("gtag\\(['\\\"]config['\\\"],\\s*['\\\"]" + measurementId.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&') + "['\\\"]");

if (!loaderPattern.test(html)) errors.push('GA4 gtag.js loader is missing from index.html');
if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html)) errors.push('GA4 dataLayer initialization is missing');
if (!configPattern.test(html)) errors.push('GA4 config call is missing or uses the wrong measurement ID');
if ((html.match(/googletagmanager\.com\/gtag\/js\?id=/g) || []).length !== 1) errors.push('index.html must load exactly one GA4 gtag.js instance');
if ((html.match(/gtag\(['\"]config['\"]/g) || []).length !== 1) errors.push('index.html must contain exactly one GA4 config call');

if (errors.length) {
  console.error('Google Analytics validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('Google Analytics validation passed for ' + measurementId + '.');
