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

/** The one-line spec used on cards and in the detail table. */
export function roomSpecs(room: Room, m: Messages, locale: Locale): string[] {
  const nf = new Intl.NumberFormat(localeTags[locale]);
  const out: string[] = [];

  if (room.sizeSqm) out.push(`${nf.format(room.sizeSqm)} m²`);

  if (room.bedrooms && room.bedrooms > 1) {
    out.push(
      `${nf.format(room.bedrooms)} ${room.bedrooms === 1 ? m.rooms.bedroomCount.one : m.rooms.bedroomCount.other}`,
    );
  }

  if (room.guests) {
    const max = room.maxGuests && room.maxGuests > room.guests ? room.maxGuests : null;
    const n = max ? `${nf.format(room.guests)}–${nf.format(max)}` : nf.format(room.guests);
    const plural = (max ?? room.guests) === 1 ? m.booking.guest_one : m.booking.guest_other;
    out.push(plural.replace("{count}", n));
  }

  const beds = room.beds
    .map((b) => bedPhrase(b.label, b.count, m, locale))
    .filter(Boolean)
    .join(", ");
  if (beds) out.push(beds);

  return out;
}
