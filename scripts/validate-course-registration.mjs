import { readFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const files = [
  'course-registration/index.html',
  'course-registration/thank-you.html',
  'course-registration/skunkworks-academy-cyber-security-training-email.html',
];

const requiredFaviconLight = 'https://www.skunkworksacademy.com/images/favicon-black.png?v=2026.08.20.3';
const requiredFaviconDark = 'https://www.skunkworksacademy.com/images/favicon-white.png?v=2026.08.20.3';
const failures = [];

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const icons = $('link[data-skunkworks-favicon="canonical"]');

  if (icons.length !== 4) fail(file, `expected 4 canonical favicon links, found ${icons.length}`);
  if ($(`link[href="${requiredFaviconLight}"]`).length < 3) fail(file, 'missing default/light favicon variants');
  if ($(`link[href="${requiredFaviconDark}"]`).length !== 1) fail(file, 'missing dark favicon variant');
  if ($('meta[name="viewport"]').length !== 1) fail(file, 'missing viewport metadata');
  if (/[ÂÃâ][\x80-\xBF]?/.test(html)) fail(file, 'contains likely mojibake/encoding corruption');

  if (file.endsWith('/index.html')) {
    if ($('body.course-registration-page').length !== 1) fail(file, 'missing course-registration page class');
    if ($('link[data-course-registration-style="canonical"]').length !== 1) fail(file, 'missing canonical registration stylesheet');
    if ($('script[data-course-registration-runtime="canonical"]').length !== 1) fail(file, 'missing registration interaction runtime');
    if ($('script[data-skunkworks-global-nav]').length !== 1) fail(file, 'missing global Academy navigation runtime');
    if ($('#courseRegistrationForm').length !== 1) fail(file, 'missing course registration form');
    if ($('input[name="_next"]').attr('value') !== 'https://www.skunkworksacademy.com/course-registration/thank-you.html') fail(file, 'registration redirect must use canonical Academy domain');
    if ($('.cr-fields').length < 4) fail(file, 'expected responsive field groups');
    if ($('input[required], select[required]').length < 8) fail(file, 'required-field contract is unexpectedly weak');
  }

  if (file.endsWith('/thank-you.html')) {
    if ($('body.registration-confirmation-page').length !== 1) fail(file, 'missing confirmation page class');
    if ($('#continueCourse').length !== 1 || $('#stayHere').length !== 1) fail(file, 'missing confirmation navigation controls');
    if ($('meta[name="robots"]').attr('content') !== 'noindex, follow') fail(file, 'confirmation page should not be indexed');
  }

  if (file.includes('training-email')) {
    if (!/@media\s+screen\s+and\s+\(max-width:\s*640px\)/i.test(html)) fail(file, 'missing mobile email media query');
    if ($('table[role="presentation"]').length < 2) fail(file, 'email template is not using presentation-table layout');
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

console.log(`Course registration audit passed for ${files.length} active HTML files.`);
console.log('Validated canonical favicons, responsive layout hooks, Academy shell integration, theme schemas, form UX and safe confirmation navigation.');
