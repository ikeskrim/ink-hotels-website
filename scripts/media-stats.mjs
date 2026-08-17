import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const MEDIA = path.join(process.cwd(), "public", "media");
const files = fs.readdirSync(MEDIA).filter((f) => /\.(webp|jpg)$/i.test(f));

let total = 0;
const rows = [];
for (const f of files) {
  const p = path.join(MEDIA, f);
  const bytes = fs.statSync(p).size;
  total += bytes;
  const { width, height } = await sharp(p).metadata();
  rows.push({ f, bytes, width, height });
}

rows.sort((a, b) => b.bytes - a.bytes);
console.log(`${files.length} files · ${(total / 1e6).toFixed(1)} MB total`);
console.log(`\nwidest: ${Math.max(...rows.map((r) => r.width))}px`);
console.log(`over 2400px wide: ${rows.filter((r) => r.width > 2400).length}`);
console.log(`over 1MB: ${rows.filter((r) => r.bytes > 1e6).length}`);
console.log("\n10 largest:");
for (const r of rows.slice(0, 10)) {
  console.log(
    `  ${r.f.slice(0, 16)}  ${String(r.width).padStart(5)}x${String(r.height).padEnd(5)}  ${(r.bytes / 1e3).toFixed(0)} kB`,
  );
}
