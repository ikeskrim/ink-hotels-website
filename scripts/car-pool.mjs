/**
 * Harvest candidate open-top Fiat 500 photographs from the four licence-safe
 * pools the owner named, and save a numbered contact sheet of previews.
 *
 *   node scripts/car-pool.mjs
 *
 * Downloads previews only, into the scratchpad — never into the project. The
 * point is to look at them before choosing; a search result is not a decision.
 * The chosen frame is fetched at full size afterwards by car-crop.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env.OUT ?? "candidates";
mkdirSync(OUT, { recursive: true });

const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
  "accept-language": "en-GB,en;q=0.9",
};

const PAGES = [
  ["pexels", "https://www.pexels.com/search/fiat%20500%20convertible/"],
  ["pexels", "https://www.pexels.com/search/fiat%20500/"],
  ["pexels", "https://www.pexels.com/search/fiat%20500%20cabrio/"],
  ["unsplash", "https://unsplash.com/s/photos/fiat-500-convertible"],
  ["unsplash", "https://unsplash.com/s/photos/fiat-500"],
  ["pixabay", "https://pixabay.com/images/search/fiat%20500%20cabrio/"],
  ["pixabay", "https://pixabay.com/images/search/fiat%20500%20convertible/"],
];

/** site → [regex over the HTML, builder for a ~900px preview URL, page URL] */
const EXTRACT = {
  pexels: {
    re: /https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^"'\\?]+\.jpe?g/g,
    preview: (m) => `${m[0]}?auto=compress&cs=tinysrgb&w=900`,
    page: (m) => `https://www.pexels.com/photo/${m[1]}/`,
    id: (m) => `pexels-${m[1]}`,
  },
  unsplash: {
    re: /https:\/\/images\.unsplash\.com\/photo-([0-9a-f]+-[0-9a-f]+)[^"'\\?]*/g,
    preview: (m) => `https://images.unsplash.com/photo-${m[1]}?w=900&q=70`,
    page: () => "(unsplash search result — open the photo page to confirm)",
    id: (m) => `unsplash-${m[1].slice(0, 14)}`,
  },
  pixabay: {
    re: /https:\/\/cdn\.pixabay\.com\/photo\/[\d/]+\/([a-z0-9-]+)_(?:640|1280|960)[^"'\\?]*\.jpg/g,
    preview: (m) => m[0],
    page: () => "(pixabay search result — open the photo page to confirm)",
    id: (m) => `pixabay-${m[1].slice(0, 22)}`,
  },
};

const seen = new Map();

for (const [site, url] of PAGES) {
  let html = "";
  try {
    const res = await fetch(url, { headers: UA });
    html = await res.text();
    console.log(`${site.padEnd(9)} ${res.status}  ${String(html.length).padStart(7)} bytes  ${url}`);
  } catch (err) {
    console.log(`${site.padEnd(9)} FAIL  ${err.message}  ${url}`);
    continue;
  }

  const { re, preview, page, id } = EXTRACT[site];
  for (const m of html.matchAll(re)) {
    const key = id(m);
    if (seen.has(key)) continue;
    seen.set(key, { site, preview: preview(m), page: page(m) });
  }
}

console.log(`\n${seen.size} distinct candidates. Downloading previews…\n`);

const manifest = [];
let n = 0;
for (const [key, c] of seen) {
  n += 1;
  const file = join(OUT, `${String(n).padStart(2, "0")}-${key}.jpg`);
  try {
    const res = await fetch(c.preview, { headers: UA });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) throw new Error(`too small (${buf.length}B)`);
    writeFileSync(file, buf);
    manifest.push({ n, key, ...c, file, bytes: buf.length });
    console.log(`  ${String(n).padStart(2)}  ${String(Math.round(buf.length / 1024)).padStart(4)} kB  ${key}`);
  } catch (err) {
    console.log(`  ${String(n).padStart(2)}  skip (${err.message})  ${key}`);
  }
}

writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} previews in ${OUT}/`);
