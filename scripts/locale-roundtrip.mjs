/**
 * Does a chosen language survive the next click?
 *
 * The classic failure in a locale-prefixed Next site is a switcher that sets a
 * cookie but hands back a URL without the prefix, or a middleware that reads
 * the cookie on one route and the prefix on another. The guest picks German,
 * clicks Rooms, and is back in English — which is worse than never offering
 * German, because they have already told you what they want.
 *
 * This drives a real browser: switch language, then navigate by clicking the
 * site's own links, and assert the language holds at every step.
 *
 *   BASE=http://localhost:3000 node scripts/locale-roundtrip.mjs
 */
import { chromium } from "playwright";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["el", "de", "fr", "nl"];

/** A word that must appear on the homepage in that language and no other. */
const FINGERPRINT = {
  el: /σουίτες|δωμάτια/i,
  de: /Suiten|Zimmer/,
  fr: /suites|chambres/i,
  nl: /suites|kamers/i,
};

const browser = await chromium.launch();
const problems = [];

for (const locale of LOCALES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  /* Arrive in English, as a real visitor does. */
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });

  /* Use the site's own switcher rather than typing the URL — the point is to
     test the mechanism the guest actually touches. The options live inside a
     dropdown, so open it first; a guest has to as well. */
  const trigger = page.locator('button[aria-haspopup="listbox"]').first();
  if ((await trigger.count()) > 0) await trigger.click();

  const link = page.locator(`a[href^="/${locale}"]`).first();
  if ((await link.count()) === 0) {
    problems.push({ locale, step: "switcher", detail: `no link to /${locale} after opening the switcher` });
    await ctx.close();
    continue;
  }
  await link.click();
  await page.waitForLoadState("domcontentloaded");

  const afterSwitch = new URL(page.url()).pathname;
  if (!afterSwitch.startsWith(`/${locale}`)) {
    problems.push({ locale, step: "switch", detail: `landed on ${afterSwitch}` });
  }
  const html = await page.content();
  if (!FINGERPRINT[locale].test(html)) {
    problems.push({ locale, step: "switch", detail: "page did not render in that language" });
  }

  /* Now click through the site's own navigation, twice, and check it holds. */
  for (const label of ["rooms", "story"]) {
    const nav = page.locator(`a[href="/${locale}/${label}"]`).first();
    if ((await nav.count()) === 0) {
      problems.push({
        locale,
        step: `nav→/${label}`,
        detail: `no /${locale}/${label} link on the page — nav may drop the prefix`,
      });
      continue;
    }
    await nav.click();
    await page.waitForLoadState("domcontentloaded");
    const p = new URL(page.url()).pathname;
    if (!p.startsWith(`/${locale}`)) {
      problems.push({ locale, step: `nav→/${label}`, detail: `fell back to ${p}` });
    }
    const lang = await page.getAttribute("html", "lang");
    if (!lang || !lang.toLowerCase().startsWith(locale)) {
      problems.push({ locale, step: `nav→/${label}`, detail: `html lang="${lang}"` });
    }
    await page.goBack({ waitUntil: "domcontentloaded" });
  }

  /* And a hard reload, which is where a cookie-only implementation fails. */
  await page.goto(`${BASE}/${locale}/rooms`, { waitUntil: "domcontentloaded" });
  const reloadLang = await page.getAttribute("html", "lang");
  if (!reloadLang || !reloadLang.toLowerCase().startsWith(locale)) {
    problems.push({ locale, step: "reload", detail: `html lang="${reloadLang}"` });
  }

  await ctx.close();
  console.log(`  ${locale}: switched, navigated twice, reloaded`);
}

await browser.close();

console.log(`\nchecked ${LOCALES.length} locales`);
if (!problems.length) {
  console.log("language survives the switch, two clicks and a reload");
  process.exit(0);
}
console.error(`\n${problems.length} FAILURE(S):`);
for (const p of problems) console.error(`  ${p.locale}  ${p.step}  →  ${p.detail}`);
process.exit(1);
