import fs from "node:fs";
import path from "node:path";

// Publish the independently built course site into the Academy Pages artifact.
// The Docusaurus build must have SKW_CANONICAL_SITE_URL set to the Academy URL.
// All course JS/CSS remains scoped to /digital-platform-courses/assets/.
const source = path.resolve(process.argv[2] || ".digital-platform-courses/build");
const mount = path.resolve("digital-platform-courses");
const basePath = "/digital-platform-courses/";
const publicOrigin = "https://www.skunkworksacademy.com";
const entries = [
  ["", "beginner/"],
  ["ai", "beginner/ai/"],
  ["cyber", "beginner/cyber/"],
  ["it-support", "beginner/it-support/"],
  ["microsoft-productivity", "beginner/microsoft-productivity/"],
  ["cloud", "beginner/cloud/"]
];
function assert(condition, explanation) {
  if (!condition) throw Error(explanation);
}
function eachFile(dir, callback) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) eachFile(full, callback);
    else if (item.isFile()) callback(full);
  }
}
function writeAlias(alias, destination) {
  const target = path.resolve("beginner", ...(alias ? [alias] : []), "index.html");
  const pathname = basePath + destination;
  const url = publicOrigin + pathname;
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>Skunkworks Academy — Beginner IT Courses</title>'
    + '<meta name="robots" content="noindex, follow">'
    + '<link rel="canonical" href="' + url + '">'
    + '<meta http-equiv="refresh" content="0;url=' + pathname + '">'
    + '</head><body><main><h1>Skunkworks Academy — Beginner IT Courses</h1>'
    + '<p>Continue to the Academy-hosted self-paced course.</p>'
    + '<p><a href="' + pathname + '">Open the course on Skunkworks Academy</a></p>'
    + '</main></body></html>';
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.writeFileSync(target, html);
}
assert(fs.existsSync(path.join(source, "index.html")), "Missing Docusaurus build/index.html");
assert(fs.existsSync(path.join(source, "assets")), "Missing Docusaurus assets");
assert(!fs.existsSync(mount), "Root /digital-platform-courses is owned by another subsystem");
const mainHtml = fs.readFileSync(path.join(source, "index.html"), "utf8");
assert(mainHtml.includes(publicOrigin + basePath),
  "Incorrect Docusaurus canonical origin or base path; refusing to publish github.io URLs on the Academy domain");
assert(!/rel=["']canonical["'][^>]+skunkworks-academy\.github\.io/i.test(mainHtml),
  "Course catalogue canonical points to github.io");
fs.cpSync(source, mount, {recursive:true});
let routes = 0;
eachFile(mount, file => {
  if (!file.endsWith(".html")) return;
  routes++;
  const rel = path.relative(mount, file).replaceAll(path.sep,"/");
  if (rel==="index.html" || rel.endsWith("/index.html") || rel==="404.html") return;
  // Docusaurus emits .html with trailingSlash:false. Also provide
  // a directory index for direct page loading on GitHub Pages.
  const routeIndex = path.join(mount, rel.slice(0,-5), "index.html");
  if (!fs.existsSync(routeIndex)) {
    fs.mkdirSync(path.dirname(routeIndex), {recursive:true});
    fs.copyFileSync(file, routeIndex);
  }
});
for (const [alias,dest] of entries) {
  assert(fs.existsSync(path.join(mount, dest, "index.html")),
    "Expected course route not in the build: " + dest);
  writeAlias(alias, dest);
}
let verifiedAssets = 0;
const re = /<(?:script|link)\b[^>]*(?:src|href)=["'](\/digital-platform-courses\/assets\/[^"'?#]+(?:\?[^"']*)?)["']/gi;
eachFile(mount, file => {
  if (!file.endsWith(".html")) return;
  const html = fs.readFileSync(file,"utf8");
  for (const match of html.matchAll(re)) {
    const clean = match[1].split("?")[0];
    const local = path.resolve("." + clean);
    assert(local.startsWith(mount + path.sep), "Unsafe asset resolution: " + clean);
    assert(fs.existsSync(local), "Missing course asset " + clean + " referenced by " + file);
    verifiedAssets++;
  }
});
assert(verifiedAssets > 0, "Course pages do not reference local isolated CSS/JS; inspect publicPath");
console.log("Mounted " + routes + " HTML documents and checked " + verifiedAssets + " assets under " + basePath);
