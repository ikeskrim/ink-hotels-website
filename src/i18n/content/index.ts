import type { ContentText } from "./types";
import { defaultLocale, type Locale } from "../config";

import { de } from "./de";
import { fr } from "./fr";
import { nl } from "./nl";
import { el } from "./el";

import { houses as enHouses, rooms as enRooms, type House, type Room } from "@/content/rooms";
import {
  experienceGroups as enGroups,
  experiences as enExperiences,
  type Experience,
  type ExperienceGroup,
} from "@/content/experiences";
import { places as enPlaces, history as enHistory, neighbourhood as enNeighbourhood, type Place } from "@/content/place";
import { chapters as enChapters, rethymnoIntro as enIntro, type Chapter } from "@/content/rethymno";
import { faqs as enFaqs, type Faq } from "@/content/faq";
import { arrival as enArrival } from "@/content/arrival";
import { reviews as enReviews, type Review } from "@/content/reviews";

/**
 * Content localisation.
 *
 * The English objects in `src/content/*` stay authoritative for everything that
 * is not language: images, slugs, sizes, bed counts, reservation-engine ids.
 * This layer overlays only the words.
 *
 * Every override is optional and falls back to English. That is deliberate: a
 * guest reading one untranslated paragraph is a minor blemish, whereas a guest
 * reading a blank heading is a broken site — and it means a new field can be
 * added to the English content without breaking four other languages.
 */

const OVERLAYS: Partial<Record<Locale, ContentText>> = { de, fr, nl, el };

function overlay(locale: Locale): ContentText {
  return (locale === defaultLocale ? undefined : OVERLAYS[locale]) ?? {};
}

/** `t ?? fallback`, but treats an empty string as absent. */
function pick<T>(translated: T | undefined, original: T): T {
  if (translated === undefined || translated === null) return original;
  if (typeof translated === "string" && translated.trim() === "") return original;
  if (Array.isArray(translated) && translated.length === 0) return original;
  return translated;
}

export function localiseHouses(locale: Locale): House[] {
  const t = overlay(locale).houses ?? {};
  return enHouses.map((h) => {
    const o = t[h.id];
    return o
      ? {
          ...h,
          name: pick(o.name, h.name),
          subtitle: pick(o.subtitle, h.subtitle),
          intro: pick(o.intro, h.intro),
        }
      : h;
  });
}

export function localiseRooms(locale: Locale): Room[] {
  const c = overlay(locale);
  const t = c.rooms ?? {};
  const amenityMap = c.amenities ?? {};
  return enRooms.map((r) => {
    const o = t[r.slug];
    if (!o && !Object.keys(amenityMap).length) return r;
    return {
      ...r,
      displayName: pick(o?.displayName, r.displayName),
      description: pick(o?.description, r.description),
      notes: pick(o?.notes, r.notes),
      outlook: o?.outlook ?? r.outlook,
      outdoor: o?.outdoor ?? r.outdoor,
      level: o?.level ?? r.level,
      /* Amenities are shared strings, translated once and looked up. */
      amenities: r.amenities.map(
        (a) => o?.amenities?.[a] ?? amenityMap[a] ?? a,
      ),
    };
  });
}

export function localiseExperienceGroups(locale: Locale): ExperienceGroup[] {
  const t = overlay(locale).experienceGroups ?? {};
  return enGroups.map((g) => {
    const o = t[g.id];
    return o
      ? { ...g, title: pick(o.title, g.title), blurb: pick(o.blurb, g.blurb) }
      : g;
  });
}

export function localiseExperiences(locale: Locale): Experience[] {
  const t = overlay(locale).experiences ?? {};
  return enExperiences.map((e) => {
    const o = t[e.slug];
    return o
      ? {
          ...e,
          title: pick(o.title, e.title),
          summary: pick(o.summary, e.summary),
          body: pick(o.body, e.body),
        }
      : e;
  });
}

export function localisePlaces(locale: Locale): Place[] {
  const t = overlay(locale).places ?? {};
  return enPlaces.map((p) => {
    const o = t[p.slug];
    return o
      ? {
          ...p,
          name: pick(o.name, p.name),
          distance: o.distance ?? p.distance,
          body: pick(o.body, p.body),
        }
      : p;
  });
}

export function localiseChapters(locale: Locale): Chapter[] {
  const t = overlay(locale).chapters ?? {};
  return enChapters.map((c) => {
    const o = t[c.id];
    return o
      ? {
          ...c,
          eyebrow: pick(o.eyebrow, c.eyebrow),
          title: pick(o.title, c.title),
          body: pick(o.body, c.body),
          imageAlt: pick(o.imageAlt, c.imageAlt),
          notes: o.notes && o.notes.length ? o.notes : c.notes,
        }
      : c;
  });
}

export function localiseFaqs(locale: Locale): Faq[] {
  const t = overlay(locale).faqs;
  /* Positional: the FAQ list is fixed and ordered, and a key per question
     would be four more things to keep in sync for no gain. */
  if (!t || t.length !== enFaqs.length) return enFaqs;
  /* Structure from the source, words from the overlay. The overlay carries
     `question` and `answer` and nothing else, so returning it whole dropped
     `topic` — and /faq would have grouped correctly in English and collapsed
     into one undifferentiated list in the other four languages. The same
     positional index that maps the translation maps the topic. */
  return t.map((f, i) => ({ ...f, topic: enFaqs[i]?.topic }));
}

export function localiseRethymnoIntro(locale: Locale) {
  const o = overlay(locale).rethymnoIntro;
  return {
    ...enIntro,
    title: pick(o?.title, enIntro.title),
    lede: pick(o?.lede, enIntro.lede),
    body: pick(o?.body, enIntro.body as unknown as string[]),
  };
}

export function localiseHistory(locale: Locale) {
  const o = overlay(locale).history;
  return {
    ...enHistory,
    eyebrow: pick(o?.eyebrow, enHistory.eyebrow),
    title: pick(o?.title, enHistory.title),
    paragraphs: pick(o?.paragraphs, enHistory.paragraphs as unknown as string[]),
  };
}

export function localiseNeighbourhood(locale: Locale) {
  const o = overlay(locale).neighbourhood;
  return {
    ...enNeighbourhood,
    title: pick(o?.title, enNeighbourhood.title),
    paragraphs: pick(
      o?.paragraphs,
      enNeighbourhood.paragraphs as unknown as string[],
    ),
  };
}

export function localiseArrival(locale: Locale) {
  const o = overlay(locale).arrival;
  return {
    ...enArrival,
    title: pick(o?.title, enArrival.title),
    lede: pick(o?.lede, enArrival.lede),
    reception: {
      heading: pick(o?.receptionHeading, enArrival.reception.heading),
      label: pick(o?.receptionLabel, enArrival.reception.label),
      body: pick(
        o?.receptionBody,
        enArrival.reception.body as unknown as string[],
      ),
    },
    steps: pick(
      o?.steps,
      enArrival.steps as unknown as { title: string; body: string }[],
    ),
    facts: pick(
      o?.facts,
      enArrival.facts as unknown as { term: string; def: string }[],
    ),
    closing: {
      heading: pick(o?.closingHeading, enArrival.closing.heading),
      body: pick(o?.closingBody, enArrival.closing.body),
    },
  };
}

/** Everything a page might need, resolved once. */
/** A quote and, when it is not in the reader's language, the gloss shown instead. */
export interface LocalisedReview extends Review {
  /** True when `text` is a translation rather than what the guest wrote. */
  translated: boolean;
  /** The language the guest actually wrote in. */
  originalLanguage: string;
}

/**
 * Quotes in the reader's language.
 *
 * English readers get the originals untouched. Everyone else gets the gloss
 * where one exists and the original where it does not — an untranslated quote
 * in English is a quote they can still read and check, which is better than a
 * hole where a guest used to be.
 *
 * `translated` drives the line under the quote. It is set from whether a gloss
 * was actually used, not from the locale, so a quote with no translation does
 * not claim to be one.
 */
export function localiseReviews(locale: Locale): LocalisedReview[] {
  const t = overlay(locale).reviews ?? {};
  return enReviews.map((r) => {
    const gloss = locale === defaultLocale ? undefined : t[`${r.name}-${r.year}`]?.text;
    return {
      ...r,
      text: gloss ?? r.text,
      translated: Boolean(gloss),
      originalLanguage: r.originalLanguage ?? "en",
    };
  });
}

export function localisedContent(locale: Locale) {
  return {
    houses: localiseHouses(locale),
    rooms: localiseRooms(locale),
    experienceGroups: localiseExperienceGroups(locale),
    experiences: localiseExperiences(locale),
    places: localisePlaces(locale),
    chapters: localiseChapters(locale),
    faqs: localiseFaqs(locale),
    rethymnoIntro: localiseRethymnoIntro(locale),
    history: localiseHistory(locale),
    neighbourhood: localiseNeighbourhood(locale),
    arrival: localiseArrival(locale),
  };
}
