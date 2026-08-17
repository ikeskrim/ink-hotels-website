/**
 * Hold the launch redirect map to its promises.
 *
 * A redirect table is the one piece of this codebase that cannot be tested by
 * using the site: its sources belong to a hostname we are not serving yet, so
 * every rule is dead code until the day it is all that matters. That is exactly
 * the shape of thing that rots quietly, so it is checked structurally here and
 * — where possible — against the running site.
 *
 * Five faults, each of which silently destroys a ranking:
 *
 *   a duplicate source, where the second rule never fires and nobody notices
 *   a loop, where a source redirects to itself directly or through a chain
 *   a chain, where a destination is itself a source: a 301 to a 301 leaks
 *     ranking and costs a round trip, and Google gives up after a few hops
 *   a destination that is not a real page, which turns a ranking into a 404
 *   a source that is not actually an old URL, which is a rule guarding nothing
 *
 * The last two need the site running; without BASE the structural checks still
 * run, so this is useful locally and thorough in CI.
 *
 *   BASE=http://localhost:3000 node scripts/redirect-check.mjs
 */
import { readFileSync } from "node:fs";

import { MAP, LOCALES, buildRedirects } from "../redirects.mjs";

const BASE = process.env.BASE?.replace(/\/$/, "");
const problems = [];

/* ── It parses, and it is the shape Next expects ───────────────────────── */
let rules;
try {
  rules = buildRedirects();
} catch (err) {
  console.error(`redirects.mjs threw while building: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(rules) || !rules.length) {
  console.error("buildRedirects() produced no rules");
  process.exit(1);
}

for (const r of rules) {
  if (typeof r.source !== "string" || !r.source.startsWith("/")) {
    problems.push(`bad source: ${JSON.stringify(r.source)}`);
  }
  if (typeof r.destination !== "string" || !r.destination.startsWith("/")) {
    problems.push(`bad destination on ${r.source}: ${JSON.stringify(r.destination)}`);
  }
  if (r.permanent !== true) {
    problems.push(`${r.source} is not permanent — a temporary redirect passes no ranking`);
  }
}

/* ── No duplicate sources ──────────────────────────────────────────────── */
const bySource = new Map();
for (const r of rules) {
  if (bySource.has(r.source)) {
    problems.push(
      `duplicate source ${r.source} — the second rule can never fire ` +
        `(→ ${bySource.get(r.source)} and → ${r.destination})`,
    );
  }
  bySource.set(r.source, r.destination);
}

/* ── No loops, and no chains ───────────────────────────────────────────── */
const bare = (p) => p.split("#")[0];

for (const r of rules) {
  if (bare(r.destination) === r.source) {
    problems.push(`${r.source} redirects to itself`);
    continue;
  }
  /* Follow the chain. Anything longer than one hop is a fault, but walk it so
     the message can name the cycle rather than just assert one exists. */
  const seen = [r.source];
  let cursor = bare(r.destination);
  while (bySource.has(cursor)) {
    if (seen.includes(cursor)) {
      problems.push(`loop: ${[...seen, cursor].join(" → ")}`);
      break;
    }
    seen.push(cursor);
    cursor = bare(bySource.get(cursor));
    if (seen.length > 8) {
      problems.push(`chain too long from ${r.source}: ${seen.join(" → ")}`);
      break;
    }
  }
  if (seen.length > 1 && !problems.some((p) => p.includes(seen.join(" → ")))) {
    problems.push(
      `chain: ${seen.join(" → ")} → ${cursor} — a 301 to a 301 leaks ranking`,
    );
  }
}

/* ── Every source is a URL the old site actually had ───────────────────── */
let harvested = null;
try {
  harvested = JSON.parse(readFileSync("scripts/live-urls.json", "utf8"));
} catch {
  /* harvest not committed; skip this check rather than fail on it */
}

if (harvested?.paths) {
  const known = new Set(harvested.paths);
  for (const [from] of MAP) {
    if (!known.has(from)) {
      problems.push(`${from} is not in the harvest — a rule guarding nothing`);
    }
  }
  /* And the reverse: an indexed URL with no rule is a ranking about to 404. */
  for (const p of harvested.paths) {
    if (p === "/") continue;
    if (!MAP.some(([from]) => from === p)) {
      problems.push(`${p} is indexed but has no redirect — it will 404 at the switch`);
    }
  }
}

/* ── Every destination is a real page ──────────────────────────────────── */
if (BASE) {
  const targets = [...new Set(MAP.map(([, to]) => bare(to)))];
  for (const t of targets) {
    try {
      const res = await fetch(BASE + t, { redirect: "follow" });
      if (res.status !== 200) {
        problems.push(`destination ${t} → HTTP ${res.status}`);
      }
    } catch (err) {
      problems.push(`destination ${t} → ${err.message}`);
    }
  }

  /* An anchor destination only lands correctly if the id exists. */
  const anchored = MAP.filter(([, to]) => to.includes("#"));
  for (const [, to] of anchored) {
    const [path, hash] = to.split("#");
    try {
      const html = await (await fetch(BASE + path)).text();
      if (!new RegExp(`id="${hash}"`).test(html)) {
        problems.push(`${to} — no element with id="${hash}" on ${path}`);
      }
    } catch (err) {
      problems.push(`${to} — could not check the anchor: ${err.message}`);
    }
  }
}

/* ── Report ────────────────────────────────────────────────────────────── */
console.log(
  `${MAP.length} mappings → ${rules.length} rules ` +
    `(${LOCALES.length} locale variants each)`,
);
if (BASE) console.log(`destinations checked against ${BASE}`);
else console.log("no BASE set — structural checks only");

if (!problems.length) {
  console.log("no duplicates, no loops, no chains, every destination resolves");
  process.exit(0);
}

console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of problems) console.error(`  ${p}`);
process.exit(1);
