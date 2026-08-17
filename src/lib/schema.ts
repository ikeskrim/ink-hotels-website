import { SITE_URL, contact, reception, site } from "@/content/site";
import { SPOKEN_TAGS } from "@/i18n/languages";
import { faqs } from "@/content/faq";
import { rooms, suites, type Room } from "@/content/rooms";

/**
 * Structured data. Only facts the property publishes are emitted — no ratings,
 * no prices, no award claims.
 */

const address = {
  "@type": "PostalAddress",
  streetAddress: contact.registeredAddress.street,
  addressLocality: contact.registeredAddress.locality,
  addressRegion: contact.registeredAddress.region,
  postalCode: contact.registeredAddress.postalCode,
  addressCountry: contact.registeredAddress.country,
} as const;

const geo = {
  "@type": "GeoCoordinates",
  latitude: contact.coordinates.lat,
  longitude: contact.coordinates.lng,
} as const;

const feature = (name: string, value = true) => ({
  "@type": "LocationFeatureSpecification",
  name,
  value,
});

/**
 * Property-level amenities.
 *
 * Derived where it can be, so it cannot drift: the hot tub and plunge pool
 * counts are read off the room records rather than typed here, and the
 * accessibility line is emitted only if a room actually claims it. A hotel
 * that markets a facility in structured data and does not have it is the
 * kind of error a search engine surfaces and a guest arrives holding.
 */
const AMENITY_FEATURES = [
  feature("Free Wi-Fi"),
  feature("Air conditioning"),
  feature("Breakfast available"),
  feature("Garden"),
  feature("Bicycle rental"),
  feature("Massage service"),
  feature("Free off-site parking within 100 m"),
  feature("Safe"),
  feature("Soundproof windows"),
  feature("Satellite television"),
  feature("Private hot tub", suites.some((r) => r.hotTub)),
  feature("Private plunge pool", rooms.some((r) => r.plungePool)),
  feature("Wheelchair accessible room", rooms.some((r) => r.accessible)),
  feature("Airport transfer"),
  feature("Car rental"),
];

/**
 * Reception hours.
 *
 * Opening time is not published, so it is not asserted — only the close, which
 * is the fact that decides whether a late flight is a problem. `opens` has to
 * carry something for the shape to validate; 08:00 would be an invention, so
 * this emits the close alone as a `specialOpeningHoursSpecification`-free
 * simple spec with both ends only where both ends are known.
 */
const RECEPTION_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [
    "https://schema.org/Monday",
    "https://schema.org/Tuesday",
    "https://schema.org/Wednesday",
    "https://schema.org/Thursday",
    "https://schema.org/Friday",
    "https://schema.org/Saturday",
    "https://schema.org/Sunday",
  ],
  closes: reception.openUntil,
} as const;

export function hotelSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${SITE_URL}/#hotel`,
    name: site.legalName,
    description: site.shortDescription,
    url: SITE_URL,
    telephone: contact.phones[0].value,
    email: contact.emails.general,
    address,
    geo,
    hasMap: contact.mapsUrl,
    image: [`${SITE_URL}/opengraph-image`],
    availableLanguage: [...SPOKEN_TAGS],
    petsAllowed: false,
    numberOfRooms: rooms.length,
    amenityFeature: AMENITY_FEATURES,
    openingHoursSpecification: [RECEPTION_HOURS],
    checkinTime: undefined,
    sameAs: [
      contact.social.instagram,
      contact.social.facebook,
      contact.group.url,
      contact.group.instagram,
      contact.group.facebook,
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: contact.bookingUrl,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "LodgingReservation", name: "Reservation at Ink Hotels" },
    },
  };
}

export function roomSchema(room: Room) {
  const size = room.sizeSqm
    ? {
        floorSize: {
          "@type": "QuantitativeValue",
          value: room.sizeSqm,
          unitCode: "MTK",
        },
      }
    : {};

  const occupancy = room.guests
    ? {
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: room.maxGuests ?? room.guests,
          unitText: "person",
        },
      }
    : {};

  return {
    "@context": "https://schema.org",
    "@type": room.kind === "room" ? "HotelRoom" : "Suite",
    name: room.name,
    description: room.description,
    url: `${SITE_URL}/rooms/${room.slug}`,
    image: room.images.slice(0, 6).map((src) => `${SITE_URL}${src}`),
    ...size,
    ...occupancy,
    bed: room.beds.map((b) => ({
      "@type": "BedDetails",
      typeOfBed: b.label,
      numberOfBeds: b.count,
    })),
    /* The amenity list, plus the four facts a guest filters on stated in the
       vocabulary a search engine recognises. They are emitted from the room's
       own booleans rather than by matching strings in the amenity list, so a
       translated amenity can never quietly drop one. */
    amenityFeature: [
      ...room.amenities.map((name) => feature(name)),
      ...(room.hotTub ? [feature("Hot tub")] : []),
      ...(room.plungePool ? [feature("Private plunge pool")] : []),
      ...(room.accessible ? [feature("Wheelchair accessible")] : []),
    ],
    ...(room.accessible
      ? {
          accessibilityFeature: [
            "stepFreeAccess",
            "walkInShower",
            "grabRails",
            "privateStreetEntrance",
          ],
        }
      : {}),
    /* Adults only is an age restriction, not an amenity. */
    ...(room.adultsOnly ? { audience: { "@type": "Audience", suggestedMinAge: 18 } } : {}),
    ...(room.bedrooms ? { numberOfRooms: room.bedrooms } : {}),
    ...(room.bathrooms ? { numberOfBathroomsTotal: room.bathrooms } : {}),
    ...(room.tourUrl ? { subjectOf: { "@type": "CreativeWork", url: room.tourUrl } } : {}),
    containedInPlace: { "@id": `${SITE_URL}/#hotel` },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}
