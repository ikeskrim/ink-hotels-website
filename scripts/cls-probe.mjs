/** Report which elements actually shift, and by how much. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/rooms"];

const browser = await chromium.launch();

for (const route of routes) {
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    isMobile: true,
  });
  const page = await ctx.newPage();

  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__shifts.push({
          value: entry.value,
          time: Math.round(entry.startTime),
          sources: (entry.sources ?? []).map((s) => ({
            tag: s.node?.tagName,
            cls: s.node?.className?.toString?.().slice(0, 80),
            from: s.previousRect
              ? `${Math.round(s.previousRect.y)}`
              : "",
            to: s.currentRect ? `${Math.round(s.currentRect.y)}` : "",
          })),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  /* Match Lighthouse's mobile profile: slow 4G and a 4x CPU handicap, which is
     what makes late-arriving fonts and images reflow visibly. */
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: Math.round((1.6 * 1024 * 1024) / 8),
    uploadThroughput: Math.round((750 * 1024) / 8),
    connectionType: "cellular4g",
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForTimeout(6000);

  const shifts = await page.evaluate(() => window.__shifts);
  const total = shifts.reduce((s, x) => s + x.value, 0);

  console.log(`\n=== ${route} — CLS ${total.toFixed(4)} across ${shifts.length} shifts ===`);
  for (const s of shifts.sort((a, b) => b.value - a.value).slice(0, 6)) {
    console.log(`  ${s.value.toFixed(4)} @ ${s.time}ms`);
    for (const src of s.sources.slice(0, 3)) {
      console.log(`     <${src.tag}> y ${src.from} → ${src.to}  ${src.cls}`);
    }
  }
  await ctx.close();
}

await browser.close();
