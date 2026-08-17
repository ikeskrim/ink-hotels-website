/**
 * What the LCP actually is, and where its milliseconds go.
 *
 * Two hypotheses were tested against this and both were wrong — that the hero
 * cycling was on the critical path, and that the body webfont's repaint was.
 * Guessing was the expensive part; this asks Lighthouse directly, under the
 * same throttling that produces the score.
 *
 * Run: BASE=http://localhost:3000 node scripts/lcp-breakdown.mjs [route ...]
 */
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

for (const route of ROUTES) {
  const r = await lighthouse(
    BASE + route,
    { port: chrome.port, output: "json", logLevel: "error" },
    undefined,
  );
  if (!r) continue;
  const { audits } = r.lhr;

  console.log(`\n════ ${route} ════`);

  const el = audits["largest-contentful-paint-element"];
  const items = el?.details?.items ?? [];
  for (const group of items) {
    if (group.type === "table" || group.items) {
      for (const row of group.items ?? []) {
        if (row.node) {
          console.log(`LCP element: ${row.node.nodeLabel}`);
          console.log(`  ${row.node.snippet?.slice(0, 110)}`);
        }
        if (row.phase) {
          console.log(
            `  ${String(row.phase).padEnd(14)} ${String(Math.round(row.timing)).padStart(5)} ms  (${row.percent})`,
          );
        }
      }
    }
  }

  /* The chain that has to finish before the LCP can paint. */
  const chain = audits["critical-request-chains"];
  console.log(`\ncritical chain longest: ${chain?.displayValue ?? "n/a"}`);

  for (const key of [
    "server-response-time",
    "render-blocking-resources",
    "unminified-css",
    "uses-text-compression",
    "total-byte-weight",
    "network-rtt",
    "network-server-latency",
    "prioritize-lcp-image",
    "font-display",
  ]) {
    const a = audits[key];
    if (!a || a.score === null) continue;
    const mark = a.score < 0.9 ? "!" : " ";
    console.log(`${mark} ${key.padEnd(28)} ${a.displayValue ?? a.score}`);
  }
}

try {
  await chrome.kill();
} catch {
  /* Windows temp-profile cleanup can fail; the numbers are already printed. */
}
