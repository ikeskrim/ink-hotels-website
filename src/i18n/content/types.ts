/**
 * Content translations.
 *
 * `src/content/*` stays the English source of truth — it holds the structure,
 * the images, the sizes, the reservation-engine ids. This layer carries only
 * the words, keyed by the same slugs, so a translation can never drift out of
 * sync with a room's data or invent a room that does not exist.
 *
 * Every field is optional. A missing translation falls back to English rather
 * than rendering an empty heading, which is the correct behaviour for a hotel:
 * a German guest reading one English paragraph is fine; a German guest reading
 * a blank page is not.
 */

export interface RoomText {
  displayName?: string;
  description?: string;
  notes?: string[];
  outlook?: string;
  outdoor?: string;
  level?: string;
  amenities?: Record<string, string>;
}

export interface HouseText {
  name?: string;
  subtitle?: string;
  intro?: string;
}

export interface ExperienceText {
  title?: string;
  summary?: string;
  body?: string[];
}

export interface ExperienceGroupText {
  title?: string;
  blurb?: string;
}

export interface PlaceText {
  name?: string;
  distance?: string;
  body?: string;
}

export interface ChapterText {
  eyebrow?: string;
  title?: string;
  body?: string[];
  imageAlt?: string;
  notes?: { term: string; def: string }[];
}

export interface FaqText {
  question: string;
  answer: string;
}

export interface ArrivalText {
  title?: string;
  lede?: string;
  receptionHeading?: string;
  receptionLabel?: string;
  receptionBody?: string[];
  steps?: { title: string; body: string }[];
  facts?: { term: string; def: string }[];
  closingHeading?: string;
  closingBody?: string;
}

export interface ContentText {
  houses?: Record<string, HouseText>;
  rooms?: Record<string, RoomText>;
  experiences?: Record<string, ExperienceText>;
  experienceGroups?: Record<string, ExperienceGroupText>;
  places?: Record<string, PlaceText>;
  chapters?: Record<string, ChapterText>;
  faqs?: FaqText[];
  arrival?: ArrivalText;
  rethymnoIntro?: { title?: string; lede?: string; body?: string[] };
  history?: { eyebrow?: string; title?: string; paragraphs?: string[] };
  neighbourhood?: { title?: string; paragraphs?: string[] };
  /** Shared amenity strings, keyed by their English form. */
  amenities?: Record<string, string>;
}
