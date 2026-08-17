/**
 * Build a labelled contact sheet from the media library so photography can be
 * reviewed and chosen. Dev tooling only — not part of the app build.
 *
 *   node scripts/contact-sheet.mjs <out.png> <start> <count> [--set gallery|room:<id>|all]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const MEDIA = path.join(process.cwd(), "public", "media");
const [, , out = "sheet.png", startArg = "0", countArg = "36", setArg = "all"] =
  process.argv;

const start = Number(startArg);
const count = Number(countArg);

const mod = await import("../src/content/generated/images.ts").catch(() => null);

let files;
if (setArg === "all" || !mod) {
  files = fs
    .readdirSync(MEDIA)
    .filter((f) => /\.(webp|jpg)$/i.test(f))
    .sort();
} else {
  files = [];
}

const slice = files.slice(start, start + count);
const COLS = 6;
const CELL = 260;
const LABEL = 22;
const ROWS = Math.ceil(slice.length / COLS);

const tiles = await Promise.all(
  slice.map(async (f, i) => {
    const buf = await sharp(path.join(MEDIA, f))
      .resize(CELL, CELL - LABEL, { fit: "cover" })
      .toBuffer();
    return {
      input: buf,
      left: (i % COLS) * CELL,
      top: Math.floor(i / COLS) * CELL,
    };
  }),
);

const labels = slice.map((f, i) => {
  const svg = `<svg width="${CELL}" height="${LABEL}">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="4" y="15" font-family="monospace" font-size="12" fill="#ffd479">${
      start + i
    } ${f.slice(0, 14)}</text>
  </svg>`;
  return {
    input: Buffer.from(svg),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL + (CELL - LABEL),
  };
});

await sharp({
  create: {
    width: COLS * CELL,
    height: ROWS * CELL,
    channels: 3,
    background: "#1a1a1a",
  },
})
  .composite([...tiles, ...labels])
  .png()
  .toFile(out);

console.log(`wrote ${out} — ${slice.length} images (${start}..${start + slice.length - 1}) of ${files.length}`);
