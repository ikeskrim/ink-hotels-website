/**
 * Pull the Fiat 500 candidates down to a scratch folder and lay them out as a
 * contact sheet, so the choice is made by looking rather than by reading alt
 * text. Dev tooling — nothing here writes into the project.
 *
 *   node scripts/car-candidates.mjs <outDir>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const out = process.argv[2];
if (!out) throw new Error("give an output directory");

const CANDIDATES = [
  ["17514215", "free-photo-of-fiat-500-cabriolet"],
  ["37870913", "free-photo-of-white-fiat-500-driving-outdoors-on-sunny-day"],
  ["34311097", "free-photo-of-vintage-red-fiat-500-cabriolet-in-italian-setting"],
  ["18271817", "free-photo-of-fiat-500-parked-on-cobblestone-street"],
  ["18244876", "free-photo-of-fiat-500"],
  ["36772071", "free-photo-of-vintage-fiat-500-parked-near-lush-garden-in-italy"],
  ["18348355", "free-photo-of-fiat-500"],
  ["19279050", "free-photo-of-black-retro-fiat-500"],
  ["24259413", "free-photo-of-fiat-500-parked-on-street"],
];

const tiles = [];
for (const [id, slug] of CANDIDATES) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}/${slug}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.log(`${id} → ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(out, `cand-${id}.jpg`), buf);
  const m = await sharp(buf).metadata();
  console.log(`${id}  ${m.width}×${m.height}  ${Math.round(buf.length / 1024)} kB`);
  tiles.push({ id, buf });
}

const CELL = 520;
const LABEL = 26;
const COLS = 3;
const comps = [];
for (let i = 0; i < tiles.length; i++) {
  comps.push({
    input: await sharp(tiles[i].buf).resize(CELL, CELL - LABEL, { fit: "cover" }).toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  });
  const svg = `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="19" font-family="monospace" font-size="15" fill="#ffd479">${tiles[i].id}</text></svg>`;
  comps.push({
    input: Buffer.from(svg),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL + CELL - LABEL,
  });
}

await sharp({
  create: {
    width: COLS * CELL,
    height: Math.ceil(tiles.length / COLS) * CELL,
    channels: 3,
    background: "#1a1a1a",
  },
})
  .composite(comps)
  .png()
  .toFile(path.join(out, "cand-sheet.png"));

console.log(`\n${tiles.length} candidates · sheet written`);
