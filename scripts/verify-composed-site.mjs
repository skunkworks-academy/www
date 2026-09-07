import http from "node:http";
import https from "node:https";

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

function request(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const target = url instanceof URL ? url : new URL(url);
    const transport = target.protocol === "https:" ? https : http;

    const req = transport.get(target, {
      headers: {
        "user-agent": "skunkworks-academy-composite-verifier/1.0",
        "accept": "*/*"
      }
    }, response => {
      const status = response.statusCode || 0;
      const location = response.headers.location;

      if (status >= 300 && status < 400 && location) {
        response.resume();
        if (redirects >= 5) {
          reject(new Error(`Too many redirects for ${target}`));
          return;
        }
        resolve(request(new URL(location, target), redirects + 1));
        return;
      }

      const chunks = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve({
          ok: status >= 200 && status < 300,
          status,
          headers: {
            get(name) {
              const value = response.headers[String(name).toLowerCase()];
              return Array.isArray(value) ? value.join(", ") : (value || "");
            }
          },
          async text() {
            return body.toString("utf8");
          }
        });
      });
    });

    req.setTimeout(15000, () => {
      req.destroy(new Error(`HTTP request timed out for ${target}`));
    });
    req.on("error", reject);
  });
}

async function get(url, context) {
  const response = await request(url);
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
