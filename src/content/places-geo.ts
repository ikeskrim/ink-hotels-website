/**
 * Where the old-town places actually are.
 *
 * Every coordinate here was read out of OpenStreetMap and the element it came
 * from is named beside it. Nothing in this file is from memory, and nothing is
 * approximate-because-it-looked-about-right: `site.ts` sets the rule for the
 * whole repo — if it is not verifiable, it does not belong — and a map is the
 * one surface where a guest may act on the data by walking somewhere.
 *
 * ── Two corrections to the figures supplied ────────────────────────────────
 *
 * THE HARBOUR. The brief gave ≈35.3716 N, 24.4786 E. OSM puts the Venetian
 * lighthouse — the thing that marks the old harbour — at 35.3702938,
 * 24.4776334, about 150 m south-west of that. Reverse-geocoding the supplied
 * point returns a parking amenity on Nearchou, which is the harbour-front
 * street: close, but the pin would have sat on the car park rather than the
 * quay. The OSM node is used.
 *
 * THE MUSEUM. The brief gave the Archaeological Museum's current site on
 * Agiou Fragkiskou. But the museum in `places.ts` is the Historical and
 * Folklore Museum — a different institution — so pinning the Archaeological
 * Museum would have put a pin on a building the page never mentions. The
 * Historical and Folklore Museum is pinned instead, OSM-verified.
 *
 * For the record, in case the owner does want the Archaeological Museum added
 * to the content: OSM has it at 35.3684033, 24.4743864 (way 261112744), which
 * is itself about 145 m south of the supplied figure. The caution in the brief
 * was right — geocoders do return the old building — but the supplied
 * replacement is not quite the new one either.
 *
 * ── What is deliberately absent ────────────────────────────────────────────
 * Arkadi Monastery and Ancient Eleftherna are in `places.ts` and are not here.
 * They are roughly 23 and 25 km away; putting them on a map of a quarter you
 * can cross in ten minutes would either shrink the old town to a dot or lie
 * about the distance. They keep their entries on the page and stay off the
 * plan.
 */

export interface PlaceGeo {
  /** Must match a slug in `places.ts` — the map links to that anchor. */
  slug: string;
  lat: number;
  lon: number;
  /** The OSM element this came from, so the next person can re-check it. */
  source: string;
}

/** The reception, from `site.ts`. Everything on the plan is measured from it. */
export const ORIGIN = { lat: 35.371388251539, lon: 24.475352765095 } as const;

export const PLACE_GEO: readonly PlaceGeo[] = [
  {
    slug: "fortezza",
    lat: 35.3721407,
    lon: 24.4709269,
    source: "Nominatim, Φρούριο Φορτέτζα",
  },
  {
    slug: "venetian-harbour",
    lat: 35.3702938,
    lon: 24.4776334,
    source: "OSM node 2301368870, the Venetian lighthouse",
  },
  {
    slug: "historical-folklore-museum",
    lat: 35.3693254,
    lon: 24.4735891,
    source: "OSM node 4653463743, Ιστορικό Λαογραφικό Μουσείο Ρεθύμνης",
  },
  {
    slug: "town-beach",
    lat: 35.3682422,
    lon: 24.4789009,
    source: "OSM way 108780081, the beach where the old town ends",
  },
];

const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;

/** Metres north and east of the reception. Equirectangular is exact enough at
 *  half a kilometre — the error against a great circle here is centimetres. */
export function offsetMetres(place: { lat: number; lon: number }) {
  const east = rad(place.lon - ORIGIN.lon) * Math.cos(rad(ORIGIN.lat)) * R;
  const north = rad(place.lat - ORIGIN.lat) * R;
  return { east, north };
}

/** Straight-line metres from the reception — a walk is always longer. */
export function distanceMetres(place: { lat: number; lon: number }) {
  const { east, north } = offsetMetres(place);
  return Math.round(Math.hypot(east, north));
}
