/**
 * The header's colour follows the ground it is over.
 *
 *   BASE=http://localhost:3000 node scripts/header-ground-check.mjs
 *
 * The bar is transparent with a white lockup over a dark ground — a full-bleed
 * photograph, an ink section — and takes its solid paper bar over a light one.
 * That used to be decided by a hand-maintained list of routes that "open with
 * a full-bleed hero", which could only ever describe the top of a page and
 * went stale whenever a page was added. It is now measured from the
 * `data-ground` every section already declares.
 *
 * Two things this asserts that the route list could not:
 *
 *   the bar inverts MID-PAGE, when the reader scrolls from a paper section
 *   onto an ink one — the old code flipped solid after 24px and stayed there
 *
 *   it is right on every page, including any page added tomorrow, because
 *   nothing here knows the name of a single route
 *
 * The trap this check exists to catch: grounds nest. Every page is inside a
 * paper-ground wrapper that spans all of it, so at any scroll position at
 * least two elements cross the header's line. The first implementation took
 * whichever the observer reported last and got the wrapper about half the
 * time — reporting "paper" over a black hero. The answer has to be the deepest
 * intersecting ground, and a page whose hero is dark is the case that proves
 * it.
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";

/** Pages with at least one dark section and one light one. */
const ROUTES = ["/", "/story", "/rooms/harmony", "/rethymno"];

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

let failures = 0;
let checked = 0;

/* Warm every route first, and throw the pass away.
   
   The first visit to a route on a cold server is still settling while it is
   measured: the server is compiling it, images are arriving, and sections move
   under the bar between the scroll and the sample. Measured cold this reported
   two failures against code that four consecutive warm runs found perfect, and
   CI is nothing but cold servers. Warming is not weakening the check — every
   assertion below is unchanged; it just stops measuring a page that is still
   being built. */
for (const route of ROUTES) {
  await goto(page, BASE + route, { waitFor: "header, main" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
}

for (const route of ROUTES) {
  await goto(page, BASE + route, { waitFor: "header, main" });

  /* Every ground band on the page, with the scroll position that puts its
     middle under the bar. */
  const bands = await page.evaluate(() => {
    const y = window.scrollY;
    return [...document.querySelectorAll("[data-ground]")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          ground: el.getAttribute("data-ground"),
          top: Math.round(r.top + y),
          height: Math.round(r.height),
        };
      })
      /* Skip the page-spanning wrapper and anything too short to scroll to. */
      .filter((b) => b.height > 400 && b.height < document.body.scrollHeight * 0.6);
  });

  for (const band of bands) {
    await page.evaluate((y) => window.scrollTo(0, y), band.top + 200);

    /* The expected answer is computed the same way the component computes it:
       the DEEPEST ground crossing the header's line. Deriving it from which
       band was scrolled to would be guessing at page structure — several of
       these "bands" are containers that wrap a hero of a different ground, and
       the first version of this check called the component wrong for correctly
       reporting the hero. */
    /* Sample until the page stops moving under the bar.

       On a cold server the first pass through a page is still settling —
       images arrive, sections shift, and the ground under the header at the
       moment of the read is not the one that was there when the scroll was
       issued. A single read after a fixed wait reported two failures on the
       first run and none on the second, against identical code. A check that
       depends on how warm the server is will eventually be believed when it is
       wrong, so it now waits for two consecutive readings to agree before it
       asserts anything. */
    const read = () => page.evaluate((headerHeight) => {
      const crossing = [...document.querySelectorAll("[data-ground]")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.top <= headerHeight && r.bottom > headerHeight;
      });
      const deepest = crossing.find(
        (el) => !crossing.some((other) => other !== el && el.contains(other)),
      );
      const header = document.querySelector("header");
      if (!header) return null;
      return {
        /* Computed here, independently of anything the header believes. */
        ground: deepest?.getAttribute("data-ground") ?? null,
        /* What the header decided. Its declared state rather than its computed
           background: the bar transitions over 700ms, and a reading taken
           part-way through sees an intermediate alpha that is neither
           transparent nor solid. That made the first version of this check
           report failures against correct code, which is worse than no check —
           a flaky guard gets ignored, or gets "fixed" by weakening it. */
        transparent: header.getAttribute("data-bar") === "transparent",
      };
    }, 72);

    /* Wait for the page to actually stop moving.
       
       This site runs Lenis, so window.scrollTo does not jump — it glides to
       the target over several hundred milliseconds. Every fixed wait tried
       here was sometimes too short, and the samples then landed mid-glide,
       where the ground under the bar is genuinely still changing. Two
       consecutive readings could agree with each other on a plateau and both
       be wrong. So the scroll position itself is polled until it settles,
       which is the condition that actually matters. */
    await page.waitForFunction(
      () => {
        const w = window;
        const last = w.__lastY;
        w.__lastY = Math.round(w.scrollY);
        w.__still = last === w.__lastY ? (w.__still ?? 0) + 1 : 0;
        return w.__still >= 3;
      },
      undefined,
      { timeout: 8000, polling: 150 },
    );
    await page.evaluate(() => {
      delete window.__lastY;
      delete window.__still;
    });

    let seen = await read();
    for (let attempt = 0; attempt < 6; attempt++) {
      await page.waitForTimeout(300);
      const again = await read();
      if (again && seen && again.ground === seen.ground && again.transparent === seen.transparent) {
        seen = again;
        break;
      }
      seen = again;
    }

    if (!seen) {
      console.log(`FAIL  ${route}  no header element`);
      failures++;
      continue;
    }
    if (!seen.ground) continue;

    checked++;
    const wantTransparent = seen.ground === "ink" || seen.ground === "night";
    const ok = seen.transparent === wantTransparent;
    if (!ok) failures++;
    console.log(
      `${ok ? "ok  " : "FAIL"}  ${route.padEnd(16)} under the bar: ${String(seen.ground).padEnd(6)} ` +
        `bar ${seen.transparent ? "transparent" : "solid     "} ` +
        `${ok ? "" : `— expected ${wantTransparent ? "transparent" : "solid"}`}`,
    );
  }
}

await browser.close();

console.log(`\n${checked} ground crossings checked; ${failures} wrong.`);

/* A check that can pass by measuring nothing is decoration. */
if (checked < 8) {
  console.log("too few crossings found — the page structure changed and this check stopped looking");
  process.exitCode = 1;
} else {
  process.exitCode = failures ? 1 : 0;
}
