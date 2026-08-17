import type { Messages } from "./messages/en";

/**
 * Translate a structural string that lives in `content/site.ts`.
 *
 * The building and phone labels — "Phos · second building", "Reception",
 * "Mobile" — are facts about the property, not authored copy, so `site.ts`
 * stays their single record and this looks the English value up rather than
 * moving it into five catalogues.
 *
 * A string with no entry is returned as it came. On a site where the addresses
 * matter more than the adjectives, an untranslated label is a small blemish; a
 * missing one is a guest at the wrong door.
 */
export function label(value: string, m: Messages): string {
  return (m.labels as Record<string, string | undefined>)[value] ?? value;
}
