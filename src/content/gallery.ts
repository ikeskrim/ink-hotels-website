import {
  ARTICLE_IMAGES,
  GALLERY_IMAGES,
  ROOM_IMAGES,
} from "./generated/images";
import {
  AGAPI_IMAGES,
  BREAKFAST_IMAGES,
  COURTYARD_IMAGES,
  ELPIDA_IMAGES,
  EROS_IMAGES,
  EVEXIA_IMAGES,
  HOUSE_IMAGES,
  PHOS_HOUSE_IMAGES,
  TOWN_IMAGES,
  ZOI_IMAGES,
} from "./generated/suite-images";
import { rooms } from "./rooms";
import { experiences } from "./experiences";
import { places } from "./place";

/**
 * The gallery, assembled from the property's own library.
 *
 * Categories are derived from where each photograph actually came from — a
 * room's own set, an experience's page, a landmark article, or the house album
 * — rather than guessed. That also means every image can carry alt text that
 * says something true about it, instead of a generic caption repeated 400 times.
 *
 * ORDER IS AN ARGUMENT. The water leads: the hot tub above the sea and the
 * plunge pool in its courtyard are the two things this hotel has that nothing
 * else on this coast has at this size, and a guest who scrolls four screens
 * before reaching them has already formed a view. Landmarks follow, then the
 * rooms, then everything else.
 */

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
}

/**
 * The collections, in the order a guest would want them.
 *
 * Grouped by where a photograph was taken rather than by what kind of thing it
 * is: "Rooms & Suites" put a Phos single and Harmony's courtyard pool in the
 * same bucket, which is no help to anybody deciding between them. Water leads,
 * because it is the reason most of these photographs get looked at at all.
 */
export const galleryCategories = [
  { id: "all", label: "Everything" },
  { id: "water", label: "Pool & hot tub" },
  { id: "suites", label: "The suites" },
  { id: "house-of-europe", label: "House of Europe" },
  { id: "phos", label: "Phos" },
  { id: "residence", label: "The Residence" },
  { id: "town", label: "The old town" },
  { id: "breakfast", label: "Breakfast" },
  { id: "experiences", label: "Experiences" },
];

/** The plunge pool, from Harmony's own set. */
const PLUNGE_POOL = ["/media/9053c1c0aa924fb16769460a7c06ae29.webp"];

function build(): GalleryItem[] {
  const seen = new Set<string>();
  const out: GalleryItem[] = [];

  const push = (src: string, alt: string, category: string) => {
    if (!src || seen.has(src)) return;
    /* Placeholders are never in the gallery. The gallery is titled "the whole
       place" and every photograph in it is a photograph of this hotel; a
       licensed stock frame standing in until the owner sends a real one would
       be the one picture in it that is somewhere else. It still appears on
       the page it belongs to, where the copy explains what it is. */
    if (src.includes("/placeholder-")) return;
    seen.add(src);
    out.push({ src, alt, category });
  };

  /* ── The water, first ─────────────────────────────────────────────────── */
  EVEXIA_IMAGES.slice(0, 6).forEach((src, i) =>
    push(
      src,
      `The private hot tub on the Evexia terrace, above the waterfront at Rethymno — photograph ${i + 1}`,
      "water",
    ),
  );
  PLUNGE_POOL.forEach((src) =>
    push(
      src,
      "The heated private plunge pool in the interior courtyard of the Harmony suite",
      "water",
    ),
  );
  ZOI_IMAGES.slice(0, 2).forEach((src, i) =>
    push(src, `The Zoi suite and its backyard — photograph ${i + 1}`, "water"),
  );
  COURTYARD_IMAGES.forEach((src) =>
    push(src, "The suite courtyards at House of Europe, from above", "water"),
  );

  /* ── The place ────────────────────────────────────────────────────────── */
  for (const place of places) {
    push(place.image, `${place.name}, Rethymno`, "town");
  }
  TOWN_IMAGES.forEach((src) =>
    push(src, "Rethymno old town and the Venetian harbour from above", "town"),
  );

  /* ── Room photography, filed by the building it was taken in ──────────── */
  const BUILDING: Record<string, string> = {
    "house-of-europe": "house-of-europe",
    phos: "phos",
    residence: "residence",
  };
  for (const room of rooms) {
    /* A suite is its own collection wherever it physically sits: somebody
       looking for "the suites" wants the seven, not the building. */
    const category = room.kind === "suite" ? "suites" : (BUILDING[room.house] ?? "town");
    const set = room.images.length ? room.images : (ROOM_IMAGES[room.id] ?? []);
    set.forEach((src, i) => {
      push(src, `${room.name} at Ink Hotels — photograph ${i + 1}`, category);
    });
  }
  EROS_IMAGES.forEach((src, i) =>
    push(src, `The Eros suite at House of Europe — photograph ${i + 1}`, "suites"),
  );
  ZOI_IMAGES.forEach((src, i) =>
    push(src, `The Zoi suite at House of Europe — photograph ${i + 1}`, "suites"),
  );
  AGAPI_IMAGES.forEach((src, i) =>
    push(src, `The Agapi suite at House of Europe — photograph ${i + 1}`, "suites"),
  );
  ELPIDA_IMAGES.forEach((src, i) =>
    push(src, `The Elpida suite at House of Europe — photograph ${i + 1}`, "suites"),
  );

  /* ── The buildings ────────────────────────────────────────────────────── */
  HOUSE_IMAGES.forEach((src, i) =>
    push(
      src,
      `House of Europe, Nikolaou Plastira — photograph ${i + 1}`,
      "house-of-europe",
    ),
  );
  PHOS_HOUSE_IMAGES.forEach((src, i) =>
    push(src, `Phos, the second building — photograph ${i + 1}`, "phos"),
  );
  for (const src of GALLERY_IMAGES) {
    push(src, "Ink Hotels, Rethymno — the houses and the old town", "town");
  }

  /* ── The days ─────────────────────────────────────────────────────────── */
  BREAKFAST_IMAGES.forEach((src, i) =>
    push(src, `Breakfast at House of Europe — photograph ${i + 1}`, "breakfast"),
  );
  for (const exp of experiences) {
    push(
      exp.image,
      exp.imageAlt ?? `${exp.title} — arranged by Ink Hotels, Rethymno`,
      "experiences",
    );
  }

  for (const set of Object.values(ARTICLE_IMAGES)) {
    for (const src of set) {
      push(src, "Rethymno, Crete", "town");
    }
  }

  return out;
}

export const galleryItems = build();
