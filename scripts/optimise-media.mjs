/**
 * Right-size the photo library.
 *
 * The originals come off the property's CDN at up to 3000px, which is more
 * resolution than any viewport on this site asks for and makes every cold
 * image transform expensive. Capping the long edge at 2400px keeps full-bleed
 * heroes sharp on a 2x display while cutting both storage and the work Next
 * has to do per request.
 *
 *   node scripts/optimise-media.mjs [--dry]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const MAX_EDGE = 2400;
const QUALITY = 82;
const DRY = process.argv.includes("--dry");

const MEDIA = path.join(process.cwd(), "public", "media");
const files = fs.readdirSync(MEDIA).filter((f) => /\.(webp|jpg)$/i.test(f));

let before = 0;
let after = 0;
let touched = 0;

for (const f of files) {
  const p = path.join(MEDIA, f);
  const startBytes = fs.statSync(p).size;
  before += startBytes;

  /* Read into memory first: sharp keeps the descriptor open while it streams,
     and Windows will not let us write back to a path it still holds. */
  const source = fs.readFileSync(p);
  const meta = await sharp(source).metadata();
  const long = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (long <= MAX_EDGE) {
    after += startBytes;
    continue;
  }

  if (DRY) {
    touched++;
    after += startBytes;
    continue;
  }

  const isWebp = /\.webp$/i.test(f);
  const pipeline = sharp(source)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .rotate();

  const buf = await (isWebp
    ? pipeline.webp({ quality: QUALITY, effort: 5 })
    : pipeline.jpeg({ quality: QUALITY, mozjpeg: true })
  ).toBuffer();

  /* Only replace if we actually saved something. */
  if (buf.length < startBytes) {
    fs.writeFileSync(p, buf);
    after += buf.length;
    touched++;
  } else {
    after += startBytes;
  }
}

console.log(
  `${files.length} files · ${touched} resized · ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB (−${(((before - after) / before) * 100).toFixed(0)}%)`,
);
