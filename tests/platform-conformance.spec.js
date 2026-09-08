import { test, expect } from "@playwright/test";

const baseURL = "http://127.0.0.1:4175";
const routes = [
  "/", "/courses/", "/learn/", "/ibm/", "/microsoft/", "/cisco/", "/comptia/",
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

    const favicons = page.locator('link[data-skunkworks-favicon="canonical"]');
    const faviconCount = await favicons.count();
    expect(faviconCount, `missing canonical favicon set on ${route}`).toBeGreaterThan(0);
    const faviconKeys = await favicons.evaluateAll(nodes =>
      nodes.map(node => `${node.getAttribute("href") || ""}|${node.getAttribute("media") || ""}|${node.getAttribute("rel") || ""}`)
    );
    expect(new Set(faviconKeys).size, `duplicate canonical favicon entries on ${route}`).toBe(faviconKeys.length);

    const theme = page.locator('link[data-skunkworks-brand-theme="canonical"]');
    await expect(theme).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const href = await canonical.getAttribute("href");
    expect(href).toMatch(/^https:\/\/(?:www\.)?skunkworksacademy\.com\//);

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
  const results = page.locator("#cisco-course-results");
  await expect(search).toBeVisible();
  await expect(results).toBeVisible();

  const before = await results.innerText();
  await search.fill("network");
  await expect(search).toHaveValue("network");
  await expect.poll(async () => results.innerText()).not.toBe(before);
  await expect(results).toContainText(/network/i);
});

test("responsive shell fits mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/", { waitUntil: "networkidle" });
  const width = await page.locator("body").evaluate(el => el.scrollWidth);
  expect(width).toBeLessThanOrEqual(392);
  await expect(page.locator(".swa-global-nav")).toBeVisible();
});


test("mobile Academy navigation is strictly monochrome", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/courses/", { waitUntil: "networkidle" });

  const nav = page.locator(".swa-global-nav");
  const toggle = page.locator(".swa-global-nav__toggle");
  const drawer = page.locator(".swa-global-nav__links");
  const signIn = page.locator(".swa-global-nav__sign-in");

  await expect(nav).toBeVisible();
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(nav).toHaveClass(/swa-menu-open/);
  await expect(drawer).toBeVisible();

  const chrome = await nav.evaluate((element) => {
    const navStyle = getComputedStyle(element);
    const dividerStyle = getComputedStyle(element, "::after");
    const drawerNode = element.querySelector(".swa-global-nav__links");
    const signInNode = element.querySelector(".swa-global-nav__sign-in");
    return {
      navBackground: navStyle.backgroundColor,
      dividerBackground: dividerStyle.backgroundColor,
      drawerBackground: drawerNode ? getComputedStyle(drawerNode).backgroundColor : "",
      signInColor: signInNode ? getComputedStyle(signInNode).color : "",
    };
  });

  expect(chrome.navBackground).toBe("rgb(0, 0, 0)");
  expect(chrome.drawerBackground).toBe("rgb(0, 0, 0)");
  expect(chrome.dividerBackground).toBe("rgb(255, 255, 255)");
  expect(chrome.signInColor).toBe("rgb(255, 255, 255)");
});
