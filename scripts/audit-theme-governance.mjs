#!/usr/bin/env node
/*
  Audits the source-level Academy theme contract across every HTML document.
  The normaliser repairs the contract; this script makes the result measurable
  and blocks unaccounted-for exceptions from becoming permanent page forks.
*/

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const reportIndex = args.indexOf('--report');
const reportPath = reportIndex === -1 ? null : args[reportIndex + 1];
if (reportIndex !== -1 && !reportPath) {
  console.error('Usage: node scripts/audit-theme-governance.mjs [root] [--report <file>]');
  process.exit(2);
}

const rootArg = args.find((arg, index) => !arg.startsWith('--') && index !== reportIndex + 1) || '.';
const root = path.resolve(rootArg);
const skipDirectories = new Set(['.git', 'node_modules', '.course-catalog']);

const requiredMarkers = [
  ['data-skunkworks-brand-theme="canonical"', 'canonical brand theme'],
  ['data-skunkworks-page-contract="runtime"', 'page-contract runtime'],
  ['data-skunkworks-color-scheme="canonical"', 'colour-scheme metadata'],
];

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, output);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) output.push(absolute);
  }
  return output;
}

function isHtmlDocument(html) {
  return /<!doctype\s+html|<html\b|<head\b|<body\b/i.test(html);
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function countMatches(haystack, pattern) {
  return (haystack.match(pattern) || []).length;
}

function relative(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function hasReason(tag) {
  const match = tag.match(/\bdata-swa-theme-scope-reason\s*=\s*(["'])(.*?)\1/i);
  return Boolean(match?.[2].trim());
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  root,
  documents: 0,
  fragmentsSkipped: 0,
  contractFailures: [],
  isolatedScopes: [],
  legacyPaletteSignals: [],
  summary: {
    isolatedScopes: 0,
    legacyVariableDeclarations: 0,
    hardCodedPaletteDeclarations: 0,
  },
};

for (const file of walk(root).sort()) {
  const html = fs.readFileSync(file, 'utf8');
  if (!isHtmlDocument(html)) {
    report.fragmentsSkipped += 1;
    continue;
  }

  report.documents += 1;
  const fileName = relative(file);
  const failures = [];

  for (const [marker, label] of requiredMarkers) {
    if (count(html, marker) !== 1) failures.push(label);
  }
  if (!/<meta\b[^>]*name\s*=\s*["']color-scheme["'][^>]*content\s*=\s*["']light dark["'][^>]*>/i.test(html)) {
    failures.push('light/dark colour-scheme content');
  }
  if (failures.length) report.contractFailures.push({ file: fileName, failures });

  const isolatedTags = html.match(/<[^>]*\bdata-swa-theme-scope\s*=\s*["']isolated["'][^>]*>/gi) || [];
  for (const tag of isolatedTags) {
    const scoped = { file: fileName, hasReason: hasReason(tag) };
    report.isolatedScopes.push(scoped);
    report.summary.isolatedScopes += 1;
    if (!scoped.hasReason) {
      report.contractFailures.push({ file: fileName, failures: ['isolated theme scope without data-swa-theme-scope-reason'] });
    }
  }

  const legacyVariableDeclarations = countMatches(html, /--(?:bg|panel|surface(?:-\d+)?|text(?:-color)?|muted(?:-color)?|accent\d?|primary|link|focus|warning)\s*:/gi);
  const hardCodedPaletteDeclarations = countMatches(html, /(?:background(?:-color)?|color|border(?:-color)?|fill|stroke)\s*:\s*#(?:03033a|1e6bd0|f24208|f7f9fc|15171a|d8dee8|5a6472|fff(?:fff)?|000(?:000)?|101010|161616)\b/gi);
  if (legacyVariableDeclarations || hardCodedPaletteDeclarations) {
    report.legacyPaletteSignals.push({
      file: fileName,
      legacyVariableDeclarations,
      hardCodedPaletteDeclarations,
    });
    report.summary.legacyVariableDeclarations += legacyVariableDeclarations;
    report.summary.hardCodedPaletteDeclarations += hardCodedPaletteDeclarations;
  }
}

if (reportPath) {
  const output = path.resolve(reportPath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

console.log(`Academy theme governance audited ${report.documents} HTML document(s); skipped ${report.fragmentsSkipped} fragment(s).`);
console.log(`Isolated theme scopes: ${report.summary.isolatedScopes}. Legacy palette signals: ${report.summary.legacyVariableDeclarations} variable declaration(s), ${report.summary.hardCodedPaletteDeclarations} hard-coded declaration(s).`);
if (reportPath) console.log(`Theme governance report: ${path.resolve(reportPath)}`);

if (report.contractFailures.length) {
  console.error(`\nTheme governance audit failed for ${report.contractFailures.length} document issue(s):`);
  for (const failure of report.contractFailures) {
    console.error(`- ${failure.file}: ${failure.failures.join(', ')}`);
  }
  process.exit(1);
}

console.log('Academy theme governance audit passed.');
