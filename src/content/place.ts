import { ARTICLE_IMAGES } from "./generated/images";

/**
 * Rethymno and its surroundings, as the property describes them.
 * Historical facts are the property's own; they are reproduced faithfully.
 */

export interface Place {
  slug: string;
  name: string;
  /** Walking or driving distance, only where the property states one. */
  distance: string | null;
  body: string;
  image: string;
}

export const places: Place[] = [
  {
    slug: "town-beach",
    name: "The Town Beach",
    distance: "A few minutes on foot",
    body: "The nearest swimming is the town's own beach, which begins where the old town ends and runs east for kilometres — sand, shallow water, and enough of it that August never quite fills it. It is a walk of a few minutes from the door, not a drive: you can go before breakfast and be back for it.",
    image: "/media/e01e491e0b9bdcae47be0dfe6250d765.webp",
  },
  {
    slug: "venetian-harbour",
    name: "The Venetian Harbour",
    distance: "A few minutes on foot",
    body: "Next to the modern harbour, with its Egyptian lighthouse, this is one of the most picturesque corners of the old town. It operated in the Byzantine period, after 961, and flourished under the Venetians, who began major works in the 14th century to hold back the silting that troubles it still. Seaside tavernas line the quay.",
    image: ARTICLE_IMAGES["1349"]?.[0] ?? "",
  },
  {
    slug: "fortezza",
    name: "The Fortezza",
    distance: "A few minutes on foot",
    body: "The fortress dominates the hill of Palekastro beside the old town, one of the largest of the Venetian era. It stands on the site of the citadel of ancient Rithimna and the temple of Artemis Rokkea. The great pentagonal fort was built in 1573; its perimeter runs 1,300 metres, and along the walls stand four bastions — St Luke, St Elijah, St Paul and St Nicholas.",
    image: ARTICLE_IMAGES["1350"]?.[0] ?? "",
  },
  {
    slug: "historical-folklore-museum",
    name: "Historical & Folklore Museum",
    distance: "In the old town",
    body: "A Venetian mansion in the old town, a listed monument of the 17th century, houses the city's historical and folk museum. Five halls hold a permanent collection of traditional craft and folk art — and the museum's work protects the building itself.",
    image: ARTICLE_IMAGES["1353"]?.[0] ?? "",
  },
  {
    slug: "archaeological-museum",
    name: "Archaeological Museum",
    distance: "In the old town",
    body:
      "The city's archaeological collection, in the former church of St Francis \u2014 a Venetian monastery church a few streets back from the harbour. The museum moved here in 2016 from its earlier home beside the Fortezza gate.",
    /* No photograph. The property's media library has none of this building,
       and a picture of a different museum would be the one invented thing on a
       site built on not inventing. The gallery skips an empty source and the
       landmark list on /rethymno shows name, distance and text, so the entry
       reads correctly without one. */
    image: "",
  },
  {
    slug: "arkadi-monastery",
    name: "Arkadi Monastery",
    distance: "23 km east",
    body: "Near the village of Amnatos, built at 500 metres on a fertile plateau of olive groves, vineyards, pine, cypress and oak. Picturesque chapels stand around it, and the Arkadi gorge begins from there.",
    image: ARTICLE_IMAGES["1351"]?.[0] ?? "",
  },
  {
    slug: "ancient-eleftherna",
    name: "The Museum of Ancient Eleftherna",
    distance: "Inland from Rethymno",
    body: "The first museum in Crete built inside an archaeological site, standing beside the ancient city of Eleftherna. Its three halls carry the whole history of the place, from 3000 BC to 1300 AD, in everyday objects and works of art.",
    image: ARTICLE_IMAGES["1352"]?.[0] ?? "",
  },
];

/** The property's own account of the buildings' history. */
export const history = {
  eyebrow: "Back in times",
  title: "A press, a newspaper, a guest house",
  paragraphs: [
    "The building that became Ink was a printing shop. From it was published the newspaper ΑΓΩΝ — Struggle — by Fotakis, who later became a congressman and a prosecutor in Athens.",
    "The central building, known as the House of Europe, was the guest house of the University of Crete. Its guests were professors and researchers who came to give lectures of consequence to the scientific and local community. Art exhibitions have long been part of the life of the house.",
    "Three separate historic buildings of the 1700s, in the centre of the medieval old town. They are a historic spot of Rethymno's life.",
  ],
} as const;

export const neighbourhood = {
  title: "Under the shadow of the Fortezza",
  paragraphs: [
    "Ink sits under the imposing Fortezza — the fortress the pirate Barbarossa once invaded — and a few steps from the sea and the medieval Venetian port, where merchants once traded goods from all over the world.",
    "Walk the streets around Ink and you find the alleys knights once rode through, small local luncheonettes with good food, fresh salads and juices. And this very alive quarter has bars that will serve you the best frozen cocktails of the summer.",
  ],
} as const;
