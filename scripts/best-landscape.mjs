/**
 * List the highest-resolution landscape images in the library — the only ones
 * fit for a full-bleed hero.  node scripts/best-landscape.mjs [minWidth]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const MEDIA = path.join(process.cwd(), "public", "media");
const MIN = Number(process.argv[2] ?? 2000);

const files = fs.readdirSync(MEDIA).filter((f) => /\.(webp|jpg)$/i.test(f));
const rows = [];

for (const f of files) {
  try {
    const m = await sharp(path.join(MEDIA, f)).metadata();
    const w = m.width ?? 0;
    const h = m.height ?? 0;
    if (w >= MIN && w > h) {
      rows.push({ f, w, h, ratio: (w / h).toFixed(2) });
    }
  } catch {
    /* skip unreadable */
  }
}

rows.sort((a, b) => b.w - a.w);
console.log(`${rows.length} landscape images at >= ${MIN}px wide\n`);
for (const r of rows) {
  console.log(`${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${r.ratio}  ${r.f}`);
}
