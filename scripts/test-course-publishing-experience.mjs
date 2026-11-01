#!/usr/bin/env node
/**
 * Chromium release gate for Academy /courses pages.
 * Checks every registered course in light/mobile and dark/desktop mode,
 * including rendered shared chrome, access/registration and axe contrast.
 * Requires playwright and axe-core, installed by the workflow.
 */
import fs from 'node:fs';
import {chromium} from 'playwright';
import axe from 'axe-core';

const origin = process.env.SKW_COURSE_TEST_ORIGIN || 'http://127.0.0.1:4174';
const manifest = JSON.parse(fs.readFileSync('course-manifest.json', 'utf8'));
const lessonSlugs = [
  'deployment-model', 'actions-deployment', 'custom-domain-dns',
  'https-security', 'troubleshooting', 'operations', 'capstone'
];
const modules = lessonSlugs.map((slug, index) => ({
  courseId: 'GHP-DOM-101',
  path: '/courses/github-pages-setup/module-' + String(index + 1).padStart(2, '0') + '-' + slug,
  module: true
}));
const courses = [...manifest.courses, ...modules];
const problems = [];
const browser = await chromium.launch({headless: true});
const configurations = [
  {theme: 'light', viewport: {width: 390, height: 844}},
  {theme: 'dark', viewport: {width: 1440, height: 900}}
];

try {
  for (const {theme, viewport} of configurations) {
    const context = await browser.newContext({colorScheme: theme, viewport, ignoreHTTPSErrors: false});
    await context.addInitScript(mode => {
      localStorage.setItem('swa-theme', mode);
      localStorage.setItem('theme', mode);
    }, theme);
    const page = await context.newPage();
    const runtimeErrors = [];
    const assetFailures = [];
    page.on('pageerror', error => runtimeErrors.push(String(error)));
    page.on('response', response => {
      const {pathname} = new URL(response.url());
      if (/\\.(?:js|css)(?:$|\\?)/i.test(pathname) && response.status() >= 400) {
        assetFailures.push(response.status() + ' ' + pathname);
      }
    });
    await page.route(/^https:\/\/(?:www\.)?skunkworksacademy\.com\/.*$/i, async route => {
      const url = new URL(route.request().url());
      const local = origin + url.pathname + url.search;
      try {
        const response = await page.request.fetch(local, {failOnStatusCode: false});
        await route.fulfill({response});
      } catch {
        await route.abort();
      }
    });
    await page.route(/^https:\/\/portal\.skunkworksacademy\.com\/api\/course-access(?:\?|$)/i, route =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        headers: {'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true'},
        body: JSON.stringify({allowed: false, reason: 'Sign in to continue'})
      })
    );
    for (const course of courses) {
      const label = course.courseId + ' ' + course.path + ' (' + theme + '/' + viewport.width + 'px)';
      try {
        const response = await page.goto(origin + course.path, {waitUntil: 'domcontentloaded', timeout: 20000});
        if (!response || !response.ok()) throw new Error('Course route returned non-2xx status.');
        await page.waitForSelector('.swa-global-nav', {state: 'visible', timeout: 6000});
        await page.waitForSelector('.swa-global-footer', {state: 'attached', timeout: 6000});
        await page.evaluate(mode => {
          document.documentElement.setAttribute('data-theme', mode);
          document.documentElement.setAttribute('data-swa-theme', mode);
        }, theme);
        const result = await page.evaluate(() => ({
          nav: document.querySelectorAll('.swa-global-nav').length,
          footer: document.querySelectorAll('.swa-global-footer').length,
          h1: [...document.querySelectorAll('h1')].filter(el => el.getBoundingClientRect().height > 0).length,
          width: document.documentElement.scrollWidth,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
          courseLink: Boolean([...document.querySelectorAll('.swa-global-nav a')]
            .some(el => (el.getAttribute('href') || '').includes('/courses/')))
        }));
        if (result.nav !== 1 || result.footer !== 1) {
          throw new Error('Expected exactly one Academy header/footer; found ' + result.nav + '/' + result.footer);
        }
        if (result.h1 < 1) throw new Error('No visible H1.');
        if (result.width > viewport.width + 3) {
          throw new Error('Horizontal viewport overflow ' + result.width + 'px > ' + viewport.width + 'px.');
        }
        if (result.canonical !== 'https://www.skunkworksacademy.com' + course.path) {
          throw new Error('Canonical course URL incorrect: ' + result.canonical);
        }
        if (!result.courseLink) throw new Error('The global header does not link to the Academy course catalogue.');
        if (course.module) {
          const navigation = page.locator('nav[aria-label="GitHub Pages Setup module navigation"]');
          await navigation.first().waitFor({state: 'visible', timeout: 5000});
          if (await page.locator('img[src*="ghp-dom-101"]').count() < 1) {
            throw new Error('Illustrated module is missing the expected visual learning aid.');
          }
          const imageState = await page.locator('img[src*="ghp-dom-101"]').first().evaluate(image => ({
            loaded: image.complete && image.naturalWidth > 0,
            hasAlt: Boolean(image.getAttribute('alt'))
          }));
          if (!imageState.loaded || !imageState.hasAlt) {
            throw new Error('Illustrated module image failed to load or lacks accessible alternative text.');
          }
        }


        if (course.courseId === 'ART-101') {
          if (await page.locator('a[href*="portal.skunkworksacademy.com"]').count() < 1) {
            throw new Error('Public ART-101 page has no portal registration link.');
          }
        } else {
          const link = page.locator('.accessGateActions a[href*="courseId="]').first();
          await link.waitFor({state: 'attached', timeout: 6000});
          const href = await link.getAttribute('href');
          if (!href || !href.includes('courseId=' + encodeURIComponent(course.courseId))) {
            throw new Error('Course registration CTA lacks scoped course ID.');
          }
        }

        await page.addScriptTag({content: axe.source});
        const audit = await page.evaluate(async () =>
          window.axe.run(document, {runOnly: {type: 'rule', values: ['color-contrast']}})
        );
        if (audit.violations.length) {
          const issues = audit.violations.flatMap(violation =>
            violation.nodes.slice(0, 5).map(node => node.target.join(' ') + ': ' + (node.failureSummary || violation.help))
          );
          throw new Error('WCAG text contrast violations: ' + issues.join(' | '));
        }
        console.log('PASS ' + label + ': shared chrome, registration, route, responsive layout and axe contrast');
      } catch (error) {
        const reason = error?.message || String(error);
        problems.push(label + ': ' + reason);
        console.error('FAIL ' + problems.at(-1));
        if (/swa-global-nav|swa-global-footer|accessGateActions/.test(reason)) {
          const diagnostics = await page.evaluate(() => ({
            url: location.href,
            readyState: document.readyState,
            navNodes: document.querySelectorAll('.swa-global-nav').length,
            footerNodes: document.querySelectorAll('.swa-global-footer').length,
            accessState: [...document.querySelectorAll('.accessGate')].map(el => el.textContent.trim().slice(0,180)),
            accessActionNodes: document.querySelectorAll('.accessGateActions').length,
            scripts: [...document.scripts].map(script => script.getAttribute('src') || '')
              .filter(src => /academy-navigation|skunkworks-(?:ui|footer)/.test(src)),
            bodyAttributes: [...document.body.attributes].map(a => a.name + '=' + a.value)
          })).catch(e => ({error: String(e)}));
          console.error('ACADEMY-SHELL-DIAGNOSTICS ' + JSON.stringify({label, diagnostics, runtimeErrors, assetFailures}));
          throw new Error('Required Academy chrome or enrollment controls are unavailable on ' + label + '; aborting remaining cases with diagnostics.');
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

if (problems.length) {
  console.error('Course browser publication gate failed for ' + problems.length + ' case(s).');
  process.exit(1);
}
console.log('Course browser publication gate passed for ' + courses.length + ' courses in both light/mobile and dark/desktop modes.');
