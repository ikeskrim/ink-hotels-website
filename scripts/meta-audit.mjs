/**
 * Which routes ship a hardcoded English <title> and <meta description> on every
 * locale, and which already derive them from the reader's language.
 *
 * Run: node scripts/meta-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/app/[locale]";
const rows = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry === "page.tsx") inspect(p);
  }
}

function inspect(p) {
  const src = readFileSync(p, "utf8");
  if (!src.includes("pageMetadata(")) return;

  const at = src.indexOf("pageMetadata(");
  const block = src.slice(at, at + 900);
  const title = /title:\s*(?:"([^"]*)"|`([^`]*)`|([A-Za-z][\w.$[\]]*))/.exec(block);
  const localeAware = /locale[,:]/.test(block);

  rows.push({
    route: p.replace(ROOT, "").replace(/[\\/]page\.tsx$/, "") || "/",
    mode: /export const metadata/.test(src) ? "static" : "generateMetadata",
    hardcoded: Boolean(title && title[1] !== undefined),
    localeAware,
    title: title ? (title[1] ?? title[2] ?? title[3]).slice(0, 70) : "?",
  });
}

walk(ROOT);
rows.sort((a, b) => Number(b.hardcoded) - Number(a.hardcoded) || a.route.localeCompare(b.route));

let bad = 0;
for (const r of rows) {
  const flag = r.hardcoded ? "EN-ONLY" : "ok     ";
  if (r.hardcoded) bad++;
  console.log(`${flag}  ${r.mode.padEnd(16)} ${(r.route || "/").padEnd(18)} ${r.title}`);
}
console.log(`\n${bad}/${rows.length} routes ship English metadata to every locale.`);
