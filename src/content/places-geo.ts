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
 * THE TWO MUSEUMS ARE TWO MUSEUMS. The brief on night three gave a coordinate
 * for the Archaeological Museum while `places.ts` held only the Historical and
 * Folklore Museum — a different institution a few streets away — so that pin
 * would have marked a building the page never mentioned. Both are here now,
 * each at its own OSM-verified position, and the distinction is worth keeping
 * in writing: they are commonly confused, and the map would look plausible
 * either way.
 *
 * THE ARCHAEOLOGICAL MUSEUM IS NOW IN, by the owner's decision, and it is
 * pinned at the OSM-verified position of its CURRENT site — 35.3684033,
 * 24.4743864, way 261112744, the former church of St Francis. Not the figure
 * supplied in the brief, which is about 145 m north of it, and emphatically
 * not what a geocoder returns for the name: that is still the pre-2016
 * building at the Fortezza gate. The caution in the brief was right about the
 * move and wrong about the replacement coordinate, which is exactly why every
 * pin here names the element it came from.
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
    slug: "archaeological-museum",
    lat: 35.3684033,
    lon: 24.4743864,
    source:
      "OSM way 261112744, Αρχαιολογικό Μουσείο Ρεθύμνου — the CURRENT site",
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
