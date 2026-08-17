/**
 * Report exactly which content keys each locale overlay is missing.
 * Reads the compiled overlays through tsx-free parsing of the English sources.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src", "content");
const OVERLAY = path.join(ROOT, "src", "i18n", "content");

const read = (p) => fs.readFileSync(p, "utf8");

const roomsSrc = read(path.join(CONTENT, "rooms.ts"));
// Scope the house ids to the `houses` array. Rooms now carry `id:` at the same
// indent — the suites are keyed by slug rather than by a reservation number —
// so an unscoped match reported evexia, eros and zoi as missing buildings.
const housesSrc = roomsSrc.slice(
  roomsSrc.indexOf("export const houses"),
  roomsSrc.indexOf("export interface Bed"),
);

const expected = {
  rooms: [...roomsSrc.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]),
  houses: [...housesSrc.matchAll(/^\s{4}id: "([a-z-]+)",/gm)].map((m) => m[1]),
  experiences: [...read(path.join(CONTENT, "experiences.ts")).matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]),
  places: [...read(path.join(CONTENT, "place.ts")).matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]),
  chapters: [...read(path.join(CONTENT, "rethymno.ts")).matchAll(/^\s{4}id: "([a-z-]+)",/gm)].map((m) => m[1]),
};
// Count only the entries in the `faqs` array — the `Faq` interface above it also
// declares a `question:` field, which would otherwise inflate the expected count by one.
const faqSrc = read(path.join(CONTENT, "faq.ts"));
const faqCount = (faqSrc.slice(faqSrc.indexOf("export const faqs")).match(/question:/g) ?? []).length;

console.log(
  `English: ${expected.rooms.length} rooms · ${expected.experiences.length} experiences · ` +
  `${expected.places.length} places · ${expected.chapters.length} chapters · ${faqCount} faqs\n`,
);

let broken = 0;
for (const locale of ["de", "fr", "nl", "el"]) {
  const file = path.join(OVERLAY, `${locale}.ts`);
  if (!fs.existsSync(file)) { console.log(`${locale}: MISSING FILE`); broken++; continue; }
  const src = read(file);

  const section = (name) => {
    const m = src.match(new RegExp(`^  ${name}: \\{([\\s\\S]*?)^  \\},`, "m"));
    return m ? m[1] : "";
  };

  const report = [];
  for (const [group, keys] of Object.entries(expected)) {
    const body = section(group === "houses" ? "houses" : group);
    // Keys may be quoted ("sea-view-phos": {) or bare identifiers (phos: {) — accept both.
    const missing = keys.filter(
      (k) => !new RegExp(`(?:^|[{,\\s])(?:["']${k}["']|${k})\\s*:`, "m").test(body),
    );
    report.push(`${group} ${keys.length - missing.length}/${keys.length}`);
    if (missing.length) { broken++; report.push(`      missing: ${missing.join(", ")}`); }
  }
  const faqs = (src.match(/question:/g) ?? []).length;
  report.push(`faqs ${faqs}/${faqCount}${faqs !== faqCount ? "  ‹‹ falls back entirely" : ""}`);
  if (faqs !== faqCount) broken++;

  console.log(`${locale}:`);
  for (const line of report) console.log(`   ${line}`);
  console.log();
}

process.exitCode = broken ? 1 : 0;
