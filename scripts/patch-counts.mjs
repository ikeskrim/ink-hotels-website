/**
 * Sweep the remaining hard-coded counts and the old building story.
 *
 *   node scripts/patch-counts.mjs
 *
 * These are page-level strings that were written before the structure was
 * known: "four buildings", "three houses", "the Gateway Suite Agapi". Each one
 * is replaced with what is now true. A miss is reported rather than silently
 * skipped, because a half-applied sweep is worse than none.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const EDITS = [
  [
    "src/content/arrival.ts",
    " * Ink is not one building with a lobby — it is four buildings in a medieval",
    " * Ink is not one building with a lobby — it is two houses and a residence in a medieval",
  ],
  [
    "src/content/arrival.ts",
    'lede: "The hotel occupies four buildings in the old town. You come to one of them — the first — and somebody walks you to your room from there.",',
    'lede: "The hotel occupies two buildings in the old town, and a residence by the harbour. You come to one door — House of Europe, the first building, at Nikolaou Plastira 4 — and somebody walks you to your room from there.",',
  ],
  [
    "src/content/arrival.ts",
    "It is the reception for all four buildings.",
    "It is the reception for the whole hotel, and where all seven suites are. It is open until 23:00.",
  ],
  [
    "src/content/rethymno.ts",
    "Ottoman lanes and three houses of the 1700s",
    "Ottoman lanes and two houses of the 1700s",
  ],
  [
    "src/app/[locale]/arrival/page.tsx",
    '"Ink Hotels occupies four buildings in the old town of Rethymno. You arrive at one — the first, at Nikolaou Plastira 4 — where somebody is expecting you and walks you to your room.",',
    '"Ink Hotels occupies two buildings in the old town of Rethymno, and a residence by the harbour. You arrive at one door — House of Europe, the first building, at Nikolaou Plastira 4 — where somebody is expecting you and walks you to your room. Reception is open until 23:00.",',
  ],
  [
    "src/app/[locale]/location/page.tsx",
    "Four buildings, addresses, coordinates and directions.",
    "Two buildings and a residence: addresses, coordinates and directions.",
  ],
  [
    "src/app/[locale]/location/page.tsx",
    'lede="Not near it, not above it — inside it. The hotel occupies four buildings within the medieval quarter, between the Venetian harbour and the Fortezza."',
    'lede="Not near it, not above it — inside it. You arrive at House of Europe on Nikolaou Plastira, where reception and all seven suites are; Phos is a short walk away, and the residence stands by the Venetian harbour."',
  ],
  [
    "src/app/[locale]/location/page.tsx",
    "The four buildings",
    "The addresses",
  ],
  [
    "src/app/[locale]/accessibility/page.tsx",
    "The Gateway Suite Agapi at Ink Hotels was designed for wheelchair users",
    "The suite Agapi at Ink Hotels was designed for wheelchair users",
  ],
  [
    "src/app/[locale]/faq/page.tsx",
    "The Gateway Suite Agapi was designed for wheelchair users.",
    "The suite Agapi was designed for wheelchair users.",
  ],
  [
    "src/app/[locale]/story/page.tsx",
    "Three historic buildings of the 1700s in the medieval old town of Rethymno.",
    "Two historic houses of the 1700s in the medieval old town of Rethymno, and a residence by the harbour.",
  ],
  [
    "src/app/[locale]/story/page.tsx",
    "{/* ── The three houses ──────────────────────────────────────────── */}",
    "{/* ── The buildings ─────────────────────────────────────────────── */}",
  ],
  [
    "src/app/[locale]/gallery/page.tsx",
    "the two houses, the four Gateway Suites, the Residence of the Old Port, and the medieval old town of Rethymno around them.",
    "the two houses, the seven suites, the Residence of the Old Port, and the medieval old town of Rethymno around them.",
  ],
  [
    "src/app/opengraph-image.tsx",
    "Three houses of the 1700s.",
    "Seven suites in the old town.",
  ],
  [
    "src/components/home/the-arrival.tsx",
    " * Four buildings in a medieval quarter is genuinely unusual, and a guest who",
    " * Two houses and a residence in a medieval quarter is genuinely unusual, and a guest who",
  ],
];

let missed = 0;
const touched = new Set();

for (const [rel, from, to] of EDITS) {
  const file = path.join(ROOT, rel);
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes(from)) {
    if (text.includes(to)) continue; // already applied
    console.log(`MISS  ${rel}\n      ${from.slice(0, 70)}`);
    missed++;
    continue;
  }
  fs.writeFileSync(file, text.replace(from, to));
  touched.add(rel);
}

console.log(`${EDITS.length - missed}/${EDITS.length} applied across ${touched.size} files`);
if (missed) process.exitCode = 1;
