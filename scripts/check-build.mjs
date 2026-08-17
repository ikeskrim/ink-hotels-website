/**
 * Refuse to serve a build that is not intact.
 *
 * Runs as `prestart`. The failure it exists to prevent: `npm run build` while a
 * dev server is live. Both write `.next`, the dev server wins the race on some
 * files, and `next start` then serves a chunk graph with holes — most pages are
 * fine because they are static HTML, and the few that reach furthest into the
 * data layer return 500. /rethymno is the heaviest page on this site (chapters,
 * landmarks, the intro, the history and the neighbourhood), so it is the first
 * to break and looks like a bug in that page rather than a broken build.
 *
 * Checking BUILD_ID alone is not enough — it survives the clobbering. This
 * compares the routes the build claims to have prerendered against the routes
 * whose HTML actually exists on disk.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const NEXT = ".next";
const problems = [];

if (!existsSync(NEXT)) {
  console.error("No .next directory. Run `npm run build` first.");
  process.exit(1);
}

for (const f of ["BUILD_ID", "prerender-manifest.json", "routes-manifest.json"]) {
  if (!existsSync(join(NEXT, f))) problems.push(`missing ${f}`);
}

if (problems.length) {
  console.error("The build is incomplete:");
  for (const p of problems) console.error(`  ${p}`);
  console.error("\nRun `npm run build` with no dev server running.");
  process.exit(1);
}

/* Every route the manifest says was prerendered must have its HTML on disk. */
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(NEXT, "prerender-manifest.json"), "utf8"));
} catch (err) {
  console.error(`prerender-manifest.json is unreadable: ${err.message}`);
  process.exit(1);
}

const routes = Object.keys(manifest.routes ?? {});
const missing = [];
for (const route of routes) {
  const rel = route === "/" ? "/index" : route;
  const base = join(NEXT, "server", "app", rel);
  /* A page emits .html/.rsc. A route handler — sitemap.xml, robots.txt, the
     OG image, the icons — emits .body and .meta instead, and appears in the
     same manifest. Both count as present; only neither is a hole. */
  const present =
    existsSync(`${base}.html`) ||
    existsSync(`${base}.rsc`) ||
    existsSync(`${base}.body`) ||
    existsSync(join(base, "route.js"));
  if (!present) missing.push(route);
}

if (missing.length) {
  console.error(
    `The build claims ${routes.length} prerendered routes but ${missing.length} have no output:\n`,
  );
  for (const r of missing.slice(0, 12)) console.error(`  ${r}`);
  if (missing.length > 12) console.error(`  … and ${missing.length - 12} more`);
  console.error(
    "\nThis is what a .next clobbered by a concurrent dev server looks like.",
  );
  console.error("Stop every dev server, delete .next, and run `npm run build`.");
  process.exit(1);
}

console.log(`build intact — ${routes.length} prerendered routes present`);
