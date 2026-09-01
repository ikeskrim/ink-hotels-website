/**
 * Guest quotes, and the aggregate scores.
 *
 * THE QUOTE LIST IS STILL EMPTY, AND THE SITE SHOWS NOTHING UNTIL IT IS NOT.
 *
 * Every component that reads this returns null below the threshold, so the
 * strip on /story and the per-suite quote slot simply do not exist yet. That is
 * the correct state: a hotel with no reviews on its site is a hotel that has
 * not collected them, which is recoverable. A hotel with invented ones is a
 * different kind of business, and one screenshot from a guest who recognises
 * their own words is the end of it.
 *
 * Nothing here may be written by anyone but a guest. Not paraphrased from a
 * booking-site review, not composed "in the spirit of" what guests say, not
 * generated, not tidied. If the owner supplies a quote, it goes in verbatim,
 * including its typos.
 *
 * ── What each quote needs ──────────────────────────────────────────────────
 *
 *   text      the words, exactly as written, in the language they were written
 *   name      first name only — "Marta", not "Marta K." and never a full name
 *   country   where they travelled from, as they would say it
 *   platform  where the quote was VERIFIED, not where it was found. A quote
 *             read on an aggregator that syndicates Booking.com is a
 *             Booking.com review and says so; one verified on Tripadvisor says
 *             Tripadvisor. Labelling it by the site you happened to be looking
 *             at is a small lie that a reader can catch in one search.
 *   year      the year of the stay
 *   source    the URL it was verified at, so the next person can check it
 *             without repeating the search
 *   roomSlug  optional; set it and the quote appears on that room's page too
 *
 * Six is the threshold below which the strip stays hidden — see
 * MINIMUM_TO_SHOW. Above ten nobody reads to the end.
 */

export type ReviewPlatform =
  | "Booking.com"
  | "Google"
  | "Tripadvisor"
  | "Airbnb"
  /** Came by email to the desk rather than being published anywhere. */
  | "direct";

export interface Review {
  /** The guest's own words, verbatim. */
  text: string;
  /** First name only. */
  name: string;
  /** Where they travelled from. */
  country: string;
  /** Where the quote was verified — see the note above on aggregators. */
  platform: ReviewPlatform;
  /** Year of the stay. */
  year: number;
  /** Where it can be checked. Omitted only for `direct`, which has no URL. */
  source?: string;
  /** Optional: also show this on one room's page. */
  roomSlug?: string;
}

/** Real guest quotes, supplied by the owner. Empty until then. */
export const reviews: readonly Review[] = [];

/**
 * The strip does not appear until there are this many.
 *
 * Three quotes in a row built for six reads as a section that lost something.
 * The owner's instruction is that it goes live at six, so the number lives
 * here rather than in the component, and the component asks this file.
 */
export const MINIMUM_TO_SHOW = 6;

/** Quotes to show on a given room's page. */
export function reviewsForRoom(slug: string): readonly Review[] {
  return reviews.filter((r) => r.roomSlug === slug);
}

/** Whether there is enough to show a strip at all. */
export const hasReviews = reviews.length >= MINIMUM_TO_SHOW;

/* ── Aggregate scores ───────────────────────────────────────────────────────
 *
 * Only figures the owner has verified at source, with the count they are drawn
 * from and the date they were read. A rating without its count is a boast; a
 * rating without a date rots quietly, because the number moves and the page
 * does not.
 *
 * The scales differ and are carried explicitly: Booking.com scores out of ten,
 * Airbnb out of five. 4.88 printed beside 8.8 with no scale is worse than
 * printing neither.
 *
 * NOT HERE, DELIBERATELY: the two Google figures. The owner has not yet read
 * them off Google Maps — one for Phos, one for the Gateway Suites — and until
 * they do, no Google number appears on this site. If you are about to add one
 * because you found it somewhere, that is the thing this paragraph exists to
 * stop.
 */

export interface Score {
  /** The listing exactly as the platform names it. */
  listing: string;
  platform: Extract<ReviewPlatform, "Booking.com" | "Airbnb">;
  /** The figure as published, unrounded. */
  value: number;
  /** What it is out of. Booking.com scores to 10, Airbnb to 5. */
  outOf: 5 | 10;
  /** How many reviews the figure is drawn from. */
  count: number;
  /** ISO date the figure was last read at source. */
  reviewedOn: string;
  /** The room this listing is, where it is one room. */
  roomSlug?: string;
}

/**
 * Read off the platforms by the owner on 28 August 2026. That is the date the
 * numbers were seen, not the date they were typed here — the distinction
 * matters, because the figures move and a page that claims to have checked
 * today when it checked last week is making a small false claim about itself.
 */
export const scores: readonly Score[] = [
  {
    listing: "Gateway Suites",
    platform: "Booking.com",
    value: 8.8,
    outOf: 10,
    count: 109,
    reviewedOn: "2026-08-28",
  },
  {
    listing: "Ink Hotel Phos",
    platform: "Booking.com",
    value: 8.7,
    outOf: 10,
    count: 198,
    reviewedOn: "2026-08-28",
  },
  {
    listing: "House of Europe",
    platform: "Booking.com",
    value: 8.3,
    outOf: 10,
    count: 417,
    reviewedOn: "2026-08-28",
  },
  {
    listing: "Elpida",
    platform: "Airbnb",
    value: 4.88,
    outOf: 5,
    count: 32,
    reviewedOn: "2026-08-28",
    roomSlug: "elpida",
  },
  {
    listing: "Harmony",
    platform: "Airbnb",
    value: 4.81,
    outOf: 5,
    count: 31,
    reviewedOn: "2026-08-28",
    roomSlug: "harmony",
  },
  {
    listing: "Pathos",
    platform: "Airbnb",
    value: 4.9,
    outOf: 5,
    count: 10,
    reviewedOn: "2026-08-28",
    roomSlug: "pathos",
  },
];

/** The score for one room, where that room is its own listing. */
export function scoreForRoom(slug: string): Score | undefined {
  return scores.find((s) => s.roomSlug === slug);
}
