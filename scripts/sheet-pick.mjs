/** Contact sheet from explicit hashes.  node scripts/sheet-pick.mjs out.png h1 h2 ... */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , out, ...hashes] = process.argv;
const MEDIA = path.join(process.cwd(), "public", "media");
const all = fs.readdirSync(MEDIA);

const files = hashes
  .map((h) => all.find((f) => f.startsWith(h)))
  .filter(Boolean);

const COLS = Math.min(4, files.length);
const CELL = 320;
const LABEL = 22;
const ROWS = Math.ceil(files.length / COLS);

const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(path.join(MEDIA, f))
      .resize(CELL, CELL - LABEL, { fit: "cover" })
      .toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  })),
);

const labels = files.map((f, i) => ({
  input: Buffer.from(
    `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="4" y="15" font-family="monospace" font-size="12" fill="#ffd479">${i} ${f.slice(0, 16)}</text></svg>`,
  ),
  left: (i % COLS) * CELL,
  top: Math.floor(i / COLS) * CELL + (CELL - LABEL),
}));

await sharp({
  create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: "#1a1a1a" },
})
  .composite([...tiles, ...labels])
  .png()
  .toFile(out);

console.log(`wrote ${out} — ${files.length}/${hashes.length} found`);
