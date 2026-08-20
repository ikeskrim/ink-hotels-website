/**
 * Every image on every route, in every language, has to say something.
 *
 *   BASE=http://localhost:3000 node scripts/alt-check.mjs
 *
 * axe already catches an <img> with no alt attribute at all. It cannot catch
 * the three ways alt text is wrong on a site like this one:
 *
 *   1. AN EMPTY ALT ON A PHOTOGRAPH THAT CARRIES MEANING. `alt=""` is the
 *      correct, deliberate marking for decoration, and it is also what you get
 *      when somebody could not think of anything to write. The difference is
 *      whether the image is decorative, so this only accepts an empty alt when
 *      the image is inside something already named — an aria-hidden subtree, a
 *      `data-decorative` block, or a control with its own accessible name,
 *      which is what the gallery filmstrip is.
 *
 *   2. FILLER OPENERS. "Image of", "Photo of", "Picture of". A screen reader
 *      has already announced that it is an image; the words are noise in every
 *      language.
 *
 *   3. A CONTROL LABELLED IN THE WRONG LANGUAGE. The one a sighted audit never
 *      finds, because the label is invisible: the suite gallery announced
 *      "Show photograph 3" and "Next photograph" in English on all five
 *      locales, with the translations already sitting in the catalogue.
 *
 * The third is checked by comparing the control labels a locale renders
 * against the ones English renders. Identical strings on a translated route
 * are the signature of a hardcoded label — with an allowance for the ones that
 * genuinely do not translate, like the wordmark.
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

const ROUTES = [
  "/", "/rooms", "/rooms/evexia", "/rooms/harmony", "/experiences", "/gallery",
  "/story", "/rethymno", "/arrival", "/location", "/contact", "/faq",
];
/* The same pages again, in a language that shares no words with English. */
const TRANSLATED = ["/el", "/el/rooms", "/el/rooms/evexia", "/el/gallery", "/el/story"];

/* Names that are the same in every language and are supposed to be. */
const UNTRANSLATABLE = /^(Ink|Ink Hotels|Ink Hotels, Rethymno|The Ink mark|Phos|Evexia|Agapi|Harmony|Facebook|Instagram|WhatsApp)$/i;

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const problems = [];

/** Alt text and control labels as actually rendered. */
async function scan(route) {
  await goto(page, BASE + route, { waitFor: "main, body" });
  /* No scrolling. This reads attributes, not pixels, and `next/image` puts
     every <img> in the DOM immediately — lazy loading is an attribute on the
     tag, not conditional rendering. Verified on the built site: /gallery
     reports 440 images and 435 descriptions whether or not the page has been
     scrolled.

     Scrolling it cost the whole check. Walking /gallery to the bottom forces
     434 image variants to be generated on a cold cache, which saturated the
     optimizer so thoroughly that the *next* route could not return even a
     `commit` inside 60s — CI failed on /experiences, a page with nothing wrong
     with it. */
  return page.evaluate(() => {
    const named = (el) => {
      /* Anything that already gives this image an accessible name — an
         explicit aria-label, or a link or button whose own text names it.
         The second case is the common one and the easy one to get wrong: an
         experience plate with `alt=""` inside a link whose heading reads
         "The organic farm" is correctly marked decorative, and flagging it
         would push somebody to add an alt that says the same thing twice. */
      const labelled = el.closest("[aria-label], [role=img][aria-label]");
      if (labelled) return true;
      const ctl = el.closest("a, button");
      return Boolean(ctl && (ctl.textContent ?? "").trim().length > 0);
    };
    const imgs = [...document.querySelectorAll("img")].map((i) => ({
      alt: i.getAttribute("alt"),
      src: (i.getAttribute("src") ?? "").slice(-26),
      decorative:
        i.closest("[aria-hidden='true'],[data-decorative]") !== null || named(i),
    }));
    const labels = [...document.querySelectorAll("[aria-label]")]
      .map((e) => e.getAttribute("alt") ?? e.getAttribute("aria-label"))
      .filter(Boolean);
    return { imgs, labels };
  });
}

const english = new Map();
for (const route of ROUTES) {
  const { imgs, labels } = await scan(route);
  english.set(route, new Set(labels));
  for (const img of imgs) {
    if (img.alt === null) problems.push(`${route}  <img> has no alt at all  (${img.src})`);
    else if (!img.alt.trim() && !img.decorative)
      problems.push(`${route}  empty alt on an image nothing else names  (${img.src})`);
    else if (/^\s*(image|photo|picture|img)\s+(of|:)/i.test(img.alt))
      problems.push(`${route}  alt opens with filler — "${img.alt.slice(0, 46)}"`);
  }
  console.log(`  ${route.padEnd(18)} ${imgs.length} images · ${labels.length} labels`);
}

for (const route of TRANSLATED) {
  const { labels, imgs } = await scan(route);

  /* The description itself, not just the control around it. A Greek page whose
     alt text contains no Greek letter is alt text that was never translated —
     the control can be perfectly localised while the sentence a blind reader
     actually hears is still English. Counted rather than failed: these live in
     the content layer and need writing, not a code change. */
  const described = imgs.filter((i) => (i.alt ?? "").trim().length > 2);
  const noGreek = described.filter((i) => !/[Ͱ-Ͽ]/.test(i.alt));
  if (described.length) {
    console.log(
      `  ${route.padEnd(18)} ${noGreek.length}/${described.length} described images still read in English`,
    );
  }
  const base = english.get(route.replace(/^\/el/, "") || "/") ?? new Set();
  const shared = labels.filter((l) => base.has(l) && !UNTRANSLATABLE.test(l.trim()));
  const unique = [...new Set(shared)];
  console.log(`  ${route.padEnd(18)} ${unique.length} control label(s) identical to English`);
  for (const l of unique) {
    problems.push(`${route}  control still labelled in English — "${l.slice(0, 46)}"`);
  }
}

await browser.close();

console.log(`\nchecked ${ROUTES.length + TRANSLATED.length} routes`);
if (!problems.length) {
  console.log("every image says something, and every control says it in the reader's language");
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)].slice(0, 40)) console.error(`  ${p}`);
process.exitCode = 1;
