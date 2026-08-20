/**
 * Full-page screenshots of the key routes, in English and Greek.
 *
 *   BASE=http://localhost:3000 node scripts/shots.mjs [outDir]
 *
 * For the owner's morning review: eight routes × two languages, one JPEG each,
 * full page rather than viewport so a whole page can be read in one image.
 *
 * ── These are never committed ──────────────────────────────────────────────
 * The output directory is git-ignored and CI uploads it as a build artifact
 * that expires. The set is ~18 MB as JPEG and was 127 MB as PNG; either way it
 * is a picture of exactly one commit, stale the moment the next one lands.
 * Putting that in the history would grow the repository every time somebody
 * wanted to glance at the site. A link to an expiring artifact is the honest
 * form for something that is only ever true of one build.
 *
 * ── What it waits for ──────────────────────────────────────────────────────
 * Not `networkidle` — /gallery carries 434 photographs and on a cold image
 * cache that state may never arrive, which is exactly how reveal-check came to
 * be flaky. It scrolls the page to force the lazy images to decode, returns to
 * the top, and gives the reveals a beat to finish. Animation is disabled up
 * front so two runs of the same commit produce the same picture.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { launch, goto } from "./lib/browser.mjs";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = process.argv[2] ?? "qa/shots";

const ROUTES = [
  ["/", "home"],
  ["/rooms", "rooms"],
  ["/rooms/evexia", "suite-evexia"],
  ["/story", "story"],
  ["/rethymno", "rethymno"],
  ["/gallery", "gallery"],
  ["/location", "location"],
  ["/faq", "faq"],
];

mkdirSync(OUT, { recursive: true });

const browser = await launch();
let written = 0;

for (const locale of ["", "/el"]) {
  const tag = locale === "" ? "en" : "el";
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    /* Deterministic: the preloader, the reveals and the cursor all stand down,
       so the same commit photographs the same way twice. */
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();

  for (const [route, name] of ROUTES) {
    const url = `${BASE}${locale}${route === "/" ? "" : route}` || BASE;
    await goto(page, url || BASE + "/", { waitFor: "main, body" });

    /* Walk the page so every lazy image decodes, then come back to the top. */
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 900) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);

    /* JPEG, not PNG. The same sixteen frames came to 127 MB as PNG — a
       full-page shot of a photograph-led site is mostly photograph, which is
       exactly what PNG is worst at. Nobody downloads a 127 MB artifact to
       glance at a site over coffee. */
    const file = join(OUT, `${tag}-${name}.jpg`);
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 82 });
    written += 1;
    console.log(`  ${file}`);
  }

  await ctx.close();
}

await browser.close();
console.log(`\n${written} screenshots in ${OUT}/ — artifact only, never committed`);
