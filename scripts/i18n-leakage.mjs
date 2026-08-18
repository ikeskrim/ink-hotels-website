/**
 * How much English is still showing in each language?
 *
 *   BASE=http://localhost:3000 node scripts/i18n-leakage.mjs
 *
 * `i18n-coverage.mjs` proves the OVERLAY has an entry for every room, chapter
 * and question. It cannot prove the rendered page is translated: a page can
 * have complete content overlays and still be full of English headings typed
 * straight into the JSX.
 *
 * So this reads the actual rendered text of each page in each language and
 * asks how many text blocks are byte-identical to the English page. Some
 * identity is correct and expected — "Ink", "Phos", "House of Europe",
 * "Coco-Mat", phone numbers, "35.3714° N" — so short blocks and blocks
 * without letters are ignored, and what remains is real leakage.
 *
 * The point of the comparison is RELATIVE: if German leaks the same as French
 * and Dutch, German is not a half-finished locale, it is the same locale in
 * the same state as the others.
 */
import { launch } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const LOCALES = ["el", "de", "fr", "nl"];
const PAGES = ["/", "/rooms", "/rooms/evexia", "/story", "/rethymno", "/arrival", "/faq", "/contact"];

/** Text blocks worth comparing: long enough to be prose, and containing letters. */
const collect = () =>
  [...document.querySelectorAll("main p, main h1, main h2, main h3, main li, main dd, main dt")]
    .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim())
    .filter((t) => t.length >= 25 && /[A-Za-zΑ-Ωα-ω]/.test(t));

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const rows = [];

for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const en = new Set(await page.evaluate(collect));

  for (const locale of LOCALES) {
    await page.goto(`${BASE}/${locale}${path === "/" ? "" : path}`, {
      waitUntil: "domcontentloaded",
    });
    const blocks = await page.evaluate(collect);
    const same = blocks.filter((t) => en.has(t));
    rows.push({ path, locale, total: blocks.length, leaked: same.length, samples: same });
  }
}

await browser.close();

/* ── Per page ──────────────────────────────────────────────────────────── */
console.log("route            " + LOCALES.map((l) => l.toUpperCase().padStart(9)).join(""));
console.log("-".repeat(17 + LOCALES.length * 9));
for (const path of PAGES) {
  const cells = LOCALES.map((l) => {
    const r = rows.find((x) => x.path === path && x.locale === l);
    return `${r.leaked}/${r.total}`.padStart(9);
  });
  console.log(path.padEnd(17) + cells.join(""));
}

/* ── Per locale ────────────────────────────────────────────────────────── */
console.log("\ntotals");
for (const locale of LOCALES) {
  const mine = rows.filter((r) => r.locale === locale);
  const leaked = mine.reduce((n, r) => n + r.leaked, 0);
  const total = mine.reduce((n, r) => n + r.total, 0);
  const pct = total ? Math.round((leaked / total) * 100) : 0;
  console.log(`  ${locale}  ${String(leaked).padStart(3)}/${total} blocks still English  (${pct}%)`);
}

/* ── What is actually leaking ──────────────────────────────────────────── */
const worst = new Map();
for (const r of rows) {
  for (const s of r.samples) worst.set(s, (worst.get(s) ?? 0) + 1);
}
console.log(`\n${worst.size} DISTINCT untranslated blocks:`);
for (const [text, count] of [...worst].sort((a, b) => b[1] - a[1])) {
  console.log(`  ×${count}  ${text.slice(0, 100)}`);
}

/* ── The ceiling ───────────────────────────────────────────────────────────
   Leakage never reaches zero, and should not. What remains is the building
   name "The Residence of the Old Port", postal addresses, an email address and
   phone numbers, all of which are meant to read the same in every language.
   The measured floor is 11-12 blocks per locale.

   The ceiling sits a little above that floor rather than on it, so moving an
   address around does not fail a build while a genuinely untranslated new
   section does. Raise it only with a reason. */
const CEILING = 16;

const over = LOCALES.map((locale) => ({
  locale,
  leaked: rows
    .filter((r) => r.locale === locale)
    .reduce((n, r) => n + r.leaked, 0),
})).filter((r) => r.leaked > CEILING);

if (over.length) {
  console.error(`
FAIL - the ceiling is ${CEILING} untranslated blocks per locale:`);
  for (const o of over) console.error(`  ${o.locale}: ${o.leaked} (${o.leaked - CEILING} over)`);
  process.exitCode = 1;
} else {
  console.log(`
all locales within the ceiling of ${CEILING} untranslated blocks`);
}
