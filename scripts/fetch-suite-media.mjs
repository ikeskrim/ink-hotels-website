/**
 * Mirror the Evexia / Eros / Zoi photography, plus the extra house, breakfast
 * and suite material, from creteholidayhome.com.
 *
 *   node scripts/fetch-suite-media.mjs
 *
 * Every file lands in public/media under the md5 of its source URL, which is
 * the same convention the existing 326 photographs use — so a re-run is a
 * no-op and nothing is ever downloaded twice.
 *
 * Some of the groups are wildcards in the brief (Agapi-*, Elpida-*), so those
 * are probed across a plausible range and the misses are simply reported. A
 * 404 is data, not an error: it tells us where the series stops.
 *
 * Output: scripts/.suite-media.json — a manifest of group → files, with the
 * dimensions of each, which is what decides where a photograph is allowed to
 * be used (a hero needs 2000px; a card does not).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = process.cwd();
const MEDIA = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "scripts", ".suite-media.json");
const BASE = "https://creteholidayhome.com/wp-content/uploads";
const MAX_EDGE = 2400;

const range = (n, f) => Array.from({ length: n }, (_, i) => f(i + 1));

/** group → ordered candidate URLs. Order is the order they will be shown in. */
const GROUPS = {
  evexia: [
    `${BASE}/2025/07/EVEXIA.jpg`,
    ...range(21, (i) => `${BASE}/2025/07/EVEXIA_3-${i}.jpg`),
    `${BASE}/2025/07/Ink-5.jpg`,
  ],
  eros: [
    ...range(10, (i) => `${BASE}/2024/12/eros-${i}-new.jpg`),
    ...range(10, (i) => `${BASE}/2024/12/EROS_2-${i}.jpg`),
    `${BASE}/2024/12/EROS-ZOI.jpg`,
  ],
  zoi: [
    ...range(7, (i) => `${BASE}/2024/12/ZOI-${i}-new.jpg`),
    ...range(4, (i) => `${BASE}/2024/12/ZOI-${i}.jpg`),
    ...range(5, (i) => `${BASE}/2024/12/ZOI_2-${i}.jpg`),
  ],
  houseOfEurope: range(18, (i) => `${BASE}/2022/05/Ink-Hotels-house-of-europe${i}.webp`),
  phos: range(10, (i) => `${BASE}/2022/05/Ink-hotels-Phos${i}.webp`),
  breakfast: range(6, (i) => `${BASE}/2022/06/breakfast-${i}.webp`),
  /* Wildcards in the brief — probed wide, trimmed by what actually exists. */
  agapi: [
    `${BASE}/2022/06/Agapi.webp`,
    ...range(16, (i) => `${BASE}/2022/06/Agapi-${i}.webp`),
  ],
  elpida: [
    `${BASE}/2022/06/Elpida.webp`,
    ...range(16, (i) => `${BASE}/2022/06/Elpida-${i}.webp`),
  ],
};

fs.mkdirSync(MEDIA, { recursive: true });

const nameFor = (url) => crypto.createHash("md5").update(url).digest("hex") + ".webp";

async function grab(url) {
  const file = nameFor(url);
  const dest = path.join(MEDIA, file);

  if (fs.existsSync(dest)) {
    const meta = await sharp(dest).metadata();
    return { url, file: `/media/${file}`, w: meta.width, h: meta.height, cached: true };
  }

  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (ink-hotels media mirror)" },
  });
  if (!res.ok) return { url, missing: res.status };

  const buf = Buffer.from(await res.arrayBuffer());
  /* `rotate()` with no argument applies the EXIF orientation and drops the tag,
     which is what stops a portrait phone shot arriving on its side. */
  const out = await sharp(buf)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  fs.writeFileSync(dest, out);
  const meta = await sharp(out).metadata();
  return { url, file: `/media/${file}`, w: meta.width, h: meta.height, bytes: out.length };
}

const manifest = {};
let ok = 0;
let missing = 0;

for (const [group, urls] of Object.entries(GROUPS)) {
  const got = [];
  const gone = [];
  /* Six at a time: polite to the origin, and fast enough. */
  for (let i = 0; i < urls.length; i += 6) {
    const batch = await Promise.all(urls.slice(i, i + 6).map(grab));
    for (const r of batch) (r.missing ? gone : got).push(r);
  }
  manifest[group] = got;
  ok += got.length;
  missing += gone.length;
  const small = got.filter((g) => Math.max(g.w, g.h) < 1400).length;
  console.log(
    `${group.padEnd(15)} ${String(got.length).padStart(2)} kept · ${String(gone.length).padStart(2)} absent` +
      (small ? ` · ${small} under 1400px` : ""),
  );
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\n${ok} photographs mirrored, ${missing} URLs did not exist.`);
console.log(`Manifest: scripts/.suite-media.json`);
