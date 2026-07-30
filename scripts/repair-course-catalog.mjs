import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync, gzipSync, inflateRawSync } from 'node:zlib';

const catalogPath = join(process.cwd(), 'assets/course-catalog.generated.js');
const source = readFileSync(catalogPath, 'utf8');
const match = source.match(/const\s+encoded\s*=\s*['"]([A-Za-z0-9+/=]+)['"]/);

if (!match) {
  throw new Error('The generated course catalogue does not contain an encoded payload.');
}

const compressed = Buffer.from(match[1], 'base64');

function findDeflateBody(buffer) {
  if (buffer.length < 18 || buffer[0] !== 0x1f || buffer[1] !== 0x8b || buffer[2] !== 0x08) {
    throw new Error('The encoded catalogue is not a supported gzip stream.');
  }

  const flags = buffer[3];
  let offset = 10;

  if (flags & 0x04) {
    const extraLength = buffer.readUInt16LE(offset);
    offset += 2 + extraLength;
  }
  if (flags & 0x08) {
    while (offset < buffer.length && buffer[offset++] !== 0);
  }
  if (flags & 0x10) {
    while (offset < buffer.length && buffer[offset++] !== 0);
  }
  if (flags & 0x02) offset += 2;

  const footerOffset = buffer.length - 8;
  if (offset >= footerOffset) throw new Error('The gzip stream does not contain a deflate payload.');
  return buffer.subarray(offset, footerOffset);
}

let jsonBuffer;
let recovered = false;

try {
  jsonBuffer = gunzipSync(compressed);
} catch (error) {
  jsonBuffer = inflateRawSync(findDeflateBody(compressed));
  recovered = true;
  console.warn(`Recovered catalogue data from a gzip stream with an invalid checksum: ${error.message}`);
}

const payload = JSON.parse(jsonBuffer.toString('utf8'));
if (!Array.isArray(payload.fields) || !Array.isArray(payload.courses)) {
  throw new Error('The recovered course catalogue payload is malformed.');
}

const canonicalJson = JSON.stringify(payload);
const canonicalEncoded = gzipSync(Buffer.from(canonicalJson), { level: 9 }).toString('base64');
const output = `window.SKUNKWORKS_COURSE_CATALOG_PROMISE = (async () => {\n  const encoded = '${canonicalEncoded}';\n  const compressed = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));\n  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));\n  return JSON.parse(await new Response(stream).text());\n})();\n`;

if (output !== source) {
  writeFileSync(catalogPath, output, 'utf8');
  console.log(`Course catalogue asset regenerated with a valid gzip checksum (${payload.courses.length} courses).`);
} else {
  console.log(`Course catalogue asset is already canonical (${payload.courses.length} courses).`);
}

if (recovered) console.log('The invalid source checksum was repaired successfully.');
