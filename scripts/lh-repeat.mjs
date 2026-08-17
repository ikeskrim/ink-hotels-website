/**
 * Lighthouse, N times per route, reported as min/median/max.
 *
 * A single run on this machine moved 84 → 82 → 84 for an unchanged build, so a
 * one-shot number cannot tell an improvement from noise. Everything in the
 * performance pass is judged against the median of three.
 *
 *   BASE=http://localhost:3000 RUNS=3 node scripts/lh-repeat.mjs [route ...]
 */
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const BASE = process.env.BASE ?? "http://localhost:3000";
const RUNS = Number(process.env.RUNS ?? 3);
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

console.log(`${RUNS} runs per route · ${BASE}\n`);
console.log("route             perf(min/med/max)   LCP med    FCP med    TBT med");
console.log("".padEnd(74, "-"));

const summary = [];
for (const route of ROUTES) {
  const perf = [];
  const lcp = [];
  const fcp = [];
  const tbt = [];

  for (let i = 0; i < RUNS; i++) {
    const r = await lighthouse(
      BASE + route,
      { port: chrome.port, output: "json", logLevel: "error" },
      undefined,
    );
    if (!r) continue;
    const { categories, audits } = r.lhr;
    perf.push(Math.round((categories.performance?.score ?? 0) * 100));
    lcp.push(audits["largest-contentful-paint"]?.numericValue ?? 0);
    fcp.push(audits["first-contentful-paint"]?.numericValue ?? 0);
    tbt.push(audits["total-blocking-time"]?.numericValue ?? 0);
  }

  const row =
    `${route.padEnd(17)} ` +
    `${String(Math.min(...perf)).padStart(3)}/${String(median(perf)).padStart(3)}/${String(Math.max(...perf)).padStart(3)}        ` +
    `${(median(lcp) / 1000).toFixed(2)}s      ` +
    `${(median(fcp) / 1000).toFixed(2)}s      ` +
    `${Math.round(median(tbt))}ms`;
  console.log(row);
  summary.push({ route, perf: median(perf), lcp: median(lcp) });
}

console.log(
  `\nmedian perf across routes: ${median(summary.map((s) => s.perf))}`,
);

try {
  await chrome.kill();
} catch {
  /* chrome-launcher cannot always remove its own temp profile on Windows;
     that must not swallow the numbers we just collected. */
}
