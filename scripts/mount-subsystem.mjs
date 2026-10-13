import fs from "node:fs";
import path from "node:path";

function readArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const [rawKey, inline] = token.slice(2).split("=", 2);
    const value = inline ?? argv[++i];
    out[rawKey] = value;
  }
  return out;
}

const args = readArgs(process.argv);

function safeRelative(value, label, { allowEmpty = false } = {}) {
  const raw = String(value ?? "");
  if (!raw && allowEmpty) return "";
  if (!raw) throw new Error(`${label} is required`);
  if (path.isAbsolute(raw) || raw.includes("\\")) {
    throw new Error(`${label} must be a forward-slash relative path`);
  }

  const normalized = raw.replace(/^\/+|\/+$/g, "");
  const segments = normalized.split("/");
  const validSegment = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
  if (!segments.length || segments.some(segment => segment === "." || segment === ".." || !validSegment.test(segment))) {
    throw new Error(`${label} must be a relative path without dot/traversal segments`);
  }
  return normalized;
}

const source = path.resolve(args.source || "");
const mount = safeRelative(args.mount, "mount");
const landing = safeRelative(args.landing || `${mount}.html`, "landing");
const manifest = safeRelative(args.manifest || "", "manifest", { allowEmpty: true });
const assetDirs = String(args["asset-dirs"] || "assets,img,downloads")
  .split(",")
  .map(value => safeRelative(value.trim(), "asset directory"))
  .filter(Boolean);

if (!args.source || !mount) {
  throw new Error("Usage: node scripts/mount-subsystem.mjs --source <build> --mount <route> [--landing route.html] [--manifest file]");
}
if (!fs.existsSync(source)) throw new Error(`Subsystem source does not exist: ${source}`);

const targetMount = path.resolve(mount);
fs.rmSync(targetMount, { recursive: true, force: true });
fs.mkdirSync(targetMount, { recursive: true });

const routedSource = path.join(source, mount);
if (fs.existsSync(routedSource) && fs.statSync(routedSource).isDirectory()) {
  fs.cpSync(routedSource, targetMount, { recursive: true });
}

const landingSource = path.join(source, landing);
if (fs.existsSync(landingSource)) {
  fs.copyFileSync(landingSource, path.resolve(landing));
  fs.copyFileSync(landingSource, path.join(targetMount, "index.html"));
}

for (const dir of assetDirs) {
  const src = path.join(source, dir);
  if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) continue;
  const dest = path.join(targetMount, dir);
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

if (manifest) {
  const src = path.join(source, manifest);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.resolve(manifest));
    fs.copyFileSync(src, path.join(targetMount, path.basename(manifest)));
  }
}

const replacements = new Map(assetDirs.map(dir => [
  `="/${dir}/`,
  `="/${mount}/${dir}/`
]));
if (manifest) {
  replacements.set(`="/${manifest}"`, `="/${mount}/${path.basename(manifest)}"`);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(targetMount);
const rootLanding = path.resolve(landing);
if (fs.existsSync(rootLanding) && !htmlFiles.includes(rootLanding)) {
  htmlFiles.push(rootLanding);
}

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) html = html.split(from).join(to);
  fs.writeFileSync(file, html);
}

const index = path.join(targetMount, "index.html");
if (!fs.existsSync(index)) throw new Error(`Mounted subsystem did not produce /${mount}/index.html`);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const dir of assetDirs) {
    if (html.includes(`="/${dir}/`)) {
      throw new Error(`${file} leaks root /${dir}/ references; subsystem assets must remain under /${mount}/${dir}/`);
    }
  }
}

const isolatedAssets = assetDirs
  .filter(dir => fs.existsSync(path.join(targetMount, dir)))
  .map(dir => `/${mount}/${dir}`);

console.log(JSON.stringify({
  source,
  mount: `/${mount}`,
  htmlDocuments: htmlFiles.length,
  isolatedAssets
}, null, 2));
