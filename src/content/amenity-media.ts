/**
 * Photographs that actually show a named amenity.
 *
 * The bento grid on a suite page reveals a frame when a feature is hovered or
 * focused, which means every entry here is a claim: "this picture is of that
 * thing". So the rule is the same one the photo audit established — a frame
 * goes in only after somebody has opened it and looked. Nothing is mapped by
 * filename, by position in the gallery, or by hoping.
 *
 * An amenity with no entry is not a gap to be filled with the nearest
 * available photograph. It renders as type, and the cell still expands and
 * still reads as deliberate. A picture of the lounge behind the word
 * "Kitchenette" is the same class of lie as a stock frame of somebody else's
 * vineyard, which this project has already removed once.
 *
 * Keyed by room slug, then by the amenity string exactly as it appears in
 * `rooms.ts` — a test holds the two together, so a renamed amenity breaks
 * loudly rather than silently losing its picture.
 */

export interface AmenityFrame {
  /** The image, which must genuinely show the amenity. */
  src: string;
  /** What is in the frame. Written from looking at it, and used as alt text. */
  alt: string;
}

export const AMENITY_MEDIA: Record<string, Record<string, AmenityFrame>> = {
  harmony: {
    /* Looked at: the pool itself, filled, in its courtyard — patterned tile on
       the far wall, towels and sunglasses on the coping. It is the frame the
       media check already carries a documented exemption for, as the largest
       one that exists of the only pool on the property. */
    "Heated private plunge pool / jacuzzi": {
      src: "/media/9053c1c0aa924fb16769460a7c06ae29.webp",
      alt: "The heated plunge pool in Harmony's courtyard, towels folded on the coping",
    },
    /* Looked at: two armchairs and a low table on marble, the shutters open
       onto the courtyard. The air-conditioning unit and the marble floor are
       both visible in it, but it is mapped to the lounge because that is what
       the photograph is OF. */
    "Lounge area": {
      src: "/media/5338a6f7e902dcf2a9d75f773dc0f09a.webp",
      alt: "Harmony's lounge — two armchairs and a low table on marble, shutters open to the courtyard",
    },
  },
  evexia: {
    /* Looked at: the hot tub on the terrace with the open sea directly behind
       it. It shows the waterfront position as plainly as it shows the tub,
       which is why the suite leads with it. */
    "Private hot tub": {
      src: "/media/c1d3015d10dbf89fdc5a854450a3d4c2.webp",
      alt: "Evexia's private hot tub on the terrace, the open sea behind it",
    },
  },
};

/** The frame for one amenity, where one has been verified. */
export function amenityFrame(
  slug: string,
  amenity: string,
): AmenityFrame | undefined {
  return AMENITY_MEDIA[slug]?.[amenity];
}

/** Whether a suite has any verified amenity photography at all. */
export function hasAmenityMedia(slug: string): boolean {
  return Object.keys(AMENITY_MEDIA[slug] ?? {}).length > 0;
}
