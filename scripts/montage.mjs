/** Tile screenshots into a review sheet.  node scripts/montage.mjs <dir> <glob-suffix> <out> <cols> */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , dir, suffix = "--desktop-fold.png", out = "montage.png", colsArg = "3"] =
  process.argv;
const COLS = Number(colsArg);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(suffix)).sort();

const W = 620;
const LABEL = 26;
const tiles = [];
let H = 0;

for (const f of files) {
  const buf = await sharp(path.join(dir, f)).resize({ width: W }).toBuffer();
  const meta = await sharp(buf).metadata();
  tiles.push({ f, buf, h: meta.height });
  H = Math.max(H, meta.height);
}

const ROWS = Math.ceil(tiles.length / COLS);
const CELL_H = H + LABEL;

const composite = [];
tiles.forEach((t, i) => {
  const left = (i % COLS) * W;
  const top = Math.floor(i / COLS) * CELL_H;
  composite.push({ input: t.buf, left, top: top + LABEL });
  const name = t.f.replace(suffix, "");
  composite.push({
    input: Buffer.from(
      `<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="18" font-family="monospace" font-size="14" fill="#ffd479">${name}</text></svg>`,
    ),
    left,
    top,
  });
});

await sharp({
  create: {
    width: COLS * W,
    height: ROWS * CELL_H,
    channels: 3,
    background: "#222",
  },
})
  .composite(composite)
  .png()
  .toFile(out);

console.log(`${tiles.length} tiles → ${out}`);
