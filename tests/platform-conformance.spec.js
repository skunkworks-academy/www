import { test, expect } from "@playwright/test";

const baseURL = "http://127.0.0.1:4175";
const routes = [
  "/", "/learn/", "/ibm/", "/microsoft/", "/cisco/", "/comptia/",
  "/course-registration/", "/forms/", "/self-paced/", "/slides/"
];

for (const route of routes) {
  test(`${route} satisfies the public platform contract`, async ({ page }) => {
    const failedAssets = [];
    page.on("response", response => {
      const url = new URL(response.url());
      if (url.origin !== baseURL) return;
      if (/\.(?:css|js)(?:\?|$)/i.test(url.pathname) && response.status() >= 400) {
        failedAssets.push(`${response.status()} ${url.pathname}`);
      }
    });

    await page.goto(baseURL + route, { waitUntil: "networkidle" });

    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".swa-global-nav")).toBeVisible();
    await expect(page.locator('link[data-skunkworks-favicon="canonical"]').first()).toHaveCount(1);
    await expect(page.locator('link[data-skunkworks-brand-theme="canonical"]').first()).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]').first();
    if (await canonical.count()) {
      const href = await canonical.getAttribute("href");
      expect(href).toMatch(/^https:\/\/(?:www\.)?skunkworksacademy\.com\//);
    }

    const authLeak = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i) || "");
      for (let i = 0; i < sessionStorage.length; i++) keys.push(sessionStorage.key(i) || "");
      return keys.filter(key => /msal|access.?token|id.?token|refresh.?token/i.test(key));
    });
    expect(authLeak, `public route ${route} leaked browser auth state`).toEqual([]);
    expect(failedAssets, `asset failures on ${route}`).toEqual([]);
  });
}

test("Cisco catalogue search remains functional", async ({ page }) => {
  await page.goto(baseURL + "/cisco/", { waitUntil: "networkidle" });
  const search = page.locator("#cisco-course-search");
  await expect(search).toBeVisible();
  await search.fill("network");
  await expect(search).toHaveValue("network");
  await expect(page.locator("#cisco-course-results")).toBeVisible();
});

test("responsive shell fits mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/", { waitUntil: "networkidle" });
  const width = await page.locator("body").evaluate(el => el.scrollWidth);
  expect(width).toBeLessThanOrEqual(392);
  await expect(page.locator(".swa-global-nav")).toBeVisible();
});
