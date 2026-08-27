/**
 * Single source of truth for property facts.
 *
 * Contact details are Crete Holiday Home's — the family-owned company that
 * operates Ink — and were taken from creteholidayhome.com/contact. The
 * building addresses are Ink's own and are unchanged: the hotel occupies four
 * separate buildings in the old town, and collapsing them into one address
 * would be wrong.
 *
 * Nothing here may be invented. If it is not verifiable, it does not belong.
 */

export const SITE_URL = "https://inkhotels.gr";

export const site = {
  name: "Ink Hotels",
  legalName: "Ink Hotels — House of Europe & Phos",
  shortDescription:
    "A small hotel in the medieval old town of Rethymno, Crete — seven suites at House of Europe, seven rooms at Phos, and a residence by the Venetian harbour.",
  town: "Rethymno",
  island: "Crete",
  country: "Greece",
} as const;

/**
 * The reception. Every guest begins here, whichever building they sleep in —
 * this is the one address that should be given for arrival, and it is not the
 * address of the rooms.
 */
export const reception = {
  name: "House of Europe — First Building & Reception",
  street: "Nikolaou Plastira 4",
  locality: "Rethymno",
  postalCode: "74100",
  region: "Crete",
  country: "GR",
  /** Staffed until this time. Arrivals after it are arranged in advance. */
  openUntil: "23:00",
} as const;

/**
 * Breakfast. Served at the first building for every guest, whichever house
 * they sleep in — which is also why reception and breakfast share an address.
 */
export const breakfast = {
  where: "House of Europe",
  style: "Buffet",
  inRoom: true,
  inRoomSurcharge: true,
} as const;

export const contact = {
  registeredAddress: {
    street: "Trantallidou 13–15",
    locality: "Rethymno",
    region: "Crete",
    postalCode: "74100",
    country: "GR",
  },

  /**
   * Every address the hotel holds in the old town. The first is House of
   * Europe — the reception, and where all seven suites are; the second is
   * Phos. The remaining two are the property's own and are kept: they are
   * where some guests actually sleep, and collapsing them into one address
   * would send somebody to the wrong door.
   */
  buildings: [
    {
      label: "House of Europe · first building",
      street: "Nikolaou Plastira 4",
      note: "Reception — where you arrive, and where the seven suites are",
      isReception: true,
    },
    {
      label: "Phos · second building",
      street: "Fotaki 10",
      note: "Seven rooms",
      isReception: false,
    },
    { label: "Also in the old town", street: "Psaron 2", note: null, isReception: false },
    { label: "Also in the old town", street: "Damvergi 26", note: null, isReception: false },
  ],

  phones: [
    {
      label: "Reception",
      value: "+30 211 444 5757",
      /* The extension is shown but not dialled. Appending it to the href makes
         some handsets dial the pause characters as digits, which fails the
         call outright; a guest reading "ext. 1" always gets it right. */
      ext: "1",
      href: "tel:+302114445757",
    },
    { label: "Mobile", value: "+30 697 406 9475", ext: null, href: "tel:+306974069475" },
  ],

  /**
   * The UK and Netherlands numbers were withdrawn by the owner: the offices are
   * Rethymno, Heraklion and Athens, and the Greek numbers above are the only
   * ones a guest should see. The field and its CMS plumbing stay so an office
   * can be published again without a code change; the annotation keeps the
   * element type, which an empty literal under `as const` would otherwise lose.
   */
  internationalOffices: [] as { label: string; value: string; href: string }[],

  emails: {
    general: "creteholidayhome@gmail.com",
    reservations: "creteholidayhome@gmail.com",
    careers: "creteholidayhome@gmail.com",
  },

  coordinates: { lat: 35.371388251539, lng: 24.475352765095 },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=35.371388251539,24.475352765095",

  social: {
    instagram: "https://www.instagram.com/ink_hotels/",
    facebook: "https://www.facebook.com/inkhotelsreth/",
  },

  /**
   * WhatsApp, on the mobile the property already publishes.
   *
   * `wa.me` takes the number in international format with no punctuation. The
   * greeting is prefilled so the guest is not staring at an empty thread
   * wondering how to open — and it is deliberately plain, because a message
   * that arrives sounding like marketing gets answered like marketing.
   */
  whatsapp: {
    number: "306974069475",
    url: (greeting: string) =>
      `https://wa.me/306974069475?text=${encodeURIComponent(greeting)}`,
  },

  /** External reservation engine. All booking CTAs point here. */
  bookingUrl: "https://inkhotels.reserve-online.net/",

  /** The parent company. */
  group: {
    name: "Crete Holiday Home",
    url: "https://creteholidayhome.com/",
    instagram: "https://www.instagram.com/crete_holiday_home_/",
    facebook:
      "https://www.facebook.com/Crete-Holiday-Home-532839923556138",
    youtube:
      "https://www.youtube.com/channel/UCiHumP-cMIBORj4fVf9tCvw/videos",
    /* Their own words. */
    descriptor:
      "a family-owned boutique hotel & villas company",
    promise:
      "authentic Greek hospitality and the ultimate in simple, effortless charm",
  },
} as const;

export const legal = {
  gntoLicence: "1041Κ132Κ3243101",
  vat: "EL998802380",
  companyRegistration: "998802380",
} as const;

/**
 * The languages the desk actually answers in. Not the languages the site is
 * translated into — those are in `src/i18n/config.ts`, and German is among
 * them because a German guest should be able to read the site, not because
 * anybody at reception speaks it.
 */
export const languages = ["English", "Greek", "Dutch", "French"] as const;

/**
 * Navigation.
 *
 * "Staying" replaces "Experiences" — the word is generic, and it sits badly
 * next to "Rethymno", which is the destination rather than the days. The page
 * itself is titled "The Art of Staying"; the URL stays `/experiences`, because
 * that is what guests actually search for and it already carries twenty-one
 * indexed pages beneath it. The drop panel disambiguates on hover.
 */
/**
 * `key` indexes into `messages.nav`, so the label comes from the active
 * catalogue rather than being hard-coded here. `href` is always the canonical
 * unprefixed path; the locale prefix is added at render time by `localePath`.
 */
export const nav = [
  { key: "rooms", href: "/rooms" },
  { key: "staying", href: "/experiences" },
  { key: "rethymno", href: "/rethymno" },
  { key: "gallery", href: "/gallery" },
  { key: "story", href: "/story" },
  { key: "arrival", href: "/arrival" },
  { key: "contact", href: "/contact" },
] as const;
