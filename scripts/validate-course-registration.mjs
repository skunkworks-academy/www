import { readFile } from 'node:fs/promises';

const files = [
  'course-registration/index.html',
  'course-registration/thank-you.html',
  'course-registration/skunkworks-academy-cyber-security-training-email.html',
];

const pageContractRuntime = await readFile('assets/academy-page-contract.js', 'utf8');
const pageContractVersionMatch = pageContractRuntime.match(/var VERSION = "([^"]+)";/);
if (!pageContractVersionMatch) {
  throw new Error('Unable to resolve Academy page-contract VERSION from assets/academy-page-contract.js');
}
const pageContractVersion = pageContractVersionMatch[1];
const requiredFaviconLight = `https://www.skunkworksacademy.com/images/favicon-black.png?v=${pageContractVersion}`;
const requiredFaviconDark = `https://www.skunkworksacademy.com/images/favicon-white.png?v=${pageContractVersion}`;
const failures = [];

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const canonicalIcons = count(html, /<link\b[^>]*data-skunkworks-favicon\s*=\s*["']canonical["'][^>]*>/gi);
  const lightIcons = count(html, new RegExp(`<link\\b[^>]*href=["']${requiredFaviconLight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi'));
  const darkIcons = count(html, new RegExp(`<link\\b[^>]*href=["']${requiredFaviconDark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi'));

  if (canonicalIcons !== 4) fail(file, `expected 4 canonical favicon links, found ${canonicalIcons}`);
  if (lightIcons < 3) fail(file, `missing default/light favicon variants for page-contract ${pageContractVersion}`);
  if (darkIcons !== 1) fail(file, `missing dark favicon variant for page-contract ${pageContractVersion}`);
  if (count(html, /<meta\b[^>]*name=["']viewport["'][^>]*>/gi) !== 1) fail(file, 'missing viewport metadata');
  if (/[ÂÃâ][\x80-\xBF]?/.test(html)) fail(file, 'contains likely mojibake/encoding corruption');

  if (file.endsWith('/index.html')) {
    if (!/<body\b[^>]*class=["'][^"']*\bcourse-registration-page\b[^"']*["']/i.test(html)) fail(file, 'missing course-registration page class');
    if (count(html, /data-course-registration-style=["']canonical["']/gi) !== 1) fail(file, 'missing canonical registration stylesheet');
    if (count(html, /data-course-registration-runtime=["']canonical["']/gi) !== 1) fail(file, 'missing registration interaction runtime');
    if (count(html, /<script\b[^>]*data-skunkworks-global-nav[^>]*>/gi) !== 1) fail(file, 'missing global Academy navigation runtime');
    if (count(html, /id=["']courseRegistrationForm["']/gi) !== 1) fail(file, 'missing course registration form');
    if (!/<input\b[^>]*name=["']_next["'][^>]*value=["']https:\/\/www\.skunkworksacademy\.com\/course-registration\/thank-you\.html["'][^>]*>/i.test(html)) fail(file, 'registration redirect must use canonical Academy domain');
    if (count(html, /class=["'][^"']*\bcr-fields\b[^"']*["']/gi) < 4) fail(file, 'expected responsive field groups');
    if (count(html, /<(?:input|select)\b[^>]*\brequired\b[^>]*>/gi) < 8) fail(file, 'required-field contract is unexpectedly weak');
  }

  if (file.endsWith('/thank-you.html')) {
    if (!/<body\b[^>]*class=["'][^"']*\bregistration-confirmation-page\b[^"']*["']/i.test(html)) fail(file, 'missing confirmation page class');
    if (count(html, /id=["']continueCourse["']/gi) !== 1 || count(html, /id=["']stayHere["']/gi) !== 1) fail(file, 'missing confirmation navigation controls');
    if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex, follow["'][^>]*>/i.test(html)) fail(file, 'confirmation page should not be indexed');
  }

  if (file.includes('training-email')) {
    if (!/@media\s+screen\s+and\s+\(max-width:\s*640px\)/i.test(html)) fail(file, 'missing mobile email media query');
    if (count(html, /<table\b[^>]*role=["']presentation["'][^>]*>/gi) < 2) fail(file, 'email template is not using presentation-table layout');
    if (!/https:\/\/www\.skunkworksacademy\.com\/course-registration\/?/i.test(html)) fail(file, 'email CTA must use canonical registration URL');
  }
}

const registrationCss = await readFile('assets/course-registration.css', 'utf8');
for (const breakpoint of ['900px', '640px', '360px']) {
  if (!registrationCss.includes(`max-width: ${breakpoint}`)) failures.push(`assets/course-registration.css: missing ${breakpoint} responsive breakpoint`);
}
if (!registrationCss.includes('html[data-theme="dark"]')) failures.push('assets/course-registration.css: missing explicit dark theme');
if (!registrationCss.includes('prefers-color-scheme: dark')) failures.push('assets/course-registration.css: missing system dark theme');
if (!registrationCss.includes('html[data-theme="light"]')) failures.push('assets/course-registration.css: missing explicit light theme override');

if (failures.length) {
  console.error('Course registration audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Course registration audit passed for ${files.length} active HTML files using page-contract ${pageContractVersion}.`);
console.log('Validated canonical favicons, responsive layout hooks, Academy shell integration, theme schemas, form UX and safe confirmation navigation.');
