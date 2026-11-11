import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'partners/index.html'), 'utf8');
const expect = (condition, message) => { if (!condition) throw new Error(message); };
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1] ?? '';
const robots = html.match(/<meta\s+name="robots"[^>]*>/i)?.[0] ?? '';
const canonical = html.match(/<link\s+rel="canonical"[^>]*>/i)?.[0] ?? '';
const description = html.match(/<meta\s+name="description"[^>]*>/i)?.[0] ?? '';

expect(attr(robots, 'content') === 'index, follow', 'partners page must be indexable');
expect(attr(canonical, 'href') === 'https://www.skunkworksacademy.com/partners/', 'partners canonical URL is incorrect');
expect(attr(description, 'content').length >= 50, 'partners page needs a descriptive meta description');
expect((html.match(/<h1\b/gi) ?? []).length === 1, 'partners page must have exactly one h1');

const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map((match) => match[1]);
for (const href of ['/contact.html', '/courses', '/google/', '/ibm/', '/redhat/', '/comptia/']) {
  expect(links.includes(href), `missing required partners link: ${href}`);
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
expect(images.length >= 4, 'partners page must show the featured partner badges');
for (const image of images) expect(attr(image, 'alt').trim(), `partner image is missing alt text: ${attr(image, 'src')}`);
console.log(`Partners page validation passed (${images.length} badge images; ${links.length} links).`);
