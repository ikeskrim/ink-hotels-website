/**
 * The site in the two engines the rest of CI never sees.
 *
 *   BASE=http://localhost:3000 node scripts/cross-browser.mjs
 *
 * Every other browser check here runs Chromium, because Chromium is what CI
 * has and what most guests use. That leaves two whole rendering engines
 * unexercised, and this site leans on exactly the features they disagree
 * about: `position: sticky` inside grid, `min-h-[100svh]`, `color-mix()`,
 * `mask-image` with an inline SVG, `backdrop-filter`, `@media (hover: hover)`,
 * and `scroll-margin-top` read back through `getComputedStyle`.
 *
 * Safari is not a rounding error for a Greek hotel: iPhones are most of the
 * mobile traffic a property like this sees, and every one of them is WebKit.
 *
 * ── What it asserts, per engine, per route, in two languages ───────────────
 *   1. The page renders: a <main> and exactly one <h1>.
 *   2. The console is clean — no `console.error` and no uncaught exception.
 *      A page that throws in Safari and not in Chrome usually still *looks*
 *      fine, which is why nobody notices until a guest cannot book.
 *   3. Booking survives: every route still offers a link to the reservation
 *      engine, and on a room page it still carries that room.
 *   4. Nothing has escaped horizontally. `documentElement.scrollWidth` must
 *      not exceed the viewport — the classic way a sideways-drifting band or
 *      an over-wide grid breaks a phone, and the classic thing that behaves
 *      differently across engines.
 *
 * ── Why it is a separate CI job ────────────────────────────────────────────
 * It installs two more browsers, which is most of its runtime. Keeping it off
 * the main job means the fast gates stay fast and a WebKit-only regression
 * does not hide behind a five-minute install.
 */
import { webkit, firefox } from "playwright";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const TIMEOUT = Number(process.env.NAV_TIMEOUT ?? 60_000);

const ROUTES = [
  "/",
  "/rooms",
  "/rooms/evexia",
  "/story",
  "/rethymno",
  "/gallery",
  "/location",
  "/faq",
];
const LOCALES = ["", "/el"];

/* Noise that is not ours and not a fault. Kept deliberately short — an
   allowlist is where real errors go to hide. */
const IGNORE = [
  /favicon/i,
  /Failed to load resource.*404.*apple-touch/i,
  /* Next's router prefetches the links on a page; navigating away before a
     prefetch lands aborts it and logs this. The message reports its own
     successful recovery — "Falling back to browser navigation" — and it is
     caused by this harness driving sixteen routes through one page object in
     ten seconds, which is not a thing a reader does. Muted by exact text, not
     by relaxing the rule: any other console error still fails the run. */
  /Failed to fetch RSC payload.*Falling back to browser navigation/i,
];

const problems = [];
let pages = 0;

for (const [name, engine] of [
  ["webkit", webkit],
  ["firefox", firefox],
]) {
  let browser;
  try {
    browser = await engine.launch();
  } catch (err) {
    problems.push(`${name}: could not launch — ${err.message.split("\n")[0]}`);
    continue;
  }

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`uncaught: ${err.message}`));

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const path = `${locale}${route === "/" ? "" : route}` || "/";
      errors.length = 0;

      let status = 0;
      try {
        const res = await page.goto(BASE + path, {
          waitUntil: "commit",
          timeout: TIMEOUT,
        });
        status = res?.status() ?? 0;
        await page.waitForSelector("main", { state: "attached", timeout: TIMEOUT });
        await page.waitForTimeout(600);
      } catch (err) {
        problems.push(`${name}  ${path}  navigation failed — ${err.message.split("\n")[0]}`);
        continue;
      }

      pages += 1;

      if (status !== 200) {
        problems.push(`${name}  ${path}  HTTP ${status}`);
        continue;
      }

      const seen = await page.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        main: Boolean(document.querySelector("main")),
        engineLinks: [...document.querySelectorAll('a[href*="reserve-online"]')].map(
          (a) => a.getAttribute("href") ?? "",
        ),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      if (!seen.main) problems.push(`${name}  ${path}  no <main>`);
      if (seen.h1 !== 1) problems.push(`${name}  ${path}  ${seen.h1} <h1> elements, expected 1`);
      if (!seen.engineLinks.length)
        problems.push(`${name}  ${path}  no route to the reservation engine`);
      if (path.includes("/rooms/evexia")) {
        /* Evexia has no engine id; the documented fallback is the plain URL. */
        const invented = seen.engineLinks.filter((h) => h.includes("bedroom="));
        if (invented.length)
          problems.push(`${name}  ${path}  invents a bedroom id for a room that has none`);
      }
      if (seen.scrollWidth > seen.innerWidth + 1)
        problems.push(
          `${name}  ${path}  horizontal overflow: scrollWidth ${seen.scrollWidth} > ${seen.innerWidth}`,
        );

      const real = errors.filter((e) => !IGNORE.some((re) => re.test(e)));
      for (const e of real.slice(0, 3)) {
        problems.push(`${name}  ${path}  console: ${e.slice(0, 90)}`);
      }
    }
  }

  console.log(`  ${name.padEnd(8)} ${ROUTES.length * LOCALES.length} pages`);
  await browser.close();
}

console.log(`\nchecked ${pages} page loads across two engines`);
if (!problems.length) {
  console.log("the site renders, stays quiet and keeps its booking links in WebKit and Firefox");
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)].slice(0, 40)) console.error(`  ${p}`);
process.exitCode = 1;
