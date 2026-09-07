import { test, expect } from '@playwright/test';

const surfaces = [
  ['home', '/'],
  ['learn', '/learn/'],
  ['ibm', '/ibm/'],
  ['microsoft', '/microsoft/'],
  ['cisco', '/cisco/'],
  ['comptia', '/comptia/'],
  ['registration', '/course-registration/'],
  ['forms', '/forms/'],
  ['self-paced', '/self-paced/'],
  ['publisher', '/slides/'],
];

const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
];

for (const [surface, path] of surfaces) {
  for (const [viewportName, viewport] of viewports) {
    test(`${surface} renders ${viewportName} without platform regressions`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.setViewportSize(viewport);
      const response = await page.goto(`http://127.0.0.1:4173${path}`, {
        waitUntil: 'networkidle',
      });

      expect(response, `${path} did not return a response`).not.toBeNull();
      expect(response.status(), `${path} returned HTTP ${response.status()}`).toBeLessThan(400);

      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('script[data-skunkworks-global-nav], script[data-skunkworks-global-shell]').first()).toHaveCount(1);
      await expect(page.locator('link[data-skunkworks-brand-theme="canonical"]').first()).toHaveCount(1);
      await expect(page.locator('link[data-skunkworks-favicon="canonical"]').first()).toHaveCount(1);

      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      expect(bodyWidth, `${surface} overflows horizontally at ${viewportName}`).toBeLessThanOrEqual(viewport.width + 2);

      expect(errors, `${surface} emitted browser errors: ${errors.join(' | ')}`).toEqual([]);

      await page.screenshot({
        path: testInfo.outputPath(`${surface}-${viewportName}.png`),
        fullPage: true,
      });
    });
  }
}
