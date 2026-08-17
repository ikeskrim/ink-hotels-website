/**
 * The last measured English leaks outside the twenty-one experience bodies.
 *
 * Two of them are building and phone labels from `site.ts` — structural data
 * rather than prose, so they are keyed by their English value and looked up,
 * which keeps `site.ts` the single record of what the buildings and numbers
 * actually are.
 *
 * Run: node scripts/patch-msg-keys.mjs first (it owns the anchor mechanism);
 * this one appends whole blocks. node scripts/patch-last-strings.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const HOME = {
  rethymnoPremise: {
    en: "You do not travel to it. You walk out into it.",
    el: "Δεν ταξιδεύετε ως εκεί. Βγαίνετε από την πόρτα μέσα σε αυτό.",
    de: "Man reist nicht dorthin. Man tritt aus der Tür hinein.",
    fr: "On ne s'y rend pas. On y sort, simplement.",
    nl: "U reist er niet naartoe. U stapt de deur uit en bent er.",
  },
  harbourEyebrow: {
    en: "Four minutes from the door",
    el: "Τέσσερα λεπτά από την πόρτα",
    de: "Vier Minuten von der Tür",
    fr: "À quatre minutes de la porte",
    nl: "Vier minuten van de deur",
  },
  harbourTitle: {
    en: "The harbour, at the end of the day",
    el: "Το λιμάνι, στο τέλος της ημέρας",
    de: "Der Hafen, am Ende des Tages",
    fr: "Le port, à la fin du jour",
    nl: "De haven, aan het eind van de dag",
  },
  landmarksEyebrow: {
    en: "What stands around you",
    el: "Τι στέκει γύρω σας",
    de: "Was um Sie herum steht",
    fr: "Ce qui vous entoure",
    nl: "Wat er om u heen staat",
  },
  landmarksTitle: {
    en: "Five things worth the walk",
    el: "Πέντε πράγματα που αξίζουν τον δρόμο",
    de: "Fünf Dinge, für die sich der Weg lohnt",
    fr: "Cinq choses qui valent la marche",
    nl: "Vijf dingen die de wandeling waard zijn",
  },
};

const FAQ = {
  lede: {
    en: "Everything you would otherwise open a review site to find out. If something is missing, ask us.",
    el: "Όλα όσα διαφορετικά θα ανοίγατε έναν ιστότοπο κριτικών για να μάθετε. Αν λείπει κάτι, ρωτήστε μας.",
    de: "Alles, wofür Sie sonst eine Bewertungsseite öffnen würden. Fehlt etwas, fragen Sie uns.",
    fr: "Tout ce pour quoi vous ouvririez autrement un site d'avis. S'il manque quelque chose, demandez-nous.",
    nl: "Alles waarvoor u anders een recensiesite zou openen. Ontbreekt er iets, vraag het ons.",
  },
  accessHeading: {
    en: "Arriving with access needs",
    el: "Άφιξη με ανάγκες προσβασιμότητας",
    de: "Anreise mit Zugangsbedarf",
    fr: "Arriver avec des besoins d'accessibilité",
    nl: "Aankomen met toegankelijkheidsbehoeften",
  },
  accessBody: {
    en: "The suite Agapi was designed for wheelchair users.",
    el: "Η σουίτα Agapi σχεδιάστηκε για χρήστες αναπηρικού αμαξιδίου.",
    de: "Die Suite Agapi wurde für Rollstuhlfahrer entworfen.",
    fr: "La suite Agapi a été conçue pour les utilisateurs de fauteuil roulant.",
    nl: "De suite Agapi is ontworpen voor rolstoelgebruikers.",
  },
};

/* Keyed by the English value in site.ts, which stays the record of fact. */
const LABELS = {
  "House of Europe · first building": {
    en: "House of Europe · first building",
    el: "House of Europe · πρώτο κτίριο",
    de: "House of Europe · erstes Gebäude",
    fr: "House of Europe · premier bâtiment",
    nl: "House of Europe · eerste gebouw",
  },
  "Phos · second building": {
    en: "Phos · second building",
    el: "Phos · δεύτερο κτίριο",
    de: "Phos · zweites Gebäude",
    fr: "Phos · deuxième bâtiment",
    nl: "Phos · tweede gebouw",
  },
  "Also in the old town": {
    en: "Also in the old town",
    el: "Επίσης στην παλιά πόλη",
    de: "Ebenfalls in der Altstadt",
    fr: "Également dans la vieille ville",
    nl: "Ook in de oude stad",
  },
  Reception: {
    en: "Reception",
    el: "Ρεσεψιόν",
    de: "Rezeption",
    fr: "Réception",
    nl: "Receptie",
  },
  Mobile: {
    en: "Mobile",
    el: "Κινητό",
    de: "Mobil",
    fr: "Mobile",
    nl: "Mobiel",
  },
  "Seven rooms": {
    en: "Seven rooms",
    el: "Επτά δωμάτια",
    de: "Sieben Zimmer",
    fr: "Sept chambres",
    nl: "Zeven kamers",
  },
  "Reception · all seven suites": {
    en: "Reception · all seven suites",
    el: "Ρεσεψιόν · και οι επτά σουίτες",
    de: "Rezeption · alle sieben Suiten",
    fr: "Réception · les sept suites",
    nl: "Receptie · alle zeven suites",
  },
};

const q = (s) => JSON.stringify(s);

/** Append `key: value` lines inside an existing top-level message group. */
function addToGroup(src, group, entries, locale) {
  const at = src.indexOf(`  ${group}: {`);
  if (at === -1) throw new Error(`no ${group} group`);
  const end = src.indexOf("\n  },", at);
  const existing = src.slice(at, end);
  const lines = [];
  for (const [key, values] of Object.entries(entries)) {
    const k = /^[A-Za-z_$][\w$]*$/.test(key) ? key : q(key);
    if (existing.includes(`${k}:`)) continue;
    lines.push(`    ${k}: ${q(values[locale])},`);
  }
  if (!lines.length) return { src, n: 0 };
  return { src: src.slice(0, end) + "\n" + lines.join("\n") + src.slice(end), n: lines.length };
}

for (const locale of ["en", "el", "de", "fr", "nl"]) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  let total = 0;

  for (const [group, entries] of [["home", HOME], ["common", FAQ]]) {
    const r = addToGroup(src, group, entries, locale);
    src = r.src;
    total += r.n;
  }

  /* `labels` is a new top-level group; create it before the final brace. */
  if (!src.includes("\n  labels: {")) {
    const close = src.lastIndexOf("\n} as const;");
    const anchor = close === -1 ? src.lastIndexOf("\n};") : close;
    const body = Object.entries(LABELS)
      .map(([key, values]) => `    ${q(key)}: ${q(values[locale])},`)
      .join("\n");
    src =
      src.slice(0, anchor) +
      `\n\n  /* Structural strings from content/site.ts, keyed by their English\n     value so site.ts stays the single record of fact. */\n  labels: {\n${body}\n  },` +
      src.slice(anchor);
    total += Object.keys(LABELS).length;
  }

  writeFileSync(file, src);
  console.log(`${locale}: +${total}`);
}
