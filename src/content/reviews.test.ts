import assert from "node:assert/strict";
import { test } from "node:test";

import {
  hasReviews,
  MINIMUM_TO_SHOW,
  reviews,
  reviewsForRoom,
  scoreForRoom,
  scores,
} from "@/content/reviews";
import { rooms } from "@/content/rooms";
import { localiseReviews } from "@/i18n/content";
import { locales } from "@/i18n/config";

/**
 * Guest quotes and scores are the one kind of content on this site that a
 * stranger can disprove.
 *
 * Everything else here is the property describing itself. A review is somebody
 * else's words and somebody else's number, and both are checkable — by the
 * guest who wrote them, by a competitor, by a regulator. So the rules are
 * mechanical rather than a matter of care:
 *
 *   every quote is attributable        name, country, year, platform
 *   every published quote is findable  a source URL, unless it came by email
 *   no quote is a composite            no duplicate texts, no full names
 *   every score carries its scale      4.88 beside 8.8 with no scale is worse
 *                                      than printing neither
 *   every score carries its count and the date it was read
 *   no Google figure exists            until the owner reads the two
 *                                      outstanding ones off Google Maps
 *
 *
 * The verbatim check below is a SECOND transcription of the owner's approved
 * rows, typed independently of the one in content/reviews.ts. That is the
 * point of it: a single copy checked against itself proves only that nobody
 * edited it since, and would happily lock in a typo made on the way in. Two
 * copies from the same source disagree the moment either drifts.
 *
 * An ellipsis marks a passage of the original review that was left out. It is
 * part of the approved text and must match exactly — a quote that quietly
 * loses its ellipsis is a quote presenting an excerpt as the whole thing.
 */

const CURRENT_YEAR = 2026;

test("every quote is attributable", () => {
  for (const r of reviews) {
    const who = `${r.name || "(unnamed)"} ${r.year || ""}`.trim();
    assert.ok(r.text.trim().length > 0, `${who}: empty quote`);
    assert.ok(r.name.trim().length > 0, `${who}: no name`);
    assert.ok(r.country.trim().length > 0, `${who}: no country`);
    assert.ok(r.platform, `${who}: no platform`);
    assert.ok(
      Number.isInteger(r.year) && r.year >= 2015 && r.year <= CURRENT_YEAR,
      `${who}: implausible year ${r.year}`,
    );
  }
});

test("a published quote can be checked at its source", () => {
  for (const r of reviews) {
    if (r.platform === "direct") continue;
    assert.ok(
      r.source && /^https?:\/\//.test(r.source),
      `${r.name} ${r.year}: published on ${r.platform} with no source URL`,
    );
  }
});

/**
 * First name only. "Marta K." and "Marta Kowalska" are both more than the
 * guest agreed to when they wrote a review on somebody else's site, and the
 * second is personal data this site has no business republishing.
 */
test("names are first names", () => {
  for (const r of reviews) {
    assert.ok(
      !/\s/.test(r.name.trim()),
      `${r.name}: more than a first name`,
    );
    assert.ok(
      !/\.$/.test(r.name.trim()),
      `${r.name}: a trailing initial is still an identifier`,
    );
  }
});

/**
 * Two identical texts under different names is what merging or duplicating
 * looks like from the outside, and it is the failure that would be hardest to
 * explain afterwards.
 */
test("no quote appears twice", () => {
  const seen = new Map<string, string>();
  for (const r of reviews) {
    const key = r.text.trim().toLowerCase();
    const prev = seen.get(key);
    assert.equal(
      prev,
      undefined,
      `the same text is attributed to both ${prev} and ${r.name}`,
    );
    seen.set(key, r.name);
  }
});

test("a quote pinned to a room names a room that exists", () => {
  const slugs = new Set(rooms.map((r) => r.slug));
  for (const r of reviews) {
    if (!r.roomSlug) continue;
    assert.ok(slugs.has(r.roomSlug), `${r.name}: no room "${r.roomSlug}"`);
    assert.ok(
      reviewsForRoom(r.roomSlug).includes(r),
      `${r.name}: pinned to ${r.roomSlug} but not returned for it`,
    );
  }
});

test("the strip stays hidden below the owner's threshold", () => {
  assert.equal(hasReviews, reviews.length >= MINIMUM_TO_SHOW);
  if (reviews.length < MINIMUM_TO_SHOW) {
    assert.equal(hasReviews, false, "the strip would render an incomplete row");
  }
});

/* ── the scores ──────────────────────────────────────────────────────────── */

test("every score carries its scale, its count and the date it was read", () => {
  assert.ok(scores.length > 0, "no scores at all");
  for (const s of scores) {
    const who = `${s.platform} ${s.listing}`;
    assert.ok([5, 10].includes(s.outOf), `${who}: no scale`);
    assert.ok(
      s.value > 0 && s.value <= s.outOf,
      `${who}: ${s.value} is not a figure out of ${s.outOf}`,
    );
    assert.ok(
      Number.isInteger(s.count) && s.count > 0,
      `${who}: a rating with no count is a boast`,
    );
    assert.ok(
      /^\d{4}-\d{2}-\d{2}$/.test(s.reviewedOn),
      `${who}: reviewedOn is not an ISO date`,
    );
    assert.ok(
      s.reviewedOn <= `${CURRENT_YEAR}-12-31`,
      `${who}: read in the future`,
    );
  }
});

/**
 * The owner has two Google figures they have not yet read off Google Maps —
 * one for Phos, one for the Gateway Suites. Until they do, no Google number
 * appears on this site. This test is the thing that stops a helpful future
 * session adding one it found somewhere.
 */
test("no Google figure is published", () => {
  const google = scores.filter((s) => (s.platform as string) === "Google");
  assert.deepEqual(
    google,
    [],
    "a Google score appeared before the owner verified it at source",
  );
});

test("a score pinned to a room names a room that exists", () => {
  const slugs = new Set(rooms.map((r) => r.slug));
  for (const s of scores) {
    if (!s.roomSlug) continue;
    assert.ok(slugs.has(s.roomSlug), `${s.listing}: no room "${s.roomSlug}"`);
    assert.equal(scoreForRoom(s.roomSlug), s);
  }
});

/* ── verbatim ────────────────────────────────────────────────────────────── */

/**
 * The approved texts, keyed by who said them and when.
 *
 * Typed from the owner's rows a second time, deliberately not copied from
 * content/reviews.ts. If the two ever disagree, one of them has drifted and
 * this says which quote.
 */
const APPROVED: Record<string, string> = {
  "Mattias-2024":
    "This was one of the best hotels I've ever stayed at. The location is perfectly located at the edge of the old town, walking distance from the beach\u2026 My girlfriend and I stayed in the deluxe suite with the private plunge pool, and this was both very romantic and very needed in the warm Cretan summer.",
  "Karla-2024":
    "A hidden gem in Rethymno's Old Town. The suite's cozy design, comfortable bed, and warm plunge pool exceeded expectations. The staff's friendly service made our stay memorable.",
  "Emily-2025":
    "Booked the suite with hot tub \u2014 just fantastic. So relaxing. Lovely location, near the sea, in a quiet courtyard. Friendly staff who made me feel so welcome!",
  "Miltos-2025":
    "We had a great one night stay\u2026 the jacuzzi outside was the highlight. Detail was paid to a lot of things \u2014 raki and peanuts, and cake was waiting in the room, plenty of towels and slippers provided.",
  "Steven-2026":
    "We received a warm welcome from Manu!! The suites are located at the quiet side of Rethymno, in the center but not close to the clubs. Rooms are great, jacuzzi is top!",
  "Alessandra-2025":
    "Exceptional place, with a lot of attention to customer service\u2026 The private bathtub was greatly appreciated. The staff was very helpful and kind, even assisting us with parking.",
  "Carole-2025":
    "Everything was perfect! The room with the baln\u00e9o was really nice and comfortable, the location was great and Emmanuel at the reception very helpful and friendly but professional!",
  "Sarah-2025":
    "The style of Gateway Suites, the location and the staff made the stay perfect! Second time I have stayed here\u2026 Beds are super comfy and the rooms are spotless!",
  "Harald-2025":
    "Very nice apartment, newly renovated and stylish. Very friendly and helpful personnel. Perfect location to explore the old town.",
  "Conroy-2024":
    "Beautifully decorated, incredibly clean room, with a lovely bathroom and splendid outside area! We loved the kitchenette which was fully equipped, and the staff were very welcoming and friendly.",
  "Fabienne-2024":
    "Our stay at Gateway Suites was like finding a charming oasis in the heart of the Old Town. The suite's private plunge pool, heated to perfection, offered a relaxing retreat.",
  "Ankiapp-2024":
    "Fantastic hotel in the old city\u2026 Clean and comfortable beds. Hotel staff was there for you. Beautiful renovation\u2026 Delicious cake and coffee in the front desk.",
  /* Read off the source page with Tripadvisor's own "Show original", because
     the site serves a machine translation by default and labels it as one.
     Zina's "ρεσεψιον" is her spelling, unaccented, and is part of the text. */
  "Anna-2026": "Ένας πανέμορφος χώρος που ξεχωρίζει για την απόλυτη καθαριότητα, τη μοναδική διακόσμηση με πρωταγωνιστή το ξύλο… Ξεχωριστή πινελιά πολυτέλειας, το πλούσιο πρωινό που σερβίρεται απευθείας στο δωμάτιο.",
  "Zina-2024": "Πολλές φροντισμένες λεπτομέρειες (πετσέτες για τη θάλασσα, ρακή καλωσορίσματος, μηχανή εσπρέσσο, παντόφλες κλπ). Ωραίο ιδιωτικό βεραντάκι και σε πολύ καλή τοποθεσία… Τα παιδιά στη ρεσεψιον πολύ εξυπηρετικά.",
};

test("no quote has been altered from the approved text", () => {
  for (const r of reviews) {
    const key = `${r.name}-${r.year}`;
    const approved = APPROVED[key];
    assert.ok(approved, `${key}: published but not on the approved list`);
    assert.equal(r.text, approved, `${key}: the published text differs from the approved one`);
  }
});

test("every approved quote is published", () => {
  const published = new Set(reviews.map((r) => `${r.name}-${r.year}`));
  for (const key of Object.keys(APPROVED)) {
    assert.ok(published.has(key), `${key}: approved but missing from the site`);
  }
});

/**
 * James names the Pathos suite and praises a hot tub Pathos does not have.
 * Publishing it would advertise a feature that may not exist, so it waits on
 * the owner.
 *
 * Anna and Zina were held for a different reason — only machine-translated
 * glosses of their Greek existed — and that reason is gone: the originals were
 * read off the source page and they are published in Greek.
 *
 * A future session with a helpful instinct is exactly how James gets added, so
 * the name is pinned here rather than only described in a comment.
 */
const HELD_BACK = ["James"];

test("the held-back quotes have not slipped in", () => {
  for (const name of HELD_BACK) {
    const found = reviews.find((r) => r.name === name);
    assert.equal(
      found,
      undefined,
      `${name} is held pending the owner and must not be published`,
    );
  }
});

test("a quote pinned to a suite is consistent with that suite", () => {
  /* Harmony is the only plunge pool on the property; the hot tubs are Evexia,
     Eros and Zoi. A quote about a plunge pool pinned to a hot-tub suite, or
     the reverse, is a mapping error that would put a wrong claim on a room
     page — which is the same failure that holds James back. */
  const plungePool = new Set(["harmony"]);
  const hotTub = new Set(["evexia", "eros", "zoi"]);
  for (const r of reviews) {
    if (!r.roomSlug) continue;
    const t = r.text.toLowerCase();
    if (t.includes("plunge pool")) {
      assert.ok(
        plungePool.has(r.roomSlug),
        `${r.name}: mentions a plunge pool but is pinned to ${r.roomSlug}`,
      );
    }
    if (t.includes("hot tub")) {
      assert.ok(
        hotTub.has(r.roomSlug),
        `${r.name}: mentions a hot tub but is pinned to ${r.roomSlug}`,
      );
    }
  }
});

/* ── translations ────────────────────────────────────────────────────────── */

/**
 * A gloss is shown in place of the guest's words, so two things have to hold:
 * every locale has one for every quote, and the flag that puts "translated"
 * under it is set from whether a gloss was actually used rather than from the
 * locale. The second is the one that could go wrong quietly — a missing
 * translation falls back to English, and English presented under a line saying
 * "translated from English" would be absurd.
 */
test("every quote reaches every reader, and only claims to be a gloss when it is", () => {
  for (const locale of locales) {
    const localised = localiseReviews(locale);
    assert.equal(localised.length, reviews.length, `${locale}: lost a quote`);

    for (const r of localised) {
      const original = reviews.find((x) => x.name === r.name && x.year === r.year);
      assert.ok(original, `${locale}: ${r.name} is not in the source list`);
      const wroteIn = original.originalLanguage ?? "en";

      if (locale === wroteIn) {
        /* The reader shares the guest's language: they get the words. */
        assert.equal(
          r.translated,
          false,
          `${locale}: ${r.name} wrote in ${wroteIn} and is marked as translated`,
        );
        assert.equal(r.text, original.text, `${locale}: ${r.name} was altered`);
        continue;
      }

      assert.equal(
        r.translated,
        true,
        `${locale}: ${r.name} has no gloss and falls back to another language unmarked`,
      );
      assert.notEqual(
        r.text,
        original.text,
        `${locale}: ${r.name} is flagged as translated but is the original text`,
      );
      assert.ok(r.text.trim().length > 0, `${locale}: ${r.name} has an empty gloss`);
    }
  }
});

/**
 * A quote not written in English needs an English gloss on the review itself:
 * English is this site's source language and has no content overlay, so there
 * is nowhere else for it to live, and without it an English reader would be
 * shown Greek.
 */
test("a non-English quote carries its English gloss", () => {
  for (const r of reviews) {
    if ((r.originalLanguage ?? "en") === "en") {
      assert.equal(
        r.glossEn,
        undefined,
        `${r.name}: wrote in English and does not need an English gloss`,
      );
      continue;
    }
    assert.ok(r.glossEn?.trim(), `${r.name}: wrote in ${r.originalLanguage} with no English gloss`);
    assert.notEqual(r.glossEn, r.text, `${r.name}: the English gloss is the original`);
  }
});

/**
 * The line under a gloss is chosen by the language the guest wrote in, and the
 * component says nothing when it has no sentence for that language. Silence is
 * the safe failure, but a published quote should never reach it.
 */
test("every language a guest wrote in has a translation sentence", () => {
  const HAVE_SENTENCES = new Set(["en", "el"]);
  for (const r of reviews) {
    const wroteIn = r.originalLanguage ?? "en";
    assert.ok(
      HAVE_SENTENCES.has(wroteIn),
      `${r.name} wrote in ${wroteIn}, which has no "translated from" sentence — the gloss would appear unmarked`,
    );
  }
});

/**
 * An ellipsis marks an elided passage. It has to survive translation, or the
 * gloss presents an excerpt as a whole review — the same misrepresentation the
 * verbatim rule exists to prevent, one language over.
 */
test("elisions survive translation", () => {
  for (const locale of locales) {
    for (const r of localiseReviews(locale)) {
      const original = reviews.find((x) => x.name === r.name && x.year === r.year);
      if (!original?.text.includes("…")) continue;
      assert.ok(
        r.text.includes("…"),
        `${locale}: ${r.name} lost its ellipsis in translation`,
      );
    }
  }
});
