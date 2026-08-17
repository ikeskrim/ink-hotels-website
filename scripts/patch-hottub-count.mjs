/**
 * The site counted its own hot tubs two different ways.
 *
 * Ground truth, derived from the room records: three suites have a private hot
 * tub — Evexia, Eros and Zoi — and one, Harmony, has the heated plunge pool.
 * The water section and the house intro said "three"; the meta descriptions for
 * / and /rooms, and the House of Europe promise line, said "one".
 *
 * The meta descriptions are the worse half: they are what a guest reads in a
 * search result before they ever reach the page, so the site was under-selling
 * itself to exactly the people deciding whether to click, and contradicting
 * itself to the ones who did.
 *
 * Fixed by hand rather than by interpolating `counts`, because these are
 * sentences with rhythm and the three languages inflect the noun differently
 * after a numeral. `scripts/count-check.mjs` guards the result.
 *
 * Run: node scripts/patch-hottub-count.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

/** locale → [find, replace] pairs. */
const SUBS = {
  en: [
    [
      "seven suites at House of Europe, one with a private hot tub and one with a plunge pool",
      "seven suites at House of Europe, three with a private hot tub and one with a heated plunge pool",
    ],
    [
      "Seven suites at House of Europe — one with a private hot tub, one with a plunge pool —",
      "Seven suites at House of Europe — three with a private hot tub, one with a heated plunge pool —",
    ],
    [
      "All seven suites are here — one with a private hot tub above the water, one with a plunge pool in its own courtyard —",
      "All seven suites are here — three with a private hot tub, one of them above the water, and one with a heated plunge pool in its own courtyard —",
    ],
  ],
  el: [
    [
      "επτά σουίτες στο House of Europe, μία με ιδιωτικό υδρομασάζ και μία με μικρή πισίνα",
      "επτά σουίτες στο House of Europe, τρεις με ιδιωτικό υδρομασάζ και μία με θερμαινόμενη μικρή πισίνα",
    ],
    [
      "Επτά σουίτες στο House of Europe — μία με ιδιωτικό υδρομασάζ, μία με μικρή πισίνα —",
      "Επτά σουίτες στο House of Europe — τρεις με ιδιωτικό υδρομασάζ, μία με θερμαινόμενη μικρή πισίνα —",
    ],
  ],
  de: [
    [
      "sieben Suiten im House of Europe, eine mit eigenem Whirlpool und eine mit Tauchpool",
      "sieben Suiten im House of Europe, drei mit eigenem Whirlpool und eine mit beheiztem Tauchpool",
    ],
    [
      "Sieben Suiten im House of Europe — eine mit eigenem Whirlpool, eine mit Tauchpool —",
      "Sieben Suiten im House of Europe — drei mit eigenem Whirlpool, eine mit beheiztem Tauchpool —",
    ],
  ],
  fr: [
    [
      "sept suites au House of Europe, une avec bain à remous privé et une avec petite piscine",
      "sept suites au House of Europe, trois avec bain à remous privé et une avec petite piscine chauffée",
    ],
    [
      "Sept suites au House of Europe — une avec bain à remous privé, une avec petite piscine —",
      "Sept suites au House of Europe — trois avec bain à remous privé, une avec petite piscine chauffée —",
    ],
  ],
  nl: [
    [
      "zeven suites in House of Europe, één met eigen bubbelbad en één met dompelbad",
      "zeven suites in House of Europe, drie met eigen bubbelbad en één met verwarmd dompelbad",
    ],
    [
      "Zeven suites in House of Europe — één met eigen bubbelbad, één met dompelbad —",
      "Zeven suites in House of Europe — drie met eigen bubbelbad, één met verwarmd dompelbad —",
    ],
  ],
};

let total = 0;
for (const [locale, pairs] of Object.entries(SUBS)) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  let n = 0;
  for (const [find, replace] of pairs) {
    if (!src.includes(find)) {
      console.warn(`  ${locale}: not found → "${find.slice(0, 56)}…"`);
      continue;
    }
    src = src.split(find).join(replace);
    n += 1;
  }
  if (n) writeFileSync(file, src);
  total += n;
  console.log(`${locale}: ${n} replacement(s)`);
}
console.log(`\n${total} total`);
