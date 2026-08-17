/**
 * Fetch every route in every locale and print the served <title> and
 * <meta description>, so a wrong-language tag is visible rather than assumed.
 *
 * Run: BASE=http://localhost:3000 node scripts/meta-check.mjs
 */
const BASE = process.env.BASE ?? "http://localhost:3000";
const LOCALES = ["en", "el", "de", "fr", "nl"];
const ROUTES = ["/", "/rooms", "/experiences", "/gallery", "/story", "/rethymno",
                "/arrival", "/location", "/contact", "/faq", "/accessibility",
                "/careers", "/privacy", "/terms"];

/* A title is "leaking" if the non-English page serves byte-identical text to
   the English one. Brand-only titles are excluded by hand where the name is
   the same in every language. */
let leaks = 0;
for (const route of ROUTES) {
  const seen = {};
  for (const l of LOCALES) {
    const url = BASE + (l === "en" ? route : `/${l}${route === "/" ? "" : route}`);
    const html = await (await fetch(url)).text();
    const t = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
    const d = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "";
    seen[l] = { t, d };
  }
  /* Cognates are not leaks. "Rethymno" is the same word in German and Dutch,
     and "Contact" in French and Dutch; a byte-identical title is only a bug
     when the description — always a full sentence — matches too. */
  const same = LOCALES.filter((l) => l !== "en" && seen[l].t === seen.en.t);
  const sameD = LOCALES.filter((l) => l !== "en" && seen[l].d === seen.en.d);
  const cognate = same.length > 0 && sameD.length === 0;
  const bad = sameD.length > 0;
  if (bad) leaks++;
  console.log(`${bad ? "LEAK" : "ok  "}  ${route.padEnd(16)} de: ${seen.de.t.slice(0, 52)}`);
  if (same.length) console.log(`        title identical to English in: ${same.join(", ")}${cognate ? "  (cognate — description differs, so not a leak)" : ""}`);
  if (sameD.length) console.log(`        description identical to English in: ${sameD.join(", ")}`);
}
console.log(`\n${leaks}/${ROUTES.length} routes still serve English metadata to another locale.`);

/* CI depends on this exiting non-zero. A check that only prints is
   decoration: it stays green while the thing it watches rots. */
process.exitCode = leaks ? 1 : 0;
