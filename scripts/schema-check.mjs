/**
 * The JSON-LD on every route, parsed and checked against what it claims to be.
 *
 *   BASE=http://localhost:3000 node scripts/schema-check.mjs
 *
 * Structured data fails silently. A trailing comma, a field renamed upstream,
 * a `@type` that no longer matches the shape below it — the page renders
 * perfectly, Lighthouse says 100 for SEO, and the rich result quietly stops
 * appearing. For a hotel that is the difference between a search result with a
 * photograph and a price range and a search result that is a blue link.
 *
 * Nothing here validates against schema.org's full vocabulary; that needs a
 * network call to a third party on every push. What it does is catch the three
 * failures that actually happen:
 *
 *   1. It no longer parses. Anything else is moot.
 *   2. A required field went missing — the ones Google documents as required
 *      for the rich result, not every field the vocabulary allows.
 *   3. The advertised image is not there. An `og:image` or a schema `image`
 *      that 404s is worse than none: the crawler fetched it and got nothing,
 *      and the card falls back to whatever it can scrape.
 *
 * The third is the one that bit here. Four images on /rethymno were answering
 * 400 in production because a quality value was not on the allowlist — the
 * page looked fine, the markup was valid, and the pictures were broken.
 */
import { launch, goto } from "./lib/browser.mjs";
import { rooms } from "../src/content/rooms.ts";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

const ROUTES = [
  "/", "/rooms", "/rooms/evexia", "/rooms/harmony", "/experiences", "/gallery",
  "/story", "/rethymno", "/arrival", "/location", "/contact", "/faq",
  "/el", "/de/rooms",
];

/* What each type must carry to be eligible for its rich result. Deliberately
   the required set, not the complete one: a check that demands every optional
   field is a check somebody switches off. */
const REQUIRED = {
  Hotel: ["name", "address", "image"],
  /* The room pages emit `Suite`, not `HotelRoom` — both are Accommodation
     subtypes and Suite is the truthful one here. Listing only HotelRoom meant
     this map checked a type the site never emits, which is a check that always
     passes. Both are listed so a change of type stays covered. */
  Suite: ["name"],
  HotelRoom: ["name"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  Question: ["name", "acceptedAnswer"],
};

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];
const seenTypes = new Map();
const images = new Set();

function check(node, route) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const n of node) check(n, route);
    return;
  }

  const type = node["@type"];
  if (typeof type === "string") {
    seenTypes.set(type, (seenTypes.get(type) ?? 0) + 1);
    const required = REQUIRED[type];
    if (required) {
      for (const field of required) {
        const value = node[field];
        const empty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);
        if (empty) {
          problems.push(`${route}  ${type} is missing required "${field}"`);
        }
      }
    }
  }

  /* Collect every image the markup advertises, wherever it appears. */
  for (const key of ["image", "photo", "logo"]) {
    const v = node[key];
    if (typeof v === "string") images.add(v);
    else if (Array.isArray(v)) for (const s of v) if (typeof s === "string") images.add(s);
    else if (v && typeof v === "object" && typeof v.url === "string") images.add(v.url);
  }

  for (const v of Object.values(node)) {
    if (v && typeof v === "object") check(v, route);
  }
}

for (const route of ROUTES) {
  const res = await goto(page, BASE + route, { waitFor: "main, body" });
  if (!res || res.status() !== 200) {
    problems.push(`${route}  HTTP ${res?.status()}`);
    continue;
  }

  const blocks = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent ?? "",
    ),
  );

  if (!blocks.length) {
    problems.push(`${route}  no JSON-LD at all`);
    continue;
  }

  let parsed = 0;
  for (const [i, text] of blocks.entries()) {
    try {
      check(JSON.parse(text), route);
      parsed += 1;
    } catch (err) {
      problems.push(`${route}  JSON-LD block ${i + 1} does not parse — ${err.message}`);
    }
  }

  /* ── hreflang ──────────────────────────────────────────────────────────
     Five languages plus x-default, on every route. Google treats a missing or
     asymmetric set as five duplicates of one page and picks one to keep — so
     an omission here does not look like a bug, it looks like four of the five
     languages quietly not ranking. */
  const alts = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({
      lang: l.getAttribute("hreflang"),
      href: l.getAttribute("href"),
    })),
  );
  const langs = alts.map((a) => a.lang);
  for (const want of ["en-GB", "el-GR", "de-DE", "fr-FR", "nl-NL", "x-default"]) {
    if (!langs.includes(want)) {
      problems.push(`${route}  hreflang is missing ${want}`);
    }
  }
  for (const a of alts) {
    if (!a.href || !a.href.startsWith("http")) {
      problems.push(`${route}  hreflang ${a.lang} is not an absolute URL`);
    }
  }
  /* The prefix must match the language it claims. */
  for (const [lang, prefix] of [["el-GR", "/el/"], ["de-DE", "/de/"], ["fr-FR", "/fr/"], ["nl-NL", "/nl/"]]) {
    const a = alts.find((x) => x.lang === lang);
    if (a?.href && !new URL(a.href).pathname.startsWith(prefix) && new URL(a.href).pathname !== prefix.slice(0, -1)) {
      problems.push(`${route}  hreflang ${lang} points at ${new URL(a.href).pathname}`);
    }
  }

  /* The og:image the page advertises to a card. */
  const og = await page.evaluate(
    () => document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
  );
  if (!og) problems.push(`${route}  no og:image`);
  else images.add(og);

  console.log(`  ${route.padEnd(16)} ${parsed}/${blocks.length} block(s) parsed`);
}

/* ── Every advertised image must actually be there ──────────────────────── */
console.log(`\n  resolving ${images.size} advertised image(s)…`);
let ok = 0;
for (const src of images) {
  const url = src.startsWith("http")
    ? src.replace(/^https?:\/\/[^/]+/, BASE)
    : BASE + (src.startsWith("/") ? src : `/${src}`);
  try {
    const r = await page.request.fetch(url, { timeout: 20_000 });
    if (r.status() !== 200) {
      problems.push(`advertised image answers ${r.status()} — ${src.slice(-60)}`);
    } else ok += 1;
  } catch (err) {
    problems.push(`advertised image could not be fetched — ${src.slice(-60)} (${err.message.split("\n")[0]})`);
  }
}

/* Every suite advertises its own frame, so a shared link shows the right room. */
const suiteImages = new Set(rooms.map((r) => r.images[0]).filter(Boolean));
console.log(`  ${ok}/${images.size} resolve · ${suiteImages.size} suite lead frames on record`);

await browser.close();

console.log(
  `\ntypes found: ${[...seenTypes].map(([t, n]) => `${t}×${n}`).join(", ")}`,
);
if (!problems.length) {
  console.log("every JSON-LD block parses, carries its required fields, and its images resolve");
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)].slice(0, 40)) console.error(`  ${p}`);
process.exitCode = 1;
