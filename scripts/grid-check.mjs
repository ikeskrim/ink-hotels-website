/**
 * The amenity grid, on every suite, in every language.
 *
 *   BASE=http://localhost:3000 node --import tsx scripts/grid-check.mjs
 *
 * content/amenity-media.ts is keyed by the English amenity string. A suite
 * page in Greek renders Greek amenity labels. If the lookup happens on the
 * translated label, four of the five languages get a grid with no
 * photographs and nobody reading the English page would ever know. So this
 * opens the disclosure on all seven suites in all five locales and counts:
 * the number of picture tiles must equal the number of frames in the map,
 * every picture must actually load, its alt must be what the map says, and
 * the tile with no frame must render as type.
 */
import { AMENITY_MEDIA } from "../src/content/amenity-media.ts";
import { rooms } from "../src/content/rooms.ts";
import { locales } from "../src/i18n/config.ts";
import { localiseAmenityItems } from "../src/i18n/content/index.ts";
import { launch, goto } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.route("**/*", (route) =>
  ["media", "font"].includes(route.request().resourceType()) ? route.abort() : route.continue(),
);

let failures = 0;
let checked = 0;
const report = (ok, label, detail = "") => {
  checked++;
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`);
};

const suites = rooms.filter((r) => AMENITY_MEDIA[r.slug]);
report(suites.length === 7, `${suites.length} suites carry amenity photography (all seven)`);

for (const locale of locales) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  for (const room of suites) {
    const expected = AMENITY_MEDIA[room.slug];
    const described = new Map(
      localiseAmenityItems(locale, room.slug).filter((i) => i.frame).map((i) => [i.frame.src, i.frame.alt]),
    );
    const url = `${BASE}${prefix}/rooms/${room.slug}`;
    await goto(page, url, { waitFor: "main" });
    /* Open whichever disclosure holds the grid. */
    /* The accordion holds one panel open, so the next click closes the last.
       After each click, wait for the grid to appear before giving up on it. */
    const opened = await page.evaluate(async () => {
      const triggers = [...document.querySelectorAll('button[aria-expanded="false"]')];
      for (const t of triggers) {
        t.click();
        for (let i = 0; i < 12; i++) {
          await new Promise((r) => setTimeout(r, 125));
          if (document.querySelector("ul li button[aria-pressed]")) return t.textContent.trim();
        }
      }
      return null;
    });
    const cells = page.locator("ul li button[aria-pressed]");
    const n = await cells.count();
    if (!n) {
      report(false, `${locale} ${room.slug.padEnd(8)} grid present`, opened ? "opened but no cells" : "no disclosure opened it");
      continue;
    }
    /* Reveal every cell that claims a picture and read it back. */
    const seen = await cells.evaluateAll(async (els) => {
      const out = [];
      for (const b of els) {
        b.focus();
        await new Promise((r) => setTimeout(r, 120));
        const img = b.querySelector("img");
        if (img) {
          await new Promise((r) => setTimeout(r, 400));
          out.push({
            label: b.textContent.trim().split("\n")[0],
            alt: img.getAttribute("alt"),
            src: img.currentSrc || img.getAttribute("src"),
            loaded: img.complete && img.naturalWidth > 0,
          });
        } else {
          out.push({ label: b.textContent.trim().split("\n")[0], alt: null });
        }
      }
      return out;
    });
    const pictures = seen.filter((c) => c.alt !== null);
    const want = Object.keys(expected).length;
    report(
      pictures.length === want,
      `${locale} ${room.slug.padEnd(8)} ${n} cells, ${pictures.length}/${want} with a photograph`,
      pictures.length === want ? "" : `text-only: ${seen.filter((c) => c.alt === null).map((c) => c.label).join(" · ")}`,
    );
    for (const p of pictures) {
      const frame = Object.values(expected).find((f) => p.src?.includes(f.src.replace("/media/", "").replace(".webp", "")));
      report(Boolean(frame) && p.loaded, `${locale} ${room.slug.padEnd(8)} “${p.label}” shows its own frame, loaded`, frame ? (p.loaded ? "" : "not loaded") : `unexpected src ${p.src}`);
      if (frame) {
        const want = described.get(frame.src);
        report(p.alt === want, `${locale} ${room.slug.padEnd(8)} “${p.label}” described in ${locale}`, p.alt === want ? "" : `got “${p.alt}”`);
      }
    }
    if (room.slug === "pathos") {
      const tub = seen.find((c) => /hot tub|υδρομασάζ|whirlpool|bain à remous|bubbelbad/i.test(c.label));
      report(Boolean(tub) && tub.alt === null, `${locale} pathos   the courtyard hot tub is a text tile, no frame invented`, tub ? "" : "no hot-tub cell");
    }
  }
}

await browser.close();
console.log(`\n${checked} assertions; ${failures} failed.`);
process.exitCode = checked < 100 ? 1 : failures ? 1 : 0;
if (checked < 100) console.log("too few assertions ran — the grid was not found where this check looks");
