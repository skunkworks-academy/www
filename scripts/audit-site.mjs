import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.cwd();
const entryPoints = [
  'index.html',
  'portal.html',
  'labs.html',
  'jobs.html',
  'self-paced/index.html'
].filter((file) => existsSync(join(root, file)));

const errors = [];
const warnings = [];

function report(collection, file, message) {
  collection.push(`${file}: ${message}`);
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
}

function auditHtml(file) {
  const fullPath = join(root, file);
  const html = readFileSync(fullPath, 'utf8');

  if (!/^<!doctype html>/i.test(html.trimStart())) report(errors, file, 'missing HTML5 doctype');
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) report(errors, file, 'missing html lang attribute');
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) report(errors, file, 'missing viewport metadata');
  if (!/<title>[^<]+<\/title>/i.test(html)) report(errors, file, 'missing non-empty title');
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html)) {
    report(errors, file, 'missing non-empty meta description');
  }

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicates) report(errors, file, `duplicate id "${id}"`);

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = match[0];
    const href = getAttribute(tag, 'href');
    const target = getAttribute(tag, 'target');
    const rel = getAttribute(tag, 'rel') ?? '';

    if (/^(?:javascript|data|vbscript):/i.test(href?.trim() ?? '')) {
      report(errors, file, `unsafe javascript: link (${href})`);
    }
    if (target === '_blank' && !/\bnoopener\b/i.test(rel)) {
      report(errors, file, 'target="_blank" link is missing rel="noopener"');
    }
    if (href?.startsWith('http://') && !href.startsWith('http://localhost') && !href.startsWith('http://127.0.0.1')) {
      report(warnings, file, `non-TLS external link (${href})`);
    }
  }

  for (const match of html.matchAll(/<(?:script|img|link)\b[^>]*>/gi)) {
    const tag = match[0];
    const source = getAttribute(tag, 'src') ?? getAttribute(tag, 'href');
    if (!source || /^(?:https?:|data:|mailto:|tel:|#|\/\/)/i.test(source)) continue;
    const clean = source.split(/[?#]/, 1)[0];
    if (!clean || clean.startsWith('/')) continue;
    const resolved = join(root, file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '', clean);
    if (!existsSync(resolved)) report(errors, file, `missing local asset (${source})`);
  }

  if (/\bEcosystem\b/i.test(html)) {
    report(warnings, file, 'contains the disallowed brand term “Ecosystem”; replace with “Academy” or omit it');
  }
}

for (const file of entryPoints) {
  if (extname(file) === '.html') auditHtml(file);
}

if (!entryPoints.length) errors.push('No recognised public entry-point HTML files were found.');

for (const warning of warnings) console.warn(`WARNING: ${warning}`);

if (errors.length) {
  console.error(`Site audit failed with ${errors.length} error(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site audit passed for ${entryPoints.length} entry point(s).`);
console.log(`Warnings: ${warnings.length}`);
