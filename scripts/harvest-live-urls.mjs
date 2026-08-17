/**
 * Harvest every URL the live inkhotels.gr publishes, so nothing indexed is lost
 * at the domain switch.
 *
 * The new site replaces the old one on the same hostname. Every URL Google has
 * in its index today will be requested against the new site the moment DNS
 * moves, and every one that 404s is a ranking thrown away — for a hotel, in the
 * weeks before a season, that is bookings.
 *
 * Reads the sitemap (following a sitemap index if that is what it is), and also
 * probes the paths a WordPress hotel site tends to have whether or not they are
 * in the sitemap. Writes a JSON manifest for `build-redirects.mjs` to map.
 *
 *   node scripts/harvest-live-urls.mjs
 *
 * Dev tooling, run rarely. The output is committed so the mapping can be
 * reviewed and re-derived without depending on the old site still being up.
 */
import { writeFileSync } from "node:fs";

const ORIGIN = process.env.LIVE_ORIGIN ?? "https://inkhotels.gr";
const OUT = "scripts/live-urls.json";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

async function get(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Pull <loc> values, following one level of sitemap index. */
async function fromSitemap(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const xml = await get(url);
  if (!xml) return [];

  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  const isIndex = /<sitemapindex/i.test(xml);
  if (!isIndex) return locs;

  const out = [];
  for (const child of locs) out.push(...(await fromSitemap(child, seen)));
  return out;
}

/* Paths a WordPress hotel site usually has, sitemap or not. Probed rather than
   assumed: only the ones that actually answer are recorded. */
const GUESSES = [
  "/", "/rooms", "/room", "/accommodation", "/suites", "/gallery", "/photos",
  "/contact", "/contact-us", "/about", "/about-us", "/location", "/how-to-find-us",
  "/services", "/facilities", "/offers", "/booking", "/book", "/reservations",
  "/experiences", "/activities", "/blog", "/news", "/faq", "/terms",
  "/privacy-policy", "/privacy", "/cookies-policy", "/el", "/en", "/gr",
  "/house-of-europe", "/phos", "/residence", "/the-residence-of-the-old-port",
];

console.log(`harvesting ${ORIGIN}\n`);

const fromMap = await fromSitemap(`${ORIGIN}/sitemap.xml`);
console.log(`sitemap: ${fromMap.length} URLs`);

const paths = new Set();
for (const u of fromMap) {
  try {
    const url = new URL(u);
    if (url.origin !== ORIGIN) continue;
    paths.add(url.pathname.replace(/\/+$/, "") || "/");
  } catch {
    /* malformed <loc> */
  }
}

/* Probe the guesses; keep only what answers 200 and is not already known. */
let probed = 0;
for (const g of GUESSES) {
  if (paths.has(g)) continue;
  probed += 1;
  try {
    const res = await fetch(ORIGIN + g, {
      headers: { "user-agent": UA },
      redirect: "manual",
    });
    if (res.status === 200) paths.add(g);
  } catch {
    /* unreachable */
  }
}
console.log(`probed ${probed} common paths`);

const sorted = [...paths].sort();
writeFileSync(
  OUT,
  JSON.stringify(
    { origin: ORIGIN, harvestedCount: sorted.length, paths: sorted },
    null,
    2,
  ) + "\n",
);

console.log(`\n${sorted.length} distinct paths → ${OUT}\n`);
for (const p of sorted) console.log(`  ${p}`);
