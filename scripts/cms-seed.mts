/**
 * Fill a fresh Sanity project with the website exactly as it stands.
 *
 *   npm run cms:seed
 *
 * Uploads the photographs, then creates every house, room, experience, place,
 * chapter, question and setting from `src/content/` — with all four
 * translations from `src/i18n/content/` already in place.
 *
 * The point is that staff never meet an empty CMS. They open the Studio and
 * find the site they already have, editable.
 *
 * Safe to re-run. Documents use deterministic ids and are written with
 * `createOrReplace`, and every uploaded asset is tagged with its source
 * filename so a second run reuses it rather than uploading 326 images again.
 *
 * It does NOT delete anything. If you have edited a room in the Studio and
 * re-run this, your edit is overwritten — that is the trade for idempotency,
 * and it is why this is a setup command rather than a sync.
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { houses, rooms } from "../src/content/rooms";
import { experienceGroups, experiences } from "../src/content/experiences";
import { places, history, neighbourhood } from "../src/content/place";
import { chapters, rethymnoIntro } from "../src/content/rethymno";
import { faqs } from "../src/content/faq";
import { arrival } from "../src/content/arrival";
import { contact, legal, reception } from "../src/content/site";
import { galleryItems, galleryCategories } from "../src/content/gallery";
import { en } from "../src/i18n/messages/en";
import { de } from "../src/i18n/content/de";
import { fr } from "../src/i18n/content/fr";
import { nl } from "../src/i18n/content/nl";
import { el } from "../src/i18n/content/el";
import type { ContentText } from "../src/i18n/content/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "\nMissing credentials.\n\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID  — from `npx sanity@latest init --env`\n" +
      "  SANITY_API_TOKEN               — create at sanity.io/manage → API → Tokens,\n" +
      "                                   with Editor permission, then add to .env.local\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const MEDIA = path.join(process.cwd(), "public", "media");
const OVERLAYS: Record<string, ContentText> = { de, fr, nl, el };

/* ── Localised value builders ─────────────────────────────────────────── */

type Getter<T> = (o: ContentText) => T | undefined;

/** Build a localeString/localeText object from English plus the four overlays. */
function L(enValue: string | null | undefined, get?: Getter<string>) {
  if (!enValue) return undefined;
  const out: Record<string, string> = { en: enValue };
  for (const [code, overlay] of Object.entries(OVERLAYS)) {
    const v = get?.(overlay);
    if (v) out[code] = v;
  }
  return out;
}

/** Same, for a list of paragraphs. */
function LB(enValue: readonly string[] | undefined, get?: Getter<string[]>) {
  if (!enValue?.length) return undefined;
  const out: Record<string, string[]> = { en: [...enValue] };
  for (const [code, overlay] of Object.entries(OVERLAYS)) {
    const v = get?.(overlay);
    if (v?.length) out[code] = v;
  }
  return out;
}

/* ── Asset upload, cached ─────────────────────────────────────────────── */

const uploaded = new Map<string, string>();

/** Look for an asset we uploaded on a previous run before sending bytes. */
async function primeAssetCache() {
  const existing = await client.fetch<{ _id: string; originalFilename: string }[]>(
    `*[_type == "sanity.imageAsset" && defined(originalFilename)]{_id, originalFilename}`,
  );
  for (const a of existing) {
    if (a.originalFilename) uploaded.set(a.originalFilename, a._id);
  }
  console.log(`  ${uploaded.size} image(s) already in the dataset`);
}

async function upload(mediaPath: string, alt: string) {
  const filename = mediaPath.replace("/media/", "");
  const cached = uploaded.get(filename);
  if (cached) {
    return { _type: "inkImage", asset: { _type: "reference", _ref: cached }, alt };
  }

  const full = path.join(MEDIA, filename);
  if (!fs.existsSync(full)) {
    console.warn(`    missing on disk, skipped: ${filename}`);
    return undefined;
  }

  const asset = await client.assets.upload("image", fs.createReadStream(full), {
    filename,
  });
  uploaded.set(filename, asset._id);
  return { _type: "inkImage", asset: { _type: "reference", _ref: asset._id }, alt };
}

/* ── Seed ─────────────────────────────────────────────────────────────── */

async function main() {
  console.log(`\nSeeding ${projectId}/${dataset}\n`);

  console.log("Checking existing assets…");
  await primeAssetCache();

  const docs: Record<string, unknown>[] = [];

  /* Houses ---------------------------------------------------------- */
  console.log("\nHouses…");
  const HOUSE_CARDS: Record<string, { image: string; promise: string }> = {
    "gateway-suites": {
      image: "/media/16d58a0125b1f827a619aba4021014ac.webp",
      promise:
        "Four suites named for passion, harmony, love and hope. Marble, courtyards, and in one of them a private plunge pool.",
    },
    "house-of-europe": {
      image: "/media/49291c0e544d7171652f05c68d4ba229.webp",
      promise:
        "The central house, once the University of Crete's guest house. Sea views, balconies, and breakfast downstairs.",
    },
    phos: {
      image: "/media/1e70b5d1cffdc9245f3c5529df47596c.webp",
      promise:
        "The quieter house. Nine rooms, and terraces that open over the rooftops of the old town.",
    },
    residence: {
      image: "/media/5b1c0f22c2104b9fc147b95ca2a58b45.webp",
      promise:
        "A two-bedroom house of your own, a hundred metres from the Venetian harbour, with a kitchen and private parking.",
    },
  };

  for (const h of houses) {
    const card = HOUSE_CARDS[h.id];
    docs.push({
      _id: `house-${h.id}`,
      _type: "house",
      key: h.id,
      name: L(h.name, (o) => o.houses?.[h.id]?.name),
      greek: h.greek,
      subtitle: L(h.subtitle, (o) => o.houses?.[h.id]?.subtitle),
      intro: L(h.intro, (o) => o.houses?.[h.id]?.intro),
      promise: card ? L(card.promise) : undefined,
      coverImage: card ? await upload(card.image, `${h.name} at Ink Hotels`) : undefined,
      order: h.order,
    });
  }

  /* Rooms ----------------------------------------------------------- */
  console.log("Rooms and their photographs…");
  for (const r of rooms) {
    const t = (o: ContentText) => o.rooms?.[r.slug];
    const images: unknown[] = [];
    for (const [i, src] of r.images.entries()) {
      const img = await upload(src, `${r.name} at Ink Hotels — photograph ${i + 1}`);
      if (img) images.push(img);
    }
    process.stdout.write(`  ${r.slug} (${images.length}) `);

    docs.push({
      _id: `room-${r.slug}`,
      _type: "room",
      slug: { _type: "slug", current: r.slug },
      bookingId: r.id,
      officialName: r.name,
      displayName: L(r.displayName, (o) => t(o)?.displayName),
      house: { _type: "reference", _ref: `house-${r.house}` },
      description: L(r.description, (o) => t(o)?.description),
      notes: LB(r.notes, (o) => t(o)?.notes),
      amenities: r.amenities.map((a) =>
        L(a, (o) => t(o)?.amenities?.[a] ?? o.amenities?.[a]),
      ),
      sizeSqm: r.sizeSqm ?? undefined,
      guests: r.guests ?? undefined,
      maxGuests: r.maxGuests,
      beds: r.beds.map((b) => ({ _type: "bed", label: L(b.label), count: b.count })),
      outlook: L(r.outlook, (o) => t(o)?.outlook),
      outdoor: L(r.outdoor, (o) => t(o)?.outdoor),
      level: L(r.level, (o) => t(o)?.level),
      renovated: r.renovated ?? undefined,
      featured: Boolean(r.featured),
      images,
    });
  }
  console.log();

  /* Experiences ----------------------------------------------------- */
  console.log("Experiences…");
  for (const [i, g] of experienceGroups.entries()) {
    docs.push({
      _id: `expgroup-${g.id}`,
      _type: "experienceGroup",
      key: g.id,
      title: L(g.title, (o) => o.experienceGroups?.[g.id]?.title),
      greek: g.greek,
      blurb: L(g.blurb, (o) => o.experienceGroups?.[g.id]?.blurb),
      order: i + 1,
    });
  }
  for (const [i, e] of experiences.entries()) {
    const t = (o: ContentText) => o.experiences?.[e.slug];
    docs.push({
      _id: `experience-${e.slug}`,
      _type: "experience",
      slug: { _type: "slug", current: e.slug },
      title: L(e.title, (o) => t(o)?.title),
      group: { _type: "reference", _ref: `expgroup-${e.category}` },
      summary: L(e.summary, (o) => t(o)?.summary),
      body: LB(e.body, (o) => t(o)?.body),
      image: await upload(e.image, e.title),
      featured: Boolean(e.featured),
      order: i + 1,
    });
  }

  /* Rethymno -------------------------------------------------------- */
  console.log("Rethymno…");
  for (const [i, p] of places.entries()) {
    const t = (o: ContentText) => o.places?.[p.slug];
    docs.push({
      _id: `place-${p.slug}`,
      _type: "place",
      slug: { _type: "slug", current: p.slug },
      name: L(p.name, (o) => t(o)?.name),
      distance: L(p.distance, (o) => t(o)?.distance),
      body: L(p.body, (o) => t(o)?.body),
      image: await upload(p.image, `${p.name}, Rethymno`),
      order: i + 1,
    });
  }
  for (const [i, c] of chapters.entries()) {
    const t = (o: ContentText) => o.chapters?.[c.id];
    docs.push({
      _id: `chapter-${c.id}`,
      _type: "chapter",
      key: c.id,
      eyebrow: L(c.eyebrow, (o) => t(o)?.eyebrow),
      title: L(c.title, (o) => t(o)?.title),
      body: LB(c.body, (o) => t(o)?.body),
      image: await upload(c.image, c.imageAlt),
      notes: (c.notes ?? []).map((n, ni) => ({
        _type: "factPair",
        term: L(n.term, (o) => t(o)?.notes?.[ni]?.term),
        def: L(n.def, (o) => t(o)?.notes?.[ni]?.def),
      })),
      order: i + 1,
    });
  }

  /* FAQ ------------------------------------------------------------- */
  console.log("Questions…");
  for (const [i, f] of faqs.entries()) {
    docs.push({
      _id: `faq-${i + 1}`,
      _type: "faq",
      question: L(f.question, (o) => o.faqs?.[i]?.question),
      answer: L(f.answer, (o) => o.faqs?.[i]?.answer),
      order: i + 1,
    });
  }

  /* Gallery --------------------------------------------------------- */
  console.log("Gallery categories…");
  for (const [i, c] of galleryCategories.filter((c) => c.id !== "all").entries()) {
    docs.push({
      _id: `galcat-${c.id}`,
      _type: "galleryCategory",
      slug: { _type: "slug", current: c.id },
      title: L(c.label),
      order: i + 1,
    });
  }

  /* The gallery holds a lot of images. Cap the seed at a browsable set —
     everything is already uploaded above, and staff can add more from the
     Studio without another 300 uploads here. */
  console.log("Gallery…");
  const GALLERY_CAP = 120;
  const galleryEntries: unknown[] = [];
  for (const item of galleryItems.slice(0, GALLERY_CAP)) {
    const img = await upload(item.src, item.alt);
    if (img) {
      galleryEntries.push({
        _type: "item",
        image: img,
        category: { _type: "reference", _ref: `galcat-${item.category}` },
      });
    }
  }
  docs.push({
    _id: "gallery",
    _type: "gallery",
    title: L("The whole place"),
    lede: L("The houses, the rooms, the courtyards, and the town they sit in."),
    coverImage: await upload(
      "/media/181f84a843edadbabe1510574f25768f.webp",
      "Rethymno old town from above, rooftops running down to the sea",
    ),
    items: galleryEntries,
  });

  /* Arrival --------------------------------------------------------- */
  console.log("Arrival…");
  const a = (o: ContentText) => o.arrival;
  docs.push({
    _id: "arrivalPage",
    _type: "arrivalPage",
    title: L(arrival.title, (o) => a(o)?.title),
    lede: L(arrival.lede, (o) => a(o)?.lede),
    heroImage: await upload(
      "/media/6ad7bfa1e7f17c6e4db2f4b5cb933ecd.webp",
      "A sunlit courtyard at Ink, deckchair and terracotta pots against warm plaster",
    ),
    receptionLabel: L(arrival.reception.label, (o) => a(o)?.receptionLabel),
    receptionHeading: arrival.reception.heading,
    receptionBody: LB(arrival.reception.body, (o) => a(o)?.receptionBody),
    receptionImage: await upload(
      "/media/eadfa8cf4ff79016e1ae3e27f1a2c530.webp",
      `An open door onto the light at Ink Hotels, near the reception at ${reception.street}`,
    ),
    steps: arrival.steps.map((s, i) => ({
      _type: "step",
      title: L(s.title, (o) => a(o)?.steps?.[i]?.title),
      body: L(s.body, (o) => a(o)?.steps?.[i]?.body),
    })),
    facts: arrival.facts.map((f, i) => ({
      _type: "factPair",
      term: L(f.term, (o) => a(o)?.facts?.[i]?.term),
      def: L(f.def, (o) => a(o)?.facts?.[i]?.def),
    })),
    closingHeading: L(arrival.closing.heading, (o) => a(o)?.closingHeading),
    closingBody: L(arrival.closing.body, (o) => a(o)?.closingBody),
  });

  /* Homepage -------------------------------------------------------- */
  console.log("Homepage…");
  const HERO = [
    ["/media/1a25f40128eeefbed32d4cf75cb7faf8.webp", "The Egyptian lighthouse at the Venetian harbour of Rethymno at dusk"],
    ["/media/1d6eaf712bb53a3d1f6a272907294901.webp", "A planted courtyard at Ink, balconies and palms above the whitewashed walls"],
    ["/media/0f143111b909f0520feed8cf971ef4b8.webp", "A sea-view room at Ink, shutters open onto the water"],
    ["/media/181f84a843edadbabe1510574f25768f.webp", "The rooftops of Rethymno old town running down to the harbour"],
  ];
  const heroImages: unknown[] = [];
  for (const [src, alt] of HERO) {
    const img = await upload(src!, alt!);
    if (img) heroImages.push(img);
  }

  const h = en.home;
  const homepageCopy = Object.fromEntries(
    (
      [
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
      ] as const
    ).map((k) => [k, L((h as Record<string, string>)[k])]),
  );

  docs.push({
    _id: "homepage",
    _type: "homepage",
    heroImages,
    ...homepageCopy,
    lightImage: await upload(
      "/media/8d17d9f0ddc6feb2df2d63ba84ea4c35.webp",
      "Morning light across a whitewashed wall and beamed ceiling inside Ink",
    ),
    settingImageTall: await upload(
      "/media/0dc83ffb4bd879a312c00e50c8bda2fc.webp",
      "A narrow lane of the old town, wooden Venetian balconies overhead",
    ),
    settingImageWide: await upload(
      "/media/05c09d32efa814812ba4598083de9b4c.webp",
      "The Venetian harbour of Rethymno with its Egyptian lighthouse",
    ),
    waterImage: await upload(
      "/media/9053c1c0aa924fb16769460a7c06ae29.webp",
      "The private plunge pool in the interior courtyard of the Harmony suite",
    ),
    agapiImage: await upload(
      "/media/d61ede4f5d00cd6b090beb09df8b5c5c.webp",
      "The Agapi suite at Ink, with marble floor and step-free access",
    ),
    familyImage: await upload(
      "/media/5c8561282159b358b4e7a2270cc972d9.webp",
      "The family team behind Ink Hotels and Crete Holiday Home",
    ),
    facts: [
      ["Breakfast", "Local Cretan cooking, served at House of Europe — including for guests staying at Phos. Available for a supplement."],
      ["Noise", "The old town is alive, and that is much of its pleasure. Sea-facing rooms sit closest to the cafés and bars. All rooms have soundproof windows; tell us if you sleep lightly."],
      ["Parking", "Free, off-site, within 100 metres. The Residence of the Old Port has private parking of its own."],
      ["Housekeeping", "Every two days."],
      ["Pets", "Not accommodated."],
      ["Languages", "English and Greek."],
    ].map(([term, def]) => ({ _type: "factPair", term: L(term), def: L(def) })),
  });

  /* Settings -------------------------------------------------------- */
  console.log("Contact & settings…");
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    phones: contact.phones.map((p) => ({
      _type: "phone",
      label: L(p.label),
      value: p.value,
      href: p.href.replace("tel:", ""),
    })),
    internationalOffices: contact.internationalOffices.map((o) => ({
      _type: "office",
      label: o.label,
      value: o.value,
      href: o.href.replace("tel:", ""),
    })),
    emailGeneral: contact.emails.general,
    emailReservations: contact.emails.reservations,
    emailCareers: contact.emails.careers,
    buildings: contact.buildings.map((b) => ({
      _type: "building",
      label: L(b.label),
      street: b.street,
      isReception: b.isReception,
    })),
    locality: contact.registeredAddress.locality,
    postalCode: contact.registeredAddress.postalCode,
    coordinates: {
      _type: "geopoint",
      lat: contact.coordinates.lat,
      lng: contact.coordinates.lng,
    },
    bookingUrl: contact.bookingUrl,
    instagram: contact.social.instagram,
    facebook: contact.social.facebook,
    groupName: contact.group.name,
    groupUrl: contact.group.url,
    gntoLicence: legal.gntoLicence,
    vat: legal.vat,
  });

  /* Simple pages ---------------------------------------------------- */
  docs.push(
    {
      _id: "page-story",
      _type: "simplePage",
      key: "story",
      eyebrow: L(history.eyebrow),
      title: L(history.title),
      lede: L(history.paragraphs[0]),
    },
    {
      _id: "page-rethymno",
      _type: "simplePage",
      key: "rethymno",
      eyebrow: L(rethymnoIntro.eyebrow),
      title: L(rethymnoIntro.title),
      lede: L(rethymnoIntro.lede),
    },
    {
      _id: "page-location",
      _type: "simplePage",
      key: "location",
      title: L("Inside the old town"),
      lede: L(neighbourhood.paragraphs[0]),
    },
  );

  /* Write ----------------------------------------------------------- */
  console.log(`\nWriting ${docs.length} documents…`);
  let tx = client.transaction();
  let n = 0;
  for (const doc of docs) {
    tx = tx.createOrReplace(doc as never);
    n++;
    /* Commit in batches — one transaction with 400 documents and 300 asset
       references is large enough to be refused. */
    if (n % 40 === 0) {
      await tx.commit({ visibility: "async" });
      tx = client.transaction();
      process.stdout.write(".");
    }
  }
  await tx.commit({ visibility: "async" });

  console.log(
    `\n\nDone. ${docs.length} documents, ${uploaded.size} photographs.\n` +
      `Open the Studio at /studio — everything is there and editable.\n`,
  );
}

main().catch((err) => {
  console.error("\nSeed failed:", err?.message ?? err);
  process.exit(1);
});
