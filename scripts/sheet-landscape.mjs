/** Contact sheet of the highest-res landscape images. node scripts/sheet-landscape.mjs out.png start count [minW] */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , out, startS = "0", countS = "24", minS = "2200"] = process.argv;
const MEDIA = path.join(process.cwd(), "public", "media");
const MIN = Number(minS);

const all = [];
for (const f of fs.readdirSync(MEDIA).filter((f) => /\.(webp|jpg)$/i.test(f))) {
  try {
    const m = await sharp(path.join(MEDIA, f)).metadata();
    if ((m.width ?? 0) >= MIN && (m.width ?? 0) > (m.height ?? 0)) all.push(f);
  } catch {}
}
all.sort();

const files = all.slice(Number(startS), Number(startS) + Number(countS));
const COLS = 6;
const CELL = 300;
const LABEL = 22;
const ROWS = Math.ceil(files.length / COLS);

const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(path.join(MEDIA, f)).resize(CELL, CELL - LABEL, { fit: "cover" }).toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  })),
);
const labels = files.map((f, i) => ({
  input: Buffer.from(
    `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="4" y="15" font-family="monospace" font-size="12" fill="#5fbecf">${Number(startS) + i} ${f.slice(0, 14)}</text></svg>`,
  ),
  left: (i % COLS) * CELL,
  top: Math.floor(i / COLS) * CELL + (CELL - LABEL),
}));

await sharp({ create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: "#1a1a1a" } })
  .composite([...tiles, ...labels])
  .png()
  .toFile(out);

console.log(`${files.length} of ${all.length} landscape >= ${MIN}px → ${out}`);
