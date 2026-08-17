import type { MetadataRoute } from "next";

import { SITE_URL } from "@/content/site";
import { rooms } from "@/content/rooms";
import { experiences } from "@/content/experiences";
import { localePath, localeTags, locales } from "@/i18n/config";

/**
 * Every page in every language, each entry declaring its alternates.
 *
 * Without the `alternates.languages` block Google reads the five versions of a
 * page as near-duplicates and picks one; with it, each is served to the right
 * audience. `x-default` points at English.
 */

const STATIC: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/rooms", priority: 0.9, changeFrequency: "weekly" },
  { path: "/experiences", priority: 0.8, changeFrequency: "monthly" },
  { path: "/rethymno", priority: 0.8, changeFrequency: "monthly" },
  { path: "/arrival", priority: 0.8, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/story", priority: 0.7, changeFrequency: "yearly" },
  { path: "/location", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/accessibility", priority: 0.5, changeFrequency: "yearly" },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" },
];

function alternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        locales.map((l) => [localeTags[l], `${SITE_URL}${localePath(l, path)}`]),
      ),
      "x-default": `${SITE_URL}${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const paths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    ...STATIC.map((s) => ({ path: s.path, priority: s.priority, freq: s.changeFrequency })),
    ...rooms.map((r) => ({
      path: `/rooms/${r.slug}`,
      priority: 0.8,
      freq: "monthly" as const,
    })),
    ...experiences.map((e) => ({
      path: `/experiences/${e.slug}`,
      priority: 0.5,
      freq: "yearly" as const,
    })),
  ];

  for (const { path, priority, freq } of paths) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, path)}`,
        lastModified: now,
        changeFrequency: freq,
        /* Translated pages sit just below their English original. */
        priority: locale === "en" ? priority : Math.max(0.1, priority - 0.1),
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
