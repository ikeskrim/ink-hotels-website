/**
 * Find candidate Fiat 500 Cabrio photographs on the free libraries.
 *
 *   node scripts/find-car-photo.mjs
 *
 * Dev tooling. Prints candidates with their page URLs so a human can look at
 * them and read the licence before anything is downloaded — the point is to
 * choose a photograph, not to scrape one blind.
 */
const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
  "accept-language": "en-GB,en;q=0.9",
};

const QUERIES = [
  ["unsplash", "https://unsplash.com/s/photos/fiat-500"],
  ["unsplash", "https://unsplash.com/s/photos/fiat-500-cabrio"],
  ["pexels", "https://www.pexels.com/search/fiat%20500/"],
  ["pexels", "https://www.pexels.com/search/fiat%20500%20convertible/"],
];

for (const [site, url] of QUERIES) {
  try {
    const res = await fetch(url, { headers: UA });
    const text = await res.text();
    console.log(`\n=== ${site} · ${url} → ${res.status} · ${text.length} bytes`);

    if (site === "unsplash") {
      const ids = [
        ...new Set(
          [...text.matchAll(/images\.unsplash\.com\/photo-([0-9a-f-]{20,})/g)].map(
            (m) => m[1],
          ),
        ),
      ];
      const slugs = [
        ...new Set(
          [...text.matchAll(/"slug":"([a-z0-9-]{8,})"/g)].map((m) => m[1]),
        ),
      ];
      console.log("  photo ids :", ids.slice(0, 12).join("\n              ") || "-");
      console.log("  slugs     :", slugs.slice(0, 12).join(", ") || "-");
    } else {
      const urls = [
        ...new Set(
          [...text.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^"'\\ ?]+/g)].map(
            (m) => m[0],
          ),
        ),
      ];
      console.log("  images    :\n    " + (urls.slice(0, 12).join("\n    ") || "-"));
    }
  } catch (e) {
    console.log(`\n=== ${site} · ${url} → ERROR ${e.message}`);
  }
}
