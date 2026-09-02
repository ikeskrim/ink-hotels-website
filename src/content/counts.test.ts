import assert from "node:assert/strict";
import { test } from "node:test";

import { rooms, counts } from "./rooms";
import { places } from "./place";
import { getMessages } from "@/i18n";
import { locales } from "@/i18n/config";
import { localiseRooms } from "@/i18n/content";

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
  en: { 1: w("one"), 3: w("three"), 4: w("four"), 5: w("five"), 6: w("six"), 7: w("seven") },
  /* Greek inflects the numeral by gender: τρεις σουίτες but τρία υδρομασάζ.
     Four and five inflect the same way — τέσσερις/τέσσερα, πέντε does not. */
  el: {
    1: w("μία"),
    3: w("(τρεις|τρία)"),
    4: w("(τέσσερις|τέσσερα)"),
    5: w("πέντε"),
    6: w("έξι"),
    7: w("επτά"),
  },
  de: { 1: w("eine"), 3: w("drei"), 4: w("vier"), 5: w("fünf"), 6: w("sechs"), 7: w("sieben") },
  fr: { 1: w("une"), 3: w("trois"), 4: w("quatre"), 5: w("cinq"), 6: w("six"), 7: w("sept") },
  nl: { 1: w("één"), 3: w("drie"), 4: w("vier"), 5: w("vijf"), 6: w("zes"), 7: w("zeven") },
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

test("the records are the four hot tubs and one plunge pool the site claims", () => {
  /* Three until 2 September 2026, when the owner corrected the record: Pathos
     has a private hot tub in its courtyard. The number is written here as a
     literal rather than derived, so that adding or losing a tub has to be a
     deliberate edit in two places. */
  assert.equal(HOT_TUBS, 4, "expected four suites with a hot tub");
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

test("every summary that counts hot tubs counts four", () => {
  for (const locale of locales) {
    const four = NUMERAL[locale]![4]!;
    const counted = summarySentences(locale).filter((s) =>
      /hot tub|υδρομασάζ|Whirlpool|bain à remous|bubbelbad/i.test(s),
    );
    assert.ok(counted.length > 0, `${locale}: no summary mentions a hot tub`);
    for (const s of counted) {
      assert.ok(
        four.test(s),
        `${locale}: counts hot tubs without saying four — "${s.slice(0, 90)}…"`,
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

/**
 * The water section's title counts the suites that come with water of their
 * own — the hot tubs plus the plunge pool. It said four when there were three
 * tubs and one pool; with Pathos it is five, and that is a different sentence
 * from the one counting tubs, in a different place, which is exactly how these
 * numbers drifted apart the first time.
 */
test("the water title counts every suite that has its own water", () => {
  const WATER = rooms.filter((r) => r.hotTub || r.plungePool).length;
  assert.equal(WATER, 5, "expected five suites with water of their own");

  for (const locale of locales) {
    const five = NUMERAL[locale]![5]!;
    const title = getMessages(locale).home.waterTitle;
    assert.ok(
      five.test(title),
      `${locale}: the water title does not count five — "${title}"`,
    );
  }
});

/**
 * The Jacuzzi / hot-tub filter, in every language.
 *
 * The filter reads `room.hotTub`, but what a reader filters is the LOCALISED
 * room list, and that list is rebuilt per locale from the content overlays. An
 * overlay that dropped or renamed a room would take a suite out of the results
 * in one language and not the others, and nothing else on the site would
 * notice. So the predicate is run against each locale's own list.
 *
 * Pathos joined this set on 2 September 2026.
 */
test("the hot-tub filter returns the same four suites in every language", () => {
  const EXPECTED = ["evexia", "eros", "pathos", "zoi"];

  for (const locale of locales) {
    const matching = localiseRooms(locale)
      .filter((r) => r.hotTub === true)
      .map((r) => r.slug)
      .sort();
    assert.deepEqual(
      matching,
      [...EXPECTED].sort(),
      `${locale}: the hot-tub filter returns a different set`,
    );
  }
});

/**
 * The water filter is the union — anything with a tub or the plunge pool.
 * Stated separately because it is a different question from "how many tubs",
 * and the two numbers are printed in different sentences on the same page.
 */
test("the water filter returns all five suites with their own water", () => {
  const EXPECTED = ["evexia", "eros", "harmony", "pathos", "zoi"];

  for (const locale of locales) {
    const matching = localiseRooms(locale)
      .filter((r) => r.hotTub === true || r.plungePool === true)
      .map((r) => r.slug)
      .sort();
    assert.deepEqual(
      matching,
      [...EXPECTED].sort(),
      `${locale}: the water filter returns a different set`,
    );
  }
});
