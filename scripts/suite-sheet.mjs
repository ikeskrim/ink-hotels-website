/**
 * Contact sheet for one group of the newly mirrored photography, so the shots
 * can actually be looked at before any of them is chosen as a hero.
 *
 *   node scripts/suite-sheet.mjs <group> <out.png>
 *
 * Each tile is labelled with its index and original filename, which is how a
 * choice made here gets carried back into src/content/rooms.ts.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const [, , group = "evexia", out = "sheet.png"] = process.argv;
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", ".suite-media.json"), "utf8"),
);

const items = manifest[group];
if (!items) {
  console.error(`no such group: ${group}. Have: ${Object.keys(manifest).join(", ")}`);
  process.exit(1);
}

const COLS = 5;
const CELL = 300;
const LABEL = 24;
const ROWS = Math.ceil(items.length / COLS);

const tiles = await Promise.all(
  items.map(async (it, i) => ({
    input: await sharp(path.join(ROOT, "public", it.file.replace("/media/", "media/")))
      .resize(CELL, CELL - LABEL, { fit: "cover" })
      .toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  })),
);

const labels = items.map((it, i) => {
  const name = it.url.split("/").pop().replace(/\.(jpg|webp)$/i, "");
  const svg = `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="5" y="17" font-family="monospace" font-size="13" fill="#ffd479">${i} ${name}</text></svg>`;
  return {
    input: Buffer.from(svg),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL + (CELL - LABEL),
  };
});

await sharp({
  create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: "#1a1a1a" },
})
  .composite([...tiles, ...labels])
  .png()
  .toFile(out);

console.log(`${out} — ${items.length} tiles`);
