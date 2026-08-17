/**
 * Lighthouse across the key routes, mobile emulation (the harsher profile).
 *   BASE=http://localhost:3100 node scripts/lh.mjs [route ...]
 * Dev tooling only.
 */
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const BASE = process.env.BASE ?? "http://localhost:3100";
const routes = process.argv.slice(2);
const ROUTES = routes.length
  ? routes
  : ["/", "/rooms", "/rooms/harmony", "/gallery", "/experiences", "/contact"];

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const rows = [];
const notes = [];

for (const route of ROUTES) {
  const result = await lighthouse(
    BASE + route,
    { port: chrome.port, output: "json", logLevel: "error" },
    undefined,
  );
  if (!result) continue;
  const { categories, audits } = result.lhr;
  const pct = (c) => Math.round((c?.score ?? 0) * 100);

  rows.push({
    route,
    perf: pct(categories.performance),
    a11y: pct(categories.accessibility),
    bp: pct(categories["best-practices"]),
    seo: pct(categories.seo),
    lcp: audits["largest-contentful-paint"]?.displayValue ?? "-",
    cls: audits["cumulative-layout-shift"]?.displayValue ?? "-",
    tbt: audits["total-blocking-time"]?.displayValue ?? "-",
  });

  for (const key of [
    "largest-contentful-paint",
    "unused-javascript",
    "render-blocking-resources",
    "uses-responsive-images",
    "modern-image-formats",
    "unsized-images",
    "font-display",
  ]) {
    const a = audits[key];
    if (a && a.score !== null && a.score < 0.9) {
      notes.push(`${route} · ${key}: ${a.displayValue ?? a.title}`);
    }
  }
}

/* chrome-launcher sometimes cannot remove its own temp profile on Windows;
   that must not swallow the results we just collected. */
try {
  await chrome.kill();
} catch {
  /* ignore */
}

console.log(
  "\nroute                      perf  a11y   bp   seo    LCP        CLS     TBT",
);
console.log("-".repeat(84));
for (const r of rows) {
  console.log(
    `${r.route.padEnd(26)} ${String(r.perf).padStart(4)}  ${String(r.a11y).padStart(4)} ${String(r.bp).padStart(4)}  ${String(r.seo).padStart(4)}   ${r.lcp.padEnd(10)} ${r.cls.padEnd(7)} ${r.tbt}`,
  );
}

const avg = (k) => Math.round(rows.reduce((s, r) => s + r[k], 0) / rows.length);
console.log("-".repeat(84));
console.log(
  `${"AVERAGE".padEnd(26)} ${String(avg("perf")).padStart(4)}  ${String(avg("a11y")).padStart(4)} ${String(avg("bp")).padStart(4)}  ${String(avg("seo")).padStart(4)}`,
);

if (notes.length) {
  console.log("\nOpportunities:");
  for (const n of [...new Set(notes)]) console.log("  " + n);
}
