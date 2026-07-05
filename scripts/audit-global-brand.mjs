#!/usr/bin/env node
/*
  Skunkworks Academy brand governance audit.
  Flags page-level style blocks, non-canonical CSS links, and deprecated data-brand usage.
*/

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "dist", "build", ".next"]);
const allowedCss = new Set([
  "/assets/skunkworks-design-system.css",
  "/faculty/assets/css/skunkworks-design-system.css"
]);

const findings = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!/\.(html|css|js|mjs)$/i.test(entry.name)) continue;
    await auditFile(full);
  }
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function add(file, rule, detail) {
  findings.push({ file: rel(file), rule, detail });
}

async function auditFile(file) {
  const text = await readFile(file, "utf8");
  const relative = rel(file);

  if (relative === "assets/skunkworks-design-system.css" || relative === "assets/skunkworks-ui.js") return;

  if (relative.endsWith(".html")) {
    if (/<style[\s>]/i.test(text)) add(file, "inline-style", "Move page-level CSS into /assets/skunkworks-design-system.css.");
    if (/data-brand=/i.test(text)) add(file, "deprecated-data-brand", "Use data-format and data-theme instead of data-brand.");

    const links = [...text.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
    for (const [, href] of links) {
      if (!allowedCss.has(href)) add(file, "non-canonical-css", `Stylesheet ${href} is not canonical.`);
    }
  }

  if (relative.endsWith(".css") && relative !== "faculty/assets/css/skunkworks-design-system.css") {
    if (/--(primary|accent|bg|text|muted|border)-color\s*:/i.test(text)) add(file, "legacy-theme-tokens", "Use --sk-* tokens from the global design system.");
  }
}

await walk(root);

if (findings.length) {
  console.error("Skunkworks global brand audit failed:\n");
  for (const finding of findings) {
    console.error(`- ${finding.file} [${finding.rule}] ${finding.detail}`);
  }
  process.exitCode = 1;
} else {
  console.log("Skunkworks global brand audit passed.");
}
