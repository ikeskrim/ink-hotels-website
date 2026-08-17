/**
 * Audit every image referenced in source: real pixel dimensions, file size, and
 * whether it is large enough for the slot it is rendered into.
 *   node scripts/audit-images.mjs
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const MEDIA = path.join(ROOT, "public", "media");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

/* Which files are referenced, and from where. */
const refs = new Map();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/["'`]\/media\/([A-Za-z0-9_.-]+)["'`]/g)) {
    const rel = path.relative(ROOT, file);
    if (!refs.has(m[1])) refs.set(m[1], new Set());
    refs.get(m[1]).add(rel);
  }
}

const rows = [];
for (const [file, where] of refs) {
  const full = path.join(MEDIA, file);
  if (!fs.existsSync(full)) continue;
  const stat = fs.statSync(full);
  let meta;
  try {
    meta = await sharp(full).metadata();
  } catch {
    continue;
  }
  rows.push({
    file,
    w: meta.width ?? 0,
    h: meta.height ?? 0,
    kb: Math.round(stat.size / 1024),
    mp: ((meta.width ?? 0) * (meta.height ?? 0)) / 1e6,
    where: [...where],
  });
}

rows.sort((a, b) => a.w - b.w);

/* A full-bleed hero on a 2x 1440 display wants ~2400px. A half-width editorial
   figure wants ~1400. Anything under 1200 is suspect anywhere prominent. */
const HERO = /hero|page-hero|cinematic|the-water|the-arrival|not-found/i;

console.log("smallest 30 referenced images\n");
console.log("px            MP    KB   file              used in");
console.log("-".repeat(100));
for (const r of rows.slice(0, 30)) {
  const prominent = r.where.some((w) => HERO.test(w));
  const flag = r.w < 1200 ? (prominent ? " ‹‹ HERO, TOO SMALL" : " ‹ small") : "";
  console.log(
    `${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${r.mp.toFixed(1).padStart(4)} ${String(r.kb).padStart(5)} ${r.file.slice(0, 14)}  ${r.where.map((w) => path.basename(w)).join(", ").slice(0, 40)}${flag}`,
  );
}

const under1200 = rows.filter((r) => r.w < 1200);
const under1600 = rows.filter((r) => r.w < 1600);
console.log(
  `\n${rows.length} referenced · ${under1200.length} under 1200px wide · ${under1600.length} under 1600px`,
);
