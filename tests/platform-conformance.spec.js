import { test, expect } from "@playwright/test";

const baseURL = new URL(process.env.SKW_TEST_ORIGIN || "http://127.0.0.1:4175").origin;

async function useStagedAssets(context) {
  if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL).hostname)) return;
  await context.route(/^https:\/\/(?:www\.)?skunkworksacademy\.com\/assets\//, async route => {
    const requested = new URL(route.request().url());
    const response = await context.request.get(baseURL + requested.pathname + requested.search);
    await route.fulfill({ response });
  });
}

test.beforeEach(async ({ context }) => useStagedAssets(context));
const routes = [
  "/", "/learn/", "/ibm/", "/microsoft/", "/cisco/", "/comptia/",
  "/course-registration/", "/forms/", "/self-paced/", "/slides/", "/plugins/academy-learning-design/"
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


test("Learning Design plugin page provides accessible visual and functional controls in both themes", async ({ browser }) => {
  for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
    await useStagedAssets(context);
    const page = await context.newPage();
    try {
      await page.goto(baseURL + "/plugins/academy-learning-design/", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: /Learning design that follows your standards/i })).toBeVisible();
      await expect(page.locator(".swa-global-nav")).toBeVisible();
      await expect(page.locator(".swa-global-footer")).toBeVisible();
      await expect(page.getByRole("link", { name: /Open the ChatGPT plugin/i })).toBeVisible();
      await expect(page.locator('img[src="/assets/plugins/academy-learning-design.svg"]')).toBeVisible();
      await page.locator(".ald-faq summary").first().click();
      await expect(page.locator(".ald-faq details").first()).toHaveAttribute("open", "");
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth
      }));
      expect(dimensions.scrollWidth, "Unexpected horizontal overflow in " + theme).toBeLessThanOrEqual(dimensions.viewportWidth + 2);
      await expect(page.locator(".ald-hero")).toHaveAttribute("data-swa-surface-tone", "dark");
      for (const selector of [".ald-card", ".ald-btn", ".ald-hero h1", ".ald-hero__lead"]) {
      for (const element of await page.locator(selector).all()) {
      const ratio = await element.evaluate(card => {
        const fg = getComputedStyle(card.querySelector("p") || card).color;
        let surface = card;
        while (surface.parentElement && getComputedStyle(surface).backgroundColor === "rgba(0, 0, 0, 0)") surface = surface.parentElement;
        const bg = getComputedStyle(surface).backgroundColor;
        const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const luminance = value => {
          const channels = rgb(value).map(channel => {
            const c = channel / 255;
            return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const values = [luminance(fg), luminance(bg)].sort((a,b) => b-a);
        return (values[0] + 0.05) / (values[1] + 0.05);
      });
      expect(ratio, selector + " text contrast in " + theme + " at " + width + "px").toBeGreaterThanOrEqual(4.5);
      }
      }
      await page.locator("#ald-copy-prompt").click();
      await expect(page.locator("#ald-copy-status")).toContainText(/copied|unavailable|blocked/i);
    } finally {
      await context.close();
    }
  }
  }
});
