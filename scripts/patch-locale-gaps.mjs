/**
 * Close two measured translation gaps in the four non-English overlays.
 *
 * 1. `arrival.facts` — the overlays carried a five-entry array written before
 *    the practical-info pass. Because the overlay merge is field-by-field, a
 *    stale array wins outright over the English seven, so a Greek reader was
 *    told reception speaks "English and Greek" (it is four languages), and was
 *    never told the phone extension or that there is a car to rent.
 *
 * 2. `amenities` — fourteen strings added since the map was written, including
 *    every one of the wellness facts the owner confirmed. "Private hot tub"
 *    reading in English on a French page is the one line on that page a guest
 *    is actually shopping for.
 *
 * Run once: node scripts/patch-locale-gaps.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const FACTS = {
  el: [
    ["Ρεσεψιόν", "House of Europe, Νικολάου Πλαστήρα 4 — το πρώτο κτίριο. Ανοιχτά έως τις 23:00."],
    ["Τηλεφωνικά", "+30 211 444 5757, εσωτερικό 1"],
    ["Πρωινό", "Μπουφές στο House of Europe για όλους τους επισκέπτες, και στο δωμάτιό σας με μικρή χρέωση"],
    ["Πάρκινγκ", "Δωρεάν, εκτός καταλύματος, εντός 100 μ."],
    ["Αυτοκίνητα και μεταφορές", "Μεταφορές από αεροδρόμιο και λιμάνι, και ένα Fiat 500 Cabrio προς ενοικίαση"],
    ["Γλώσσες", "Αγγλικά, ελληνικά, ολλανδικά και γαλλικά"],
    ["Άφιξη χωρίς σκαλιά", "Η σουίτα Agapi έχει δική της είσοδο από τον δρόμο"],
  ],
  de: [
    ["Rezeption", "House of Europe, Nikolaou Plastira 4 — das erste Gebäude. Geöffnet bis 23:00 Uhr."],
    ["Telefonisch", "+30 211 444 5757, Durchwahl 1"],
    ["Frühstück", "Buffet im House of Europe für alle Gäste, und gegen einen kleinen Aufpreis auf dem Zimmer"],
    ["Parken", "Kostenlos, außerhalb des Hauses, in 100 m Entfernung"],
    ["Autos und Transfers", "Transfers vom Flughafen und vom Hafen, und ein Fiat 500 Cabrio zur Miete"],
    ["Sprachen", "Englisch, Griechisch, Niederländisch und Französisch"],
    ["Stufenfreie Ankunft", "Die Suite Agapi hat einen eigenen Zugang von der Straße"],
  ],
  fr: [
    ["Réception", "House of Europe, Nikolaou Plastira 4 — le premier bâtiment. Ouverte jusqu'à 23h00."],
    ["Par téléphone", "+30 211 444 5757, poste 1"],
    ["Petit-déjeuner", "Buffet au House of Europe pour tous les clients, et en chambre moyennant un léger supplément"],
    ["Stationnement", "Gratuit, hors site, à moins de 100 m"],
    ["Voitures et transferts", "Transferts aéroport et port, et une Fiat 500 Cabrio à louer"],
    ["Langues", "Anglais, grec, néerlandais et français"],
    ["Arrivée de plain-pied", "La suite Agapi a sa propre entrée sur rue"],
  ],
  nl: [
    ["Receptie", "House of Europe, Nikolaou Plastira 4 — het eerste gebouw. Open tot 23.00 uur."],
    ["Telefonisch", "+30 211 444 5757, toestel 1"],
    ["Ontbijt", "Buffet in House of Europe voor alle gasten, en op de kamer tegen een kleine vergoeding"],
    ["Parkeren", "Gratis, buiten het pand, binnen 100 m"],
    ["Auto's en transfers", "Transfers van luchthaven en haven, en een Fiat 500 Cabrio te huur"],
    ["Talen", "Engels, Grieks, Nederlands en Frans"],
    ["Drempelloze aankomst", "De suite Agapi heeft een eigen ingang aan de straat"],
  ],
};

/** [english, el, de, fr, nl] */
const AMENITIES = [
  ["Backyard", "Αυλή", "Innenhof", "Cour", "Binnenplaats"],
  [
    "Built-in window sofa",
    "Εντοιχισμένος καναπές στο παράθυρο",
    "Eingebaute Fensterbank mit Sofa",
    "Banquette intégrée sous la fenêtre",
    "Ingebouwde vensterbank met bank",
  ],
  [
    "Concrete vanity table with black washbasin",
    "Τσιμεντένιος πάγκος νιπτήρα με μαύρη λεκάνη",
    "Waschtisch aus Beton mit schwarzem Becken",
    "Plan-vasque en béton avec vasque noire",
    "Betonnen wastafelmeubel met zwarte wasbak",
  ],
  ["Family friendly", "Κατάλληλο για οικογένειες", "Familienfreundlich", "Adapté aux familles", "Gezinsvriendelijk"],
  [
    "Glass double shower cabin beside the bed",
    "Γυάλινη διπλή καμπίνα ντους δίπλα στο κρεβάτι",
    "Gläserne Doppeldusche neben dem Bett",
    "Cabine de douche double en verre près du lit",
    "Glazen dubbele douchecabine naast het bed",
  ],
  [
    "Heating & air conditioning",
    "Θέρμανση και κλιματισμός",
    "Heizung und Klimaanlage",
    "Chauffage et climatisation",
    "Verwarming en airconditioning",
  ],
  ["Patio / balcony", "Αυλή ή μπαλκόνι", "Terrasse oder Balkon", "Patio ou balcon", "Patio of balkon"],
  ["Private entrance", "Ιδιωτική είσοδος", "Eigener Eingang", "Entrée privée", "Eigen ingang"],
  ["Private hot tub", "Ιδιωτικό υδρομασάζ", "Eigener Whirlpool", "Bain à remous privé", "Eigen bubbelbad"],
  [
    "Private plunge pool / jacuzzi",
    "Ιδιωτική μικρή πισίνα με υδρομασάζ",
    "Eigener Tauchpool mit Whirlpool",
    "Petite piscine privée avec jacuzzi",
    "Eigen dompelbad met jacuzzi",
  ],
  [
    "Private street entrance",
    "Ιδιωτική είσοδος από τον δρόμο",
    "Eigener Zugang von der Straße",
    "Entrée privée sur rue",
    "Eigen ingang aan de straat",
  ],
  ["Two bathrooms", "Δύο λουτρά", "Zwei Badezimmer", "Deux salles de bains", "Twee badkamers"],
  ["Two bedrooms", "Δύο υπνοδωμάτια", "Zwei Schlafzimmer", "Deux chambres", "Twee slaapkamers"],
  [
    "Waterfront position",
    "Θέση δίπλα στο νερό",
    "Lage direkt am Wasser",
    "Situation en bord de mer",
    "Ligging aan het water",
  ],
];

const q = (s) => JSON.stringify(s);
const COL = { el: 1, de: 2, fr: 3, nl: 4 };

for (const locale of ["el", "de", "fr", "nl"]) {
  const file = `src/i18n/content/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  const before = src;

  /* ── arrival.facts ────────────────────────────────────────────────── */
  const arrivalAt = src.indexOf("  arrival: {");
  if (arrivalAt === -1) throw new Error(`${locale}: no arrival block`);
  const factsAt = src.indexOf("    facts: [", arrivalAt);
  if (factsAt === -1) throw new Error(`${locale}: no arrival.facts`);
  const factsEnd = src.indexOf("\n    ],", factsAt);
  if (factsEnd === -1) throw new Error(`${locale}: unterminated arrival.facts`);

  const body = FACTS[locale]
    .map(([term, def]) => `      { term: ${q(term)}, def: ${q(def)} },`)
    .join("\n");
  src = src.slice(0, factsAt) + `    facts: [\n${body}` + src.slice(factsEnd);

  /* ── amenities ────────────────────────────────────────────────────── */
  const amAt = src.indexOf("  amenities: {");
  if (amAt === -1) throw new Error(`${locale}: no amenities block`);
  const amEnd = src.indexOf("\n  },", amAt);
  if (amEnd === -1) throw new Error(`${locale}: unterminated amenities`);
  const block = src.slice(amAt, amEnd);

  const added = [];
  for (const row of AMENITIES) {
    const en = row[0];
    if (block.includes(`${q(en)}:`) || new RegExp(`^\\s{4}${en}:`, "m").test(block)) continue;
    added.push(`    ${q(en)}: ${q(row[COL[locale]])},`);
  }
  if (added.length) src = src.slice(0, amEnd) + "\n" + added.join("\n") + src.slice(amEnd);

  if (src === before) {
    console.log(`${locale}: no change`);
  } else {
    writeFileSync(file, src);
    console.log(`${locale}: facts → 7, amenities +${added.length}`);
  }
}
