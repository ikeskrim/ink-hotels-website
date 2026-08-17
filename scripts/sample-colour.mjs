/** Sample dominant colours from a region of an image. node scripts/sample-colour.mjs <hash> [x y w h] */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , hash, xs, ys, ws, hs] = process.argv;
const MEDIA = path.join(process.cwd(), "public", "media");
const file = fs.readdirSync(MEDIA).find((f) => f.startsWith(hash));
if (!file) throw new Error("not found");

const src = fs.readFileSync(path.join(MEDIA, file));
const meta = await sharp(src).metadata();
console.log(`${file}  ${meta.width}x${meta.height}`);

const region =
  xs !== undefined
    ? {
        left: Math.round(Number(xs) * meta.width),
        top: Math.round(Number(ys) * meta.height),
        width: Math.round(Number(ws) * meta.width),
        height: Math.round(Number(hs) * meta.height),
      }
    : null;

let pipe = sharp(src);
if (region) pipe = pipe.extract(region);

const { data, info } = await pipe
  .resize(60, 60, { fit: "inside" })
  .raw()
  .toBuffer({ resolveWithObject: true });

const buckets = new Map();
for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  /* Only saturated, mid-tone pixels — we want the ink of the mark, not paper. */
  if (sat < 0.28 || max < 45 || min > 215) continue;
  const key = `${Math.round(r / 16)}-${Math.round(g / 16)}-${Math.round(b / 16)}`;
  const e = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
  e.n++; e.r += r; e.g += g; e.b += b;
  buckets.set(key, e);
}

const top = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 6);
const hex = (n) => n.toString(16).padStart(2, "0");
for (const t of top) {
  const r = Math.round(t.r / t.n), g = Math.round(t.g / t.n), b = Math.round(t.b / t.n);
  console.log(`  #${hex(r)}${hex(g)}${hex(b)}  (${t.n} px)`);
}
