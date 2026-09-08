import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Serve Academy assets from this checkout, including absolute production URLs.
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/(www\.)?skunkworksacademy\.com\/assets\//, async route => {
    const file = path.resolve('.' + new URL(route.request().url()).pathname);
    if (fs.existsSync(file)) await route.fulfill({ path: file });
    else await route.abort();
  });
});

for (const route of ['/', '/learn/', '/forms/', '/authors/']) {
  for (const width of [320, 768, 1440]) {
    test(`footer ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('http://127.0.0.1:4175' + route);
      const footer = page.locator('.swa-global-footer');
      await expect(footer).toHaveCount(1);
      await expect(footer.locator('a')).toHaveCount(17);
      await expect(footer).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.locator('.swa-global-nav')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
      const bounds = await footer.evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth }));
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.width);
      if (width === 1440) {
        const cards = await footer.locator('.swa-global-footer__social-link').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().top));
        expect(new Set(cards.slice(0, 6)).size).toBe(1);
        expect(cards[6]).toBeGreaterThan(cards[0]);
      }
      await page.emulateMedia({ colorScheme: 'dark' });
      await expect(footer).toHaveCSS('background-color', 'rgb(0, 0, 0)');
      await expect(footer).toHaveCSS('color', 'rgb(255, 255, 255)');
      const summary = footer.locator('summary');
      await summary.click();
      await footer.getByRole('button', { name: 'Light', exact: true }).click();
      await expect(summary).toBeFocused();
      await expect(footer).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await summary.press('Enter');
      await summary.press('Escape');
      await expect(footer.locator('details')).not.toHaveAttribute('open');
      await expect(summary).toBeFocused();
      if (route === '/' && width === 1440) await footer.screenshot({ path: testInfo.outputPath('footer-desktop.png') });
      if (route === '/' && width === 320) await footer.screenshot({ path: testInfo.outputPath('footer-mobile.png') });
    });
  }
}

