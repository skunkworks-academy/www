import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { inflateSync } from 'node:zlib';
const visualBaseline = JSON.parse(fs.readFileSync(new URL('./platform-visual-baseline.json', import.meta.url), 'utf8'));

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Unexpected screenshot format: PNG signature missing');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (bitDepth !== 8 || interlace !== 0 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported screenshot PNG format: bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const inflated = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * stride);
  let inputOffset = 0;

  for (let y = 0; y < height; y++) {
    const filter = inflated[inputOffset++];
    const rowStart = y * stride;
    const prevStart = (y - 1) * stride;

    for (let x = 0; x < stride; x++) {
      const raw = inflated[inputOffset++];
      const left = x >= channels ? pixels[rowStart + x - channels] : 0;
      const up = y > 0 ? pixels[prevStart + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[prevStart + x - channels] : 0;

      let value;
      if (filter === 0) value = raw;
      else if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + up;
      else if (filter === 3) value = raw + Math.floor((left + up) / 2);
      else if (filter === 4) value = raw + paethPredictor(left, up, upLeft);
      else throw new Error(`Unsupported PNG filter type ${filter}`);

      pixels[rowStart + x] = value & 0xff;
    }
  }

  return { width, height, channels, data: pixels };
}

function pixelLuma(png, x, y) {
  const offset = (y * png.width + x) * png.channels;
  const r = png.data[offset];
  const g = png.data[offset + 1];
  const b = png.data[offset + 2];
  return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function screenshotFingerprint(buffer) {
  const png = decodePng(buffer);
  let bits = 0n;
  for (let gy = 0; gy < 8; gy++) {
    const y = Math.min(png.height - 1, Math.floor((gy + 0.5) * png.height / 8));
    const row = [];
    for (let gx = 0; gx < 9; gx++) {
      const x = Math.min(png.width - 1, Math.floor((gx + 0.5) * png.width / 9));
      row.push(pixelLuma(png, x, y));
    }
    for (let gx = 0; gx < 8; gx++) {
      bits = (bits << 1n) | (row[gx] > row[gx + 1] ? 1n : 0n);
    }
  }

  const samples = [];
  for (let gy = 0; gy < 8; gy++) {
    const y = Math.min(png.height - 1, Math.floor((gy + 0.5) * png.height / 8));
    for (let gx = 0; gx < 8; gx++) {
      const x = Math.min(png.width - 1, Math.floor((gx + 0.5) * png.width / 8));
      samples.push(pixelLuma(png, x, y));
    }
  }

  return {
    width: png.width,
    height: png.height,
    dhash: bits.toString(16).padStart(16, '0'),
    avgLuma: samples.reduce((sum, value) => sum + value, 0) / samples.length,
  };
}

function hammingHex(a, b) {
  let value = BigInt('0x' + a) ^ BigInt('0x' + b);
  let count = 0;
  while (value) {
    count += Number(value & 1n);
    value >>= 1n;
  }
  return count;
}

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

      const screenshotPath = testInfo.outputPath(`${surface}-${viewportName}.png`);
      const screenshot = await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      const key = `${surface}-${viewportName}`;
      const approved = visualBaseline.cases[key];
      expect(approved, `missing approved visual baseline for ${key}`).toBeTruthy();

      const current = screenshotFingerprint(screenshot);
      expect(current.width, `${key} screenshot width drifted`).toBe(approved.width);

      const heightDelta = Math.abs(current.height - approved.height) / approved.height;
      expect(
        heightDelta,
        `${key} page-height drift ${(heightDelta * 100).toFixed(1)}% exceeds approved tolerance`
      ).toBeLessThanOrEqual(visualBaseline.maxHeightRatioDelta);

      const hashDistance = hammingHex(current.dhash, approved.dhash);
      expect(
        hashDistance,
        `${key} perceptual screenshot distance ${hashDistance} exceeds approved tolerance`
      ).toBeLessThanOrEqual(visualBaseline.maxDHashDistance);

      const lumaDelta = Math.abs(current.avgLuma - approved.avgLuma);
      expect(
        lumaDelta,
        `${key} average luminance drift ${lumaDelta.toFixed(1)} exceeds approved tolerance`
      ).toBeLessThanOrEqual(visualBaseline.maxAverageLumaDelta);
    });
  }
}
