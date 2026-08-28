import { ROOM_IMAGES } from "./generated/images";
import {
  EROS_IMAGES,
  EVEXIA_IMAGES,
  ZOI_IMAGES,
} from "./generated/suite-images";

/**
 * The property, as it is actually laid out.
 *
 * THREE ADDRESSES, TWO OF THEM HOTEL HOUSES
 *
 *   House of Europe — Nikolaou Plastira 4. The entrance and the reception, and
 *     the building every arrival goes through. It holds ALL SEVEN SUITES and
 *     the sea-facing room categories, and breakfast is served here.
 *   Phos — Fotaki St. Seven rooms, numbered 1 to 7. Rooms only: the word
 *     "suite" does not belong to this building and is not used of it anywhere.
 *   The Residence of the Old Port — one unit, two bedrooms, by the harbour.
 *
 * `name` is the full public name of the category, and everywhere but the two
 * renamed Phos rooms it is the reservation engine's own string too — so what
 * is browsed here matches what is reserved there. `displayName` is an
 * editorial shortening used in headings; the full name is shown alongside it
 * on the detail page. See ENGINE_NAMES for the two that differ.
 *
 * Sizes, occupancy, bed counts and amenities are taken from the reservation
 * system and from the property's own specifications. Where no figure is
 * published, the field is null and the UI omits it rather than guessing.
 */

export type HouseId = "house-of-europe" | "phos" | "residence";

export interface House {
  id: HouseId;
  name: string;
  subtitle: string;
  /** Greek form of the name, where there is one. Always rendered via <Gk>. */
  greek?: string;
  /** Street address. The first building is also the reception. */
  street?: string;
  intro: string;
  order: number;
}

export const houses: House[] = [
  {
    id: "house-of-europe",
    name: "House of Europe",
    subtitle: "The first building · reception",
    street: "Nikolaou Plastira 4",
    intro:
      "The building that gave the hotel its heart: once the University of Crete's guest house, where visiting professors and researchers stayed. Reception is here, breakfast is served here, and all seven suites are here. Renovated May 2020.",
    order: 1,
  },
  {
    id: "phos",
    name: "Phos",
    subtitle: "Light · the second building",
    greek: "Φως",
    street: "Fotaki Street",
    intro:
      "Seven rooms, numbered one to seven, in the quieter of the two buildings — a short walk from House of Europe, where reception and breakfast are. Renovated June 2019.",
    order: 2,
  },
  {
    id: "residence",
    name: "The Residence of the Old Port",
    subtitle: "A house of your own",
    intro:
      "One two-bedroom residence with its own kitchen and private parking, one hundred metres from the Venetian harbour.",
    order: 3,
  },
];

export interface Bed {
  label: string;
  count: number;
}

export interface Room {
  /** Stable internal key. For bookable categories this is the engine's own id. */
  id: string;
  /**
   * Reservation-system id, used to deep-link straight into availability.
   * Null where the property has not yet given us one — the button then opens
   * the engine's front page rather than a link that would 404.
   */
  bookingId: string | null;
  slug: string;
  /**
   * The public name of the category — what a guest sees here and, everywhere
   * but Phos, what the reservation engine calls it too.
   *
   * Two Phos categories are the exception; see ENGINE_NAMES below. The link
   * into availability goes by `bookingId`, so nothing depends on the wording.
   */
  name: string;
  /** Short editorial name used in headings only. */
  displayName: string;
  house: HouseId;
  /** A suite, a room, or the whole residence. Drives the label and the schema. */
  kind: "suite" | "room" | "residence";
  /**
   * The collection this suite belongs to.
   *
   * All seven are The Gateway Suites. This began as a heritage label on the
   * original four — the name four of them still carry verbatim in the
   * reservation engine — and the owner's decision of 24 August is that the
   * whole seven are presented under it. The engine names are untouched: what
   * a guest reserves still reads exactly as the engine spells it.
   *
   * Rooms at Phos and the Residence are not suites and carry nothing here.
   */
  collection?: "gateway";
  /** Maximum guests, where published. */
  guests: number | null;
  maxGuests?: number;
  sizeSqm: number | null;
  bedrooms?: number;
  bathrooms?: number;
  beds: Bed[];
  outlook: string | null;
  outdoor: string | null;
  level: string | null;
  /** Faithful to the property's own description; tightened, never embellished. */
  description: string;
  /** Verbatim-sourced notes the property publishes about this room. */
  notes: string[];
  amenities: string[];
  images: readonly string[];
  renovated: string | null;
  /* ── Facts a guest filters on ──────────────────────────────────────────── */
  hotTub?: boolean;
  plungePool?: boolean;
  accessible?: boolean;
  adultsOnly?: boolean;
  /** External 360° walkthrough, where the property has published one. */
  tourUrl?: string;
  /**
   * What the desk most often arranges alongside this room.
   *
   * Experience slugs, so the strip can only ever link to a page that exists —
   * an invented cross-sell is a dead end with a price attached. Left unset,
   * `relatedFor()` falls back to the three the desk arranges for everybody.
   *
   * Breakfast in the room is deliberately absent. It is a real service and a
   * published fact in the FAQ, but it has no experience page, and giving it one
   * purely to fill a fourth slot would be inventing content to fit a layout.
   */
  relatedExperiences?: readonly string[];
  /** Position in the featured run. Lower is earlier; unset is not featured. */
  featureOrder?: number;
}

/**
 * Where the reservation system's wording differs from ours, for anyone
 * reconciling a booking against it.
 *
 * Nothing at Phos is a suite, and the word does not belong to that building —
 * so it appears in neither the copy nor the markup. This map is deliberately
 * NOT a field on `Room`: room objects are serialised into the page for the
 * client components, and a field carrying the string "Suite … Phos" would put
 * it back into the HTML, invisible on the page but sitting in view-source.
 *
 * Keyed by `bookingId`, because that is what the engine actually matches on.
 */
export const ENGINE_NAMES: Record<string, string> = {
  "4077": "Suite With Terrace - Phos",
  "4418": "Suite with Balcony - Phos",
};

const BASE_AMENITIES = [
  "Air conditioning",
  "Free Wi-Fi",
  "Satellite flat-screen TV",
  "Private shower room",
  "Mini fridge",
  "Safe",
  "Hair dryer",
  "Soundproof windows",
  "Smoke detector",
];

const SUITE_AMENITIES = [
  "Air conditioning",
  "Free Wi-Fi",
  "Satellite flat-screen TV",
  "Nespresso machine & kettle",
  "Mini fridge",
  "Iron & ironing board",
  "Marble floors",
  "Eco-friendly bathroom amenities",
  "Fire extinguisher",
];

export const rooms: Room[] = [
  // ══ THE SEVEN SUITES · House of Europe ════════════════════════════════════
  {
    id: "evexia",
    bookingId: null,
    slug: "evexia",
    name: "Evexia",
    displayName: "Evexia",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 2,
    sizeSqm: 30,
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "The waterfront",
    outdoor: "Terrace with a private hot tub",
    level: null,
    description:
      "Evexia is the Greek word for wellbeing, and the suite is arranged around one: a private hot tub set into its own terrace, with the sea running the full width of the view behind it. The wall around it is hung with painted Cretan tiles and a cactus stands at the parapet — a roof made to be lived on rather than looked at. Thirty square metres below it, entered straight from the street, with a backyard of its own, a bedroom, a bathroom, and a corner for coffee.",
    notes: [],
    amenities: [
      "Private hot tub",
      "Private street entrance",
      "Waterfront position",
      "Backyard",
      "Heating & air conditioning",
      "Coffee maker",
      "Mini fridge",
      "Safe",
      "Free Wi-Fi",
    ],
    images: EVEXIA_IMAGES,
    renovated: null,
    hotTub: true,
    featureOrder: 1,
  },
  {
    id: "30918",
    bookingId: "30918",
    slug: "harmony",
    name: "Gateway Suites - Harmony",
    displayName: "Harmony",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 2,
    maxGuests: 4,
    sizeSqm: 40,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { label: "King bed", count: 1 },
      { label: "Sofa bed", count: 2 },
    ],
    outlook: "Private interior courtyard",
    outdoor: "Courtyard with a heated private plunge pool",
    level: "Ground floor",
    description:
      "The largest of the suites. A secluded interior courtyard with a private plunge pool, heated, so the water is warm whatever the month — a jacuzzi at one end of the day and a place to lie in water at the other — for relaxation without distraction or disruption: the day flowing on beside running water, under a bright blue sky, or by moonlight with a glass of Greek wine. Inside: a lounge area, a king-size bed of 1.80m, a 55-inch television with HDMI, two armchairs that convert to beds, and elegant marble underfoot. The kitchenette holds every kind of coffee maker, a kettle, an electric stove and a microwave.",
    notes: ["All bathroom amenities are eco-friendly."],
    amenities: [
      ...SUITE_AMENITIES,
      "Heated private plunge pool / jacuzzi",
      "Kitchenette with electric stove & microwave",
      "Lounge area",
      /* A courtyard, not a terrace. The record said "Terrace" while every
         other field on this suite — outlook, outdoor, the description and
         the photographs — describes an enclosed interior courtyard at
         ground level. A guest who books a terrace expects to be outside
         and above, and would arrive to find neither. */
      "Private interior courtyard",
    ],
    images: ROOM_IMAGES["30918"] ?? [],
    renovated: null,
    plungePool: true,
    tourUrl:
      "https://vtours.pepita.io/spitogatos/7f8301cb-b853-4ff5-95e4-0a7d0be2ddf7",
    featureOrder: 2,
  },
  {
    id: "30919",
    bookingId: "30919",
    slug: "agapi",
    name: "Gateway Suites - Agapi",
    displayName: "Agapi",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 2,
    sizeSqm: 30,
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ label: "King bed", count: 1 }],
    outlook: "Inner courtyard with an old well",
    outdoor: "Private courtyard",
    level: "Ground floor",
    description:
      "Agapi means love — named for the care invested in its design, particularly for people with special needs. It has a private entrance from the side street, and a bathroom built fully to the standards of safe and comfortable hygiene care, designed for wheelchair users. The serene inner courtyard, with its picturesque old well, is made for sitting outside as Cretan neighbourhoods have always done. Sleek marble floors throughout.",
    notes: [
      "All bathroom amenities are eco-friendly.",
      "Coco-Mat mattress.",
    ],
    amenities: [
      ...SUITE_AMENITIES,
      "Step-free access & private entrance",
      "Walk-in shower",
      "Toilet with grab rails",
      "Coco-Mat mattress",
      "Terrace",
    ],
    images: ROOM_IMAGES["30919"] ?? [],
    renovated: null,
    accessible: true,
    tourUrl:
      "https://vtours.pepita.io/spitogatos/b0940633-9df2-406c-b4ff-97772cdb3377",
    featureOrder: 4,
  },
  {
    id: "30874",
    bookingId: "30874",
    slug: "pathos",
    name: "Gateway Suites - Pathos",
    displayName: "Pathos",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 2,
    sizeSqm: 17,
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ label: "King bed", count: 1 }],
    outlook: "Exterior courtyard",
    outdoor: "Terrace",
    level: "Upper level",
    description:
      "Pathos means passion, and the room is arranged around one piece of nerve: a glass double shower cabin standing beside the bed rather than hidden behind a door. It is the whole design — nothing else in the suite competes with it — and it is why this is the one couples ask for by name. An intimate junior suite in a private, secluded corner of the hotel, with a courtyard just outside for morning coffee under the bright Greek sun, or a drink in the moonlight. Adults only: the layout is built around two people and no third.",
    notes: ["All bathroom amenities are eco-friendly."],
    /* The shower cabin leads the list because it leads the room. It is not a
       jacuzzi and is never described as one — the property publishes no
       hydromassage here, and inventing one would be the easiest lie on the
       site to tell and the worst one to be caught in at check-in. */
    amenities: [
      "Glass double shower cabin beside the bed",
      ...SUITE_AMENITIES,
      "Terrace",
      "Room closet",
    ],
    images: ROOM_IMAGES["30874"] ?? [],
    renovated: null,
    adultsOnly: true,
    tourUrl:
      "https://momento360.com/e/uc/1091cc936a674660bd1a349e78d91c06?utm_campaign=embed&utm_source=other&size=medium&display-plan=true",
    featureOrder: 5,
  },
  {
    id: "30920",
    bookingId: "30920",
    slug: "elpida",
    name: "Gateway Suites -  Elpida",
    displayName: "Elpida",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 2,
    sizeSqm: 30,
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ label: "King bed", count: 1 }],
    outlook: "Over the old town",
    outdoor: "Terrace",
    level: "First floor",
    description:
      "Elpida means hope, and two pieces of design hold the whole room. A minimal concrete vanity table stands beside the bed, carrying a mirror and a black washbasin — plumbing treated as furniture rather than hidden. Opposite it, a sofa is built into the windows and banked with pillows, so the best seat in the suite is the one in the light. Read there in the morning with coffee, or sit with wine in the evening and listen to the moonlit city. Adults only.",
    notes: [],
    amenities: [
      "Concrete vanity table with black washbasin",
      "Built-in window sofa",
      ...SUITE_AMENITIES,
      "Terrace",
    ],
    images: ROOM_IMAGES["30920"] ?? [],
    renovated: null,
    adultsOnly: true,
    featureOrder: 6,
  },
  {
    id: "eros",
    bookingId: null,
    slug: "eros",
    name: "Eros",
    displayName: "Eros",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 4,
    sizeSqm: 30,
    bedrooms: 2,
    bathrooms: 1,
    beds: [{ label: "Bedroom", count: 2 }],
    outlook: "Private courtyard",
    outdoor: "Patio with a private hot tub",
    level: null,
    description:
      "A blend of serenity and luxury. Thirty square metres across two bedrooms, entered from its own door rather than from a corridor, opening onto a shaded patio with a hot tub of its own, a wooden screen for privacy and deckchairs set out on the grass. Built for couples — and for honeymoons, which is what it is most often asked for.",
    notes: [],
    amenities: [
      "Private hot tub",
      "Private entrance",
      "Patio / balcony",
      "Two bedrooms",
      "Air conditioning",
      "Free Wi-Fi",
      "Flat-screen TV",
      "Mini fridge",
      "Safe",
    ],
    images: EROS_IMAGES,
    renovated: null,
    hotTub: true,
    tourUrl:
      "https://vtours.pepita.io/spitogatos/d75fb879-0973-4bda-816b-7fda0181f42a",
    featureOrder: 7,
  },
  {
    id: "zoi",
    bookingId: null,
    slug: "zoi",
    name: "Zoi",
    displayName: "Zoi",
    house: "house-of-europe",
    kind: "suite",
    collection: "gateway",
    guests: 4,
    sizeSqm: 30,
    bedrooms: 2,
    bathrooms: 2,
    beds: [{ label: "Bedroom", count: 2 }],
    outlook: "Private backyard",
    outdoor: "Backyard with a private hot tub",
    level: null,
    description:
      "Zoi means life. Two bedrooms and two bathrooms across thirty square metres — the only suite here where nobody has to queue in the morning — with a private entrance and a backyard of its own, fenced in wood, planted along the wall, and holding a hot tub big enough for the four of you. The one to take with children, or with another couple.",
    notes: [],
    amenities: [
      "Private hot tub",
      "Private entrance",
      "Backyard",
      "Two bedrooms",
      "Two bathrooms",
      "Family friendly",
      "Air conditioning",
      "Free Wi-Fi",
      "Flat-screen TV",
      "Mini fridge",
      "Safe",
    ],
    images: ZOI_IMAGES,
    renovated: null,
    hotTub: true,
    tourUrl:
      "https://momento360.com/e/uc/89a112ead3134685b72c16a547c01bce?utm_campaign=embed&utm_source=other&size=medium&display-plan=true",
    featureOrder: 8,
  },

  // ══ ROOMS · House of Europe ═══════════════════════════════════════════════
  {
    id: "4079",
    bookingId: "4079",
    slug: "sea-view-balcony-house-of-europe",
    name: "Standard Room With Sea View and Balcony - House of Europe",
    displayName: "Sea View with Balcony",
    house: "house-of-europe",
    kind: "room",
    guests: 2,
    sizeSqm: 15,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Sea view",
    outdoor: "Balcony",
    level: null,
    description:
      "A warm room of rustic wood and whitewashed wall, facing the sea, with a balcony to take it in from. Open the shutters in the morning and the water is the whole window.",
    notes: [
      "Sea-facing rooms can be lively — they sit closest to the cafés and bars.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: [...BASE_AMENITIES, "Balcony"],
    images: ROOM_IMAGES["4079"] ?? [],
    renovated: "May 2020",
    featureOrder: 3,
  },
  {
    id: "4078",
    bookingId: "4078",
    slug: "sea-view-house-of-europe",
    name: "Standard Room With Sea View - House of Europe",
    displayName: "Sea View",
    house: "house-of-europe",
    kind: "room",
    guests: 2,
    sizeSqm: 15,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Sea view",
    outdoor: null,
    level: null,
    description:
      "Fifteen square metres facing the water, in the building that was once the University of Crete's guest house.",
    notes: [
      "Sea-facing rooms can be lively — they sit closest to the cafés and bars.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4078"] ?? [],
    renovated: "May 2020",
  },
  {
    id: "4082",
    bookingId: "4082",
    slug: "side-sea-view-balcony-house-of-europe",
    name: "Standard Room With Side Sea View and Balcony - House of Europe",
    displayName: "Side Sea View with Balcony",
    house: "house-of-europe",
    kind: "room",
    guests: 2,
    sizeSqm: 15,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Side sea view",
    outdoor: "Balcony",
    level: null,
    description:
      "The sea arrives at an angle here, framed between old-town roofs, with a balcony to watch the light change from.",
    notes: ["Housekeeping is arranged with each stay — typically every two days."],
    amenities: [...BASE_AMENITIES, "Balcony"],
    images: ROOM_IMAGES["4082"] ?? [],
    renovated: "May 2020",
  },
  {
    id: "4081",
    bookingId: "4081",
    slug: "balcony-house-of-europe",
    name: "Standard Room With Balcony - House of Europe",
    displayName: "Room with Balcony",
    house: "house-of-europe",
    kind: "room",
    guests: 2,
    sizeSqm: 12,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Over the old town",
    outdoor: "Balcony",
    level: null,
    description:
      "A compact room turned inward to the old town, with a balcony over the alley below.",
    notes: ["Housekeeping is arranged with each stay — typically every two days."],
    amenities: [...BASE_AMENITIES, "Balcony"],
    images: ROOM_IMAGES["4081"] ?? [],
    renovated: "May 2020",
  },
  {
    id: "4080",
    bookingId: "4080",
    slug: "standard-house-of-europe",
    name: "Standard Room - House of Europe",
    displayName: "Standard Room",
    house: "house-of-europe",
    kind: "room",
    guests: 2,
    sizeSqm: 14,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Over the old town",
    outdoor: null,
    level: null,
    description:
      "Fourteen quiet square metres in the first building, a minute from breakfast.",
    notes: ["Housekeeping is arranged with each stay — typically every two days."],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4080"] ?? [],
    renovated: "May 2020",
  },
  {
    id: "4421",
    bookingId: "4421",
    slug: "two-bedroom-apartment-house-of-europe",
    name: "Τwo Bedroom Apartments - House of Europe",
    displayName: "Two-Bedroom Apartment",
    house: "house-of-europe",
    kind: "room",
    guests: 4,
    sizeSqm: 30,
    bedrooms: 2,
    beds: [
      { label: "Double bed", count: 1 },
      { label: "Single bed", count: 2 },
    ],
    outlook: "Over the old town",
    outdoor: null,
    level: null,
    description:
      "Thirty square metres across two bedrooms — the room to take for a family, or for two couples travelling together.",
    notes: [
      "Sea-facing rooms can be lively — they sit closest to the cafés and bars.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4421"] ?? [],
    renovated: "May 2020",
  },

  // ══ ROOMS · Phos ══════════════════════════════════════════════════════════
  // Seven rooms, numbered 1 to 7. Nothing here is called a suite.
  {
    id: "4077",
    bookingId: "4077",
    slug: "room-with-terrace-phos",
    name: "Room With Terrace - Phos",
    displayName: "Room with Terrace",
    house: "phos",
    kind: "room",
    guests: 2,
    sizeSqm: 12,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Over the old town",
    outdoor: "Terrace",
    level: null,
    description:
      "Twelve square metres indoors, and a private terrace above the rooftops of the old town that is the better half of it.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: [...BASE_AMENITIES, "Private terrace"],
    images: ROOM_IMAGES["4077"] ?? [],
    renovated: "June 2019",
    featureOrder: 9,
  },
  {
    id: "4418",
    bookingId: "4418",
    slug: "superior-room-with-balcony-phos",
    name: "Superior Room with Balcony - Phos",
    /* NAME COLLISION — see PROPOSALS.md #1, awaiting the owner.
       Booking id 4076 is called "Superior Room With Balcony - Phos": the same
       string with one capital letter changed. A guest who wants this room —
       20 m², sleeps four — can book that one, which is 18 m² and sleeps three,
       and find out at check-in. Renaming this one "Family Room with Balcony"
       would fix it in a single field without touching the URL, the engine name
       or the deep link. Not applied: room names are the owner's to decide. */
    displayName: "Superior Room with Balcony",
    house: "phos",
    kind: "room",
    guests: 4,
    sizeSqm: 20,
    beds: [
      { label: "Double bed", count: 1 },
      { label: "Single bed", count: 1 },
      { label: "Sofa bed", count: 1 },
    ],
    outlook: "Over the old town",
    outdoor: "Balcony",
    level: null,
    description:
      "Twenty square metres with a balcony, arranged to sleep four: one double bed, one sofa bed and one bunk bed.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: [...BASE_AMENITIES, "Balcony"],
    images: ROOM_IMAGES["4418"] ?? [],
    renovated: "June 2019",
  },
  {
    id: "4076",
    bookingId: "4076",
    slug: "superior-balcony-phos",
    name: "Superior Room With Balcony - Phos",
    displayName: "Superior with Balcony",
    house: "phos",
    kind: "room",
    guests: 3,
    sizeSqm: 18,
    beds: [
      { label: "Double bed", count: 1 },
      { label: "Single bed", count: 1 },
    ],
    outlook: "Over the old town",
    outdoor: "Balcony",
    level: null,
    description:
      "Eighteen square metres and a balcony, sleeping three.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: [...BASE_AMENITIES, "Balcony"],
    images: ROOM_IMAGES["4076"] ?? [],
    renovated: "June 2019",
  },
  {
    id: "4074",
    bookingId: "4074",
    slug: "standard-phos",
    name: "Standard Room - Phos",
    displayName: "Standard Room",
    house: "phos",
    kind: "room",
    guests: 2,
    sizeSqm: 15,
    beds: [{ label: "Double bed", count: 1 }],
    outlook: "Over the old town",
    outdoor: null,
    level: null,
    description:
      "Fifteen square metres in the quieter building, wood and white plaster, shutters onto the alley.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4074"] ?? [],
    renovated: "June 2019",
  },
  {
    id: "4075",
    bookingId: "4075",
    slug: "triple-phos",
    name: "Triple Room - Phos",
    displayName: "Triple Room",
    house: "phos",
    kind: "room",
    guests: 3,
    sizeSqm: 14,
    beds: [
      { label: "Double bed", count: 1 },
      { label: "Single bed", count: 1 },
    ],
    outlook: "Over the old town",
    outdoor: null,
    level: null,
    description: "A double and a single, for three travelling together.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4075"] ?? [],
    renovated: "June 2019",
  },
  {
    id: "4419",
    bookingId: "4419",
    slug: "quadruple-phos",
    name: "Quadruple Room - Phos",
    displayName: "Quadruple Room",
    house: "phos",
    kind: "room",
    guests: 4,
    sizeSqm: 14,
    beds: [
      { label: "Double bed", count: 1 },
      { label: "Single bed", count: 2 },
    ],
    outlook: "Over the old town",
    outdoor: null,
    level: null,
    description: "One double bed and two bunk beds — the family room at Phos.",
    notes: [
      "Reception and breakfast are at House of Europe, a short walk away.",
      "Housekeeping is arranged with each stay — typically every two days.",
    ],
    amenities: BASE_AMENITIES,
    images: ROOM_IMAGES["4419"] ?? [],
    renovated: "June 2019",
  },

  // ══ THE RESIDENCE ═════════════════════════════════════════════════════════
  {
    id: "23980",
    bookingId: "23980",
    slug: "residence-of-the-old-port",
    name: "The Residence of the Old Port",
    displayName: "The Residence of the Old Port",
    house: "residence",
    kind: "residence",
    guests: null,
    sizeSqm: null,
    bedrooms: 2,
    beds: [{ label: "Bedroom", count: 2 }],
    outlook: "Rethymno old town",
    outdoor: "Balcony & terrace",
    level: null,
    description:
      "A two-bedroom house of your own, one hundred metres from the Venetian harbour and four hundred from the Archaeological Museum, with private parking and a kitchen. The town beach is a few minutes' walk. Continental breakfast is available.",
    notes: [],
    amenities: [
      "Air conditioning",
      "Free Wi-Fi",
      "Flat-screen TV",
      "Full kitchen & kitchenette",
      "Coffee maker",
      "Dining table",
      "Sitting area & desk",
      "Private parking",
      "Terrace",
      "Iron & ironing board",
    ],
    images: ROOM_IMAGES["23980"] ?? [],
    renovated: null,
    featureOrder: 10,
  },
];

export const roomsBySlug = new Map(rooms.map((r) => [r.slug, r]));

export function roomsInHouse(house: HouseId): Room[] {
  return rooms.filter((r) => r.house === house);
}

/** The seven suites, in house order. All of them are at House of Europe. */
export const suites = rooms.filter((r) => r.kind === "suite");

/**
 * The featured run, in the order the property wants it read: the hot tub
 * first, then the plunge pool, then the best sea view, then the rest.
 */
/**
 * What is arranged alongside a room.
 *
 * The default is what the desk arranges for everybody: getting here, getting
 * about, and the therapist who comes to the room. Suites deviate only where
 * the room itself suggests it — the adults-only pair lean to the private and
 * the unhurried; the two that sleep four lean to the boat and the jeep, which
 * are the things a family actually asks for.
 */
/* Rebalanced 27 Aug 2026, after nine stock frames were withdrawn.
 *
 * Nine arrangements now have no photograph, and these strips are three cards
 * wide: evexia and harmony had all three of theirs withdrawn and showed a row
 * of three empty frames, which reads as a page that failed rather than as a
 * page that is honest. Every strip now carries at least two photographs.
 *
 * What was NOT done: giving a withdrawn card somebody else's picture. A
 * genuine frame of the organic farm on a card headed "Massage" is the same
 * lie as the stock was, in better clothes. The arrangements keep their own
 * pictures or none; only which three are offered has changed, and the reasons
 * below still hold — the adults-only pair lean private and unhurried, the two
 * that sleep four lean to the boat and the jeep, agapi keeps its transfer.
 *
 * One line each to put back. */
const RELATED_DEFAULT = ["chauffeur", "rent-a-car", "breakfast-on-the-beach"] as const;

const RELATED_BY_SLUG: Record<string, readonly string[]> = {
  evexia: ["breakfast-on-the-beach", "private-boat-trip", "chauffeur"],
  harmony: ["organic-farm", "breakfast-on-the-beach", "chauffeur"],
  agapi: ["chauffeur", "rent-a-car", "organic-farm"],
  pathos: ["massage", "private-boat-trip", "breakfast-on-the-beach"],
  elpida: ["massage", "organic-farm", "private-boat-trip"],
  eros: ["private-boat-trip", "scuba-diving", "massage"],
  zoi: ["chauffeur", "jeep-safari", "rent-a-car"],
};

/** The slugs to offer beside a room, in order. */
export function relatedFor(room: Room): readonly string[] {
  return room.relatedExperiences ?? RELATED_BY_SLUG[room.slug] ?? RELATED_DEFAULT;
}

export const featuredRooms = rooms
  .filter((r) => r.featureOrder !== undefined)
  .sort((a, b) => (a.featureOrder ?? 99) - (b.featureOrder ?? 99));

/* ── The counts, derived once so nothing on the site can disagree ──────────
   Every "seven suites" and "seven rooms" line reads from here rather than
   being typed again, which is how "nine rooms" survived three rewrites. */
export const counts = {
  suites: suites.length,
  /** Physical rooms at Phos, numbered 1–7 — not the number of bookable types. */
  phosRooms: 7,
  roomTypes: rooms.length,
  buildings: houses.length,
};

/** Deep link straight into the reservation engine for a given room. */
export function bookingUrlFor(room?: Room): string {
  const base = "https://inkhotels.reserve-online.net/";
  return room?.bookingId ? `${base}?bedroom=${room.bookingId}` : base;
}
