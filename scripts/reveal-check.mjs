/**
 * Assert that nothing is left invisible after a reader has scrolled past it.
 *
 *   BASE=http://localhost:3000 node scripts/reveal-check.mjs
 *
 * Scroll entrances are inline `opacity: 0` until an IntersectionObserver
 * fires. Three things can stop that happening — a threshold set too deep, a
 * page opened in a background tab, an element already above the viewport —
 * and in every case the result is the same: a section of the site that is
 * simply not there. This walks each page at a reading pace and fails if any
 * entrance is still hidden behind it.
 *
 * Also measures the largest vertical gap between visible content, which is
 * the other half of the complaint: not invisible, just very far apart.
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/rooms", "/rethymno", "/story", "/experiences", "/gallery", "/arrival"];

const browser = await launch();
let failures = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await goto(page, BASE + route, { waitUntil: "networkidle" });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate((h) => window.scrollTo(0, h), height);

  /**
   * Settle, then poll.
   *
   * A single wait has to be as long as the site's slowest declared entrance or
   * it reports a false alarm. The Story page's written mark runs nib → wipe →
   * swash → press → colophon and takes about 3.5 seconds by design, and a
   * 900 ms sample called it "stuck" while it was still perfectly on schedule.
   *
   * So this polls instead: as soon as nothing is hidden it stops, and it only
   * fails after six seconds of nothing changing. A genuinely stuck element is
   * still caught — it is stuck at second six too.
   */
  const findStuck = () =>
    page.evaluate(() =>
    [...document.querySelectorAll("[style]")]
      .filter((el) => {
        const s = el.getAttribute("style") || "";
        return (
          /opacity:\s*0(?!\.)/.test(s) || /clip-path:\s*inset\((?!0%)/.test(s)
        );
      })
      /* A hero frame that is not the current one is meant to be at zero, and
         so is the nib once it has finished writing — both are decoration
         with no text in them. Only content that has words can be missing. */
      .filter((el) => !el.closest("[data-decorative]"))
      .filter((el) => !el.closest('[aria-hidden="true"]'))
      .filter((el) => (el.textContent || "").trim().length > 0)
      .map((el) => ({
        text: (el.textContent || "").trim().slice(0, 48),
        cls: el.className.toString().slice(0, 40),
      })),
    );

  let stuck = await findStuck();
  for (let waited = 0; stuck.length && waited < 6000; waited += 600) {
    await page.waitForTimeout(600);
    stuck = await findStuck();
  }

  /* The largest run of empty vertical space between two pieces of content. */
  const gap = await page.evaluate(() => {
    /* dt/dd and figcaption belong here: leaving them out made a definition
       list read as a thousand pixels of nothing, which is a false alarm and
       the fastest way to stop trusting this number. */
    const boxes = [
      ...document.querySelectorAll(
        "main h1, main h2, main h3, main h4, main p, main img, main li, main dt, main dd, main figcaption, main a, main button, main input, main select",
      ),
    ]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      })
      .filter((b) => b.bottom > b.top)
      .sort((a, b) => a.top - b.top);
    let worst = 0;
    let at = 0;
    let reach = 0;
    for (const b of boxes) {
      if (b.top - reach > worst) {
        worst = Math.round(b.top - reach);
        at = Math.round(reach);
      }
      reach = Math.max(reach, b.bottom);
    }
    return { worst, at };
  });

  const ok = stuck.length === 0;
  if (!ok) failures++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${route.padEnd(14)} ${String(stuck.length).padStart(2)} stuck · largest gap ${String(gap.worst).padStart(4)}px at y=${gap.at}`,
  );
  for (const s of stuck.slice(0, 5)) console.log(`        ${s.cls} — ${s.text}`);

  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} route(s) with hidden content` : "\nNothing hidden.");
process.exitCode = failures ? 1 : 0;
