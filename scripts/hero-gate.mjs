/* Prove the hero starts static and the cycle begins only after an LCP entry. */
import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 412, height: 915 } });
const marks = [];
await p.exposeFunction("__mark", (m, t) => marks.push([m, Math.round(t)]));
await p.addInitScript(() => {
  new PerformanceObserver((l) => {
    if (l.getEntries().length) window.__mark?.("lcp-entry", performance.now());
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
await p.goto("http://localhost:3000/", { waitUntil: "load" });

const frames = () => p.evaluate(() => document.querySelectorAll("[data-decorative] img").length);
const at = async (ms) => { await p.waitForTimeout(ms); return frames(); };

const t0 = await frames();
const t1 = await at(400);
const t2 = await at(2500);
console.log(`hero frames mounted:  at load ${t0} · +0.4s ${t1} · +2.9s ${t2}`);
console.log("marks:", marks.map(([m, t]) => `${m}@${t}ms`).join(", ") || "(none)");
await b.close();
