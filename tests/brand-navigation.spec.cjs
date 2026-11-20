const {test, expect} = require('@playwright/test');

const origin = 'http://127.0.0.1:4173';

async function useBranchAssets(page) {
  await page.route(/^https:\/\/(?:www\.)?skunkworksacademy\.com\/.*$/i, async route => {
    const url = new URL(route.request().url());
    const response = await page.request.fetch(origin + url.pathname + url.search, {failOnStatusCode: false});
    await route.fulfill({response});
  });
  await page.route(/https:\/\/(?:snap\.licdn\.com|px\.ads\.linkedin\.com|www\.googletagmanager\.com|www\.google-analytics\.com|connect\.facebook\.net|bat\.bing\.com)\//i, route => route.abort());
}

async function contrast(page, foreground, background) {
  return page.evaluate(([front, back]) => {
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = value => rgb(value).map(channel => {
      channel /= 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
    const a = luminance(getComputedStyle(document.querySelector(front)).color);
    const b = luminance(getComputedStyle(document.querySelector(back)).backgroundColor);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }, [foreground, background]);
}

for (const path of ['/', '/partners/']) {
  for (const theme of ['light', 'dark']) {
    for (const [size, viewport] of [['desktop', {width: 1440, height: 900}], ['mobile', {width: 390, height: 844}]]) {
      test(`${path} ${theme} ${size} navigation is legible and operable`, async ({page}, testInfo) => {
        await useBranchAssets(page);
        await page.setViewportSize(viewport);
        await page.addInitScript(value => localStorage.setItem('swa-theme', value), theme);
        await page.goto(origin + path, {waitUntil: 'domcontentloaded'});
        const header = page.locator('.swa-global-nav');
        await expect(header).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(header).toHaveCSS('background-color', theme === 'dark' ? 'rgb(17, 17, 17)' : 'rgb(255, 255, 255)');
        await expect(header).toHaveCSS('color', theme === 'dark' ? 'rgb(245, 245, 245)' : 'rgb(17, 17, 17)');
        const logo = header.locator('.swa-global-nav__brand-logo.swa-logo-' + (theme === 'dark' ? 'dark' : 'light'));
        await expect(logo).toBeVisible();
        await expect.poll(() => logo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(page.locator('body > .swa-skip-link').first()).toBeAttached();
        expect(await page.locator('body').evaluate(body => body.firstElementChild.classList.contains('swa-skip-link'))).toBe(true);
        await expect(header.getByRole('button', {name: 'Dark theme'})).toHaveAttribute('aria-pressed', String(theme === 'dark'));
        await expect(header.locator('summary[aria-label="Skunkworks ecosystem"]')).toBeVisible();
        expect(await contrast(page, '.swa-global-nav__sign-in', '.swa-global-nav')).toBeGreaterThanOrEqual(4.5);

        if (size === 'desktop') {
          const button = header.locator('.swa-global-nav__top-menu-button').first();
          await expect(button).toBeVisible();
          await button.click();
          const panel = header.locator('.swa-primary-open .swa-global-nav__top-menu-panel');
          await expect(panel).toBeVisible();
          expect(await contrast(page, '.swa-primary-open .swa-global-nav__top-menu-option strong', '.swa-primary-open .swa-global-nav__top-menu-panel')).toBeGreaterThanOrEqual(4.5);
          expect(await contrast(page, '.swa-primary-open .swa-global-nav__top-menu-option span', '.swa-primary-open .swa-global-nav__top-menu-panel')).toBeGreaterThanOrEqual(4.5);
          await page.keyboard.press('Escape');
          await expect(button).toBeFocused();
          await expect(button).toHaveAttribute('aria-expanded', 'false');
        } else {
          const button = header.getByRole('button', {name: 'Open Academy menu'});
          await button.click();
          const dialog = page.getByRole('dialog', {name: 'Skunkworks Academy navigation'});
          await expect(dialog).toBeVisible();
          await expect(dialog.getByRole('button', {name: 'Close navigation'})).toBeFocused();
          await page.keyboard.press('Escape');
          await expect(dialog).not.toBeVisible();
          await expect(button).toBeFocused();
        }
        const bounds = await header.locator('.swa-global-nav__inner').evaluate(node => {
          const controls = [...node.querySelectorAll('.swa-global-nav__toggle,.swa-global-nav__brand,.swa-global-nav__search,.swa-global-nav__theme,.swa-global-nav__sign-in,.swa-global-nav__ecosystem-summary')];
          return controls.filter(element => element.getClientRects().length).map(element => {
            const rect = element.getBoundingClientRect();
            return {left: rect.left, right: rect.right};
          });
        });
        expect(bounds.every(rect => rect.left >= -1 && rect.right <= viewport.width + 1)).toBe(true);
        await page.screenshot({path: testInfo.outputPath(`navigation-${size}-${theme}.png`)});
      });
    }
  }
}

test('React-safe course shell does not mutate framework-owned navigation', async ({page}) => {
  await useBranchAssets(page);
  await page.route(origin + '/course-shell-fixture', route => route.fulfill({contentType: 'text/html', body: `
    <!doctype html><html lang="en"><head><title>Course shell</title>
    <script defer src="/assets/skunkworks-ui.js" data-skunkworks-ui="canonical"></script>
    <script defer src="/assets/skunkworks-footer.js" data-skunkworks-global-footer="canonical"></script>
    <script defer src="/assets/academy-navigation-v11.js" data-skunkworks-react-safe="true"></script>
    </head><body><div id="__docusaurus"><nav class="navbar navbar--fixed-top">Framework navigation</nav><main><h1>Course</h1></main></div></body></html>`}));
  await page.goto(origin + '/course-shell-fixture');
  await expect(page.locator('.swa-global-nav__top-menu')).toBeVisible();
  expect((await page.locator('#__docusaurus .navbar').getAttribute('style')) || '').not.toMatch(/display\s*:/i);
  await expect(page.locator('#__docusaurus main h1')).toHaveText('Course');
});
