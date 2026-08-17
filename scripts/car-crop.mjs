/**
 * Compose the landscape frame for the car section from the portrait original.
 *
 *   node scripts/car-crop.mjs <scratchDir> [--write]
 *
 * The source is 3024×4032 and the car is nearly square in it, so a 3:2 crop at
 * full width covers exactly half the frame — every option is a trade between
 * how much of the wheels survives and how much of the whitewashed courtyard
 * does. This prints the options as a sheet so the trade is looked at, and with
 * `--write` puts the chosen one into public/media.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const scratch = process.argv[2];
const WRITE = process.argv.includes("--write");
if (!scratch) throw new Error("give a scratch directory");

const src = path.join(scratch, "car-original.jpg");
const meta = await sharp(src).metadata();
const W = meta.width ?? 0;
const H = meta.height ?? 0;
const cropH = Math.round(W / 1.5); // 3:2 at full width

/** Top edge of each candidate crop, in original pixels. */
const OPTIONS = [
  ["high", 1620],
  ["mid", 1790],
  ["low", 1960],
];

const tiles = [];
for (const [name, top] of OPTIONS) {
  const t = Math.max(0, Math.min(top, H - cropH));
  const buf = await sharp(src)
    .extract({ left: 0, top: t, width: W, height: cropH })
    .toBuffer();
  fs.writeFileSync(path.join(scratch, `car-crop-${name}.jpg`), buf);
  tiles.push({ name, top: t, buf });
  console.log(`${name.padEnd(5)} top ${t}  →  ${W}×${cropH}`);
}

const CELL_W = 900;
const CELL_H = 600;
const comps = [];
for (let i = 0; i < tiles.length; i++) {
  comps.push({
    input: await sharp(tiles[i].buf).resize(CELL_W, CELL_H - 26, { fit: "cover" }).toBuffer(),
    left: 0,
    top: i * CELL_H,
  });
  const svg = `<svg width="${CELL_W}" height="26"><rect width="100%" height="100%" fill="#111"/><text x="6" y="19" font-family="monospace" font-size="15" fill="#ffd479">${tiles[i].name} · top ${tiles[i].top}</text></svg>`;
  comps.push({ input: Buffer.from(svg), left: 0, top: i * CELL_H + CELL_H - 26 });
}
await sharp({
  create: { width: CELL_W, height: tiles.length * CELL_H, channels: 3, background: "#1a1a1a" },
})
  .composite(comps)
  .png()
  .toFile(path.join(scratch, "car-crop-sheet.png"));
console.log("sheet written");

if (WRITE) {
  const chosen = process.env.CROP ?? "mid";
  const pick = tiles.find((t) => t.name === chosen);
  if (!pick) throw new Error(`no crop named ${chosen}`);

  /* The registration, softened.
     The brief asked for no readable plate. Painting it out would leave a
     rectangle of nothing on the bumper of a classic car, which reads as
     censorship; a short blur over the digits leaves the plate present as an
     object and unreadable as a number, which is the actual requirement. The
     car belongs to somebody else and this is a placeholder — its registration
     has no business being advertised on a hotel's page. */
  const PLATE = { left: 1935, top: 1560, width: 415, height: 170 };
  const plate = await sharp(pick.buf).extract(PLATE).blur(13).toBuffer();

  /* Two pipelines, not one. sharp applies `composite` AFTER `resize` whatever
     order they are called in, so chaining them put a 415px patch at 3024-scale
     coordinates onto a 2400-wide image — sharp clamped it and the blur landed
     in the bottom-right corner instead of on the bumper. Compositing at full
     size and resizing separately is the only way to mean what you wrote. */
  const patched = await sharp(pick.buf)
    .composite([{ input: plate, left: PLATE.left, top: PLATE.top }])
    .toBuffer();

  const out = await sharp(patched)
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toBuffer();

  const dest = path.join(process.cwd(), "public", "media", "placeholder-fiat-500-cabrio.webp");
  fs.writeFileSync(dest, out);
  const m = await sharp(out).metadata();
  console.log(`\nwrote ${dest}  ${m.width}×${m.height}  ${Math.round(out.length / 1024)} kB`);

  /* A proof at viewing size, so the blur can be checked rather than assumed. */
  await sharp(out).resize({ width: 1200 }).png().toFile(path.join(scratch, "car-final.png"));
}
