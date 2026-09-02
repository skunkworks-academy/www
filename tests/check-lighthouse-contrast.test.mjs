import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const validator = resolve('scripts/check-lighthouse-contrast.mjs');

async function runValidator(report, { raw = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'lighthouse-contrast-test-'));
  const reportPath = join(directory, 'report.json');
  await writeFile(reportPath, raw ? report : JSON.stringify(report));

  try {
    return spawnSync(process.execPath, [validator, reportPath], {
      encoding: 'utf8',
      timeout: 5_000,
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function audit(overrides = {}) {
  return {
    audits: {
      'color-contrast': {
        score: 1,
        scoreDisplayMode: 'binary',
        details: { items: [] },
        ...overrides,
      },
    },
  };
}

test('accepts a perfect Lighthouse contrast score', async () => {
  const result = await runValidator(audit());

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Audit Score: 100%/);
  assert.match(result.stdout, /Audit Status: binary/);
  assert.match(result.stdout, /Rendered light\/dark colour-contrast audit passed/);
  assert.equal(result.stderr, '');
});

test('accepts a not-applicable audit regardless of its numeric score', async () => {
  const result = await runValidator(audit({
    score: null,
    scoreDisplayMode: 'notApplicable',
  }));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Audit Status: notApplicable/);
  assert.match(result.stdout, /audit passed/);
});

test('accepts a non-perfect audit when Lighthouse reports no failing nodes', async () => {
  const result = await runValidator(audit({ score: 0.5 }));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Audit Score: 50%/);
  assert.match(result.stdout, /No contrast failures detected/);
});

test('reports every failing node with calculated ratios and theme-aware recovery', async () => {
  const result = await runValidator(audit({
    score: 0,
    details: {
      items: [
        {
          node: { selector: 'main .muted-copy' },
          foregroundColor: 'rgb(119, 119, 119)',
          backgroundColor: '#ffffff',
          fontSize: '16px',
          fontWeight: '400',
        },
        {
          node: { snippet: '<p class="dim">Dim copy</p>' },
          computedStyle: {
            color: '#555555',
            backgroundColor: 'rgba(0, 0, 0, 1)',
          },
          fontSize: '24px',
          fontWeight: '700',
        },
      ],
    },
  }));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Found 2 colour-contrast failure\(s\)/);
  assert.match(result.stderr, /Selector: main \.muted-copy/);
  assert.match(result.stderr, /Selector: <p class="dim">Dim copy<\/p>/);
  assert.match(result.stderr, /Contrast ratio: 4\.48:1 \(requires 4\.5:1\)/);
  assert.match(result.stderr, /Contrast ratio: 2\.82:1 \(requires 3:1\)/);
  assert.match(result.stderr, /Make foreground darker \(e\.g\., #000000\)/);
  assert.match(result.stderr, /Make foreground lighter \(e\.g\., #ffffff\)/);
  assert.match(result.stderr, /Recovery Procedure:/);
  assert.match(result.stderr, /npm run validate:contrast/);
});

test('uses serialized item details when Lighthouse omits node metadata', async () => {
  const result = await runValidator(audit({
    score: 0,
    details: { items: [{ explanation: 'unknown element' }] },
  }));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Selector: \{"explanation":"unknown element"\}/);
  assert.doesNotMatch(result.stderr, /Contrast ratio:/);
});

test('does not crash when a failure contains unsupported color formats', async () => {
  const result = await runValidator(audit({
    score: 0,
    details: {
      items: [{
        node: { selector: '.transparent-text' },
        foregroundColor: 'transparent',
        backgroundColor: '#fff',
      }],
    },
  }));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Foreground: transparent/);
  assert.match(result.stderr, /Background: #fff/);
  assert.doesNotMatch(result.stderr, /Contrast ratio:/);
});

test('rejects reports without the color-contrast audit', async () => {
  const result = await runValidator({ audits: {} });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No color-contrast audit found in report/);
});

test('rejects malformed Lighthouse JSON with a useful error', async () => {
  const result = await runValidator('{not-json', { raw: true });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Error reading or parsing Lighthouse report:/);
  assert.match(result.stderr, /JSON/);
});
