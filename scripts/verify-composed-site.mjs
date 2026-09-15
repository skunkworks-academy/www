function readArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const [key, inline] = token.slice(2).split("=", 2);
    out[key] = inline ?? argv[++i];
  }
  return out;
}

const args = readArgs(process.argv);
const baseUrl = new URL(args["base-url"] || "http://127.0.0.1:4174/");
const routes = String(args.routes || "/,/courses/,/learn/,/ibm/,/microsoft/,/cisco/,/comptia/,/course-registration/,/forms/,/self-paced/,/slides/")
  .split(",").map(v => v.trim()).filter(Boolean);

const academyHosts = new Set([
  "skunkworksacademy.com",
  "www.skunkworksacademy.com",
  baseUrl.hostname
]);

function extractAssets(html) {
  const refs = new Set();
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"'#]+)["'][^>]*>/gi)) {
    const ref = match[1];
    if (/\.(?:css|js)(?:[?#].*)?$/i.test(ref)) refs.add(ref);
  }
  return [...refs];
}

async function get(url, context) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${context}: HTTP ${response.status} for ${url}`);
  return response;
}

function assertAssetContentType(response, url) {
  const pathname = new URL(url).pathname.toLowerCase();
  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  if (pathname.endsWith(".css") && !contentType.startsWith("text/css")) {
    throw new Error(`CSS asset returned unexpected Content-Type ${contentType || "<missing>"} for ${url}`);
  }

  if (
    pathname.endsWith(".js") &&
    !/^(?:text|application)\/(?:javascript|x-javascript)(?:;|$)/i.test(contentType)
  ) {
    throw new Error(`JavaScript asset returned unexpected Content-Type ${contentType || "<missing>"} for ${url}`);
  }
}

const failures = [];
let checkedAssets = 0;

for (const route of routes) {
  try {
    const routeUrl = new URL(route, baseUrl);
    const response = await get(routeUrl, `route ${route}`);
    const html = await response.text();

    if (!/<html\b/i.test(html)) throw new Error(`route ${route} did not return an HTML document`);

    const assets = extractAssets(html);
    if (route.startsWith("/courses") && !assets.some(ref => ref.includes("/courses/assets/"))) {
      throw new Error("course catalogue does not reference isolated /courses/assets resources");
    }

    for (const ref of assets) {
      const resolved = new URL(ref, routeUrl);
      if (!academyHosts.has(resolved.hostname)) continue;

      const localUrl = new URL(resolved.pathname + resolved.search, baseUrl);
      const assetResponse = await get(localUrl, `asset referenced by ${route}`);
      // Drain each response before opening the next request. Unread bodies can
      // leave the HTTP parser paused when the preview server closes its socket.
      await assetResponse.arrayBuffer();
      assertAssetContentType(assetResponse, localUrl);
      checkedAssets += 1;
    }
  } catch (error) {
    failures.push(String(error?.message || error));
  }
}

if (failures.length) {
  console.error("Composite site verification failed:");
  failures.forEach(failure => console.error(" -", failure));
  process.exit(1);
}

console.log(`Composite site verification passed for ${routes.length} routes and ${checkedAssets} same-origin CSS/JS references.`);
