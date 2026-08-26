import { writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";

const size = 512;
const pixels = Buffer.alloc(size * size * 4);
const colour = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255];
const bg = colour("#08111f");

function set(x, y, rgba) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const at = (y * size + x) * 4;
  pixels.set(rgba, at);
}
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
function roundedInside(x, y, left, top, right, bottom, radius) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}
function line(x1, y1, x2, y2, width, rgba) {
  const half = width / 2;
  for (let y = Math.floor(y1 - half); y <= Math.ceil(y2 + half); y++) for (let x = Math.floor(x1 - half); x <= Math.ceil(x2 + half); x++) {
    const px = Math.max(x1, Math.min(x, x2));
    const py = Math.max(y1, Math.min(y, y2));
    if ((x - px) ** 2 + (y - py) ** 2 <= half ** 2) set(x, y, rgba);
  }
}
function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) set(x, y, bg);
const violet = colour("#7c3aed"), cyan = colour("#06b6d4"), white = colour("#eef6ff");
for (let y = 96; y <= 416; y++) for (let x = 108; x <= 404; x++) {
  const outer = roundedInside(x, y, 108, 96, 404, 416, 42);
  const inner = roundedInside(x, y, 140, 128, 372, 384, 20);
  if (outer && !inner) set(x, y, mix(violet, cyan, (x + y - 204) / 616));
}
line(178, 184, 334, 184, 24, white);
line(178, 242, 290, 242, 24, white);
line(178, 300, 334, 300, 24, white);
const pointer = [[302, 324], [384, 358], [346, 376], [328, 414]];
for (let y = 316; y <= 422; y++) for (let x = 294; x <= 392; x++) if (pointInPolygon(x, y, pointer)) set(x, y, mix(violet, cyan, (x - 294) / 98));

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data = Buffer.alloc(0)) {
  const name = Buffer.from(type); const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0); name.copy(out, 4); data.copy(out, 8); out.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8); return out;
}
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr.set([8, 6, 0, 0, 0], 8);
const raw = Buffer.alloc((size * 4 + 1) * size);
for (let y = 0; y < size; y++) { const row = y * (size * 4 + 1); raw[row] = 0; pixels.copy(raw, row + 1, y * size * 4, (y + 1) * size * 4); }
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND")]);
await writeFile(new URL("../assets/logo.png", import.meta.url), png);
console.log("Generated assets/logo.png");
