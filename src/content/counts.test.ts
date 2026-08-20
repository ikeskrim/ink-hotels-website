import assert from "node:assert/strict";
import { test } from "node:test";

import { rooms, counts } from "./rooms";
import { places } from "./place";
import { getMessages } from "@/i18n";
import { locales } from "@/i18n/config";

/**
 * The site counts itself in prose, in five languages, in places nobody reads
 * together — a meta description, a homepage lede, a section spec line. It got
 * this wrong: the water section said three private hot tubs while the meta
 * description for / and /rooms said one, so the search result under-sold the
 * property and contradicted the page it led to.
 *
 * These tests hold the prose to the room records. They are deliberately about
 * numerals-in-sentences rather than about the `counts` object, because the
 * object was already right; it was the sentences that drifted.
 */

const HOT_TUBS = rooms.filter((r) => r.hotTub).length;
const PLUNGE = rooms.filter((r) => r.plungePool).length;

/**
 * How each language writes the small numbers these sentences use.
 *
 * Word boundaries are built from `\p{L}` rather than `\b`, because `\b` is
 * defined on ASCII word characters: every Greek letter is a non-word character
 * to it, so `\bτρεις\b` never matches and the Greek copy silently passed.
 *
 * Dutch counts only `één` with its accents. Unaccented `een` is the indefinite
 * article — "een eigen bubbelbad" is "a hot tub of its own", not "one" — and
 * matching it flagged the corrected sentence as still saying one.
 */
const w = (word: string) => new RegExp(`(^|[^\\p{L}])${word}([^\\p{L}]|$)`, "iu");

const NUMERAL: Record<string, Record<number, RegExp>> = {
  en: { 1: w("one"), 3: w("three"), 6: w("six") },
  /* Greek inflects the numeral by gender: τρεις σουίτες but τρία υδρομασάζ. */
  el: { 1: w("μία"), 3: w("(τρεις|τρία)"), 6: w("έξι") },
  de: { 1: w("eine"), 3: w("drei"), 6: w("sechs") },
  fr: { 1: w("une"), 3: w("trois"), 6: w("six") },
  nl: { 1: w("één"), 3: w("drie"), 6: w("zes") },
};

/** Every sentence on the site that puts a numeral in front of "hot tub". */
function countingSentences(locale: (typeof locales)[number]): string[] {
  const m = getMessages(locale);
  return [
    m.home.roomsLede,
    m.home.promiseHouseOfEurope,
    m.home.waterBody,
    m.home.waterSpec,
    m.pageMeta.home.d,
    m.pageMeta.rooms.d,
  ];
}

test("the records are the three hot tubs and one plunge pool the site claims", () => {
  assert.equal(HOT_TUBS, 3, "expected three suites with a hot tub");
  assert.equal(PLUNGE, 1, "expected one suite with a plunge pool");
  assert.equal(counts.suites, 7);
});

test("no sentence in any language says 'one' hot tub", () => {
  for (const locale of locales) {
    const one = NUMERAL[locale]![1]!;
    for (const s of countingSentences(locale)) {
      if (!/hot tub|υδρομασάζ|Whirlpool|bain à remous|bubbelbad/i.test(s)) continue;
      /* Take the words immediately before the noun — that is where the count
         sits in all five languages. */
      const before = s.split(
        /hot tub|υδρομασάζ|Whirlpool|bain à remous|bubbelbad/i,
      )[0]!;
      const tail = before.slice(-40);
      assert.ok(
        !one.test(tail),
        `${locale}: counts one hot tub — "…${tail.trim()}"`,
      );
    }
  }
});

/**
 * Only sentences that put a numeral in front of the noun are counting. The
 * water section narrates the suites one at a time — "Evexia has a private hot
 * tub… Eros and Zoi each have one" — which mentions a tub without counting
 * them, and is correct prose. Asserting on every mention flagged that, which
 * would have taught the next person to delete the test rather than trust it.
 */
const SUMMARY_KEYS = ["roomsLede", "promiseHouseOfEurope", "waterSpec"] as const;

function summarySentences(locale: (typeof locales)[number]): string[] {
  const m = getMessages(locale);
  return [
    ...SUMMARY_KEYS.map((k) => m.home[k]),
    m.pageMeta.home.d,
    m.pageMeta.rooms.d,
  ];
}

test("every summary that counts hot tubs counts three", () => {
  for (const locale of locales) {
    const three = NUMERAL[locale]![3]!;
    const counted = summarySentences(locale).filter((s) =>
      /hot tub|υδρομασάζ|Whirlpool|bain à remous|bubbelbad/i.test(s),
    );
    assert.ok(counted.length > 0, `${locale}: no summary mentions a hot tub`);
    for (const s of counted) {
      assert.ok(
        three.test(s),
        `${locale}: counts hot tubs without saying three — "${s.slice(0, 90)}…"`,
      );
    }
  }
});

test("the plunge pool is called heated wherever a summary names it", () => {
  const HEATED = /heated|θερμαινόμενη|beheizt|chauff[ée]|verwarmd/i;
  for (const locale of locales) {
    for (const s of summarySentences(locale)) {
      if (!/plunge pool|πισίνα|Tauchpool|piscine|dompelbad/i.test(s)) continue;
      assert.ok(
        HEATED.test(s),
        `${locale}: plunge pool not called heated — "${s.slice(0, 90)}…"`,
      );
    }
  }
});

/**
 * The landmark heading counts the landmarks.
 *
 * It read "Five things worth the walk" in all five languages while `places.ts`
 * held six — the town beach, the harbour, the Fortezza, the Historical and
 * Folklore Museum, Arkadi and Eleftherna. Nobody notices a heading that
 * under-counts by one; it just quietly makes the page smaller than the place.
 * Found while plotting those same six for the old-town plan, which is the
 * usual way: a number is only checked when something else has to agree with it.
 */
test("the landmark heading counts the landmarks it lists", () => {
  for (const locale of locales) {
    const m = getMessages(locale);
    const word = NUMERAL[locale]![places.length];
    assert.ok(
      word,
      `${locale}: no numeral spelling for ${places.length} — add one to NUMERAL`,
    );
    assert.ok(
      word!.test(m.home.landmarksTitle),
      `${locale}: landmarksTitle does not say ${places.length} — "${m.home.landmarksTitle}"`,
    );
  }
});
