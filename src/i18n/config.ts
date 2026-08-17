/**
 * Locales.
 *
 * English is the default and is served without a prefix, so every existing URL
 * keeps working and keeps its search equity. Every other language lives under
 * its own prefix: /el, /de, /fr, /nl.
 *
 * Adding a language is one entry here plus one file in `messages/`. Nothing
 * else in the app names a locale.
 */

export const locales = ["en", "el", "de", "fr", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { native: string; english: string; short: string }> = {
  en: { native: "English", english: "English", short: "EN" },
  el: { native: "Ελληνικά", english: "Greek", short: "EL" },
  de: { native: "Deutsch", english: "German", short: "DE" },
  fr: { native: "Français", english: "French", short: "FR" },
  nl: { native: "Nederlands", english: "Dutch", short: "NL" },
};

/** BCP-47 tags for <html lang>, hreflang and OpenGraph. */
export const localeTags: Record<Locale, string> = {
  en: "en-GB",
  el: "el-GR",
  de: "de-DE",
  fr: "fr-FR",
  nl: "nl-NL",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** `/rooms` for English, `/el/rooms` for the rest. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/**
 * Strip a locale prefix back to the canonical path.
 *
 * ANY locale prefix, including the default one. English is served unprefixed,
 * so `/en/...` never appears in a link — but the middleware REWRITES `/` to
 * `/en` rather than redirecting, and the router reports the rewritten path.
 * The earlier version excluded the default locale and so returned `/en` for
 * the English homepage, which meant every `path === "/"` test in the app was
 * false there: the header decided it was not over a hero and inked itself
 * opaque across the top of the photograph on every English page.
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    return { locale: first, path: "/" + segments.slice(1).join("/") };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
