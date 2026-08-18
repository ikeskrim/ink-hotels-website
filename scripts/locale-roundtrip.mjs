/**
 * Does a chosen language survive the next click?
 *
 * The failure this guards is real and was measured here. Internal links were
 * written as plain site paths, and the middleware inferred the language from an
 * `ink_locale` cookie. That works for someone who used the switcher — and fails
 * for the reader most likely to be on /de, who arrived from a search result
 * through the hreflang alternates and has no cookie at all:
 *
 *   no cookie:   /rooms/evexia -> /rooms/evexia    lang=en-GB
 *   with cookie: /rooms/evexia -> /de/rooms/evexia lang=de-DE
 *
 * So this asserts the property rather than a click path: on a localised page,
 * with no cookie, every internal link already carries the prefix. That is the
 * thing which makes the language survive, and unlike "click the second link in
 * the header" it does not break when the layout moves.
 *
 * The switcher itself is still exercised once per locale, because it is the
 * control a guest actually touches.
 *
 *   BASE=http://localhost:3000 node scripts/locale-roundtrip.mjs
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["el", "de", "fr", "nl"];
const PAGES = ["", "/rooms", "/story"];

/** Words that must appear on the homepage in that language. */
const FINGERPRINT = {
  el: /σουίτες|δωμάτια/i,
  de: /Suiten|Zimmer/,
  fr: /suites|chambres/i,
  nl: /suites|kamers/i,
};

/* Unprefixed paths that are legitimately not localised pages. */
const EXEMPT = "^(/$|/(el|de|fr|nl)(/|$)|/studio|/api|/media|/#|/opengraph|/icon|/apple-icon|/robots|/sitemap)";

const browser = await launch();
const problems = [];

for (const locale of LOCALES) {
  /* A fresh context each time: no cookie, exactly like arriving from Google. */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    const res = await goto(page, `${BASE}/${locale}${path}`, {});
    const where = path || "/";

    if (!res || res.status() !== 200) {
      problems.push({ locale, where, what: `HTTP ${res?.status()}` });
      continue;
    }

    const lang = await page.getAttribute("html", "lang");
    if (!lang?.toLowerCase().startsWith(locale)) {
      problems.push({ locale, where, what: `html lang="${lang}"` });
    }

    if (path === "" && !FINGERPRINT[locale].test(await page.content())) {
      problems.push({ locale, where, what: "page did not render in that language" });
    }

    const bare = await page.evaluate(
      (ex) =>
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && h.startsWith("/") && !h.startsWith("//"))
          .filter((h) => !new RegExp(ex).test(h))
          .filter((h, i, all) => all.indexOf(h) === i)
          .slice(0, 6),
      EXEMPT,
    );
    for (const href of bare) {
      problems.push({ locale, where, what: `unprefixed link ${href}` });
    }
  }

  /* The control a guest actually touches. */
  await goto(page, BASE + "/");
  await page.locator('button[aria-haspopup="listbox"]').first().click();
  const box = page.locator('[role="listbox"]').first();
  await box.waitFor({ state: "visible" });
  /* Scoped to the listbox: a bare selector also matches the <noscript>
     fallback anchors, which are inert while scripting is on — clicking one
     goes nowhere and reports a site fault that is really a fault here. */
  await box.locator(`a[href^="/${locale}"]`).first().click();
  /* waitForLoadState is wrong here: the switcher is a next/link, so this is a
     client-side navigation with no new document load and the state resolves
     immediately — leaving page.url() still on the page we came from, which
     reads as the switcher having failed. Wait for the URL itself. */
  let after;
  try {
    await page.waitForURL(new RegExp(`/${locale}(/|$)`), { timeout: 8000 });
    after = new URL(page.url()).pathname;
  } catch {
    after = new URL(page.url()).pathname;
  }
  if (!after.startsWith(`/${locale}`)) {
    problems.push({ locale, where: "switcher", what: `landed on ${after}` });
  }

  await ctx.close();
  console.log(`  ${locale}: ${PAGES.length} pages, switcher exercised`);
}

await browser.close();

console.log(`\nchecked ${LOCALES.length} locales`);
if (!problems.length) {
  console.log("every internal link keeps the reader's language, with no cookie");
  process.exit(0);
}
console.error(`\n${problems.length} FAILURE(S):`);
for (const p of problems) console.error(`  ${p.locale}  ${p.where}  →  ${p.what}`);
process.exit(1);
