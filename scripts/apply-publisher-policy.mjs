import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(fs.readFileSync(path.join(root, 'publisher-policy.json'), 'utf8'));
const checkOnly = process.argv.includes('--check');
const indexable = new Set(policy.indexablePages.map(normalizePath));
const adEligible = new Set(policy.adsenseEligiblePages.map(normalizePath));
const excludedDirectories = new Set(['.git', 'node_modules']);

function normalizePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function routeFor(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'index.html'.length)}`;
  return `/${relativePath}`;
}

function htmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function setRobots(html, content) {
  const tag = `<meta name="robots" content="${content}">`;
  const existing = /<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/i;
  if (existing.test(html)) return html.replace(existing, tag);
  return html.replace(/<head\b[^>]*>/i, (head) => `${head}\n  ${tag}`);
}

function setCanonical(html, canonicalUrl) {
  const tag = `<link rel="canonical" href="${canonicalUrl}">`;
  const existing = /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i;
  if (existing.test(html)) return html.replace(existing, tag);
  return html.replace(/<\/head\s*>/i, `  ${tag}\n</head>`);
}

function removeAdsenseLoader(html) {
  return html.replace(/\s*<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/gi, '');
}

function addAdsenseLoader(html) {
  const loader = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${policy.publisherId}" crossorigin="anonymous"></script>`;
  return html.replace(/<\/head\s*>/i, `  ${loader}\n</head>`);
}

function setAdInventory(html, eligible) {
  if (!/<body\b/i.test(html)) return html;
  const value = eligible ? 'eligible' : 'ineligible';
  if (/\bdata-ad-inventory\s*=\s*["'][^"']*["']/i.test(html)) {
    return html.replace(/\bdata-ad-inventory\s*=\s*["'][^"']*["']/i, `data-ad-inventory="${value}"`);
  }
  return html.replace(/<body\b/i, `<body data-ad-inventory="${value}"`);
}

function transformHtml(source, relativePath) {
  let html = source.replaceAll('https://skunkworksacademy.com', policy.canonicalOrigin);
  const mayIndex = indexable.has(relativePath);
  const mayShowAds = adEligible.has(relativePath);
  html = setRobots(html, mayIndex ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow');
  html = setCanonical(html, `${policy.canonicalOrigin}${routeFor(relativePath)}`);
  html = setAdInventory(html, mayShowAds);
  html = removeAdsenseLoader(html);
  if (mayShowAds) html = addAdsenseLoader(html);
  return html;
}

function learnSitemapXml() {
  const learnPages = ['learn/index.html', 'self-paced/index.html', 'instructor-led/index.html'];
  const urls = learnPages.map((relativePath) => [
    '  <url>',
    `    <loc>${policy.canonicalOrigin}${routeFor(relativePath)}</loc>`,
    `    <lastmod>${policy.lastModified}</lastmod>`,
    '  </url>',
  ].join('\n'));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
function sitemapXml() {
  const urls = policy.indexablePages.map(normalizePath).map((relativePath) => [
    '  <url>',
    `    <loc>${policy.canonicalOrigin}${routeFor(relativePath)}</loc>`,
    `    <lastmod>${policy.lastModified}</lastmod>`,
    '  </url>',
  ].join('\n'));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

for (const relativePath of adEligible) {
  if (!indexable.has(relativePath)) throw new Error(`AdSense-eligible page must also be indexable: ${relativePath}`);
}
const files = htmlFiles(root);
const existing = new Set(files.map((file) => normalizePath(path.relative(root, file))));
for (const relativePath of indexable) {
  if (!existing.has(relativePath)) throw new Error(`Indexable page does not exist: ${relativePath}`);
}
if (checkOnly) {
  const expectedSitemap = sitemapXml();
  const actualSitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').replaceAll('\r\n', '\n');
  if (actualSitemap !== expectedSitemap) throw new Error('sitemap.xml is not synchronized with publisher-policy.json. Run: npm run publisher:apply');
  const expectedLearnSitemap = learnSitemapXml();
  const actualLearnSitemap = fs.readFileSync(path.join(root, 'learn-sitemap.xml'), 'utf8').replaceAll('\r\n', '\n');
  if (actualLearnSitemap !== expectedLearnSitemap) throw new Error('learn-sitemap.xml is not synchronized with publisher-policy.json. Run: npm run publisher:apply');
  console.log(`Publisher policy is valid: ${indexable.size} indexable page(s), ${adEligible.size} AdSense-eligible page(s), ${files.length - indexable.size} page(s) excluded from indexing.`);
  process.exit(0);
}
let changed = 0;
for (const file of files) {
  const relativePath = normalizePath(path.relative(root, file));
  const source = fs.readFileSync(file, 'utf8');
  const output = transformHtml(source, relativePath);
  if (source !== output) {
    fs.writeFileSync(file, output, 'utf8');
    changed += 1;
  }
}
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemapXml(), 'utf8');
fs.writeFileSync(path.join(root, 'learn-sitemap.xml'), learnSitemapXml(), 'utf8');
console.log(`Applied publisher policy to ${files.length} HTML document(s); changed ${changed}.`);
console.log(`Indexable: ${indexable.size}. AdSense eligible: ${adEligible.size}.`);


