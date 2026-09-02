import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile('assets/skunkworks-accessibility.css', 'utf8');

function findBlock(source, selectorPattern) {
  const match = selectorPattern.exec(source);
  assert.ok(match, `Expected CSS block matching ${selectorPattern}`);
  const open = source.indexOf('{', match.index);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }

  assert.fail(`Unterminated CSS block matching ${selectorPattern}`);
}

function declarations(block) {
  const result = {};
  const pattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of block.matchAll(pattern)) {
    result[match[1]] = match[2].replace(/\s*!important\s*$/i, '').trim();
  }
  return result;
}

function property(block, name) {
  const pattern = new RegExp(`${name.replace('-', '\\-')}\\s*:\\s*([^;]+);`, 'i');
  const match = pattern.exec(block);
  assert.ok(match, `Expected ${name} declaration`);
  return match[1].trim();
}

function resolveColor(value, tokens, seen = []) {
  const variable = /^var\((--[a-z0-9-]+)\)$/i.exec(value);
  if (!variable) return value.toLowerCase();
  const name = variable[1];
  assert.ok(!seen.includes(name), `Circular token reference: ${[...seen, name].join(' -> ')}`);
  assert.ok(tokens[name], `Missing token ${name}`);
  return resolveColor(tokens[name], tokens, [...seen, name]);
}

function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i, `Expected an opaque six-digit color, received ${hex}`);
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function assertContrast(tokens, foregroundName, backgroundName, minimum = 4.5) {
  const foreground = resolveColor(tokens[foregroundName] ?? foregroundName, tokens);
  const background = resolveColor(tokens[backgroundName] ?? backgroundName, tokens);
  const ratio = contrast(foreground, background);
  assert.ok(
    ratio + Number.EPSILON >= minimum,
    `${foregroundName} (${foreground}) on ${backgroundName} (${background}) is ${ratio.toFixed(2)}:1; expected ${minimum}:1`,
  );
}

const root = declarations(findBlock(css, /:root\s*\{/i));
const explicitLight = declarations(findBlock(css, /:root\[data-theme="light"\]\s*\{/i));
const explicitDark = declarations(findBlock(
  css,
  /:root\[data-theme="dark"\],\s*:root\[data-swa-theme="dark"\],\s*\[data-theme="dark"\]\s*\{/i,
));

test('defines stable accessible tokens for explicit light and dark themes', () => {
  assert.deepEqual(
    {
      lightLink: root['--sk-a11y-link-light'],
      darkLink: root['--sk-a11y-link-dark'],
      focus: root['--sk-a11y-signal-orange'],
    },
    {
      lightLink: '#0050b3',
      darkLink: '#8ab4ff',
      focus: '#c93400',
    },
  );

  assert.equal(explicitLight['--sk-link'], 'var(--sk-a11y-link-light)');
  assert.equal(explicitDark['--sk-link'], 'var(--sk-a11y-link-dark)');
  assert.equal(explicitLight['--sk-focus'], 'var(--sk-a11y-signal-orange)');
  assert.equal(explicitDark['--sk-focus'], 'var(--sk-a11y-signal-orange)');
});

test('semantic text tokens meet WCAG AA in both themes', () => {
  const light = { ...root, ...explicitLight, '--surface': '#ffffff' };
  const dark = { ...root, ...explicitDark, '--surface': '#191e27' };
  const semanticTokens = [
    '--sk-link',
    '--sk-interactive-text',
    '--sk-text-success',
    '--sk-text-warning',
    '--sk-text-danger',
    '--sk-text-info',
  ];

  for (const token of semanticTokens) {
    assertContrast(light, token, '--surface');
    assertContrast(dark, token, '--surface');
  }

  assertContrast(light, '--sk-focus', '--surface', 3);
  assertContrast(dark, '--sk-focus', '--surface', 3);
});

test('publisher foregrounds meet WCAG AA on their intended light surfaces', () => {
  const tokens = { ...root, ...explicitLight };
  const pairs = [
    ['--sk-pub-heading', '--sk-pub-card-bg'],
    ['--sk-pub-text', '--sk-pub-card-bg'],
    ['--sk-pub-muted', '--sk-pub-card-bg'],
    ['--sk-pub-muted', '--sk-pub-soft-bg'],
    ['--sk-pub-link', '--sk-pub-card-bg'],
    ['--sk-pub-link-hover', '--sk-pub-card-bg'],
    ['--sk-pub-eyebrow', '--sk-pub-page-bg'],
    ['--sk-pub-tag-text', '--sk-pub-tag-bg'],
    ['--sk-pub-on-inverse', '--sk-pub-inverse-bg'],
    ['--sk-pub-on-inverse-muted', '--sk-pub-inverse-bg'],
    ['--sk-pub-on-inverse-link', '--sk-pub-inverse-bg'],
  ];

  for (const pair of pairs) assertContrast(tokens, ...pair);
});

test('publisher foregrounds meet WCAG AA on their intended dark surfaces', () => {
  const tokens = { ...root, ...explicitDark };
  const pairs = [
    ['--sk-pub-heading', '--sk-pub-card-bg'],
    ['--sk-pub-text', '--sk-pub-card-bg'],
    ['--sk-pub-muted', '--sk-pub-card-bg'],
    ['--sk-pub-muted', '--sk-pub-soft-bg'],
    ['--sk-pub-link', '--sk-pub-card-bg'],
    ['--sk-pub-link-hover', '--sk-pub-card-bg'],
    ['--sk-pub-eyebrow', '--sk-pub-card-bg'],
    ['--sk-pub-tag-text', '--sk-pub-tag-bg'],
    ['--sk-pub-on-inverse', '--sk-pub-inverse-bg'],
    ['--sk-pub-on-inverse-muted', '--sk-pub-inverse-bg'],
    ['--sk-pub-on-inverse-link', '--sk-pub-inverse-bg'],
  ];

  for (const pair of pairs) assertContrast(tokens, ...pair);
});

test('system dark-mode fallback matches every explicit dark-theme token', () => {
  const media = findBlock(css, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/i);
  const fallback = declarations(findBlock(
    media,
    /:root:not\(\[data-theme="light"\]\):not\(\[data-swa-theme="light"\]\)\s*\{/i,
  ));

  assert.deepEqual(fallback, explicitDark);
});

test('legacy custom-property fallback covers every interactive accent selector', () => {
  const fallback = findBlock(css, /@supports\s+not\s*\(color:\s*var\(--sk-interactive-text\)\)\s*\{/i);
  const accents = findBlock(
    fallback,
    /\.sk-eyebrow,\s*\.sk-tag,\s*\.tile-kicker,\s*\.level,\s*\.sk-stat__value,\s*\.metric strong,\s*\.stat \.number\s*\{/i,
  );

  assert.equal(property(accents, 'color'), '#0043ce !important');
});

test('print mode resets all semantic statuses to the accessible light palette', () => {
  const print = findBlock(css, /@media\s+print\s*\{/i);
  const printTokens = declarations(findBlock(print, /:root\s*\{/i));

  for (const token of [
    '--sk-text-success',
    '--sk-text-warning',
    '--sk-text-danger',
    '--sk-text-info',
  ]) {
    assert.equal(printTokens[token], root[token]);
    assertContrast({ ...printTokens, '--paper': '#ffffff' }, token, '--paper');
  }
});

test('forced-color mode preserves a visible system focus indicator', () => {
  const forcedColors = findBlock(css, /@media\s*\(forced-colors:\s*active\)\s*\{/i);
  const focus = findBlock(forcedColors, /:focus-visible\s*\{/i);

  assert.equal(property(focus, 'outline'), '3px solid CanvasText !important');
  assert.equal(property(focus, 'outline-offset'), '3px !important');
});
