import { test, expect } from '@playwright/test';

const LOCAL_ORIGIN = 'http://127.0.0.1:4173';
const academyHosts = new Set(['skunkworksacademy.com', 'www.skunkworksacademy.com']);

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
      const pageErrors = [];
      const failedAcademyAssets = [];

      // Canonical Academy pages intentionally use absolute production URLs for
      // shared assets. During PR visual verification, route those URLs back to
      // the checked-out branch so the screenshots exercise the proposed code.
      await page.route(/https:\/\/(?:snap\.licdn\.com|px\.ads\.linkedin\.com|www\.googletagmanager\.com|www\.google-analytics\.com|connect\.facebook\.net|bat\.bing\.com)\//i, route => route.abort());

      await page.route(/^https:\/\/(?:www\.)?skunkworksacademy\.com\/.*$/i, async route => {
        const requested = new URL(route.request().url());
        const localUrl = LOCAL_ORIGIN + requested.pathname + requested.search;
        const response = await page.request.fetch(localUrl, { failOnStatusCode: false });
        await route.fulfill({ response });
      });

      page.on('pageerror', error => pageErrors.push(String(error)));
      page.on('response', response => {
        const url = new URL(response.url());
        const isAcademy = url.origin === LOCAL_ORIGIN || academyHosts.has(url.hostname);
        const isCriticalAsset = /\.(?:css|js|png|svg|ico)(?:\?|$)/i.test(url.pathname);
        if (isAcademy && isCriticalAsset && response.status() >= 400) {
          failedAcademyAssets.push(`${response.status()} ${url.pathname}`);
        }
      });

      await page.setViewportSize(viewport);
      const response = await page.goto(`${LOCAL_ORIGIN}${path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 20_000,
      });
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(250);

      expect(response, `${path} did not return a response`).not.toBeNull();
      expect(response.status(), `${path} returned HTTP ${response.status()}`).toBeLessThan(400);

      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('script[data-skunkworks-global-nav], script[data-skunkworks-global-shell]').first()).toHaveCount(1);
      await expect(page.locator('link[data-skunkworks-brand-theme="canonical"]').first()).toHaveCount(1);
      await expect(page.locator('link[data-skunkworks-favicon="canonical"]').first()).toHaveCount(1);

      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      expect(bodyWidth, `${surface} overflows horizontally at ${viewportName}`).toBeLessThanOrEqual(viewport.width + 2);

      expect(pageErrors, `${surface} emitted runtime errors: ${pageErrors.join(' | ')}`).toEqual([]);
      expect(
        [...new Set(failedAcademyAssets)],
        `${surface} has missing Academy CSS/JS/image assets`
      ).toEqual([]);

      await page.screenshot({
        path: testInfo.outputPath(`${surface}-${viewportName}.png`),
        fullPage: true,
      });
    });
  }
}
