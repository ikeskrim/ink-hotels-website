import assert from "node:assert/strict";
import { test } from "node:test";

import { stay } from "@/content/site";
import { faqs as enFaqs } from "@/content/faq";
import { hotelSchema } from "@/lib/schema";
import { getMessages } from "@/i18n";
import { localiseArrival, localiseFaqs } from "@/i18n/content";
import { locales, type Locale } from "@/i18n/config";
import { timeSep } from "@/i18n/time";

/**
 * Check-in 16:00, check-out 11:00 — in every place that states them.
 *
 * The times are the owner's, given in August 2026, and they appear in four
 * places: the plain-facts list, the FAQ, the arrival page and the Hotel
 * structured data. `stay` in site.ts is the single source, but three of those
 * four are prose, and prose does not import a constant. This is what stops the
 * copies drifting: change `stay` and the strings that no longer agree with it
 * fail here, in milliseconds, instead of contradicting each other in
 * production and being believed in whichever order the guest reads them.
 *
 * French writes 23h00 for the reception hours, so its check-in is punctuated
 * the same way. `timeSep` is the only place that knows this.
 */

/** How a locale writes a time from `stay`. */
function shown(t: string, locale: Locale): string {
  return t.replace(":", timeSep(locale));
}

/**
 * The facts line takes its times at render, so asserting that the rendered
 * string contains what was just substituted into it proves nothing. What is
 * worth pinning is that the catalogue defers: both placeholders present, and
 * no time written into the translation by hand — a hardcoded 15:00 in one
 * language is exactly the drift this file exists to prevent, and it would
 * survive any amount of substituting.
 */
test("every locale's facts line defers to the source for both times", () => {
  for (const locale of locales) {
    const raw = getMessages(locale).common.factCheckin;
    assert.ok(raw.includes("{checkin}"), `${locale}: facts line hardcodes check-in`);
    assert.ok(raw.includes("{checkout}"), `${locale}: facts line hardcodes check-out`);
    assert.ok(
      !/\d{1,2}[:h]\d{2}/.test(raw),
      `${locale}: facts line writes a time by hand: ${raw}`,
    );
    const line = raw
      .replace("{checkin}", shown(stay.checkIn, locale))
      .replace("{checkout}", shown(stay.checkOut, locale));
    assert.ok(!line.includes("{"), `${locale}: a placeholder survived rendering`);
  }
});

test("every locale's arrival page states both times", () => {
  for (const locale of locales) {
    const facts = localiseArrival(locale).facts;
    const hit = facts.find(
      (f) =>
        f.def.includes(shown(stay.checkIn, locale)) &&
        f.def.includes(shown(stay.checkOut, locale)),
    );
    assert.ok(hit, `${locale}: no arrival fact states both times`);
  }
});

test("every locale's FAQ states both times", () => {
  for (const locale of locales) {
    const hit = localiseFaqs(locale).find(
      (f) =>
        f.answer.includes(shown(stay.checkIn, locale)) &&
        f.answer.includes(shown(stay.checkOut, locale)),
    );
    assert.ok(hit, `${locale}: no FAQ answer states both times`);
  }
});

/**
 * localiseFaqs is positional and falls back to the English list wholesale when
 * the lengths differ. A translated FAQ added to one file and not the others
 * would therefore not throw — it would quietly serve English to four
 * languages. The test above would still pass, because English states the
 * times. This is the one that catches it.
 */
test("the FAQ overlays are the same length as the source, so none falls back", () => {
  for (const locale of locales) {
    assert.equal(
      localiseFaqs(locale).length,
      enFaqs.length,
      `${locale}: FAQ length differs from the source list`,
    );
    if (locale === "en") continue;
    const translated = localiseFaqs(locale).some(
      (f, i) => f.question !== enFaqs[i]?.question,
    );
    assert.ok(translated, `${locale}: FAQ fell back to English`);
  }
});

test("the structured data carries both times as xsd:time", () => {
  const hotel = hotelSchema() as Record<string, unknown>;
  assert.equal(hotel.checkinTime, `${stay.checkIn}:00`);
  assert.equal(hotel.checkoutTime, `${stay.checkOut}:00`);
});
