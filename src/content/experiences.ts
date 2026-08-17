import { EXPERIENCE_IMAGES } from "./generated/images";

/**
 * The 21 experiences the property arranges, grouped into four families so the list
 * reads as a curated collection rather than an undifferentiated grid.
 *
 * Copy is faithful to the property's own descriptions, tightened for readability.
 * Several of the source pages describe the group's sister villa property; those are
 * framed here as experiences the concierge arranges, which is what they are — no
 * facility is claimed for the hotel itself that the hotel does not have.
 */

export type ExperienceCategory = "table" | "sea" | "land" | "self";

export interface ExperienceGroup {
  id: ExperienceCategory;
  title: string;
  greek: string;
  blurb: string;
}

export const experienceGroups: ExperienceGroup[] = [
  {
    id: "table",
    title: "At the Table",
    greek: "Τραπέζι",
    blurb:
      "Crete eats better than almost anywhere in the Mediterranean. These are the ways in.",
  },
  {
    id: "sea",
    title: "On the Water",
    greek: "Θάλασσα",
    blurb:
      "The coast is four minutes' walk away. Everything below begins from it.",
  },
  {
    id: "land",
    title: "Into the Island",
    greek: "Νησί",
    blurb:
      "Gorges, mountain villages, monasteries, and roads that only go one way. Arranged for you.",
  },
  {
    id: "self",
    title: "For Yourself",
    greek: "Ησυχία",
    blurb: "Quieter arrangements, made in your own time.",
  },
];

export interface Experience {
  slug: string;
  title: string;
  category: ExperienceCategory;
  /** Short line used on cards. */
  summary: string;
  /** Longer description, faithful to the property's copy. */
  body: string[];
  image: string;
  /**
   * Describes the photograph, where the title does not. Usually the title is
   * the honest alt — the picture of a boat trip is a boat. It stops being
   * honest for a placeholder, where the frame shows something the hotel does
   * not own; then the alt has to say what is actually in it.
   */
  imageAlt?: string;
  featured?: boolean;
  /**
   * An outward link, where the thing being arranged belongs to a named
   * business rather than to the hotel — the family's excursions brand, the
   * sister property's garden. Naming them is the honest form: a guest should
   * know whose boat, whose farm, whose guide.
   */
  link?: { href: string; label: string };
  /** Another experience this one obviously pairs with. */
  seeAlso?: string;
}

export const experiences: Experience[] = [
  // ── At the Table ──────────────────────────────────────────────────────────
  {
    slug: "learn-the-secrets-of-cretan-cuisine",
    title: "The Secrets of Cretan Cuisine",
    category: "table",
    summary: "Taste the unique Cretan cuisine — and learn how it is made.",
    body: ["Taste the unique Cretan cuisine, and learn the secrets behind it."],
    /* The library's own image for this one is a stock chalkboard; this is a
       photograph of the thing itself, from the same library. */
    image: "/media/7a8843db0f095b81891cc5b04f23c931.webp",
    featured: true,
  },
  {
    slug: "wine-tasting",
    title: "Wine Tasting",
    category: "table",
    summary:
      "Outstanding wines, distinct flavours, and the ancient Greek wine culture behind them.",
    body: [
      "Taste outstanding wines and distinct flavours, and learn about wine, ancient Greek wine culture, and the unique varieties of Greece.",
    ],
    image: EXPERIENCE_IMAGES["wine-tasting"] ?? "",
    featured: true,
  },
  {
    slug: "wine-production",
    title: "Wine Production",
    category: "table",
    summary: "The wine of Crete is famous worldwide. See how it is made.",
    body: [
      "The wine of Crete is famous worldwide. Come with us and explore how the production is done in the celebrated wineries around the island.",
    ],
    image: EXPERIENCE_IMAGES["wine-production"] ?? "",
  },
  {
    slug: "organic-farm",
    title: "The Organic Farm",
    category: "table",
    summary: "The vegetable garden at Thalasses Villas — plant with us, then taste it at breakfast.",
    body: [
      "Come and live a unique experience in the biological garden. Plant with us, and taste fresh organic vegetables in your daily breakfast.",
      "The garden is at Thalasses Villas, on the coast west of here. It is not a supplier we buy from: it is the same family's property, run by the same people who run Ink, which is why what is picked there can be on the table at House of Europe the next morning.",
    ],
    image: "/media/06a05af91d30ec670c3f57cdf39169c6.webp",
    /* The garden's own page, not the estate's front door — a guest who clicks
       to see the vegetables should land on the vegetables. Confirmed reachable
       and static; its own wording matches the body copy above.
       The page also promises villa guests a nightly basket of vegetables in
       their room. That is a Thalasses villa benefit and is deliberately not
       repeated here: an Ink guest is not staying in a villa and would arrive
       expecting something nobody promised them. */
    link: {
      href: "https://thalasses.com/en/biological-garden-1.html",
      label: "The garden at Thalasses Villas",
    },
  },
  {
    slug: "private-chef",
    title: "A Chef, Privately",
    category: "table",
    summary: "A chef comes to cook Cretan food for you alone.",
    body: ["Taste the unique Cretan cuisine. A chef can come and cook for you alone."],
    image: EXPERIENCE_IMAGES["chef-in-villa"] ?? "",
  },
  {
    slug: "breakfast-on-the-beach",
    title: "Breakfast on the Beach",
    category: "table",
    summary: "Breakfast, arranged on the sand.",
    body: ["Enjoy your breakfast on the beach. It can be arranged."],
    image: EXPERIENCE_IMAGES["breakfast-on-the-beach"] ?? "",
  },

  // ── On the Water ──────────────────────────────────────────────────────────
  {
    slug: "private-boat-trip",
    title: "A Boat of Your Own",
    category: "sea",
    summary:
      "Coves reachable only by sea, turquoise water, and the island seen the way it should be.",
    body: [
      "Our goal is to show you the sights of our island from the comfort of your own private boat. We have boats rented exclusively to you or your company, and we organise cruises all over Crete.",
      "The numerous coves accessible only by boat, the sandy beaches, the marine habitats with their turquoise water and the rocky landscape make an exceptional setting for relaxation, exploration, fishing and pleasure.",
    ],
    image: EXPERIENCE_IMAGES["private-boat-trip"] ?? "",
    featured: true,
  },
  {
    slug: "scuba-diving",
    title: "Scuba Diving",
    category: "sea",
    summary: "Crete is as remarkable below the surface as above it.",
    body: [
      "Crete has enchanting landscapes both on its surface and below the sea.",
      "The clear blue water is tempting enough to swim in. But what happens beneath it? You can find out — and earn a diving qualification while you do.",
    ],
    image: EXPERIENCE_IMAGES["scuba-diving"] ?? "",
  },
  {
    slug: "water-sports",
    title: "Water Sports",
    category: "sea",
    summary:
      "Jet ski and jet-ski safari, parasailing, water skiing — with a lifeguard on watch all day.",
    body: [
      "We work with the best water sports operator in Rethymno. Our partner provides professional equipment held to high safety standards.",
      "Jet skiing and jet-ski safari, parasailing and water skiing are only some of the activities. A lifeguard is on watch all day, and the equipment is checked daily by specialist staff.",
    ],
    image: EXPERIENCE_IMAGES["water-sports"] ?? "",
  },
  {
    slug: "wedding-on-the-beach",
    title: "A Wedding on the Beach",
    category: "sea",
    summary: "Sand underfoot, sun overhead.",
    body: [
      "Dreaming of a wedding on the beach, with the sand under your feet and the sun above your head? Speak to us, and we will arrange it.",
    ],
    image: EXPERIENCE_IMAGES["dream-weadding-on-the-beach"] ?? "",
  },

  // ── Into the Island ───────────────────────────────────────────────────────
  {
    slug: "kourtaliotiko-gorge",
    title: "Kourtaliotiko Gorge",
    category: "land",
    summary:
      "A day in the gorge that runs down to Preveli — arranged with Routes, the family's excursions company.",
    body: [
      "The Kourtaliotiko gorge cuts south through the mountains behind Rethymno and comes out at Preveli, where a palm-lined river meets the sea. Sheer rock on both sides, waterfalls at the bottom of a long stair, and a chapel cut into the cliff at the top.",
      "It is a day trip rather than a walk: the drive in, the descent, the water, and the beach at the end of it. We arrange it with Routes — the family's own excursions company — so the guide is somebody the desk knows by name rather than a booking on a platform.",
    ],
    image: "/media/b180118a9d768f785a2a5fe0e1950796.webp",
    link: { href: "https://routescrete.gr/", label: "Routes" },
    featured: true,
  },
  {
    slug: "jeep-safari",
    title: "Jeep Safari",
    category: "land",
    summary:
      "The hard-to-find parts of southern Crete, away from the crowds — all in one day.",
    body: [
      "A tour to the hard-to-find places of Crete, away from the crowds: spectacular views and the pleasure of travelling off-road through the landscapes of southern Crete — all in one day.",
    ],
    image: EXPERIENCE_IMAGES["jeep-safari"] ?? "",
    featured: true,
  },
  {
    slug: "quad-safari",
    title: "Quad Safari",
    category: "land",
    summary: "Up into the mountains of Rethymno, through gorges and shallow rivers.",
    body: [
      "A route that heads up into the mountains of Rethymno, through impressive gorges with remarkable rock formations, crossing shallow rivers on the way.",
    ],
    image: EXPERIENCE_IMAGES["quad-safari"] ?? "",
  },
  {
    slug: "hiking",
    title: "Hiking",
    category: "land",
    summary: "Ask us for routes. The paths here are exceptional.",
    body: [
      "Ask us for routes across Crete. Explore the enchanting paths and the landscapes they open onto.",
    ],
    image: EXPERIENCE_IMAGES["hiking"] ?? "",
  },
  {
    slug: "bike-tours",
    title: "Bike Tours",
    category: "land",
    summary: "Bicycles, and routes worth riding.",
    body: [
      "Ask us to provide bicycles, and explore the routes around Crete.",
    ],
    image: EXPERIENCE_IMAGES["bike-tours"] ?? "",
  },
  {
    slug: "exclusive-tour",
    title: "A Private Tour",
    category: "land",
    summary: "The history, mythology and culture of Crete, privately guided.",
    body: [
      "A personal, private tour through the history, mythology and culture of Crete. Speak to us for details.",
    ],
    image: EXPERIENCE_IMAGES["exclusive-tour"] ?? "",
  },
  {
    slug: "running",
    title: "Running",
    category: "land",
    summary: "Routes for the morning, before the heat.",
    body: [
      "Ask us for routes across Crete. Explore the enchanting paths and the landscapes they open onto.",
    ],
    image: EXPERIENCE_IMAGES["running"] ?? "",
  },

  // ── For Yourself ──────────────────────────────────────────────────────────
  {
    slug: "massage",
    title: "Massage",
    category: "self",
    summary: "Booked for you, in your own room.",
    body: ["Book your appointment for a relaxing massage."],
    image: EXPERIENCE_IMAGES["massage"] ?? "",
    featured: true,
  },
  {
    slug: "therapist",
    title: "A Therapist",
    category: "self",
    summary: "Inner peace, balance and vitality — in life and in relationships.",
    body: [
      "Find your healing space. A therapist can help you find inner peace, balance and vitality, in life and in relationships.",
    ],
    image: EXPERIENCE_IMAGES["therapist"] ?? "",
  },
  {
    slug: "personal-trainer",
    title: "Personal Training",
    category: "self",
    summary: "Stay in form on holiday, privately.",
    body: [
      "Stay fit on your holidays. A personal trainer can come to you, with privacy and safety.",
      "We can also provide TRX equipment, a Pilates ball, or vitamins.",
    ],
    image: EXPERIENCE_IMAGES["personal-trainer"] ?? "",
  },
  {
    slug: "rent-a-car",
    title: "A Car from Our Collection",
    category: "self",
    summary:
      "A Fiat 500 Cabrio, ours rather than a rental desk's — for the days the island is the point.",
    body: [
      "Guests can rent a Fiat 500 Cabrio from our own collection. It is not a booking passed to a rental company at the airport: the car is ours, it is here when you arrive, and the paperwork happens at the desk in about the time it takes to drink a coffee.",
      "It is the right size for these roads. The lanes behind Rethymno were not laid out for anything wider, the mountain switchbacks reward something small and light, and with the roof down the drive to Preveli or up to Arkadi stops being transport.",
      "Tell us the days you want it when you book your room, and it will be waiting.",
    ],
    /* ⚠ PLACEHOLDER PHOTOGRAPH — NOT THE FLEET CAR.
     *
     *   Source   https://www.pexels.com/photo/fiat-500-cabriolet-17514215/
     *   Licence  Pexels licence — free for commercial use, no attribution
     *            required, modification permitted.
     *            https://www.pexels.com/license/
     *   Original 3024×4032, portrait. Cropped to 3:2 around the car and
     *            resized to 2400px by `scripts/car-crop.mjs`, which is
     *            re-runnable. The registration is blurred: the car belongs to
     *            somebody else and its number has no business being
     *            advertised here.
     *
     * It is a Fiat 500 Jolly — the open, wicker-seated spiaggina — rather than
     * the modern 500C, chosen because it is the only free frame of an open 500
     * that reads as this coast: mint paint, whitewashed wall, palms,
     * cobblestones. SWAP IT the moment the owner sends a photograph of the
     * actual car. Nothing else needs to change; only this line.
     *
     * TWO WIDER SEARCHES HAVE ALREADY BEEN RUN. Do not run a third.
     *
     * Wikimedia Commons — `scripts/commons-fiat.mjs`, fifteen query variants,
     * 119 files, 9 with a usable licence at usable size. Every one is the right
     * car in the wrong place: a suburban Australian street with wheelie bins, a
     * German car park, a Belgian hedge, and a vintage Nuova 500 in an airport
     * duty-free shop wearing Disaronno livery.
     *
     * Pexels, Unsplash and Pixabay — every pool checked by alt text, by Pexels'
     * own `?color=` filter, and by looking at the frames. "fiat 500 convertible"
     * returns exactly 24 results and "fiat 500 cabrio" the same 24; that is the
     * whole pool, not a first page. Two runners-up, each blocked on one thing:
     *
     *   pexels 37870913 — a modern 500C, roof rolled back, in cream. The only
     *     cream open-top in any of the four pools. Blocked: a driver's face is
     *     visible through the windscreen, and it is mid-frame — every crop that
     *     loses the face also loses the roof, which is the entire subject. A
     *     stranger's face on a hotel's commercial page is a privacy problem
     *     rather than a matter of taste, so it is not a judgement call to make
     *     on the owner's behalf.
     *   pexels 34311097 — a classic 500 cabriolet by a Roman archway. No people,
     *     no plate, the best-composed frame of the three. Blocked: it is red,
     *     and red is the one body colour the brief rules out.
     *
     * Either becomes the placeholder by changing `image` and `imageAlt` below
     * and re-running scripts/car-crop.mjs against the new source. See
     * scripts/car-finalists.mjs for the contact sheet the three were judged on.
     */
    image: "/media/placeholder-fiat-500-cabrio.webp",
    imageAlt:
      "A mint-green open-topped Fiat 500 with a striped canopy and wicker seats, parked on cobblestones before a whitewashed wall",
    seeAlso: "chauffeur",
    featured: true,
  },
  {
    slug: "chauffeur",
    title: "Airport & Port Transfers",
    category: "self",
    summary: "Met at Chania, Heraklion or the port, and driven in.",
    body: [
      "Have you arranged your holiday and not worked out how to get here from the airport or the port? Let us know, and we will be waiting on arrival to bring you in.",
      "The old town's lanes are narrow and mostly one-way, and House of Europe is inside them. Being driven to the right corner with your luggage is worth arranging — it is the difference between arriving and finding your way.",
    ],
    image: EXPERIENCE_IMAGES["chauffeur"] ?? "",
    seeAlso: "rent-a-car",
  },
  {
    slug: "private-helipad",
    title: "Private Helipad",
    category: "self",
    summary:
      "Available at Thalasses Villas, our sister property on the Cretan coast.",
    body: [
      "Thalasses Villas — our sister property, which commands sweeping views of the Cretan sea — is the only seafront villa estate on this coast with a private helipad on the property. Arrival can be arranged through us.",
    ],
    image: EXPERIENCE_IMAGES["private-helipad"] ?? "",
  },
];

export const experiencesBySlug = new Map(experiences.map((e) => [e.slug, e]));

export function experiencesInGroup(id: ExperienceCategory): Experience[] {
  return experiences.filter((e) => e.category === id);
}

export const featuredExperiences = experiences.filter((e) => e.featured);
