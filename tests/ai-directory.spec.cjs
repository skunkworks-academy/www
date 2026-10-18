const {test, expect} = require('@playwright/test');
const base = 'http://127.0.0.1:4173';

test('AI catalogue loads 26 records and honours enrolment approval', async ({page}) => {
  const response = await page.goto(base + '/ai/', {waitUntil: 'domcontentloaded'});
  expect(response.status()).toBe(200);
  await expect(page.locator('#ai-results-count')).toHaveText('26 of 26 AI-related course entries', {timeout: 15000});
  await expect(page.locator('.ai-course-card')).toHaveCount(26);
  await expect(page.locator('a.ai-checkout')).toHaveCount(1);
  await expect(page.locator('a.ai-checkout')).toHaveAttribute('href', /courseId=SKW-BEG-AI-101/);
  const snapshot = await page.request.get(base + '/ai/ai-master-catalog.json');
  expect(snapshot.status()).toBe(200);
  expect((await snapshot.json()).summary).toEqual({generated: 19, curated: 7, total: 26});
});

test('AI catalogue filters and URL state are keyboard accessible', async ({page}) => {
  await page.goto(base + '/ai/?q=watsonx', {waitUntil: 'domcontentloaded'});
  await expect(page.locator('#ai-results-count')).toHaveText('1 of 26 AI-related course entries');
  await expect(page.locator('.ai-course-card').first()).toContainText('IBM watsonx Foundations');
  await page.locator('#ai-reset').click();
  await expect(page.locator('.ai-course-card')).toHaveCount(26);
  await page.locator('#ai-category').selectOption('AI Security');
  await expect(page.locator('.ai-course-card')).toHaveCount(1);
  await expect(page.locator('.ai-course-card').first()).toContainText('AI Security Specialist');
  await expect(page).toHaveURL(/category=AI%20Security/);
  await page.locator('#ai-reset').click();
  await page.locator('#ai-search').fill('Claude');
  await expect(page.locator('.ai-course-card')).toHaveCount(1);
  await expect(page.locator('.ai-course-card').first()).toContainText('Claude User Fundamentals');
});

for (const scheme of ['light', 'dark']) {
  test('AI directory renders without mobile overflow in ' + scheme + ' theme', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({colorScheme: scheme});
    await page.goto(base + '/ai/', {waitUntil: 'domcontentloaded'});
    await expect(page.locator('.ai-course-card')).toHaveCount(26);
    const measurements = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      cardBg: getComputedStyle(document.querySelector('.ai-course-card')).backgroundColor,
      cardText: getComputedStyle(document.querySelector('.ai-course-card h3')).color,
      filtersVisible: [...document.querySelectorAll('.ai-field')].every(x => x.getBoundingClientRect().width > 0),
    }));
    expect(measurements.bodyWidth).toBeLessThanOrEqual(measurements.viewportWidth + 2);
    expect(measurements.filtersVisible).toBe(true);
    expect(measurements.cardBg).not.toBe(measurements.cardText);
  });
}
