/**
 * Which font files are preloaded on a page, how big they are, and which family
 * the LCP element actually uses.
 *
 * Run: BASE=http://localhost:3000 node scripts/font-probe.mjs [route ...]
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/el"];

const browser = await launch();

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });
  const bytes = new Map();
  page.on("response", async (r) => {
    if (!/\.woff2?($|\?)/.test(r.url())) return;
    try {
      bytes.set(r.url().split("/").pop(), (await r.body()).length);
    } catch {
      /* body already discarded */
    }
  });

  await page.goto(BASE + route, { waitUntil: "networkidle" });

  const preloads = await page.$$eval(
    'link[rel="preload"][as="font"]',
    (ls) => ls.map((l) => l.getAttribute("href").split("/").pop()),
  );

  const lcp = await page.evaluate(() => {
    /* The hero lede — measured earlier as the LCP element on every route. */
    const el =
      document.querySelector("[data-hero-lede]") ??
      [...document.querySelectorAll("p")]
        .map((p) => ({ p, a: p.getBoundingClientRect().width * p.getBoundingClientRect().height }))
        .filter((x) => x.p.getBoundingClientRect().top < window.innerHeight)
        .sort((a, b) => b.a - a.a)[0]?.p;
    if (!el) return null;
    return {
      text: el.textContent.slice(0, 45),
      family: getComputedStyle(el).fontFamily.split(",")[0].trim(),
    };
  });

  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  console.log(`\n=== ${route} ===`);
  console.log(`largest above-fold paragraph uses: ${lcp?.family}`);
  console.log(`  "${lcp?.text}…"`);
  console.log(`preloaded fonts: ${preloads.length} · downloaded ${Math.round(total / 1024)} kB total`);
  for (const f of preloads) {
    console.log(`  PRELOAD  ${String(Math.round((bytes.get(f) ?? 0) / 1024)).padStart(3)} kB  ${f}`);
  }
  for (const [f, b] of bytes) {
    if (!preloads.includes(f)) console.log(`  lazy     ${String(Math.round(b / 1024)).padStart(3)} kB  ${f}`);
  }
  await page.close();
}

await browser.close();
