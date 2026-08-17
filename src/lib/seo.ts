import type { Metadata } from "next";

import { SITE_URL, site } from "@/content/site";
import {
  defaultLocale,
  localePath,
  localeTags,
  locales,
  type Locale,
} from "@/i18n/config";

interface PageMetaInput {
  title: string;
  description: string;
  /** Canonical, unprefixed path — e.g. `/rooms`. */
  path: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
}

/**
 * Page metadata, including the full hreflang set.
 *
 * A page that declares its own `alternates` replaces the layout's, so the
 * language map has to be rebuilt here — otherwise every page except the layout
 * root would lose its hreflang and Google would treat the five translations as
 * duplicates of each other.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
  image = "/opengraph-image",
  type = "website",
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${localePath(locale, path)}`;
  const fullTitle = path === "/" ? title : `${title} — ${site.name} Rethymno`;

  return {
    /* `absolute`, because the root layout also carries
       `title.template: "%s — Ink Hotels Rethymno"`. Returning a plain string
       here let the template run on top of a title that already ended in the
       site name, and every page shipped
       "Harmony — House of Europe — Ink Hotels Rethymno — Ink Hotels Rethymno".
       Either half could have been removed; the suffix is built here because the
       homepage is the one page that must NOT have it, and the template has no
       way to make that exception. */
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeTags[l], `${SITE_URL}${localePath(l, path)}`]),
        ),
        "x-default": `${SITE_URL}${path}`,
      },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: localeTags[locale].replace("-", "_"),
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
