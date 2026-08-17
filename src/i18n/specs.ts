import type { Room } from "@/content/rooms";
import type { Messages } from "./messages/en";
import { localeTags, type Locale } from "./config";

/**
 * Room specifications, in the reader's language.
 *
 * "15 m² · 2 guests · 1 double bed" was assembled in the card component from
 * English nouns and an English pluralisation rule (`label + "s"`), so it was
 * the single most-repeated piece of untranslated text on the site — every room
 * card on every page in every language.
 *
 * Bed labels come from the reservation system in English and are mapped here
 * rather than translated in the room overlay, because there are five of them
 * and two hundred uses: a lookup is one place to be right.
 *
 * Numbers go through `Intl.NumberFormat` so a German reader gets 1.234 and a
 * French one 1 234 — irrelevant at these sizes, correct anyway, and free.
 */

type BedKey = "bedKing" | "bedDouble" | "bedSingle" | "bedSofa" | "bedBunk" | "bedRoom";

const BED_KEYS: Record<string, BedKey> = {
  "king bed": "bedKing",
  "double bed": "bedDouble",
  "single bed": "bedSingle",
  "sofa bed": "bedSofa",
  "bunk bed": "bedBunk",
  bedroom: "bedRoom",
};

/** "2 double beds" — the count, then the noun, pluralised by the catalogue. */
export function bedPhrase(
  label: string,
  count: number,
  m: Messages,
  locale: Locale,
): string {
  const key = BED_KEYS[label.trim().toLowerCase()];
  const n = new Intl.NumberFormat(localeTags[locale]).format(count);
  /* An unmapped label is shown as it came from the engine rather than dropped:
     a visible English word is a bug report; a missing bed is a complaint. */
  if (!key) return `${n} ${label.toLowerCase()}${count > 1 ? "s" : ""}`;
  const forms = m.rooms[key];
  return `${n} ${count === 1 ? forms.one : forms.other}`;
}

/**
 * The one-line spec used on cards and in the detail table.
 *
 * The reservation system records a bedroom count in two places: `bedrooms`, and
 * again as a `beds` entry labelled "Bedroom" — the same fact stated twice,
 * because the engine has no separate field for "this unit has rooms rather than
 * beds". Eros, Zoi and the Residence all carry both, and the card read
 * "30 m² · 2 bedrooms · 4 guests · 2 bedrooms".
 *
 * Rather than special-case that one label, every part is pushed through a
 * de-duplicating collector. Two parts that render to the same words are the
 * same fact whatever produced them, and saying a fact twice on a card that has
 * room for four makes the room look thinner, not fuller.
 */
export function roomSpecs(room: Room, m: Messages, locale: Locale): string[] {
  const nf = new Intl.NumberFormat(localeTags[locale]);
  const out: string[] = [];
  const seen = new Set<string>();

  /** Add a part unless something rendering identically is already there. */
  const push = (part: string) => {
    const key = part.trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(part);
  };

  if (room.sizeSqm) push(`${nf.format(room.sizeSqm)} m²`);

  if (room.bedrooms && room.bedrooms > 1) {
    push(
      `${nf.format(room.bedrooms)} ${room.bedrooms === 1 ? m.rooms.bedroomCount.one : m.rooms.bedroomCount.other}`,
    );
  }

  if (room.guests) {
    const max = room.maxGuests && room.maxGuests > room.guests ? room.maxGuests : null;
    const n = max ? `${nf.format(room.guests)}–${nf.format(max)}` : nf.format(room.guests);
    const plural = (max ?? room.guests) === 1 ? m.booking.guest_one : m.booking.guest_other;
    push(plural.replace("{count}", n));
  }

  /* Bed phrases are de-duplicated among themselves first, so a room listing
     the same bed twice does not produce "1 double bed, 1 double bed" inside
     what is meant to read as one clause. */
  const bedParts: string[] = [];
  const bedSeen = new Set<string>();
  for (const b of room.beds) {
    const phrase = bedPhrase(b.label, b.count, m, locale);
    const key = phrase.trim().toLowerCase();
    if (!phrase || bedSeen.has(key) || seen.has(key)) continue;
    bedSeen.add(key);
    bedParts.push(phrase);
  }
  if (bedParts.length) push(bedParts.join(", "));

  return out;
}
