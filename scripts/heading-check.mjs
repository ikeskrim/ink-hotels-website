/**
 * Catch headings whose words run together in the accessible name.
 *
 * The homepage h1 is set as two block spans so it breaks where the design
 * wants it to. Visually that is two lines; in the DOM it is one text stream
 * with nothing between the spans, so `textContent` — which is what a screen
 * reader announces, what Google indexes and what the accessible name is built
 * from — read "Seven suitesin the old town."
 *
 * The rule this checks: if a heading has more than one block-level child, the
 * text either side of every junction must be separated by whitespace. Nothing
 * about the visual result changes; the space only has to exist in the stream.
 *
 *   BASE=http://localhost:3000 node scripts/heading-check.mjs
 */
import { chromium } from "playwright";
import { goto } from "./lib/goto.mjs";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

/* One page per distinct heading construction on the site, in two locales so a
   translated string that happens to end in punctuation cannot mask the bug. */
const ROUTES = [
  "/", "/rooms", "/rooms/harmony", "/experiences", "/experiences/organic-farm",
  "/gallery", "/story", "/rethymno", "/arrival", "/location", "/contact",
  "/faq", "/accessibility", "/careers",
  "/el", "/el/rethymno", "/de", "/de/location", "/fr/experiences", "/nl/story",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];

for (const route of ROUTES) {
  const res = await goto(page, BASE + route, { waitUntil: "domcontentloaded" });
  if (!res || res.status() !== 200) {
    problems.push({ route, heading: "(page)", text: `HTTP ${res?.status()}` });
    continue;
  }

  const found = await page.evaluate(() => {
    const out = [];
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      const kids = [...h.querySelectorAll(":scope > *")].filter((el) => {
        /* Skip what a screen reader skips. The masthead pairs an sr-only
           "Ink" with an aria-hidden span of animated letters; counting the
           hidden one made the heading look like it read "InkINK" when the
           accessible name is just "Ink". */
        if (el.getAttribute("aria-hidden") === "true") return false;
        const d = getComputedStyle(el).display;
        return d === "block" || d === "flex" || d === "grid";
      });
      if (kids.length < 2) continue;

      /* Walk the heading's own text stream and look at each junction. */
      for (let i = 0; i < kids.length - 1; i++) {
        const a = (kids[i].textContent ?? "").replace(/\s+$/, "");
        const b = (kids[i + 1].textContent ?? "").replace(/^\s+/, "");
        if (!a || !b) continue;
        const between = (h.textContent ?? "").slice(
          (h.textContent ?? "").indexOf(a) + a.length,
        );
        const gap = between.slice(0, between.indexOf(b));
        if (!/\s/.test(gap)) {
          out.push({
            tag: h.tagName,
            text: (h.textContent ?? "").trim().slice(0, 70),
            junction: `${a.slice(-14)}|${b.slice(0, 14)}`,
          });
          break;
        }
      }
    }
    return out;
  });

  for (const f of found) problems.push({ route, heading: f.tag, ...f });
}

await browser.close();

console.log(`checked headings on ${ROUTES.length} pages`);
if (!problems.length) {
  console.log("every multi-part heading reads with its words separated");
  process.exit(0);
}
console.error(`\n${problems.length} RUN-TOGETHER HEADING(S):\n`);
for (const p of problems) {
  console.error(`  ${p.route}  <${(p.heading ?? "").toLowerCase()}>  "${p.text}"`);
  if (p.junction) console.error(`      junction: …${p.junction}…`);
}
process.exit(1);
