/**
 * Guest quotes.
 *
 * EMPTY ON PURPOSE, AND THE SITE SHOWS NOTHING UNTIL IT IS NOT.
 *
 * Every component that reads this returns null on an empty array, so the
 * homepage strip and the per-suite quote slot simply do not exist yet. That is
 * the correct state: a hotel with no reviews on its site is a hotel that has
 * not collected them, which is recoverable. A hotel with invented ones is a
 * different kind of business, and one screenshot from a guest who recognises
 * their own words is the end of it.
 *
 * Nothing here may be written by anyone but a guest. Not paraphrased from a
 * booking-site review, not composed "in the spirit of" what guests say, not
 * generated. If the owner supplies a quote, it goes in verbatim.
 *
 * ── What the owner needs to supply, per quote ──────────────────────────────
 *
 *   text      the words, exactly as written, in the language they were written
 *   name      first name only — "Marta", not "Marta K." and never a full name
 *   country   where they travelled from, as they would say it
 *   platform  where it was published: Booking.com, Google, Airbnb, or "direct"
 *             if it came by email
 *   year      the year of the stay
 *   roomSlug  optional; set it and the quote appears on that room's page too
 *
 * Six to ten is the useful number. Below six the strip looks thin; above ten
 * nobody reads to the end.
 *
 * ── Aggregate scores ───────────────────────────────────────────────────────
 * There is deliberately no "9.4 from 380 reviews" field. An aggregate rating in
 * JSON-LD must be a real, verifiable number the property can evidence, and
 * Google penalises invented ones. When the owner has the figure from the
 * booking engine, it belongs in `lib/schema.ts` as `aggregateRating` — with the
 * count, from a named source, and never rounded up.
 */

export interface Review {
  /** The guest's own words, verbatim. */
  text: string;
  /** First name only. */
  name: string;
  /** Where they travelled from. */
  country: string;
  /** Where it was published. */
  platform: "Booking.com" | "Google" | "Airbnb" | "direct";
  /** Year of the stay. */
  year: number;
  /** Optional: also show this on one room's page. */
  roomSlug?: string;
}

/** Real guest quotes, supplied by the owner. Empty until then. */
export const reviews: readonly Review[] = [];

/** Quotes to show on a given room's page. */
export function reviewsForRoom(slug: string): readonly Review[] {
  return reviews.filter((r) => r.roomSlug === slug);
}

/** Whether there is enough to show a strip at all. */
export const hasReviews = reviews.length > 0;
