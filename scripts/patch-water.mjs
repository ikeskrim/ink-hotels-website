/**
 * Three hot tubs, not one.
 *
 *   node scripts/patch-water.mjs
 *
 * The owner has confirmed that Eros and Zoi each have a private hot tub, which
 * the photographs already showed. That turns "two of the seven come with their
 * own water" into four, and the water section, the hero lede and the FAQ all
 * assert the old number in five languages.
 *
 * Anchored on opening words rather than whole strings: French and Greek both
 * use punctuation this file cannot retype byte-for-byte.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** Replace the string value of `key:` wherever it appears in a catalogue. */
function setValue(text, key, value) {
  const i = text.indexOf(`    ${key}:`);
  if (i < 0) throw new Error(`key not found: ${key}`);
  const start = text.indexOf('"', i);
  let end = start + 1;
  while (end < text.length && !(text[end] === '"' && text[end - 1] !== "\\")) end++;
  return text.slice(0, start) + JSON.stringify(value) + text.slice(end + 1);
}

/** Replace one clause inside an existing value, leaving the rest alone. */
function swap(text, from, to) {
  if (!text.includes(from)) {
    if (text.includes(to)) return text;
    throw new Error(`clause not found: ${from.slice(0, 48)}`);
  }
  return text.replace(from, to);
}

const MESSAGES = {
  en: {
    waterEyebrow: "The water",
    waterTitle: "Four of the seven come with their own water.",
    waterBody:
      "Evexia has a private hot tub set into its terrace, with the sea running the full width of the view behind it. Eros and Zoi each have one in a courtyard of their own. Harmony has a plunge pool in a secluded interior courtyard — forty square metres on the ground floor, with a king bed, a lounge and marble underfoot. Not one of them is shared with anybody.",
    waterSpec: "Three private hot tubs · one private plunge pool",
    heroClause: [
      "one with a private hot tub above the water, one with a plunge pool in its own courtyard",
      "three with a private hot tub, one with a plunge pool in its own courtyard",
    ],
  },
  el: {
    waterEyebrow: "Το νερό",
    waterTitle: "Τέσσερις από τις επτά έχουν το δικό τους νερό.",
    waterBody:
      "Η Evexia έχει ιδιωτικό υδρομασάζ χωμένο στη βεράντα της, με τη θάλασσα να απλώνεται σε όλο το πλάτος της θέας. Η Eros και η Zoi έχουν από ένα, η καθεμία σε δική της αυλή. Η Harmony έχει μικρή πισίνα σε απόμερη εσωτερική αυλή — σαράντα τετραγωνικά στο ισόγειο, με κρεβάτι king, καθιστικό και μάρμαρο στο πάτωμα. Καμία τους δεν μοιράζεται με κανέναν.",
    waterSpec: "Τρία ιδιωτικά υδρομασάζ · μία ιδιωτική πισίνα",
    heroClause: [
      "η μία με ιδιωτικό υδρομασάζ πάνω από το νερό, η άλλη με μικρή πισίνα σε δική της αυλή",
      "τρεις με ιδιωτικό υδρομασάζ, μία με μικρή πισίνα σε δική της αυλή",
    ],
  },
  de: {
    waterEyebrow: "Das Wasser",
    waterTitle: "Vier der sieben haben ihr eigenes Wasser.",
    waterBody:
      "Evexia hat einen eigenen Whirlpool, in die Terrasse eingelassen, mit dem Meer über die ganze Breite des Blicks dahinter. Eros und Zoi haben je einen im eigenen Innenhof. Harmony hat einen Plunge Pool in einem geschützten Innenhof — vierzig Quadratmeter im Erdgeschoss, mit Kingsize-Bett, Wohnbereich und Marmor unter den Füßen. Keiner von ihnen wird geteilt.",
    waterSpec: "Drei eigene Whirlpools · ein eigener Plunge Pool",
    heroClause: [
      "eine mit eigenem Whirlpool über dem Wasser, eine mit Plunge Pool im eigenen Innenhof",
      "drei mit eigenem Whirlpool, eine mit Plunge Pool im eigenen Innenhof",
    ],
  },
  fr: {
    waterEyebrow: "L'eau",
    waterTitle: "Quatre des sept ont leur propre eau.",
    waterBody:
      "Evexia possède un bain à remous privé encastré dans sa terrasse, la mer occupant toute la largeur de la vue derrière lui. Eros et Zoi en ont chacune un, dans une cour à elles. Harmony possède un bassin dans une cour intérieure abritée — quarante mètres carrés au rez-de-chaussée, avec un lit king size, un salon et du marbre au sol. Aucun d'eux ne se partage.",
    waterSpec: "Trois bains à remous privés · un bassin privé",
    heroClause: [
      "l'une avec un bain à remous privé au-dessus de l'eau, l'autre avec un bassin dans sa propre cour",
      "trois avec un bain à remous privé, une avec un bassin dans sa propre cour",
    ],
  },
  nl: {
    waterEyebrow: "Het water",
    waterTitle: "Vier van de zeven hebben hun eigen water.",
    waterBody:
      "Evexia heeft een eigen bubbelbad, verzonken in het terras, met de zee over de volle breedte van het uitzicht erachter. Eros en Zoi hebben er elk een, op een eigen binnenplaats. Harmony heeft een plunge pool op een besloten binnenplaats — veertig vierkante meter op de begane grond, met een kingsize bed, een zithoek en marmer onder de voet. Geen van alle wordt gedeeld.",
    waterSpec: "Drie eigen bubbelbaden · één eigen plunge pool",
    heroClause: [
      "één met een eigen bubbelbad boven het water, één met een plunge pool op een eigen binnenplaats",
      "drie met een eigen bubbelbad, één met een plunge pool op een eigen binnenplaats",
    ],
  },
};

for (const [locale, v] of Object.entries(MESSAGES)) {
  const file = path.join(ROOT, "src", "i18n", "messages", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  t = setValue(t, "waterEyebrow", v.waterEyebrow);
  t = setValue(t, "waterTitle", v.waterTitle);
  t = setValue(t, "waterBody", v.waterBody);
  t = setValue(t, "waterSpec", v.waterSpec);
  t = swap(t, v.heroClause[0], v.heroClause[1]);
  fs.writeFileSync(file, t);
  console.log(`messages/${locale}: water + hero updated`);
}

/* ── The FAQ answer, English source and the four overlays ─────────────────── */
const FAQ = {
  en: [
    "Two of the seven suites have their own water. Evexia has a private hot tub set into its terrace, above the waterfront. Harmony has a private plunge pool in its own secluded interior courtyard. There is no communal pool — the sea is a short walk away.",
    "Four of the seven suites have their own water. Evexia has a private hot tub set into its terrace, above the waterfront; Eros and Zoi each have one in a courtyard of their own. Harmony has a private plunge pool in its own secluded interior courtyard. There is no communal pool — the sea is a short walk away.",
  ],
  el: [
    "Δύο από τις επτά σουίτες έχουν το δικό τους νερό. Η Evexia έχει ιδιωτικό υδρομασάζ χωμένο στη βεράντα της, πάνω από την ακτή. Η Harmony έχει ιδιωτική μικρή πισίνα στη δική της απόμερη εσωτερική αυλή. Κοινόχρηστη πισίνα δεν υπάρχει — η θάλασσα είναι λίγα βήματα μακριά.",
    "Τέσσερις από τις επτά σουίτες έχουν το δικό τους νερό. Η Evexia έχει ιδιωτικό υδρομασάζ χωμένο στη βεράντα της, πάνω από την ακτή· η Eros και η Zoi έχουν από ένα, η καθεμία σε δική της αυλή. Η Harmony έχει ιδιωτική μικρή πισίνα στη δική της απόμερη εσωτερική αυλή. Κοινόχρηστη πισίνα δεν υπάρχει — η θάλασσα είναι λίγα βήματα μακριά.",
  ],
  de: [
    "Zwei der sieben Suiten haben ihr eigenes Wasser. Evexia hat einen eigenen Whirlpool, in die Terrasse eingelassen, oberhalb der Uferstraße. Harmony hat einen privaten Tauchpool im eigenen geschützten Innenhof. Einen gemeinsamen Pool gibt es nicht — das Meer liegt wenige Schritte entfernt.",
    "Vier der sieben Suiten haben ihr eigenes Wasser. Evexia hat einen eigenen Whirlpool, in die Terrasse eingelassen, oberhalb der Uferstraße; Eros und Zoi haben je einen im eigenen Innenhof. Harmony hat einen privaten Tauchpool im eigenen geschützten Innenhof. Einen gemeinsamen Pool gibt es nicht — das Meer liegt wenige Schritte entfernt.",
  ],
  fr: [
    "Deux des sept suites ont leur propre eau. Evexia dispose d'un bain à remous privé encastré dans sa terrasse, au-dessus du front de mer. Harmony dispose d'un bassin privé dans sa propre cour intérieure, à l'abri des regards. Il n'y a pas de piscine commune — la mer est à quelques minutes à pied.",
    "Quatre des sept suites ont leur propre eau. Evexia dispose d'un bain à remous privé encastré dans sa terrasse, au-dessus du front de mer ; Eros et Zoi en ont chacune un, dans une cour à elles. Harmony dispose d'un bassin privé dans sa propre cour intérieure, à l'abri des regards. Il n'y a pas de piscine commune — la mer est à quelques minutes à pied.",
  ],
  nl: [
    "Twee van de zeven suites hebben hun eigen water. Evexia heeft een eigen bubbelbad, verzonken in het terras, boven de boulevard. Harmony heeft een eigen plunge pool op een afgeschermde binnenplaats. Een gemeenschappelijk zwembad is er niet — de zee ligt op korte loopafstand.",
    "Vier van de zeven suites hebben hun eigen water. Evexia heeft een eigen bubbelbad, verzonken in het terras, boven de boulevard; Eros en Zoi hebben er elk een, op een eigen binnenplaats. Harmony heeft een eigen plunge pool op een afgeschermde binnenplaats. Een gemeenschappelijk zwembad is er niet — de zee ligt op korte loopafstand.",
  ],
};

for (const [locale, [from, to]] of Object.entries(FAQ)) {
  const file =
    locale === "en"
      ? path.join(ROOT, "src", "content", "faq.ts")
      : path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  t = swap(t, from, to);
  fs.writeFileSync(file, t);
  console.log(`faq/${locale}: updated`);
}
