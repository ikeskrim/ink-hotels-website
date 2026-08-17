/**
 * Fail loudly if any /media/... path referenced in source does not exist on disk.
 * A broken hero image is invisible in a diff and obvious to a visitor.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const MEDIA = path.join(ROOT, "public", "media");

const onDisk = new Set(fs.readdirSync(MEDIA));

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

const missing = [];
const undersized = [];
let refs = 0;

/**
 * Files that render a photograph full-bleed. An image used here is scaled to
 * the whole viewport, so anything under 2000px is visibly soft on a laptop and
 * embarrassing on a 2x display. Two 1080px portraits shipped in the hero this
 * way once; this is here so it cannot happen twice.
 *
 * `the-water.tsx` was on this list and is no longer: the section became a
 * two-up diptych, so each plate is drawn at roughly 50vw and is held to the
 * ordinary standard. That is a change in the component, not a relaxation of
 * the rule — put a photograph back across the whole viewport there and it
 * belongs back on this list.
 */
const FULL_BLEED = /hero\.tsx|page-hero\.tsx|depth\.tsx|not-found\.tsx|the-arrival\.tsx/i;
const MIN_FULL_BLEED_WIDTH = 2000;

/**
 * Documented exceptions: the subject exists nowhere larger in the library.
 * Each of these is a request for a reshoot, not a standard being relaxed.
 */
const EXEMPT = new Map([
  [
    "9053c1c0aa924fb16769460a7c06ae29.webp",
    "Harmony's plunge pool — 1920px is the largest frame of the only pool on the property. Reshoot: highest-ADR asset on the site.",
  ],
]);

/**
 * Generated image lists, resolved so an indirect reference is still checked.
 *
 * A hero written as `EVEXIA_IMAGES[0]` used to slip past this script entirely,
 * because there is no `/media/…` literal in the file. A guard that only sees
 * string literals stops guarding the moment somebody refactors to a constant —
 * which is precisely when a mistake is most likely.
 */
const GENERATED = path.join(SRC, "content", "generated");
const lists = new Map();
if (fs.existsSync(GENERATED)) {
  for (const f of fs.readdirSync(GENERATED)) {
    const text = fs.readFileSync(path.join(GENERATED, f), "utf8");
    for (const m of text.matchAll(
      /export const ([A-Z0-9_]+)[^=]*=\s*\[([\s\S]*?)\];/g,
    )) {
      lists.set(
        m[1],
        [...m[2].matchAll(/"\/media\/([A-Za-z0-9_.-]+)"/g)].map((x) => x[1]),
      );
    }
  }
}

async function checkSize(rel, name) {
  if (EXEMPT.has(name)) return;
  const meta = await sharp(path.join(MEDIA, name)).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < MIN_FULL_BLEED_WIDTH) {
    undersized.push(`${rel} → ${name} is ${w}×${h} (needs ≥${MIN_FULL_BLEED_WIDTH} wide)`);
  } else if (h > w) {
    undersized.push(`${rel} → ${name} is portrait ${w}×${h} in a full-bleed slot`);
  }
}

const sources = walk(SRC);

for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  const isFullBleed = FULL_BLEED.test(rel);

  for (const m of text.matchAll(/["'`]\/media\/([A-Za-z0-9_.-]+)["'`]/g)) {
    refs++;
    const name = m[1];
    if (!onDisk.has(name)) {
      missing.push(`${rel} → /media/${name}`);
      continue;
    }
    if (isFullBleed) await checkSize(rel, name);
  }

  /* Indirect: `SOME_IMAGES[0]` in a full-bleed file. */
  if (isFullBleed) {
    for (const m of text.matchAll(/\b([A-Z0-9_]{3,})\[(\d+)\]/g)) {
      const list = lists.get(m[1]);
      const name = list?.[Number(m[2])];
      if (name && onDisk.has(name)) {
        refs++;
        await checkSize(rel, name);
      }
    }
  }
}

/* ── Every `quality` must be declared in next.config ───────────────────────
   Declaring `images.qualities` makes Next answer any UNDECLARED quality with
   a 400 — a broken image in production and nowhere else, because dev serves
   the original. This introduced four broken images the day the list was
   added. The check costs nothing and would have caught all four. */
const configSrc = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
const declared = new Set(
  (configSrc.match(/qualities:\s*\[([^\]]*)\]/)?.[1] ?? "")
    .split(",")
    .map((n) => Number(n.trim()))
    .filter(Number.isFinite),
);

const undeclared = new Map();
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/quality=\{(\d+)\}/g)) {
    const q = Number(m[1]);
    if (declared.size && !declared.has(q)) {
      undeclared.set(q, (undeclared.get(q) ?? []).concat(path.relative(ROOT, file)));
    }
  }
}

console.log(`checked ${refs} media references against ${onDisk.size} files`);
console.log(
  `image qualities declared: ${[...declared].sort((a, b) => a - b).join(", ")}`,
);

if (undeclared.size) {
  console.error(`\n${undeclared.size} QUALITY VALUE(S) NOT DECLARED in next.config.ts:`);
  for (const [q, files] of undeclared) {
    console.error(`  quality={${q}} → ${[...new Set(files)].join(", ")}`);
  }
  console.error("  Next answers these with 400. Move the component onto the");
  console.error("  ladder, or add the value to images.qualities.");
  process.exit(1);
}

if (missing.length) {
  console.error(`\n${missing.length} MISSING:`);
  for (const m of missing) console.error("  " + m);
}
if (undersized.length) {
  console.error(`\n${undersized.length} TOO SMALL FOR A FULL-BLEED SLOT:`);
  for (const u of undersized) console.error("  " + u);
}
if (missing.length || undersized.length) process.exit(1);

console.log("all media references resolve, and every full-bleed image is large enough");
if (EXEMPT.size) {
  console.log(`\n${EXEMPT.size} documented exemption(s) — reshoot list:`);
  for (const [file, why] of EXEMPT) console.log(`  ${file.slice(0, 14)} — ${why}`);
}
