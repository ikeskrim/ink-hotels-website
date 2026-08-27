/**
 * A phone number never appears alone.
 *
 * The owner's rule: wherever a number is printed, its extension is printed
 * with it and WhatsApp is offered beside it. A guest who dials the reception
 * number without "ext. 1" reaches a switchboard and gives up, and a guest
 * abroad pays for a Greek call they could have had free.
 *
 * Every page in every locale is fetched, reduced to the text a reader would
 * see, and judged occurrence by occurrence. Pages that print no number are not
 * the rule's business and are skipped.
 *
 * Two things are deliberately not counted as "printed":
 *
 *   - JSON-LD and meta tags. They carry the number for Google, must carry it,
 *     and no guest reads them.
 *   - Distance measured in markup. An InkAnchor emits several hundred
 *     characters of Tailwind classes, so two links on adjacent lines can be
 *     two thousand characters apart in the HTML. Proximity is measured in
 *     stripped text instead, which is what the reader actually scans.
 *
 * Run: BASE=http://localhost:3000 node scripts/phone-check.mjs
 */
const BASE = process.env.BASE ?? "http://localhost:3000";
const LOCALES = ["en", "el", "de", "fr", "nl"];
const ROUTES = [
  "/", "/rooms", "/experiences", "/gallery", "/story", "/rethymno",
  "/arrival", "/location", "/contact", "/faq", "/accessibility",
  "/careers", "/privacy", "/terms", "/offline",
];

const RECEPTION = "+30 211 444 5757";
const MOBILE = "+30 697 406 9475";
const WA_HREF = "wa.me/306974069475";
/* The label is "WhatsApp" in all five catalogues — it is a brand, not a word
   to translate — so one string serves every locale. */
const WA_WORD = "WhatsApp";

/** How far from a number, in characters of text, still counts as "beside it". */
const NEAR = 220;

/** What a reader sees: no scripts, no meta, no tags, whitespace collapsed. */
function readable(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<meta[^>]*>/g, " ")
    .replace(/<title>[\s\S]*?<\/title>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

/** Every index at which `needle` occurs in `hay`. */
function occurrences(hay, needle) {
  const out = [];
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + 1)) {
    out.push(i);
  }
  return out;
}

let failures = 0;
let pagesWithNumber = 0;

for (const route of ROUTES) {
  for (const l of LOCALES) {
    const path = l === "en" ? route : `/${l}${route === "/" ? "" : route}`;
    const res = await fetch(BASE + path);
    if (!res.ok) {
      console.log(`FAIL  ${path.padEnd(18)} ${res.status}`);
      failures++;
      continue;
    }
    const html = await res.text();
    const body = readable(html);

    const hits = [
      ...occurrences(body, RECEPTION).map((i) => [RECEPTION, i]),
      ...occurrences(body, MOBILE).map((i) => [MOBILE, i]),
    ];
    if (!hits.length) continue;
    pagesWithNumber++;

    const problems = [];

    for (const [number, i] of hits) {
      const after = body.slice(i + number.length, i + number.length + 40);

      /* The extension reads "(ext. 1)" in English, carries each locale's own
         word, and on the arrival page is written as prose — ", extension 1".
         All three are the extension being shown, so what is asserted is a lone
         1 shortly after the number with no other digits in between. Only the
         reception number has an extension; the mobile has none. */
      if (number === RECEPTION && !/^[^0-9]{0,24}1(?![0-9])/.test(after)) {
        problems.push(
          `no extension after the reception number ("…${after.slice(0, 26).trim()}")`,
        );
      }

      const around = body.slice(Math.max(0, i - NEAR), i + NEAR);
      if (!around.includes(WA_WORD)) {
        problems.push(`${number} with no WhatsApp within ${NEAR} characters of text`);
      }
    }

    /* The word has to be a link, or it is a mention rather than an option. */
    if (!html.includes(WA_HREF)) {
      problems.push("WhatsApp is named but never linked");
    }

    /* One line per page, however many of its occurrences failed. */
    const unique = [...new Set(problems)];
    if (unique.length) {
      failures++;
      console.log(`FAIL  ${path.padEnd(18)} ${unique.join("; ")}`);
    } else {
      console.log(
        `ok    ${path.padEnd(18)} ${hits.length} number(s), each with its extension and WhatsApp`,
      );
    }
  }
}

console.log(
  `\n${pagesWithNumber} pages print a number; ${failures} of them break the rule.`,
);

/* A check that can pass by finding nothing is decoration. */
if (!pagesWithNumber) {
  console.log("no page printed a number at all — nothing was actually guarded");
  process.exitCode = 1;
} else {
  process.exitCode = failures ? 1 : 0;
}
