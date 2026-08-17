import { en } from "./messages/en";
import type { Messages } from "./messages/en";
import { defaultLocale, type Locale } from "./config";

/**
 * Message lookup.
 *
 * Catalogues are imported statically rather than dynamically: there are five of
 * them, they are small, and static imports let TypeScript prove at build time
 * that every catalogue has every key. A missing translation becomes a compile
 * error instead of an empty heading in production.
 */

import { el } from "./messages/el";
import { de } from "./messages/de";
import { fr } from "./messages/fr";
import { nl } from "./messages/nl";

const catalogues: Record<Locale, Messages> = { en, el, de, fr, nl };

export function getMessages(locale: Locale): Messages {
  return catalogues[locale] ?? catalogues[defaultLocale];
}

/**
 * Fills {placeholders}. Deliberately dumb — no expression language, no dates,
 * no rich text. Anything that needs more than substitution is a component.
 */
export function fill(
  template: string,
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

/**
 * Plural selection against the catalogue's `_one` / `_other` convention.
 * Uses Intl so each locale gets its own rules rather than English's.
 */
export function plural(
  messages: Record<string, string>,
  base: string,
  count: number,
  locale: Locale,
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  const exact = messages[`${base}_${rule}`];
  const other = messages[`${base}_other`];
  const one = messages[`${base}_one`];
  return fill(exact ?? other ?? one ?? base, { count });
}

export type { Messages };
