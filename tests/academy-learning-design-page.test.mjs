import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = name => path.join(root, name);
const read = name => fs.readFileSync(file(name), "utf8");
const html = read("plugins/academy-learning-design/index.html");
const css = read("assets/academy-learning-design.css");
const js = read("assets/academy-learning-design.js");
const nav = read("assets/skunkworks-ui.js");
const loader = read("assets/academy-navigation.js");
const navRuntime = read("assets/academy-navigation-v11.js");
const sitemap = read("sitemap.xml");
const publisherPolicy = JSON.parse(read("publisher-policy.json"));
const route = "https://www.skunkworksacademy.com/plugins/academy-learning-design/";
const pluginUrl = "https://chatgpt.com/plugins/plugins_6ae6fd252188819198e31f3bb07995b7";

test("Landing route has exactly one canonical, clear metadata and real plugin CTA", () => {
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html[^>]*lang="en-ZA"/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<meta name="description" content="[^"]{80,}"/);
  assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes('href="' + route + '"'), "Canonical route mismatch");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('href="' + pluginUrl + '"'), "CTA must use verified plugin link");
  assert.match(html, /\bPrivate plugin\b/);
  assert.match(html, /\bAccess is limited to authorised users\b/);
  assert.match(html, /does not independently edit GitHub repositories/i);
});

test("Global Academy shell, footer, sitemap and navigation are integrated", () => {
  assert.equal((html.match(/data-skunkworks-global-nav="v10"/g) || []).length, 1);
  assert.equal((html.match(/data-skunkworks-brand-theme="canonical"/g) || []).length, 1);
  assert.ok(html.includes('/assets/academy-navigation.js'), "Global navigation script missing");
  assert.ok(loader.includes("academy-navigation-v11.js"), "Global shell must load the shared runtime");
  assert.ok(navRuntime.includes("skunkworks-footer.js"), "Shared runtime must install canonical Academy footer");
  const expectedRoute = new URL(route);
  const expectedOriginAndPath = expectedRoute.origin + expectedRoute.pathname;
  const navUrls = [...nav.matchAll(/https:\/\/[^\s"'`)<]+/g)].map(m => m[0]);
  const hasExpectedRoute = navUrls.some((raw) => {
    try {
      const parsed = new URL(raw);
      return (parsed.origin + parsed.pathname) === expectedOriginAndPath;
    } catch {
      return false;
    }
  });
  assert.ok(hasExpectedRoute, "Global navigation/search destination missing");
  assert.ok(publisherPolicy.indexablePages.includes("plugins/academy-learning-design/index.html"), "Publisher policy must own indexable page");
  assert.equal(publisherPolicy.lastModifiedOverrides["plugins/academy-learning-design/index.html"],"2026-11-01");
  assert.ok(sitemap.includes('<loc>' + route + '</loc>'), "Sitemap missing plugin route");
  assert.equal(sitemap.split('<loc>' + route + '</loc>').length - 1, 1);
  assert.ok(html.includes('href="/privacy.html"'));
  assert.ok(html.includes('href="/terms.html"'));
  assert.ok(fs.existsSync(file("privacy.html")));
  assert.ok(fs.existsSync(file("terms.html")));
});

test("Accessible sections, theme hooks and responsive styles exist", () => {
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /class="ald-skip" href="#main-content"/);
  for (const id of ["capabilities", "workflow", "standards", "example", "faq"]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing " + id + " destination");
    assert.ok(html.includes('href="#' + id + '"'), "Missing " + id + " in-page link");
  }
  assert.match(css, /data-theme="dark"/);
  assert.match(css, /prefers-color-scheme:dark/);
  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /--ald-surface:\s*var\(--sk-layer-01/);
  assert.match(css, /\.ald-hero h1\s*\{\s*color:#fff/);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(x => x[0]);
  assert.ok(imgs.length >= 1, "Visual illustration missing");
  for (const img of imgs) assert.match(img, /\balt="[^"]+"/, "Every image requires alt text");
  assert.ok(fs.existsSync(file("assets/plugins/academy-learning-design.svg")));
  const visual = read("assets/plugins/academy-learning-design.svg");
  assert.match(visual, /<title\b/);
  assert.match(visual, /<desc\b/);
});

test("Copy prompt is functional and announces success or failure", () => {
  assert.match(html, /id="ald-copy-prompt"/);
  assert.match(html, /id="ald-prompt-text"/);
  assert.match(html, /id="ald-copy-status" role="status" aria-live="polite"/);
  assert.match(js, /addEventListener\("click"/);
  assert.match(js, /navigator\.clipboard\.writeText/);
  assert.match(js, /Clipboard access is unavailable/);
  assert.match(html, /Skunkworks Academy course on GitHub Pages deployment/);
});

test("Public page does not assert unsupported certification or private access", () => {
  assert.doesNotMatch(html, /\b(?:ISO[\s-]?certified|certified by ISO|WCAG compliant)\b/i);
  assert.match(html, /does not establish ISO certification/);
  assert.match(html, /privately available, skills-based plugin/);
  assert.match(html, /data-ad-inventory="ineligible"/);
  assert.ok(!html.includes("onclick="), "No inline click handlers");
  assert.ok(!html.includes("javascript:"), "No unsafe navigation schemes");
});

test("JSON-LD is valid and identifies the current plugin version", () => {
  const script = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(script, "Structured data missing");
  const data = JSON.parse(script[1]);
  assert.ok(data["@graph"].some(entry => entry["@type"] === "SoftwareApplication" && entry.url === pluginUrl && entry.softwareVersion === "0.1.1"));
});
