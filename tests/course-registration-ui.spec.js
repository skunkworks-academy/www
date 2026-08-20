const { test, expect } = require('@playwright/test');
const http = require('node:http');
const { readFile, stat } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const root = process.cwd();
const port = 4187;
const baseURL = `http://127.0.0.1:${port}`;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

let server;

test.beforeAll(async () => {
  server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, baseURL).pathname);
      const safe = normalize(pathname).replace(/^([.][.][/\\])+/, '');
      let file = join(root, safe);
      const info = await stat(file).catch(() => null);
      if (info?.isDirectory()) file = join(file, 'index.html');
      const data = await readFile(file);
      res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
});

test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

async function assertNoHorizontalOverflow(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth, `horizontal overflow: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function contrastRatio(page, selector) {
  return page.locator(selector).evaluate((element) => {
    function rgb(value) {
      const match = value.match(/rgba?\((\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)/i);
      if (!match) throw new Error(`Unsupported colour ${value}`);
      return match.slice(1, 4).map(Number);
    }
    function luminance(value) {
      const channels = rgb(value).map((channel) => {
        const c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }
    const style = getComputedStyle(element);
    let background = style.backgroundColor;
    let parent = element.parentElement;
    while (background === 'rgba(0, 0, 0, 0)' && parent) {
      background = getComputedStyle(parent).backgroundColor;
      parent = parent.parentElement;
    }
    const foregroundL = luminance(style.color);
    const backgroundL = luminance(background);
    return (Math.max(foregroundL, backgroundL) + 0.05) / (Math.min(foregroundL, backgroundL) + 0.05);
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
]) {
  test(`registration page is responsive at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${baseURL}/course-registration/`, { waitUntil: 'domcontentloaded' });
    await assertNoHorizontalOverflow(page);

    await expect(page.locator('link[data-skunkworks-favicon="canonical"]')).toHaveCount(4);
    await expect(page.locator('#courseRegistrationForm')).toBeVisible();
    await expect(page.locator('.cr-button').first()).toBeVisible();

    const targets = await page.locator('.cr-button, .cr-form input:not([type="hidden"]), .cr-form select, .cr-form textarea').evaluateAll((elements) =>
      elements.filter((element) => getComputedStyle(element).display !== 'none').map((element) => ({
        tag: element.tagName,
        id: element.id,
        height: element.getBoundingClientRect().height,
      })),
    );
    for (const target of targets) expect(target.height, `${target.tag}#${target.id} is too small`).toBeGreaterThanOrEqual(44);
  });
}

test('registration form exposes accessible validation feedback', async ({ page }) => {
  await page.goto(`${baseURL}/course-registration/`, { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'not-an-email');
  await page.fill('#phone', '+27 82 555 0101');
  await page.click('button[type="submit"]');
  await expect(page.locator('#formError')).toBeVisible();
  await expect(page.locator('#formError')).toContainText('valid email');
  await expect(page.locator('#email')).toBeFocused();

  await page.fill('#email', 'learner@example.com');
  await page.fill('#phone', '123');
  await page.click('button[type="submit"]');
  await expect(page.locator('#formError')).toContainText('at least eight digits');
  await expect(page.locator('#phone')).toBeFocused();
});

test('explicit light and dark themes keep form text readable', async ({ page }) => {
  await page.goto(`${baseURL}/course-registration/`, { waitUntil: 'domcontentloaded' });

  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => {
      document.documentElement.setAttribute('data-theme', value);
      window.dispatchEvent(new CustomEvent('skunkworksacademy:theme-change', { detail: { theme: value } }));
    }, theme);
    await page.waitForTimeout(50);
    expect(await contrastRatio(page, '.cr-form label[for="email"]'), `${theme} label contrast`).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(page, '.cr-form-header p'), `${theme} secondary text contrast`).toBeGreaterThanOrEqual(4.5);
  }
});

test('confirmation page blocks cross-origin return URLs and lets users cancel redirect', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/course-registration/thank-you.html?return=${encodeURIComponent('https://evil.example/phish')}&redirect=0`, { waitUntil: 'domcontentloaded' });
  await assertNoHorizontalOverflow(page);
  await expect(page.locator('link[data-skunkworks-favicon="canonical"]')).toHaveCount(4);
  await expect(page.locator('#continueCourse')).toHaveAttribute('href', '/self-paced/');
  await expect(page.locator('#redirectMessage')).toContainText('Continue to course');
});

test('email template remains readable without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/course-registration/skunkworks-academy-cyber-security-training-email.html`, { waitUntil: 'domcontentloaded' });
  await assertNoHorizontalOverflow(page);
  await expect(page.locator('link[data-skunkworks-favicon="canonical"]')).toHaveCount(4);
  const emailCardWidth = await page.locator('.email-card').evaluate((element) => element.getBoundingClientRect().width);
  expect(emailCardWidth).toBeLessThanOrEqual(390);
});
