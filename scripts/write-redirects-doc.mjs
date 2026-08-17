/**
 * Write REDIRECTS.md from the map, so the document cannot drift from the code.
 *
 *   node scripts/write-redirects-doc.mjs
 */
import { writeFileSync, readFileSync } from "node:fs";

import { MAP, LOCALES, buildRedirects } from "../redirects.mjs";

let harvest = { harvestedCount: MAP.length, origin: "https://inkhotels.gr" };
try {
  harvest = JSON.parse(readFileSync("scripts/live-urls.json", "utf8"));
} catch {
  /* not committed yet */
}

const rules = buildRedirects();

/** Group the map by destination area, in the order the file declares them. */
const GROUPS = [
  ["Experiences", (to) => to.startsWith("/experiences")],
  ["Rethymno", (to) => to.startsWith("/rethymno")],
  ["The story", (to) => to.startsWith("/story")],
  ["Careers", (to) => to.startsWith("/careers")],
  ["No direct equivalent", () => true],
];

const used = new Set();
const sections = [];

for (const [title, test] of GROUPS) {
  const rows = MAP.filter(([from, to]) => !used.has(from) && test(to));
  for (const [from] of rows) used.add(from);
  if (rows.length) sections.push({ title, rows });
}

const lines = [
  "# Launch redirects",
  "",
  "Every URL the live " +
    `[${harvest.origin.replace(/^https?:\/\//, "")}](${harvest.origin}) publishes today,` +
    " pointed at where that page now lives.",
  "",
  "**Generated — do not edit.** The map lives in [`redirects.mjs`](redirects.mjs);",
  "run `node scripts/write-redirects-doc.mjs` after changing it.",
  "",
  "## Why this exists",
  "",
  "The new site replaces the old one on the same hostname. The moment DNS moves,",
  "every URL Google holds in its index is requested against this codebase, and",
  "each one that 404s is a ranking thrown away. For a hotel, in the weeks before",
  "a season, that is bookings.",
  "",
  `All ${harvest.harvestedCount ?? MAP.length} indexed URLs are covered.`,
  `That is ${MAP.length} mappings, expanded to **${rules.length} rules** —`,
  `each source also gets a variant under every locale prefix (${LOCALES.join(", ")}),`,
  "so an old link that arrives with a language on it keeps that language instead",
  "of dropping the reader into English.",
  "",
  "Every rule is a **301** (`permanent: true`, which Next serves as a 308).",
  "A temporary redirect passes no ranking, which would defeat the purpose.",
  "",
  "**These are inert until the domain switch.** The sources are old",
  "inkhotels.gr paths; nothing requests them while the site lives on another",
  "hostname. Nothing here needs to be timed with the cutover.",
  "",
  "## The map",
  "",
];

for (const { title, rows } of sections) {
  lines.push(`### ${title}`, "", "| old | new |", "| --- | --- |");
  for (const [from, to] of rows) lines.push(`| \`${from}\` | \`${to}\` |`);
  lines.push("");
}

lines.push(
  "## Decisions worth knowing",
  "",
  "**The old site prefixed English; this one does not.** Every source begins",
  "`/en/` and every destination does not, so no row is a mechanical rewrite.",
  "",
  "**`/en/dream-weadding-on-the-beach` is spelled that way on purpose.** The",
  "misspelling is in the indexed URL. Correcting it here would simply fail to",
  "match and the ranking would be lost.",
  "",
  "**The five Rethymno landmarks each had their own numbered page** and are now",
  "entries on one. Each redirect carries the anchor of its own entry, so someone",
  "who searched for Arkadi Monastery lands on Arkadi rather than at the top of a",
  "long page. The ids exist on `/rethymno` for exactly this reason, and CI",
  "asserts they are still there.",
  "",
  "**Two pages have no counterpart, and none was invented.** The Covid measures",
  "page described measures no longer in force — republishing them would be",
  "stating something untrue — so it goes to the FAQ, where a guest with a",
  "practical question is actually served. \"Ink Special Announcements\" was a",
  "noticeboard with nothing standing on it, so it goes to the homepage.",
  "",
  "## What CI checks",
  "",
  "`scripts/redirect-check.mjs`, on every push:",
  "",
  "- the table parses and every rule is well-formed and permanent",
  "- no duplicate source, where the second rule could never fire",
  "- no loop, direct or through a chain",
  "- no chain at all: a 301 to a 301 leaks ranking and costs a round trip",
  "- every destination returns 200 on the running site",
  "- every anchored destination has an element with that id",
  "- every harvested URL has a rule, and every rule matches a harvested URL",
  "",
);

writeFileSync("REDIRECTS.md", lines.join("\n"));
console.log(`REDIRECTS.md — ${MAP.length} mappings, ${rules.length} rules`);
