const {test, expect} = require('@playwright/test');
const origin = 'http://127.0.0.1:4180';

for (const theme of ['light', 'dark']) {
  for (const [size, viewport] of [['desktop', {width:1440,height:900}], ['mobile', {width:390,height:844}]]) {
    test(`reviewed MB-800 guide navigation is ${theme} and usable on ${size}`, async ({page}) => {
      await page.route(/^https:\/\/(?:www\.)?skunkworksacademy\.com\/.*$/i, async route => {
        const url = new URL(route.request().url());
        const response = await page.request.fetch(origin + url.pathname + url.search, {failOnStatusCode:false});
        await route.fulfill({response});
      });
      await page.setViewportSize(viewport);
      await page.addInitScript(mode => localStorage.setItem('swa-theme', mode), theme);
      await page.goto(origin + '/courses/mb-800-exam-preparation/', {waitUntil:'domcontentloaded'});
      const header = page.locator('.swa-global-nav');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('background-color', theme === 'dark' ? 'rgb(17, 17, 17)' : 'rgb(255, 255, 255)');
      await expect(page.locator('.swa-global-nav__top-menu')).toHaveCount(0);
      await expect(page.locator('#syllabus')).toBeVisible();
      const button = header.getByRole('button', {name:'Open Academy menu'});
      await button.click();
      const dialog = page.getByRole('dialog', {name:'Skunkworks Academy navigation'});
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('details.swa-global-nav__drawer-group')).toHaveCount(9);
      const learn = dialog.locator('details').filter({has: dialog.locator('summary', {hasText: /^Learn$/})});
      if (await learn.getAttribute('open') === null) await learn.locator('summary').click();
      await expect(learn.getByRole('link', {name:'All courses', exact:true})).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(button).toBeFocused();
      await page.goto(origin + '/courses/mb-800-exam-preparation/module-01-foundations/', {waitUntil:'domcontentloaded'});
      await expect(page.locator('.swa-global-nav__top-menu')).toHaveCount(0);
      await expect(page.locator('nav[aria-label$="module navigation"]').first()).toBeVisible();
    });
  }
}
