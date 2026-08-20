import "server-only";

import { sanityFetch } from "./client";
import {
  arrivalQuery,
  chaptersQuery,
  experienceGroupsQuery,
  experiencesQuery,
  faqsQuery,
  galleryQuery,
  homepageQuery,
  housesQuery,
  placesQuery,
  roomsQuery,
  settingsQuery,
} from "./queries";
import { defaultLocale, type Locale } from "@/i18n/config";
import { localisedContent } from "@/i18n/content";
import { roomsBySlug, type House, type Room } from "@/content/rooms";
import type { Experience, ExperienceGroup } from "@/content/experiences";
import type { Place } from "@/content/place";
import type { Chapter } from "@/content/rethymno";
import type { Faq } from "@/content/faq";
import { buildGallery } from "@/content/gallery";
import { getMessages } from "@/i18n";

/**
 * The content adapter.
 *
 * Every page asks this module for content. It returns CMS data when Sanity is
 * connected and has the document, and the local content files otherwise —
 * already localised, because the fallback path reuses the translation overlay
 * built earlier.
 *
 * The point of this seam is that connecting, seeding and checking a CMS never
 * requires the live site to depend on it half-way through. It also means the
 * site keeps working if Sanity is unreachable, which for a hotel is the
 * difference between a stale page and no bookings.
 */

/* ── Localised value helpers ──────────────────────────────────────────── */

type LocaleField = Partial<Record<Locale, string>> | undefined | null;
type LocaleListField = Partial<Record<Locale, string[]>> | undefined | null;

/** Pick a language, falling back to English exactly as the front end does. */
function text(field: LocaleField, locale: Locale, fallback = ""): string {
  if (!field) return fallback;
  const value = field[locale]?.trim();
  if (value) return value;
  const en = field[defaultLocale]?.trim();
  return en || fallback;
}

function list(field: LocaleListField, locale: Locale, fallback: string[] = []): string[] {
  if (!field) return fallback;
  const value = field[locale];
  if (Array.isArray(value) && value.length) return value;
  const en = field[defaultLocale];
  return Array.isArray(en) && en.length ? en : fallback;
}

/** A Sanity image projection, reduced to what next/image needs. */
export interface CmsImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  lqip?: string;
}

function image(src: unknown): CmsImage | null {
  const i = src as CmsImage | null;
  return i?.url ? i : null;
}

function images(src: unknown): CmsImage[] {
  return Array.isArray(src) ? (src as CmsImage[]).filter((i) => i?.url) : [];
}

/* ── Rooms ────────────────────────────────────────────────────────────── */

interface CmsRoom {
  slug: string;
  id: string;
  name: string;
  displayName: LocaleField;
  description: LocaleField;
  notes: LocaleListField;
  amenities?: LocaleField[];
  house: Room["house"];
  sizeSqm: number | null;
  guests: number | null;
  maxGuests?: number;
  beds?: { label: LocaleField; count: number }[];
  outlook: LocaleField;
  outdoor: LocaleField;
  level: LocaleField;
  renovated: string | null;
  featured?: boolean;
  images?: CmsImage[];
}

export async function getRooms(locale: Locale): Promise<Room[]> {
  const cms = await sanityFetch<CmsRoom[]>(roomsQuery, {}, ["room"]);
  if (!cms?.length) return localisedContent(locale).rooms;

  return cms.map((r) => {
    /* Structure is not the CMS's to change. Which building a room is in and
       what it is called are editable; whether it is a suite, whether it has a
       hot tub, whether it takes children, and which id it books against are
       facts about the property that a typo in an admin panel must not be able
       to rewrite. Those come from the local record, matched by slug. */
    const fixed = roomsBySlug.get(r.slug);

    return {
      id: r.id,
      bookingId: fixed?.bookingId ?? null,
      slug: r.slug,
      name: r.name,
      displayName: text(r.displayName, locale),
      house: r.house,
      kind: fixed?.kind ?? (r.house === "residence" ? "residence" : "room"),
      collection: fixed?.collection,
      guests: r.guests ?? null,
      maxGuests: r.maxGuests,
      sizeSqm: r.sizeSqm ?? null,
      bedrooms: fixed?.bedrooms,
      bathrooms: fixed?.bathrooms,
      beds: (r.beds ?? []).map((b) => ({
        label: text(b.label, locale),
        count: b.count,
      })),
      outlook: text(r.outlook, locale) || null,
      outdoor: text(r.outdoor, locale) || null,
      level: text(r.level, locale) || null,
      description: text(r.description, locale),
      notes: list(r.notes, locale),
      amenities: (r.amenities ?? []).map((a) => text(a, locale)).filter(Boolean),
      images: images(r.images).map((i) => i.url),
      renovated: r.renovated ?? null,
      hotTub: fixed?.hotTub,
      plungePool: fixed?.plungePool,
      accessible: fixed?.accessible,
      adultsOnly: fixed?.adultsOnly,
      tourUrl: fixed?.tourUrl,
      featureOrder: fixed?.featureOrder,
    };
  });
}

export async function getRoom(
  slug: string,
  locale: Locale,
): Promise<Room | undefined> {
  const all = await getRooms(locale);
  return all.find((r) => r.slug === slug);
}

/* ── Houses ───────────────────────────────────────────────────────────── */

interface CmsHouse {
  id: House["id"];
  name: LocaleField;
  greek?: string;
  subtitle: LocaleField;
  intro: LocaleField;
  promise: LocaleField;
  order: number;
  coverImage?: CmsImage;
}

export async function getHouses(locale: Locale): Promise<House[]> {
  const cms = await sanityFetch<CmsHouse[]>(housesQuery, {}, ["house"]);
  if (!cms?.length) return localisedContent(locale).houses;

  return cms.map((h) => ({
    id: h.id,
    name: text(h.name, locale),
    subtitle: text(h.subtitle, locale),
    greek: h.greek || undefined,
    intro: text(h.intro, locale),
    order: h.order,
  }));
}

/** House cover images and homepage promise lines, keyed by house id. */
export async function getHouseCards(
  locale: Locale,
): Promise<Record<string, { image: string | null; promise: string }>> {
  const cms = await sanityFetch<CmsHouse[]>(housesQuery, {}, ["house"]);
  if (!cms?.length) return {};
  return Object.fromEntries(
    cms.map((h) => [
      h.id,
      { image: image(h.coverImage)?.url ?? null, promise: text(h.promise, locale) },
    ]),
  );
}

/* ── Experiences ──────────────────────────────────────────────────────── */

interface CmsExperience {
  slug: string;
  title: LocaleField;
  summary: LocaleField;
  body: LocaleListField;
  category: Experience["category"];
  featured?: boolean;
  image?: CmsImage;
}

export async function getExperiences(locale: Locale): Promise<Experience[]> {
  const cms = await sanityFetch<CmsExperience[]>(experiencesQuery, {}, ["experience"]);
  if (!cms?.length) return localisedContent(locale).experiences;

  return cms.map((e) => ({
    slug: e.slug,
    title: text(e.title, locale),
    category: e.category,
    summary: text(e.summary, locale),
    body: list(e.body, locale),
    image: image(e.image)?.url ?? "",
    featured: e.featured,
  }));
}

interface CmsGroup {
  id: ExperienceGroup["id"];
  title: LocaleField;
  greek?: string;
  blurb: LocaleField;
}

export async function getExperienceGroups(
  locale: Locale,
): Promise<ExperienceGroup[]> {
  const cms = await sanityFetch<CmsGroup[]>(experienceGroupsQuery, {}, ["experienceGroup"]);
  if (!cms?.length) return localisedContent(locale).experienceGroups;

  return cms.map((g) => ({
    id: g.id,
    title: text(g.title, locale),
    greek: g.greek ?? "",
    blurb: text(g.blurb, locale),
  }));
}

/* ── Rethymno ─────────────────────────────────────────────────────────── */

interface CmsPlace {
  slug: string;
  name: LocaleField;
  distance: LocaleField;
  body: LocaleField;
  image?: CmsImage;
}

export async function getPlaces(locale: Locale): Promise<Place[]> {
  const cms = await sanityFetch<CmsPlace[]>(placesQuery, {}, ["place"]);
  if (!cms?.length) return localisedContent(locale).places;

  return cms.map((p) => ({
    slug: p.slug,
    name: text(p.name, locale),
    distance: text(p.distance, locale) || null,
    body: text(p.body, locale),
    image: image(p.image)?.url ?? "",
  }));
}

interface CmsChapter {
  id: string;
  eyebrow: LocaleField;
  title: LocaleField;
  body: LocaleListField;
  image?: CmsImage;
  notes?: { term: LocaleField; def: LocaleField }[];
}

export async function getChapters(locale: Locale): Promise<Chapter[]> {
  const cms = await sanityFetch<CmsChapter[]>(chaptersQuery, {}, ["chapter"]);
  if (!cms?.length) return localisedContent(locale).chapters;

  return cms.map((c) => ({
    id: c.id,
    eyebrow: text(c.eyebrow, locale),
    title: text(c.title, locale),
    body: list(c.body, locale),
    image: image(c.image)?.url ?? "",
    imageAlt: image(c.image)?.alt ?? "",
    notes: (c.notes ?? []).map((n) => ({
      term: text(n.term, locale),
      def: text(n.def, locale),
    })),
  }));
}

/* ── The story's prose ────────────────────────────────────────────────────
   `history`, `neighbourhood` and the Rethymno intro have translations in the
   overlay and had no getter, so the Story page imported the English objects
   straight from `content/place.ts` and rendered them untranslated in all four
   languages. These exist so a page cannot reach past the localisation layer
   by accident. They are not in the CMS schema yet; when they are, they take
   the same shape as everything above. */

export function getHistory(locale: Locale) {
  return localisedContent(locale).history;
}

export function getNeighbourhood(locale: Locale) {
  return localisedContent(locale).neighbourhood;
}

export function getRethymnoIntro(locale: Locale) {
  return localisedContent(locale).rethymnoIntro;
}

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export async function getFaqs(locale: Locale): Promise<Faq[]> {
  const cms = await sanityFetch<{ question: LocaleField; answer: LocaleField }[]>(
    faqsQuery,
    {},
    ["faq"],
  );
  if (!cms?.length) return localisedContent(locale).faqs;
  return cms.map((f) => ({
    question: text(f.question, locale),
    answer: text(f.answer, locale),
  }));
}

/* ── Gallery ──────────────────────────────────────────────────────────── */

export interface GalleryData {
  title: string;
  lede: string;
  coverImage: string | null;
  items: { src: string; alt: string; category: string }[];
  categories: { id: string; label: string }[];
}

export async function getGallery(locale: Locale): Promise<GalleryData | null> {
  const cms = await sanityFetch<{
    title: LocaleField;
    lede: LocaleField;
    coverImage?: CmsImage;
    items?: { image: CmsImage; category: string }[];
    categories?: { id: string; title: LocaleField }[];
  }>(galleryQuery, {}, ["gallery"]);

  if (!cms?.items?.length) return null;

  return {
    title: text(cms.title, locale),
    lede: text(cms.lede, locale),
    coverImage: image(cms.coverImage)?.url ?? null,
    items: cms.items
      .filter((i) => i.image?.url)
      .map((i) => ({
        src: i.image.url,
        alt: i.image.alt ?? "",
        category: i.category,
      })),
    categories: [
      { id: "all", label: "Everything" },
      ...(cms.categories ?? []).map((c) => ({
        id: c.id,
        label: text(c.title, locale),
      })),
    ],
  };
}

/* ── Homepage ─────────────────────────────────────────────────────────── */

export interface HomepageData {
  heroImages: { src: string; alt: string }[];
  copy: Record<string, string>;
  facts: { term: string; def: string }[];
  featuredRoomSlugs: string[];
  sectionImages: Record<string, string | null>;
}

export async function getHomepage(locale: Locale): Promise<HomepageData | null> {
  const cms = await sanityFetch<Record<string, unknown>>(homepageQuery, {}, ["homepage"]);
  if (!cms) return null;

  const t = (key: string) => text(cms[key] as LocaleField, locale);
  const img = (key: string) => image(cms[key])?.url ?? null;

  const heroImages = images(cms.heroImages).map((i) => ({
    src: i.url,
    alt: i.alt ?? "",
  }));
  if (!heroImages.length) return null;

  const COPY_KEYS = [
    "heroEyebrow", "heroTitleLine1", "heroTitleLine2", "heroLede",
    "pressEyebrow", "pressTitle", "pressLede", "pressImprint",
    "pressBody1", "pressBody2", "pressPull",
    "markEyebrow", "markTitle", "markBody1", "markBody2",
    "lightEyebrow", "lightBody1", "lightBody2", "lightSpec",
    "settingEyebrow", "settingTitle", "settingBody1", "settingBody2",
    "roomsEyebrow", "roomsTitle", "roomsLede",
    "waterEyebrow", "waterTitle", "waterBody", "waterSpec",
    "agapiTitle", "agapiBody1", "agapiBody2",
    "stayingEyebrow", "stayingTitle", "stayingLede",
    "familyTitle", "familyBody1", "familyBody2",
    "factsTitle", "datesTitle",
  ];

  return {
    heroImages,
    copy: Object.fromEntries(COPY_KEYS.map((k) => [k, t(k)])),
    facts: ((cms.facts as { term: LocaleField; def: LocaleField }[]) ?? []).map((f) => ({
      term: text(f.term, locale),
      def: text(f.def, locale),
    })),
    featuredRoomSlugs: ((cms.featuredRooms as { slug: string }[]) ?? []).map((r) => r.slug),
    sectionImages: {
      light: img("lightImage"),
      settingTall: img("settingImageTall"),
      settingWide: img("settingImageWide"),
      water: img("waterImage"),
      agapi: img("agapiImage"),
      family: img("familyImage"),
    },
  };
}

/* ── Settings ─────────────────────────────────────────────────────────── */

export interface SettingsData {
  phones: { label: string; value: string; href: string }[];
  internationalOffices: { label: string; value: string; href: string }[];
  emails: { general: string; reservations: string; careers: string };
  buildings: { label: string; street: string; isReception: boolean }[];
  locality: string;
  postalCode: string;
  coordinates: { lat: number; lng: number } | null;
  bookingUrl: string;
  social: { instagram: string; facebook: string };
  group: { name: string; url: string };
  legal: { gntoLicence: string; vat: string };
}

export async function getSettings(locale: Locale): Promise<SettingsData | null> {
  const cms = await sanityFetch<{
    phones?: { label: LocaleField; value: string; href: string }[];
    internationalOffices?: { label: string; value: string; href: string }[];
    emailGeneral?: string;
    emailReservations?: string;
    emailCareers?: string;
    buildings?: { label: LocaleField; street: string; isReception?: boolean }[];
    locality?: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
    bookingUrl?: string;
    instagram?: string;
    facebook?: string;
    groupName?: string;
    groupUrl?: string;
    gntoLicence?: string;
    vat?: string;
  }>(settingsQuery, {}, ["siteSettings"]);

  if (!cms?.phones?.length) return null;

  return {
    phones: cms.phones.map((p) => ({
      label: text(p.label, locale),
      value: p.value,
      href: p.href.startsWith("tel:") ? p.href : `tel:${p.href}`,
    })),
    internationalOffices: cms.internationalOffices ?? [],
    emails: {
      general: cms.emailGeneral ?? "",
      reservations: cms.emailReservations ?? cms.emailGeneral ?? "",
      careers: cms.emailCareers ?? cms.emailGeneral ?? "",
    },
    buildings: (cms.buildings ?? []).map((b) => ({
      label: text(b.label, locale),
      street: b.street,
      isReception: Boolean(b.isReception),
    })),
    locality: cms.locality ?? "",
    postalCode: cms.postalCode ?? "",
    coordinates: cms.coordinates ?? null,
    bookingUrl: cms.bookingUrl ?? "",
    social: { instagram: cms.instagram ?? "", facebook: cms.facebook ?? "" },
    group: { name: cms.groupName ?? "", url: cms.groupUrl ?? "" },
    legal: { gntoLicence: cms.gntoLicence ?? "", vat: cms.vat ?? "" },
  };
}

/* ── Arrival ──────────────────────────────────────────────────────────── */

export async function getArrival(locale: Locale) {
  const cms = await sanityFetch<{
    title: LocaleField;
    lede: LocaleField;
    heroImage?: CmsImage;
    receptionLabel: LocaleField;
    receptionHeading?: string;
    receptionBody: LocaleListField;
    receptionImage?: CmsImage;
    steps?: { title: LocaleField; body: LocaleField }[];
    facts?: { term: LocaleField; def: LocaleField }[];
    closingHeading: LocaleField;
    closingBody: LocaleField;
  }>(arrivalQuery, {}, ["arrivalPage"]);

  const local = localisedContent(locale).arrival;
  if (!cms?.title) return { ...local, heroImage: null, receptionImage: null };

  return {
    eyebrow: local.eyebrow,
    title: text(cms.title, locale, local.title),
    lede: text(cms.lede, locale, local.lede),
    heroImage: image(cms.heroImage)?.url ?? null,
    receptionImage: image(cms.receptionImage)?.url ?? null,
    reception: {
      label: text(cms.receptionLabel, locale, local.reception.label),
      heading: cms.receptionHeading || local.reception.heading,
      body: list(cms.receptionBody, locale, local.reception.body as string[]),
    },
    steps: (cms.steps ?? []).length
      ? cms.steps!.map((s) => ({
          title: text(s.title, locale),
          body: text(s.body, locale),
        }))
      : (local.steps as { title: string; body: string }[]),
    facts: (cms.facts ?? []).length
      ? cms.facts!.map((f) => ({
          term: text(f.term, locale),
          def: text(f.def, locale),
        }))
      : (local.facts as { term: string; def: string }[]),
    closing: {
      heading: text(cms.closingHeading, locale, local.closing.heading),
      body: text(cms.closingBody, locale, local.closing.body),
    },
  };
}

/**
 * The gallery, described in one language.
 *
 * The 434 alt attributes on /gallery are fourteen sentences with a name or a
 * number in them. This builds them from the catalogue's `galleryAlt` block and
 * from the already-localised places and experiences, so a Greek reader hears
 * Greek descriptions rather than Greek chrome around English prose.
 *
 * It is not cached per locale on purpose: `buildGallery` is a loop over arrays
 * that are already in memory, and five copies of a 434-item list is a worse
 * trade than rebuilding one on the render that needs it.
 */
export async function getGalleryItems(locale: Locale) {
  const m = getMessages(locale);
  const [places, experiences] = await Promise.all([
    getPlaces(locale),
    getExperiences(locale),
  ]);
  return buildGallery(m.galleryAlt, places, experiences);
}
