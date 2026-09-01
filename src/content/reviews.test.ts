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
 * The list is empty today, so the quote assertions are vacuous — and that is
 * fine. They exist to bite on the day somebody adds the first one, which is
 * the day the risk starts.
 *
 * NOT YET HERE: the verbatim check. The owner's brief asks that no quote text
 * be altered from the approved list, which needs the approved list to compare
 * against. It lands in the same commit as the quotes.
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
