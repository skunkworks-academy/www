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

let failed = false;
for (const [category, minimum] of Object.entries(thresholds)) {
  const samples = reports.map((report) => report.categories[category]?.score ?? 0);
  const score = median(samples);
  console.log(`${category}: median ${Math.round(score * 100)} from [${samples.map((value) => Math.round(value * 100)).join(', ')}]`);
  if (score < minimum) {
    console.error(`${category} median is below ${Math.round(minimum * 100)}`);
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
