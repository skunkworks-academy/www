const { test, expect } = require('@playwright/test');
const { join } = require('node:path');

const root = process.cwd();
const contractStyles = [
  join(root, 'assets', 'academy-brand-theme.css'),
  join(root, 'assets', 'academy-page-contract.css'),
];
const governedInputTypes = ['search', 'text', 'email', 'tel', 'url', 'number'];

function controls(prefix) {
  return `
    <label data-field-label>
      Course
      <select id="${prefix}-select">
        <optgroup label="Cloud courses">
          <option>A deliberately long course name that must not widen its container</option>
        </optgroup>
      </select>
    </label>
    ${governedInputTypes.map((type) => `<input id="${prefix}-${type}" type="${type}" aria-label="${type}" />`).join('')}
  `;
}

async function renderFixture(page, { width = 1024, theme = 'light' } = {}) {
  await page.setViewportSize({ width, height: 720 });
  await page.setContent(`
    <!doctype html>
    <html data-theme="${theme}">
      <head>
        <style>
          body { margin: 0; }
          .fixture { font-size: 12px; width: 240px; }
          .fixture > * { display: block; }
          .token-probe {
            background-color: var(--sk-layer-01);
            color: var(--sk-text-primary);
          }
        </style>
      </head>
      <body>
        <main class="fixture" data-scope="main">${controls('main')}</main>
        <div class="fixture" role="main" data-scope="role-main">${controls('role-main')}</div>
        <div class="fixture site-main" data-scope="site-main">${controls('site-main')}</div>
        <div class="fixture document" data-scope="document">${controls('document')}</div>
        <main class="fixture" data-scope="excluded-types">
          <input id="password" type="password" aria-label="password" />
          <textarea id="textarea" aria-label="textarea"></textarea>
        </main>
        <div class="fixture" data-scope="outside">${controls('outside')}</div>
        <div class="token-probe" aria-hidden="true"></div>
      </body>
    </html>
  `);

  for (const path of contractStyles) await page.addStyleTag({ path });
}

async function controlMetrics(locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      appearance: style.appearance,
      boxSizing: style.boxSizing,
      fontSize: style.fontSize,
      height: bounds.height,
      lineHeight: style.lineHeight,
      maxInlineSize: style.maxInlineSize,
      minInlineSize: style.minInlineSize,
      overflow: style.overflow,
      textOverflow: style.textOverflow,
      whiteSpace: style.whiteSpace,
      width: bounds.width,
    };
  });
}

for (const scope of ['main', 'role-main', 'site-main', 'document']) {
  test(`standardizes native controls inside the ${scope} content root`, async ({ page }) => {
    await renderFixture(page);

    const containerWidth = await page.locator(`[data-scope="${scope}"]`).evaluate((element) => element.getBoundingClientRect().width);
    const labelMinWidth = await page.locator(`[data-scope="${scope}"] [data-field-label]`).evaluate((element) => getComputedStyle(element).minInlineSize);
    expect(labelMinWidth).toBe('0px');

    for (const type of governedInputTypes) {
      const metrics = await controlMetrics(page.locator(`#${scope}-${type}`));
      expect(metrics.boxSizing, `${type} box sizing`).toBe('border-box');
      expect(metrics.width, `${type} should fill its container`).toBeCloseTo(containerWidth, 0);
      expect(metrics.maxInlineSize, `${type} maximum inline size`).toBe('100%');
      expect(metrics.minInlineSize, `${type} minimum inline size`).toBe('0px');
      expect(metrics.height, `${type} touch target`).toBeGreaterThanOrEqual(44);
      expect(
        Number.parseFloat(metrics.lineHeight) / Number.parseFloat(metrics.fontSize),
        `${type} line height`,
      ).toBeCloseTo(1.25, 2);
    }

    const select = await controlMetrics(page.locator(`#${scope}-select`));
    expect(select.boxSizing).toBe('border-box');
    expect(select.width, 'select should ignore the intrinsic width of a long option').toBeCloseTo(containerWidth, 0);
    expect(select.maxInlineSize).toBe('100%');
    expect(select.minInlineSize).toBe('0px');
    expect(select.height).toBeGreaterThanOrEqual(44);
    expect(select.appearance).toBe('auto');
    expect(select.overflow).toBe('hidden');
    expect(select.textOverflow).toBe('ellipsis');
    expect(select.whiteSpace).toBe('nowrap');
  });
}

test('uses the active light and dark theme tokens for option and optgroup text', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await renderFixture(page, { theme });

    const expected = await page.locator('.token-probe').evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    });

    for (const selector of ['#main-select option', '#main-select optgroup']) {
      const actual = await page.locator(selector).evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, color: style.color };
      });
      expect(actual, `${theme} ${selector} palette`).toEqual(expected);
    }
  }
});

test('applies mobile sizing at the 720px boundary without leaking above it', async ({ page }) => {
  await renderFixture(page, { width: 720 });

  for (const id of ['main-select', ...governedInputTypes.map((type) => `main-${type}`)]) {
    const metrics = await controlMetrics(page.locator(`#${id}`));
    expect(metrics.fontSize, `${id} mobile font size`).toBe('16px');
    expect(metrics.height, `${id} mobile touch target`).toBeGreaterThanOrEqual(48);
  }

  await renderFixture(page, { width: 721 });
  const desktop = await controlMetrics(page.locator('#main-text'));
  expect(desktop.fontSize).not.toBe('16px');
  expect(desktop.height).toBeGreaterThanOrEqual(44);
  expect(desktop.height).toBeLessThan(48);
});

test('does not apply the scoped sizing contract to excluded controls', async ({ page }) => {
  await renderFixture(page, { width: 390 });

  const governedWidth = (await controlMetrics(page.locator('#main-text'))).width;
  for (const selector of ['#password', '#textarea', '#outside-text']) {
    const metrics = await controlMetrics(page.locator(selector));
    expect(metrics.width, `${selector} should retain its authored or native width`).not.toBeCloseTo(governedWidth, 0);
    expect(metrics.height, `${selector} should not receive the mobile minimum height`).toBeLessThan(48);
  }
});
