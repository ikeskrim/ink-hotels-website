/**
 * Screenshot pages at several viewports for design review.
 *   node scripts/shots.mjs <outDir> [path ...]
 * Dev tooling only.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [, , outDir = "shots", ...paths] = process.argv;
const routes = paths.length ? paths : ["/"];
const BASE = process.env.BASE ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const errors = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.isMobile ?? false,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${vp.name}] ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${vp.name}] PAGEERROR ${e.message}`));

  for (const route of routes) {
    const url = BASE + route;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    }
    // Let entrance animations settle before capturing.
    await page.waitForTimeout(2600);

    const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");

    await page.screenshot({
      path: path.join(outDir, `${slug}--${vp.name}-fold.png`),
      fullPage: false,
    });

    // Scroll through so lazy content and reveals fire, then capture full page.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.waitForTimeout(900);

    await page.screenshot({
      path: path.join(outDir, `${slug}--${vp.name}-full.png`),
      fullPage: true,
    });
    console.log(`  ${slug} @ ${vp.name}`);
  }
  await ctx.close();
}

await browser.close();

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of [...new Set(errors)]) console.log("  " + e);
} else {
  console.log("\nNo console errors.");
}
