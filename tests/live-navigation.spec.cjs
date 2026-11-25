const {test, expect} = require('@playwright/test');

const origin = 'https://www.skunkworksacademy.com';
const routes = [
  ['home', '/', false],
  ['partners', '/partners/', false],
  ['course catalogue', '/courses/', true],
  ['beginner course', '/digital-platform-courses/beginner/ai/', true],
  ['MB-800 guide', '/courses/mb-800-exam-preparation/', true]
];
const configurations = [
  ['light mobile', 'light', {width:390, height:844}],
  ['dark desktop', 'dark', {width:1440, height:900}]
];

for (const [label, path, ownsShell] of routes) {
  for (const [size, theme, viewport] of configurations) {
    test(`production ${label}: ${size} navigation`, async ({page}) => {
      await page.setViewportSize(viewport);
      await page.addInitScript(mode => localStorage.setItem('swa-theme', mode), theme);
      const response = await page.goto(origin + path, {waitUntil:'domcontentloaded', timeout:30000});
      expect(response && response.ok()).toBeTruthy();
      const header = page.locator('.swa-global-nav');
      await expect(header).toHaveCount(1);
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('background-color', theme === 'dark' ? 'rgb(17, 17, 17)' : 'rgb(255, 255, 255)');
      await expect(header).toHaveCSS('color', theme === 'dark' ? 'rgb(245, 245, 245)' : 'rgb(17, 17, 17)');
      const logo = header.locator('.swa-global-nav__brand-logo.swa-logo-' + theme);
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(header.getByRole('button', {name:'Dark theme'})).toHaveAttribute('aria-pressed', String(theme === 'dark'));
      if (ownsShell) await expect(page.locator('script[data-skunkworks-react-safe="true"]')).toHaveCount(1);
      await expect(header.locator('.swa-global-nav__top-menu')).toHaveCount(0);
      const button = header.getByRole('button', {name:'Open Academy menu'});
      await button.click();
      const dialog = page.getByRole('dialog', {name:'Skunkworks Academy navigation'});
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('details.swa-global-nav__drawer-group')).toHaveCount(9);
      const learn = dialog.locator('details').filter({has: dialog.locator('summary', {hasText: /^Learn$/})});
      if (!(await learn.getAttribute('open') !== null)) await learn.locator('summary').click();
      const link = learn.getByRole('link', {name:'All courses', exact:true});
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(button).toBeFocused();
    });
  }
}
