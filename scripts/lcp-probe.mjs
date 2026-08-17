/** What is the LCP element, and what did the page actually download? */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const browser = await chromium.launch();

for (const route of routes) {
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    isMobile: true,
  });
  const page = await ctx.newPage();

  const bytes = [];
  page.on("response", async (res) => {
    const h = res.headers();
    const len = Number(h["content-length"] ?? 0);
    const type = h["content-type"] ?? "";
    if (len > 4000) {
      bytes.push({ url: res.url().slice(0, 110), len, type: type.split(";")[0] });
    }
  });

  await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForTimeout(2500);

  const lcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = null;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) last = e;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => {
          if (!last) return resolve(null);
          resolve({
            time: Math.round(last.startTime),
            size: last.size,
            tag: last.element?.tagName,
            cls: last.element?.className?.toString().slice(0, 70),
            src: last.url || last.element?.currentSrc?.slice(0, 110) || "",
          });
        }, 400);
      }),
  );

  console.log(`\n=== ${route} ===`);
  console.log("LCP:", JSON.stringify(lcp, null, 1));
  bytes.sort((a, b) => b.len - a.len);
  const total = bytes.reduce((s, b) => s + b.len, 0);
  console.log(`downloaded (>4kB): ${(total / 1024).toFixed(0)} kB across ${bytes.length} responses`);
  for (const b of bytes.slice(0, 8)) {
    console.log(`  ${(b.len / 1024).toFixed(0).padStart(5)} kB  ${b.type.padEnd(16)} ${b.url}`);
  }
  await ctx.close();
}

await browser.close();
