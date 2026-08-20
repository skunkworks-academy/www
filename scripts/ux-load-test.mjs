import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = 4173;
const routes = [
  '/',
  '/catalogue/',
  '/plans-and-purchases/',
  '/forms/',
  '/course-registration/',
  '/course-registration/thank-you.html?redirect=0',
  '/course-registration/skunkworks-academy-cyber-security-training-email.html',
  '/microsoft/',
  '/google/',
  '/redhat/',
  '/repositories/',
];
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};

const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const safe = normalize(pathname).replace(/^([.][.][/\\])+/, '');
    let file = join(root, safe);
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, {'content-type': mime[extname(file)] || 'application/octet-stream', 'cache-control':'no-store'});
    res.end(data);
  } catch {
    res.writeHead(404, {'content-type':'text/plain'});
    res.end('Not found');
  }
});

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));

try {
  const routeResults = await Promise.all(routes.map(async route => {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, {redirect:'manual'});
    return {route, status: response.status, ms: Number(response.headers.get('server-timing') || 0)};
  }));
  const broken = routeResults.filter(result => result.status >= 400);
  if (broken.length) throw new Error(`Broken routes: ${broken.map(x => `${x.route}=${x.status}`).join(', ')}`);

  const total = 250;
  const concurrency = 25;
  const timings = [];
  let cursor = 0;
  async function worker() {
    while (cursor < total) {
      cursor += 1;
      const started = performance.now();
      const response = await fetch(`http://127.0.0.1:${port}/`, {cache:'no-store'});
      await response.arrayBuffer();
      timings.push(performance.now() - started);
      if (!response.ok) throw new Error(`Load request failed with ${response.status}`);
    }
  }
  await Promise.all(Array.from({length:concurrency}, worker));
  timings.sort((a,b) => a-b);
  const avg = timings.reduce((a,b) => a+b,0) / timings.length;
  const p95 = timings[Math.floor(timings.length * .95) - 1];
  const max = timings.at(-1);
  console.log(JSON.stringify({routes:routeResults, requests:total, concurrency, avgMs:+avg.toFixed(2), p95Ms:+p95.toFixed(2), maxMs:+max.toFixed(2)}, null, 2));
  if (p95 > 1000) throw new Error(`Local p95 ${p95.toFixed(0)}ms exceeds 1000ms threshold`);
} finally {
  server.close();
}
