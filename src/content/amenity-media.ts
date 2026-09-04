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

/** One cell of the grid, fully resolved for the reader's language. */
export interface AmenityItem {
  /** The English amenity string — the key the map and the tests use. */
  key: string;
  /** What the cell says, in the reader's language. */
  label: string;
  /** The verified photograph, described in the reader's language, if any. */
  frame?: AmenityFrame;
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

  /* ── The other five, added 4 September 2026 ──────────────────────────────
     Every frame below was opened and looked at before it was written down.
     Where an amenity has no entry it is because no frame shows it: Agapi's
     walk-in shower, grab rails and step-free entrance; Elpida's terrace;
     Zoi's second bathroom and backyard; and Pathos's courtyard hot tub, which
     is flagged in incoming/README.md as photography the site is waiting on. */

  agapi: {
    /* Looked at: the doors thrown open onto the terrace, a deckchair on the
       tiles outside, a neighbour's old wooden door across the lane. */
    Terrace: {
      src: "/media/8e76866167b3779ada4139c6c418fdbc.webp",
      alt: "Agapi's terrace through the open doors — a deckchair on the tiles, an old door across the lane",
    },
    /* Looked at: the red Nespresso machine and the kettle on the desk, cups
       set out, the terrace doors open behind. The marble floor is in the
       frame too; it is mapped to the coffee because that is what the eye
       goes to. */
    "Nespresso machine & kettle": {
      src: "/media/29a58ddec0a53c44cb46383fcd5edfcf.webp",
      alt: "The Nespresso machine and kettle on Agapi's desk, the terrace doors open behind",
    },
  },

  elpida: {
    /* Looked at: the bench built in under the two windows, cushions along
       it, the shutters open onto the old-town wall opposite. */
    "Built-in window sofa": {
      src: "/media/259cebe3b62e64b5834bdfc394fdea91.webp",
      alt: "Elpida's built-in window sofa under the open shutters, cushions along the bench",
    },
    /* Looked at: the poured-concrete vanity with the black basin and black
       tap, a brass-framed mirror above, the kitchenette beyond. */
    "Concrete vanity table with black washbasin": {
      src: "/media/c106dfa69cae9a90fd7893c48b2d6581.webp",
      alt: "Elpida's concrete vanity and black washbasin under a brass mirror, the kitchenette beyond",
    },
  },

  pathos: {
    /* Looked at: the glass cabin standing beside the bed with its black
       fittings, the bathroom door open behind it. The lead frame of the
       suite; the courtyard hot tub has no photograph yet. */
    "Glass double shower cabin beside the bed": {
      src: "/media/5561be9a4b7a1d50a0a442cb221cb185.webp",
      alt: "Pathos's glass shower cabin standing beside the bed, black fittings, the bathroom door open behind",
    },
  },

  eros: {
    /* Looked at: the tub on the turf patio, a tray of fruit on its edge,
       towels beside it, the wooden gate and a deckchair behind. */
    "Private hot tub": {
      src: "/media/c0a38a892dbed31350857c9c38c71097.webp",
      alt: "Eros's hot tub on the turf patio, a tray of fruit on the edge, the wooden gate behind",
    },
    /* Looked at: the whole patio from its gate — the name plate on the gate,
       the tub, a shade sail overhead, a deckchair against the wooden screen. */
    "Patio / balcony": {
      src: "/media/30492ae8c18483102f4d79f00f39fad7.webp",
      alt: "Eros's patio from its gate — the tub, a shade sail overhead, a deckchair against the wooden screen",
    },
  },

  zoi: {
    /* Looked at: the tub inside its wood-panelled enclosure, hanging planters
       on the boards, fruit and a bottle of wine on the tray. */
    "Private hot tub": {
      src: "/media/0a193d645f4e57add2197fa6850cceae.webp",
      alt: "Zoi's hot tub in its wood-panelled backyard, fruit and wine on the tray",
    },
    /* Looked at: one of the two bedrooms — twin beds made up together, a
       terracotta floor, woven cactus shapes on the wall. The second bedroom
       is the next frame in the set. */
    "Two bedrooms": {
      src: "/media/38f5821ccb89087cc3fa478c5d16740e.webp",
      alt: "One of Zoi's two bedrooms — twin beds made up as a double, terracotta floor",
    },
    /* Looked at: the second bedroom, and under the shelf by the desk, the
       mini fridge with a bottle and glasses set out on top. */
    "Mini fridge": {
      src: "/media/581cc04206e899915675ca034a11965b.webp",
      alt: "Zoi's second bedroom, the mini fridge under the shelf by the desk",
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
