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
/**
 * The approved set, observed at source on 28 August 2026.
 *
 * Every text is verbatim. Where a "…" appears it marks a passage of the
 * original review that was left out, never a word that was changed — the
 * excerpting is the only editing that has happened, and the ellipsis is how
 * the reader is told so.
 *
 * `platform` is where the quote was VERIFIED. Several of these were read on
 * Planet of Hotels, which mirrors Booking.com reviews verbatim; they are
 * Booking.com reviews and say so, with the mirror recorded beside the
 * canonical URL where that is where the eye actually landed.
 *
 * On the room mappings: a guest almost never names their suite. Two of these
 * are matched by a feature only one suite has, and that inference is recorded
 * on the entry rather than left to look like something the guest said.
 */
export const reviews: readonly Review[] = [
  {
    /* "the deluxe suite with the private plunge pool". Harmony is the only
       suite with a plunge pool — Evexia, Eros and Zoi have hot tubs, Pathos a
       shower cabin. The mapping is the owner's, by feature; the guest did not
       name the suite. */
    text:
      "This was one of the best hotels I've ever stayed at. The location is perfectly located at the edge of the old town, walking distance from the beach… My girlfriend and I stayed in the deluxe suite with the private plunge pool, and this was both very romantic and very needed in the warm Cretan summer.",
    name: "Mattias",
    country: "Sweden",
    platform: "Booking.com",
    year: 2024,
    source: "https://www.booking.com/hotel/gr/gateway-suites.html",
    roomSlug: "harmony",
  },
  {
    text:
      "A hidden gem in Rethymno's Old Town. The suite's cozy design, comfortable bed, and warm plunge pool exceeded expectations. The staff's friendly service made our stay memorable.",
    name: "Karla",
    country: "Croatia",
    platform: "Booking.com",
    year: 2024,
    source: "https://www.booking.com/hotel/gr/gateway-suites.html",
    roomSlug: "harmony",
  },
  {
    /* The excerpt says only "the suite with hot tub", which four suites have.
       The owner reports that the full review names Eros; the naming is in the
       part not quoted here. */
    text:
      "Booked the suite with hot tub — just fantastic. So relaxing. Lovely location, near the sea, in a quiet courtyard. Friendly staff who made me feel so welcome!",
    name: "Emily",
    country: "Germany",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
    roomSlug: "eros",
  },
  {
    /* Published on Booking under the handle "MiltosThes". The owner's
       instruction is to show the first name; the handle is recorded here so
       the quote can still be found at source. */
    text:
      "We had a great one night stay… the jacuzzi outside was the highlight. Detail was paid to a lot of things — raki and peanuts, and cake was waiting in the room, plenty of towels and slippers provided.",
    name: "Miltos",
    country: "Greece",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    text:
      "We received a warm welcome from Manu!! The suites are located at the quiet side of Rethymno, in the center but not close to the clubs. Rooms are great, jacuzzi is top!",
    name: "Steven",
    country: "Belgium",
    platform: "Booking.com",
    year: 2026,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    text:
      "Exceptional place, with a lot of attention to customer service… The private bathtub was greatly appreciated. The staff was very helpful and kind, even assisting us with parking.",
    name: "Alessandra",
    country: "Italy",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    /* "balnéo" is the guest's own word, written in French inside an otherwise
       English review. It stays. */
    text:
      "Everything was perfect! The room with the balnéo was really nice and comfortable, the location was great and Emmanuel at the reception very helpful and friendly but professional!",
    name: "Carole",
    country: "France",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    text:
      "The style of Gateway Suites, the location and the staff made the stay perfect! Second time I have stayed here… Beds are super comfy and the rooms are spotless!",
    name: "Sarah",
    country: "United Kingdom",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    text:
      "Very nice apartment, newly renovated and stylish. Very friendly and helpful personnel. Perfect location to explore the old town.",
    name: "Harald",
    country: "Norway",
    platform: "Booking.com",
    year: 2025,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    text:
      "Beautifully decorated, incredibly clean room, with a lovely bathroom and splendid outside area! We loved the kitchenette which was fully equipped, and the staff were very welcoming and friendly.",
    name: "Conroy",
    country: "United Kingdom",
    platform: "Booking.com",
    year: 2024,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
  },
  {
    /* "heated to perfection" — Harmony's plunge pool is the heated one. */
    text:
      "Our stay at Gateway Suites was like finding a charming oasis in the heart of the Old Town. The suite's private plunge pool, heated to perfection, offered a relaxing retreat.",
    name: "Fabienne",
    country: "Germany",
    platform: "Booking.com",
    year: 2024,
    source: "https://en.planetofhotels.com/greece/rethymno-town/gateway-suites",
    roomSlug: "harmony",
  },
  {
    /* Published under the handle "Ankiapp", which is what Tripadvisor shows.
       Verified on Tripadvisor, so it is labelled Tripadvisor and not Google. */
    text:
      "Fantastic hotel in the old city… Clean and comfortable beds. Hotel staff was there for you. Beautiful renovation… Delicious cake and coffee in the front desk.",
    name: "Ankiapp",
    country: "Norway",
    platform: "Tripadvisor",
    year: 2024,
    source: "https://www.tripadvisor.com/Hotel_Review-g189421-d22551444-Reviews-Ink_Hotels_House_of_Europe-Rethymnon_Rethymnon_Prefecture_Crete.html",
  },
];

/* ── Held back, deliberately ────────────────────────────────────────────────
 *
 * Two Greek reviews on Tripadvisor — Anna (Athens, 2026) and Zina (Corfu,
 * 2024) — are approved in substance but not published here. The research
 * report holds only machine-translated glosses of them, and the rule at the
 * top of this file is that a quote goes in as the guest wrote it. Publishing
 * a machine translation as though it were somebody's words is exactly the
 * thing the rule forbids. They go in when the Greek originals are read off
 * the source page.
 *
 * One review from James (United Kingdom, Booking.com, 2025) names the Pathos
 * suite and praises "the hot tub". Pathos has no hot tub — its signature is
 * the glass double shower cabin beside the bed; the suites with hot tubs are
 * Evexia, Eros and Zoi, and Harmony has the plunge pool. Confirmed against
 * content/rooms.ts. Publishing it would advertise a feature that suite may not
 * have, so it waits on the owner.
 *
 * Two nameless Booking snippets — one for House of Europe, one for Phos — wait
 * on confirmation in the extranet. A quote with no name fails the attribution
 * rule anyway.
 */

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
