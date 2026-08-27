import { GALLERY_IMAGES } from "./generated/images";

/**
 * Rethymno, at length.
 *
 * The destination sells the room. A guest choosing between four boutique
 * hotels in Crete is really choosing between four versions of a week, and this
 * is ours — written as somebody who lives here would describe it, not as a
 * guidebook.
 *
 * Every factual claim traces to the property's own material or to the town's
 * public record (the Fortezza's 1573 date and 1,300 m perimeter, the harbour's
 * Byzantine origin after 961, Arkadi at 23 km and 500 m altitude, Eleftherna's
 * 3000 BC–1300 AD span). No restaurant, beach or shop is named, because we
 * cannot verify what is still open.
 */

export interface Chapter {
  id: string;
  eyebrow: string;
  title: string;
  greek?: string;
  body: string[];
  image: string;
  imageAlt: string;
  /** Optional short factual lines shown as a spec strip. */
  notes?: { term: string; def: string }[];
}

export const rethymnoIntro = {
  eyebrow: "The destination",
  title: "A town built over itself",
  lede: "Ancient Rithimna, a Byzantine harbour, a Venetian fort, Ottoman lanes and two houses of the 1700s — layered on one headland, and small enough to walk in an afternoon.",
  body: [
    "Rethymno sits halfway along the north coast of Crete, between Chania and Heraklion, with a mountain behind it and the Cretan Sea in front. Its old town is one of the best-preserved in Greece: nobody flattened it, so the Venetian doorways, the Ottoman fountains and the wooden balconies are still where they were put.",
    "What that means for a stay is simple. You are not driven to attractions. You walk out of a door into the thing itself.",
  ],
} as const;

export const chapters: Chapter[] = [
  {
    id: "old-town",
    eyebrow: "Chapter one",
    title: "The old town",
    body: [
      "The quarter around Ink is a grid of lanes too narrow for cars, laid out by Venetians and lived in ever since. Doorways carry carved lintels four hundred years old. Bougainvillea comes over the walls in summer and drops into the street.",
      "It is not a preserved quarter. People live here — laundry, cats, scooters, an argument two floors up — and that is precisely what makes walking it at eight in the evening better than any excursion.",
    ],
    image: "/media/74a4ef6ba01d4657fc483050a182533c.webp",
    imageAlt:
      "A street of the old town of Rethymno seen from a balcony, ochre houses either side",
    notes: [{ term: "From the door", def: "You are already in it" }],
  },
  {
    id: "venetian",
    eyebrow: "Chapter two",
    title: "Venetian stone",
    body: [
      "The Fortezza stands on the hill of Palekastro above the town, built in 1573 on the site of the citadel of ancient Rithimna and the temple of Artemis Rokkea. Its walls run 1,300 metres, with four bastions — St Luke, St Elijah, St Paul and St Nicholas.",
      "Below it the Venetian harbour curls behind its Egyptian lighthouse. It worked in the Byzantine period, after 961, and flourished under the Venetians, who began major works in the 14th century against the silting that troubles it to this day.",
    ],
    image: "/media/12fdb3e377a57fa420aa8dcbea7feaf4.webp",
    imageAlt: "The Fortezza fortress above the old town of Rethymno",
    notes: [
      { term: "Fortezza", def: "Built 1573 · 1,300 m of wall" },
      { term: "Harbour", def: "In use since the 10th century" },
    ],
  },
  {
    id: "sea",
    eyebrow: "Chapter three",
    title: "The water",
    body: [
      "The nearest swimming is the town's own beach, a few minutes' walk from the door: it begins where the old town ends and runs east for kilometres — sand, shallow water, and enough of it that August never quite fills it. You can be in the sea before breakfast and back for it.",
      "The better swimming is further out, in coves reachable only by boat, and on the south coast where the water changes colour entirely. A boat can be taken privately for a day. The desk arranges it.",
    ],
    image: "/media/09cb81f4aba0dee9ece0ab74c834e2dd.webp",
    imageAlt:
      "The harbour and coastline of Rethymno from above, turquoise water against the town",
    notes: [
      { term: "Town beach", def: "A few minutes on foot" },
      { term: "Koumbes beach", def: "1.6 km from the Residence" },
    ],
  },
  {
    id: "table",
    eyebrow: "Chapter four",
    title: "What Crete eats",
    body: [
      "Cretan cooking is the oldest argument in favour of the Mediterranean diet, and it is not a health regime here — it is lunch. Wild greens, sheep's cheese, barley rusk, olive oil poured like it costs nothing, and lamb cooked slowly with whatever grew nearest.",
      "The wine of Crete is famous worldwide, and the wineries in the hills behind Rethymno will show you how it is made. Closer to home, there are small luncheonettes in these lanes doing fresh salads and juices, and bars that make the best frozen cocktails of the summer.",
    ],
    image: "/media/81f32d1a29c59e8bacedce1256625494.webp",
    imageAlt: "A table set by the sea in Rethymno",
    notes: [
      { term: "Breakfast", def: "Local cooking, at House of Europe" },
      { term: "Arranged", def: "Wine tasting, a farm" },
    ],
  },
  {
    id: "inland",
    eyebrow: "Chapter five",
    title: "Behind the town",
    body: [
      "Twenty minutes inland the coast stops mattering. Gorges open, villages sit at the end of single roads, and the mountains run up to snow that lasts into May.",
      "Arkadi Monastery is 23 kilometres east, built at 500 metres on a plateau of olive groves, vineyards, pine, cypress and oak, with the Arkadi gorge beginning below it. Further on, the Museum of Ancient Eleftherna — the first museum in Crete built inside an archaeological site — carries the whole history of the place from 3000 BC to 1300 AD.",
      "South, the Kourtaliotiko gorge cuts down to Preveli, where a palm-lined river runs into the sea. That one is a day rather than an afternoon, and we arrange it with Routes, the family's own excursions company.",
    ],
    image: "/media/13dcbc1e810a47022f5791951f545b6b.webp",
    imageAlt: "The mountains and gorges inland from Rethymno",
    notes: [
      { term: "Arkadi", def: "23 km east · 500 m altitude" },
      { term: "Eleftherna", def: "3000 BC – 1300 AD" },
      { term: "Kourtaliotiko", def: "A day trip, arranged with Routes" },
    ],
  },
  {
    id: "hidden",
    eyebrow: "Chapter six",
    title: "The parts you would not find",
    body: [
      "Every town has a version of itself that only opens to people who know somebody. Which lane floods after rain. Which beach empties on a Sunday. Which taverna is still worth the walk in February, when most have shut for the winter.",
      "That is the actual argument for staying somewhere family-run rather than somewhere with a brand manual. Ask at the desk, and you get an answer from someone who lives here.",
    ],
    image: "/media/461f62e27fac13a619b832a11fb81846.webp",
    imageAlt: "A green Venetian door in a quiet lane of the old town",
  },
];

/** A wide strip of the town, used as a visual break. */
export const townStrip: readonly string[] = [
  "/media/181f84a843edadbabe1510574f25768f.webp",
  "/media/05c09d32efa814812ba4598083de9b4c.webp",
  "/media/1a25f40128eeefbed32d4cf75cb7faf8.webp",
  GALLERY_IMAGES[3] ?? "/media/02c0f591d1c1a4c37a286ad8e7f2744a.webp",
];
