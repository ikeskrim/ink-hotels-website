/**
 * Nothing is lost and nothing is doubled when the homepage becomes a trailer.
 *
 *   BASE=http://localhost:3000 node --import tsx scripts/trailer-parity.mjs
 *
 * Stage 5.2 moves eight sections off the homepage and onto `/rooms`, `/story`
 * and `/rethymno`. The promise made when it was built was that this is a
 * relocation and not a deletion — eight blocks of copy, in five languages,
 * that must arrive somewhere.
 *
 * A promise like that is worth exactly as much as the thing that checks it,
 * because the failure is silent: a shorter homepage looks *better*, and a
 * section that never landed on its destination looks like nothing at all. You
 * would find out when a guest asked where the arrival steps went.
 *
 * ── What it asserts, per locale ────────────────────────────────────────────
 *   1. Every RETAINED section is on the homepage.
 *   2. Every RELOCATED section is NOT on the homepage.
 *   3. Every RELOCATED section IS on the destination the table names.
 *   4. No section appears on two pages at once — a relocation that forgets to
 *      remove is a duplication, and Google reads duplicated blocks as thin
 *      content.
 *   5. The totals add up: retained + relocated equals the fifteen sections the
 *      homepage started with.
 *
 * With the flag off it asserts the mirror image — all fifteen on the homepage,
 * none of them on the destination pages — so it guards the *current* shipped
 * state too, not only the future one. It is a check for both worlds because
 * the flag can be flipped either way at any time.
 *
 * Sections are identified by `data-section`, set on the component. Matching on
 * heading text would need the catalogue in five languages and would break the
 * first time the copy changed; matching on position would break the first time
 * a section moved, which is the change this exists to guard.
 */
import { launch, goto } from "./lib/browser.mjs";
import {
  TRAILER,
  RETAINED,
  RELOCATED,
} from "../src/content/homepage-trailer.ts";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["", "/el", "/de", "/fr", "/nl"];
const DESTINATIONS = ["/rooms", "/story", "/rethymno"];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

/* Not a photograph is needed to read an attribute. */
await page.route("**/*", (route) => {
  const type = route.request().resourceType();
  if (type === "image" || type === "media" || type === "font") return route.abort();
  return route.continue();
});

const problems = [];

/** The `data-section` names present on a page. */
async function sectionsOn(path) {
  const res = await goto(page, BASE + (path || "/"), { waitFor: "main, body" });
  if (!res || res.status() !== 200) {
    problems.push(`${path || "/"}  HTTP ${res?.status()}`);
    return new Set();
  }
  const found = await page.evaluate(() =>
    [...document.querySelectorAll("[data-section]")].map(
      (el) => el.getAttribute("data-section") ?? "",
    ),
  );
  /* A name appearing twice on one page is its own fault. */
  const seen = new Set();
  for (const n of found) {
    if (seen.has(n)) problems.push(`${path || "/"}  ${n} rendered twice on one page`);
    seen.add(n);
  }
  return seen;
}

console.log(`  TRAILER is ${TRAILER ? "ON" : "OFF"} — asserting that state\n`);

const relocatedNames = RELOCATED.map((r) => r.section);
const destinationOf = new Map(RELOCATED.map((r) => [r.section, r.to]));
/* Sections that legitimately render nothing today — declared in the table, not
   inferred here. A section with nothing to say and a section that failed to
   arrive look identical from the DOM, so the difference has to be stated. */
const dormant = new Set(RELOCATED.filter((r) => r.dormant).map((r) => r.section));
if (dormant.size) {
  console.log(`  dormant (renders nothing yet): ${[...dormant].join(", ")}
`);
}

for (const locale of LOCALES) {
  const tag = locale || "/en";
  const home = await sectionsOn(locale);

  const onDestination = new Map();
  for (const dest of DESTINATIONS) {
    onDestination.set(dest, await sectionsOn(`${locale}${dest}`));
  }

  /* 1 — the retained set is on the homepage, in both worlds. */
  for (const name of RETAINED) {
    if (!home.has(name)) {
      problems.push(`${tag}  ${name} is missing from the homepage`);
    }
  }

  for (const name of relocatedNames) {
    const dest = destinationOf.get(name);
    const there = onDestination.get(dest)?.has(name) ?? false;

    if (dormant.has(name)) {
      /* Only one thing is still worth asserting: it must not appear twice. */
      if (home.has(name) && there) {
        problems.push(`${tag}  ${name} is on the homepage AND on ${dest}`);
      }
      continue;
    }

    if (TRAILER) {
      /* 2 — gone from the homepage. */
      if (home.has(name)) {
        problems.push(`${tag}  ${name} is still on the homepage after relocation`);
      }
      /* 3 — arrived at its destination. */
      if (!there) {
        problems.push(`${tag}  ${name} left the homepage and never arrived on ${dest}`);
      }
    } else {
      /* The mirror image, so the shipped state is guarded too. */
      if (!home.has(name)) {
        problems.push(`${tag}  ${name} is missing from the homepage and the flag is off`);
      }
      if (there) {
        problems.push(`${tag}  ${name} is on ${dest} while the flag is off — duplicated`);
      }
    }

    /* 4 — never in two places at once, whichever way the flag points. */
    if (home.has(name) && there) {
      problems.push(`${tag}  ${name} is on the homepage AND on ${dest}`);
    }
  }

  /* 5 — the totals. */
  const live = relocatedNames.filter((n) => !dormant.has(n));
  const expectedHome = TRAILER ? RETAINED.length : RETAINED.length + live.length;
  if (home.size !== expectedHome) {
    problems.push(
      `${tag}  homepage carries ${home.size} sections, expected ${expectedHome}`,
    );
  }

  console.log(
    `  ${tag.padEnd(4)} homepage ${String(home.size).padStart(2)} · ` +
      DESTINATIONS.map(
        (d) => `${d} ${String(onDestination.get(d)?.size ?? 0).padStart(2)}`,
      ).join(" · "),
  );
}

await browser.close();

console.log(
  `\nchecked ${LOCALES.length} locales × ${1 + DESTINATIONS.length} pages`,
);
if (!problems.length) {
  console.log(
    TRAILER
      ? "every relocated section arrived, none stayed behind, none is in two places"
      : "all fifteen sections are on the homepage and none has leaked to a destination",
  );
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)].slice(0, 40)) console.error(`  ${p}`);
process.exitCode = 1;
