import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function ready(page){await page.goto('/ibm/');await expect(page.locator('.ibm-course')).toHaveCount(12);}
test('search, details, keyboard close and enquiry context',async({page})=>{
 await ready(page);const code=await page.locator('.ibm-code').first().textContent();
 await page.locator('#ibm-search').fill(code);await expect(page.locator('.ibm-course')).toHaveCount(1);
 await page.getByRole('button',{name:'View course '+code,exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Before you start'})).toBeVisible();
 const enquiry=await page.locator('#ibm-detail-enquiry').getAttribute('href');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.goto(enquiry);await expect(page.locator('#course')).toHaveValue(new RegExp(code));await expect(page.locator('#notes')).toHaveValue(new RegExp(code));
});
test('shortlist survives reload and filters and empty state work',async({page})=>{
 await ready(page);await page.locator('.ibm-save').first().click();await page.reload();await expect(page.locator('#ibm-saved-count')).toHaveText('1');
 await page.locator('#ibm-shortlist-toggle').click();await expect(page.locator('.ibm-course')).toHaveCount(1);
 await page.locator('#ibm-search').fill('no-course-zzzz');await expect(page.locator('#ibm-empty')).toBeVisible();await page.locator('#ibm-empty-reset').click();await expect(page.locator('.ibm-course')).toHaveCount(12);
 await page.locator('#ibm-next').click();await expect(page.locator('#ibm-page')).toContainText('Page 2');
});
test('deep links and retired reference courses remain honest',async({page})=>{
 const data=await (await page.request.get('/data/ibm-learning/catalogue.json')).json();const c=data.courses.find(c=>c.availability!=='Content Available');
 await page.goto('/ibm/?course='+c.code);await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#ibm-detail-content')).toContainText('Reference course');await expect(page.locator('#ibm-detail-enquiry')).toHaveText('Ask about alternatives ↗');
});
test('failed catalogue has a usable retry and IBM fallback',async({page})=>{
 await page.route('**/data/ibm-learning/catalogue.json',r=>r.fulfill({status:503,body:'Unavailable'}));await page.goto('/ibm/');await expect(page.locator('#ibm-error')).toBeVisible();await page.unroute('**/data/ibm-learning/catalogue.json');await page.locator('#ibm-retry').click();await expect(page.locator('.ibm-course')).toHaveCount(12);
});
for(const width of [320,390,768,1440])for(const theme of ['light','dark'])test(`${width}px ${theme}: layout and accessibility`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({colorScheme:theme});await ready(page);
 await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.dataset.swaTheme=t;},theme);
 await page.waitForTimeout(600);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await expect(page.locator('.swa-global-nav')).toHaveCount(1);await expect(page.locator('.swa-global-footer')).toHaveCount(1);
 const audit=await new AxeBuilder({page}).include('#ibm-learning').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.screenshot({path:`test-results/ibm-${width}-${theme}.png`,fullPage:width===390});
});
