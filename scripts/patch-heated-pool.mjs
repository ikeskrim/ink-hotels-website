/**
 * 1.2 — Harmony's plunge pool is heated, and the site never said so.
 *
 * "Heated" is the difference between a pool that sells a stay in April and one
 * that reads as a summer-only ornament, so it belongs in every place the pool
 * is named: the homepage water section, the badge on the card, the amenity
 * line, and the room's own spec. Also 1.7, where the same suite's amenity list
 * claimed a terrace it does not have.
 *
 * Run: node scripts/patch-heated-pool.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const q = (s) => JSON.stringify(s);

/* ── message catalogue: badge, filter label, homepage copy ─────────────── */
const MESSAGES = {
  plungePool: {
    en: "Heated private plunge pool",
    el: "Θερμαινόμενη ιδιωτική μικρή πισίνα",
    de: "Beheizter eigener Tauchpool",
    fr: "Petite piscine privée chauffée",
    nl: "Verwarmd eigen dompelbad",
  },
  badgePlungePool: {
    en: "Heated plunge pool",
    el: "Θερμαινόμενη μικρή πισίνα",
    de: "Beheizter Tauchpool",
    fr: "Piscine privée chauffée",
    nl: "Verwarmd dompelbad",
  },
  waterSpec: {
    en: "Three private hot tubs · one heated private plunge pool",
    el: "Τρία ιδιωτικά υδρομασάζ · μία θερμαινόμενη ιδιωτική μικρή πισίνα",
    de: "Drei eigene Whirlpools · ein beheizter eigener Tauchpool",
    fr: "Trois bains à remous privés · une petite piscine privée chauffée",
    nl: "Drie eigen bubbelbaden · één verwarmd eigen dompelbad",
  },
  waterBody: {
    en: "Evexia has a private hot tub set into its terrace, with the sea running the full width of the view behind it. Eros and Zoi each have one in a courtyard of their own. Harmony has a heated plunge pool in a secluded interior courtyard — the water is warm whatever the month — forty square metres on the ground floor, with a king bed, a lounge and marble underfoot. Not one of them is shared with anybody.",
    el: "Η Evexia έχει ιδιωτικό υδρομασάζ χωμένο στη βεράντα της, με τη θάλασσα να απλώνεται σε όλο το πλάτος της θέας από πίσω. Ο Eros και η Zoi έχουν από ένα σε δική τους αυλή. Η Harmony έχει θερμαινόμενη μικρή πισίνα σε μια απόμερη εσωτερική αυλή — το νερό είναι ζεστό όποιον μήνα κι αν βρισκόμαστε — σαράντα τετραγωνικά στο ισόγειο, με king-size κρεβάτι, καθιστικό και μάρμαρο στο πάτωμα. Κανένα τους δεν μοιράζεται με κανέναν.",
    de: "Evexia hat einen eigenen Whirlpool in der Terrasse, mit dem Meer über die ganze Breite des Blicks dahinter. Eros und Zoi haben je einen in einem eigenen Innenhof. Harmony hat einen beheizten Tauchpool in einem abgeschiedenen Innenhof — das Wasser ist warm, in welchem Monat auch immer — vierzig Quadratmeter im Erdgeschoss, mit Kingsize-Bett, Lounge und Marmor unter den Füßen. Keiner davon wird mit irgendjemandem geteilt.",
    fr: "Evexia a un bain à remous privé encastré dans sa terrasse, la mer occupant toute la largeur de la vue derrière. Eros et Zoi en ont chacun un dans une cour qui leur est propre. Harmony a une petite piscine chauffée dans une cour intérieure retirée — l'eau est chaude quel que soit le mois — quarante mètres carrés au rez-de-chaussée, avec un lit king-size, un salon et du marbre au sol. Aucun d'eux n'est partagé avec qui que ce soit.",
    nl: "Evexia heeft een eigen bubbelbad in het terras, met de zee over de volle breedte van het uitzicht erachter. Eros en Zoi hebben er elk een in een eigen binnenplaats. Harmony heeft een verwarmd dompelbad op een afgelegen binnenplaats — het water is warm, welke maand het ook is — veertig vierkante meter op de begane grond, met een kingsize bed, een zithoek en marmer onder de voeten. Geen ervan wordt met iemand gedeeld.",
  },
};

for (const locale of ["en", "el", "de", "fr", "nl"]) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  let n = 0;
  for (const [key, values] of Object.entries(MESSAGES)) {
    const re = new RegExp(`(\\n\\s{4}${key}:\\s*\\n?\\s*)"(?:[^"\\\\]|\\\\.)*"`, "");
    if (!re.test(src)) {
      console.warn(`  ${locale}: ${key} not found — skipped`);
      continue;
    }
    src = src.replace(re, (_m, head) => `${head}${q(values[locale])}`);
    n += 1;
  }
  writeFileSync(file, src);
  console.log(`${locale}: ${n} key(s) updated`);
}

/* ── content overlay: the amenity strings that changed shape ───────────── */
const AMENITIES = {
  "Heated private plunge pool / jacuzzi": {
    el: "Θερμαινόμενη ιδιωτική μικρή πισίνα με υδρομασάζ",
    de: "Beheizter eigener Tauchpool mit Whirlpool",
    fr: "Petite piscine privée chauffée avec jacuzzi",
    nl: "Verwarmd eigen dompelbad met jacuzzi",
  },
  "Private interior courtyard": {
    el: "Ιδιωτική εσωτερική αυλή",
    de: "Eigener Innenhof",
    fr: "Cour intérieure privée",
    nl: "Eigen binnenplaats",
  },
};

for (const locale of ["el", "de", "fr", "nl"]) {
  const file = `src/i18n/content/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  const at = src.indexOf("  amenities: {");
  const end = src.indexOf("\n  },", at);
  const block = src.slice(at, end);
  const lines = [];
  for (const [en, v] of Object.entries(AMENITIES)) {
    if (block.includes(q(en) + ":")) continue;
    lines.push(`    ${q(en)}: ${q(v[locale])},`);
  }
  if (!lines.length) {
    console.log(`${locale}: amenities unchanged`);
    continue;
  }
  writeFileSync(file, src.slice(0, end) + "\n" + lines.join("\n") + src.slice(end));
  console.log(`${locale}: amenities +${lines.length}`);
}
