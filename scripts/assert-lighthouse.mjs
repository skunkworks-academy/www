import { readFile } from 'node:fs/promises';

const reportPaths = process.argv.slice(2);
if (reportPaths.length < 3) {
  throw new Error('Expected at least three Lighthouse report paths.');
}

const reports = await Promise.all(
  reportPaths.map(async (path) => JSON.parse(await readFile(path, 'utf8'))),
);

const median = (values) => {
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) / 2;
};

const thresholds = {
  performance: 0.70,
  accessibility: 0.90,
  'best-practices': 0.90,
  seo: 0.90,
};

const metricIds = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
];

/* Chromium can occasionally evict the main document response before
   Lighthouse's charset gatherer reads it. That is a collection failure, not
   a site best-practices failure, so isolate only this documented condition. */
const transientGathererError = /Protocol error \(Network\.getResponseBody\): Request content was evicted from inspector cache/i;

function categoryFailures(report, category) {
  const refs = report.categories?.[category]?.auditRefs ?? [];
  return refs
    .filter((ref) => (ref.weight ?? 0) > 0)
    .map((ref) => ({ref, audit: report.audits?.[ref.id]}))
    .filter(({audit}) => audit && audit.scoreDisplayMode !== 'notApplicable' && (audit.score ?? 0) < 1);
}

function hasOnlyTransientGathererFailures(report, category) {
  const failures = categoryFailures(report, category);
  return failures.length > 0 && failures.every(({audit}) => (
    audit.score == null && transientGathererError.test(audit.errorMessage || '')
  ));
}

function printCategoryFailures(report, category) {
  for (const {ref, audit} of categoryFailures(report, category)) {
    const detail = audit.errorMessage || audit.explanation || audit.displayValue || '';
    console.error(`  - ${ref.id}: score=${audit.score ?? 'null'} weight=${ref.weight} ${audit.title || ''}${detail ? ` — ${detail}` : ''}`);
  }
}

let failed = false;
for (const [category, minimum] of Object.entries(thresholds)) {
  const transientSamples = [];
  const samples = reports.flatMap((report, index) => {
    if (hasOnlyTransientGathererFailures(report, category)) {
      transientSamples.push(index + 1);
      return [];
    }
    return [report.categories[category]?.score ?? 0];
  });

  if (!samples.length) {
    if (transientSamples.length === reports.length) {
      console.warn(`${category} was unavailable in every sample because Lighthouse hit the known transient gatherer error; retaining the other category and metric checks.`);
      continue;
    }
    console.error(`${category} has no valid Lighthouse samples after transient gatherer failures.`);
    failed = true;
    continue;
  }

  const score = median(samples);
  const excluded = transientSamples.length ? `; excluded transient samples: ${transientSamples.join(', ')}` : '';
  console.log(`${category}: median ${Math.round(score * 100)} from [${samples.map((value) => Math.round(value * 100)).join(', ')}]${excluded}`);
  if (score < minimum) {
    console.error(`${category} median is below ${Math.round(minimum * 100)}`);
    reports.forEach((report, index) => {
      console.error(`Sample ${index + 1} ${category} audit failures:`);
      printCategoryFailures(report, category);
    });
    failed = true;
  }
}

for (const id of metricIds) {
  const samples = reports
    .map((report) => report.audits[id]?.numericValue)
    .filter((value) => Number.isFinite(value));
  if (!samples.length) continue;
  const value = median(samples);
  const suffix = id === 'cumulative-layout-shift' ? '' : ' ms';
  console.log(`${id}: median ${value.toFixed(id === 'cumulative-layout-shift' ? 3 : 0)}${suffix}`);
}

if (failed) process.exit(1);
