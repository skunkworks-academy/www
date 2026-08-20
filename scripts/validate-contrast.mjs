import { readFile } from 'node:fs/promises';

const files = {
  publisher: 'assets/publisher.css',
  design: 'assets/skunkworks-design-system.css',
  accessibility: 'assets/skunkworks-accessibility.css',
};

const css = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

function findBlock(source, selectorPattern) {
  const match = selectorPattern.exec(source);
  if (!match) throw new Error(`Unable to find CSS block matching ${selectorPattern}`);
  const open = source.indexOf('{', match.index);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  throw new Error(`Unterminated CSS block matching ${selectorPattern}`);
}

function declarations(block) {
  const result = {};
  const pattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of block.matchAll(pattern)) {
    result[match[1]] = match[2].replace(/\s*!important\s*$/i, '').trim();
  }
  return result;
}

function rootTokens(source) {
  return declarations(findBlock(source, /:root\s*\{/i));
}

function darkTokens(source) {
  // A dark-theme declaration can be part of a selector list. Do not require an
  // exact two-selector sequence: the accessibility contract also supports
  // data-swa-theme and may add further equivalent selectors over time.
  const selector = /:root\[(?:data-theme|data-swa-theme)\s*=\s*["']dark["']\][^{]*\{/i;
  return declarations(findBlock(source, selector));
}

const accessibilityRoot = rootTokens(css.accessibility);
const accessibilityDark = darkTokens(css.accessibility);
const publisher = { ...rootTokens(css.publisher), ...accessibilityRoot };
const designLight = { ...rootTokens(css.design), ...accessibilityRoot };
const designDark = { ...designLight, ...darkTokens(css.design), ...accessibilityDark };

function resolve(value, tokens, stack = []) {
  if (!value) throw new Error('Missing colour value');
  const variable = /^var\((--[a-z0-9-]+)(?:,\s*([^\)]+))?\)$/i.exec(value.trim());
  if (!variable) return value.trim();
  const [, name, fallback] = variable;
  if (stack.includes(name)) throw new Error(`Circular CSS variable reference: ${[...stack, name].join(' -> ')}`);
  const next = tokens[name] ?? fallback;
  if (!next) throw new Error(`CSS variable ${name} is not defined`);
  return resolve(next, tokens, [...stack, name]);
}

function rgb(hex) {
  const clean = hex.trim().toLowerCase();
  if (!/^#[0-9a-f]{3}([0-9a-f]{3})?$/.test(clean)) {
    throw new Error(`Contrast validator only accepts opaque hex colours; received ${hex}`);
  }
  const expanded = clean.length === 4
    ? `#${clean.slice(1).split('').map((character) => character + character).join('')}`
    : clean;
  return [1, 3, 5].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16) / 255);
}

function luminance(hex) {
  const [red, green, blue] = rgb(hex).map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const normalText = 4.5;
const enhancedText = 7;

const suites = [
  {
    name: 'publisher light theme',
    tokens: publisher,
    pairs: [
      ['--graphite', '--white', enhancedText, 'body text'],
      ['--slate', '--white', normalText, 'secondary text'],
      ['--slate', '--off-white', normalText, 'secondary text on soft surface'],
      ['--skunk-blue', '--white', normalText, 'links'],
      ['--skunk-blue', '--pale-blue', normalText, 'tags'],
      ['--white', '--skunk-blue', normalText, 'primary button label'],
      ['--signal-orange', '--white', normalText, 'eyebrow text'],
      ['--signal-orange', '--off-white', normalText, 'eyebrow text on soft surface'],
      ['#9ec5ff', '--ink-navy', normalText, 'hero eyebrow'],
      ['#dce6ff', '--ink-navy', normalText, 'hero/footer secondary text'],
      ['--white', '--ink-navy', enhancedText, 'hero heading'],
    ],
  },
  {
    name: 'design system light theme',
    tokens: designLight,
    pairs: [
      ['--sk-text-primary', '--sk-layer-01', enhancedText, 'primary text'],
      ['--sk-text-secondary', '--sk-layer-01', normalText, 'secondary text'],
      ['--sk-text-muted', '--sk-bg', normalText, 'muted text'],
      ['--sk-link', '--sk-layer-01', normalText, 'links'],
      ['--sk-link', '--sk-bg', normalText, 'links on page background'],
      ['--sk-interactive-text', '--sk-layer-01', normalText, 'interactive foreground text'],
      ['--sk-text-on-color', '--sk-interactive', normalText, 'primary button label'],
      ['--sk-text-on-color', '--sk-interactive-hover', normalText, 'hover button label'],
      ['--sk-text-inverse', '--sk-layer-inverse', enhancedText, 'inverse text'],
      ['--sk-text-success', '--sk-layer-01', normalText, 'success text'],
      ['--sk-text-warning', '--sk-layer-01', normalText, 'warning text'],
      ['--sk-text-danger', '--sk-layer-01', normalText, 'danger text'],
      ['--sk-text-info', '--sk-layer-01', normalText, 'information text'],
    ],
  },
  {
    name: 'design system dark theme',
    tokens: designDark,
    pairs: [
      ['--sk-text-primary', '--sk-layer-01', enhancedText, 'primary text'],
      ['--sk-text-secondary', '--sk-layer-01', normalText, 'secondary text'],
      ['--sk-text-muted', '--sk-layer-01', normalText, 'muted text'],
      ['--sk-link', '--sk-layer-01', normalText, 'links'],
      ['--sk-link', '--sk-layer-02', normalText, 'links on raised surfaces'],
      ['--sk-interactive-text', '--sk-layer-01', normalText, 'interactive foreground text'],
      ['--sk-interactive-text', '--sk-layer-02', normalText, 'interactive text on raised surfaces'],
      ['--sk-text-on-color', '--sk-interactive', normalText, 'primary button label'],
      ['--sk-text-on-color', '--sk-interactive-hover', normalText, 'hover button label'],
      ['--sk-text-inverse', '--sk-layer-inverse', enhancedText, 'inverse text'],
      ['--sk-text-success', '--sk-layer-01', normalText, 'success text'],
      ['--sk-text-warning', '--sk-layer-01', normalText, 'warning text'],
      ['--sk-text-danger', '--sk-layer-01', normalText, 'danger text'],
      ['--sk-text-info', '--sk-layer-01', normalText, 'information text'],
    ],
  },
];

let failed = false;
for (const suite of suites) {
  console.log(`\n${suite.name}`);
  for (const [foregroundRef, backgroundRef, minimum, label] of suite.pairs) {
    const foreground = resolve(foregroundRef.startsWith('--') ? suite.tokens[foregroundRef] : foregroundRef, suite.tokens);
    const background = resolve(backgroundRef.startsWith('--') ? suite.tokens[backgroundRef] : backgroundRef, suite.tokens);
    const ratio = contrast(foreground, background);
    const status = ratio + 1e-9 >= minimum ? 'PASS' : 'FAIL';
    console.log(`${status} ${ratio.toFixed(2)}:1 (min ${minimum.toFixed(1)}:1) ${label}: ${foregroundRef} ${foreground} on ${backgroundRef} ${background}`);
    if (status === 'FAIL') failed = true;
  }
}

if (failed) {
  console.error('\nWCAG contrast contract failed. Do not weaken the threshold; choose an accessible semantic token instead.');
  process.exit(1);
}

console.log('\nWCAG contrast contract passed for publisher, light design-system and dark design-system states.');
