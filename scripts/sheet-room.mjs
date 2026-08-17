/**
 * Contact sheet for one room's gallery, in source order.
 *   node scripts/sheet-room.mjs <roomId> <out.png>
 * Dev tooling only.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , roomId, out = "room.png"] = process.argv;

const src = fs.readFileSync(
  path.join(process.cwd(), "src", "content", "generated", "images.ts"),
  "utf8",
);

const block = src.match(
  new RegExp(`"${roomId}":\\s*\\[([\\s\\S]*?)\\]`, "m"),
);
if (!block) throw new Error(`room ${roomId} not found`);
const files = [...block[1].matchAll(/"\/media\/([^"]+)"/g)].map((m) => m[1]);

const COLS = 6;
const CELL = 260;
const LABEL = 22;
const ROWS = Math.ceil(files.length / COLS);

const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(path.join(process.cwd(), "public", "media", f))
      .resize(CELL, CELL - LABEL, { fit: "cover" })
      .toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  })),
);

const labels = files.map((f, i) => ({
  input: Buffer.from(
    `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="4" y="15" font-family="monospace" font-size="12" fill="#ffd479">${i} ${f.slice(0, 14)}</text></svg>`,
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

console.log(`wrote ${out} — ${files.length} images for room ${roomId}`);
