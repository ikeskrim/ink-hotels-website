import { localeTags, type Locale } from "./config";

/**
 * The languages the desk answers in, named in the reader's own language.
 *
 * These are BCP-47 tags rather than English words, so `Intl.DisplayNames` can
 * render them correctly for each reader — a French visitor is told "anglais,
 * grec, néerlandais et français", in lower case, because that is how French
 * writes language names. A hand-written list would have got that wrong in at
 * least three of the five catalogues.
 *
 * This is deliberately NOT the set of languages the site is translated into.
 * German is in `locales` because a German guest should be able to read the
 * site; it is not here, because nobody at the desk speaks it.
 */
export const SPOKEN = ["en", "el", "nl", "fr"] as const;

/** BCP-47 tags, for schema.org's `availableLanguage`. */
export const SPOKEN_TAGS = ["en-GB", "el-GR", "nl-NL", "fr-FR"] as const;

export function spokenLanguages(locale: Locale): string {
  const tag = localeTags[locale];
  const names = new Intl.DisplayNames([tag], { type: "language" });
  const list = new Intl.ListFormat(tag, { style: "long", type: "conjunction" });
  return list.format(SPOKEN.map((l) => names.of(l) ?? l));
}
