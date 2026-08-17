/**
 * Accessibility audit across every route, at desktop and mobile, with axe-core.
 *   BASE=http://localhost:3100 node scripts/a11y.mjs
 * Dev tooling only.
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";

const ROUTES = [
  "/",
  "/rooms",
  "/rooms/evexia",
  "/rooms/harmony",
  "/rooms/agapi",
  "/rooms/eros",
  "/rooms/zoi",
  "/rooms/room-with-terrace-phos",
  "/rooms/sea-view-balcony-house-of-europe",
  "/rooms/residence-of-the-old-port",
  "/experiences",
  "/experiences/private-boat-trip",
  "/experiences/rent-a-car",
  "/experiences/kourtaliotiko-gorge",
  "/gallery",
  "/story",
  "/rethymno",
  "/arrival",
  "/location",
  "/contact",
  "/faq",
  "/accessibility",
  "/careers",
  "/terms",
  "/privacy",
  "/this-route-does-not-exist",
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
let total = 0;
const bySeverity = { critical: 0, serious: 0, moderate: 0, minor: 0 };
const seen = new Map();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();

    for (const v of results.violations) {
      total += v.nodes.length;
      bySeverity[v.impact ?? "minor"] =
        (bySeverity[v.impact ?? "minor"] ?? 0) + v.nodes.length;
      const key = `${v.id}`;
      if (!seen.has(key)) {
        seen.set(key, {
          id: v.id,
          impact: v.impact,
          help: v.help,
          where: new Set(),
          sample: v.nodes[0]?.html?.slice(0, 160),
        });
      }
      seen.get(key).where.add(`${route} (${vp.name})`);
    }
  }
  await ctx.close();
}

await browser.close();

console.log(`\n${ROUTES.length} routes × ${VIEWPORTS.length} viewports`);
console.log(`total violation nodes: ${total}`);
console.log(
  `critical ${bySeverity.critical ?? 0} · serious ${bySeverity.serious ?? 0} · moderate ${bySeverity.moderate ?? 0} · minor ${bySeverity.minor ?? 0}`,
);

if (seen.size === 0) {
  console.log("\nNo violations.");
} else {
  console.log("\nUnique issues:");
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  for (const v of [...seen.values()].sort(
    (a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9),
  )) {
    console.log(`\n  [${(v.impact ?? "?").toUpperCase()}] ${v.id} — ${v.help}`);
    console.log(`    routes: ${[...v.where].slice(0, 6).join(", ")}${v.where.size > 6 ? ` +${v.where.size - 6}` : ""}`);
    if (v.sample) console.log(`    e.g. ${v.sample}`);
  }
  process.exitCode = 1;
}
