/**
 * The last of the four-buildings story, in the four overlays.
 *
 *   node scripts/patch-arrival-overlays.mjs
 *
 * These strings sat in the arrival overlay rather than in the message
 * catalogue, so the English sweep never touched them: a Dutch reader was still
 * being told the hotel occupies four buildings and that reception serves all
 * four of them.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** [find, replace] pairs, per locale. */
const EDITS = {
  el: [
    [
      "Το ξενοδοχείο καταλαμβάνει τέσσερα κτίρια στην παλιά πόλη. Έρχεστε σε ένα από αυτά — στο πρώτο — και από εκεί κάποιος σας συνοδεύει στο δωμάτιό σας.",
      "Το ξενοδοχείο καταλαμβάνει δύο κτίρια στην παλιά πόλη και μία κατοικία δίπλα στο λιμάνι. Έρχεστε σε μία πόρτα — στο House of Europe, το πρώτο κτίριο, Νικολάου Πλαστήρα 4 — και από εκεί κάποιος σας συνοδεύει στο δωμάτιό σας.",
    ],
    [
      "Είναι η ρεσεψιόν και για τα τέσσερα κτίρια.",
      "Είναι η ρεσεψιόν για όλο το ξενοδοχείο, και εκεί βρίσκονται και οι επτά σουίτες. Είναι ανοιχτή έως τις 23:00.",
    ],
  ],
  de: [
    [
      "Das Hotel belegt vier Gebäude in der Altstadt. Sie kommen zu einem davon — dem ersten — und von dort begleitet Sie jemand zu Ihrem Zimmer.",
      "Das Hotel belegt zwei Gebäude in der Altstadt, dazu eine Residenz am Hafen. Sie kommen zu einer Tür — House of Europe, dem ersten Gebäude, Nikolaou Plastira 4 — und von dort begleitet Sie jemand zu Ihrem Zimmer.",
    ],
    [
      "Das ist die Rezeption für alle vier Gebäude.",
      "Das ist die Rezeption für das ganze Haus, und dort liegen alle sieben Suiten. Sie ist bis 23:00 Uhr besetzt.",
    ],
  ],
  fr: [
    [
      "L'hôtel occupe quatre bâtiments de la vieille ville. Vous venez à l'un d'eux — le premier — et quelqu'un vous conduit de là jusqu'à votre chambre.",
      "L'hôtel occupe deux bâtiments de la vieille ville, plus une résidence près du port. Vous arrivez à une seule porte — House of Europe, le premier bâtiment, au 4 rue Nikolaou Plastira — et quelqu'un vous conduit ensuite jusqu'à votre chambre.",
    ],
    [
      "C'est la réception des quatre bâtiments.",
      "C'est la réception de tout l'hôtel, et les sept suites y sont. Elle est ouverte jusqu'à 23h00.",
    ],
    [
      "des ruelles ottomanes et trois maisons des années 1700",
      "des ruelles ottomanes et deux maisons des années 1700",
    ],
  ],
  nl: [
    [
      "Het hotel beslaat vier gebouwen in de oude stad. U komt naar één ervan — het eerste — en vandaar loopt iemand met u mee naar uw kamer.",
      "Het hotel beslaat twee gebouwen in de oude stad, plus een woonhuis bij de haven. U komt naar één deur — House of Europe, het eerste gebouw, Nikolaou Plastira 4 — en vandaar loopt iemand met u mee naar uw kamer.",
    ],
    [
      "Dat is de receptie voor alle vier de gebouwen.",
      "Dat is de receptie voor het hele hotel, en daar liggen alle zeven suites. Hij is open tot 23:00 uur.",
    ],
  ],
};

let missed = 0;
for (const [locale, pairs] of Object.entries(EDITS)) {
  const file = path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  let applied = 0;
  for (const [from, to] of pairs) {
    if (t.includes(from)) {
      t = t.replace(from, to);
      applied++;
    } else if (!t.includes(to)) {
      console.log(`MISS ${locale}: ${from.slice(0, 56)}…`);
      missed++;
    }
  }
  fs.writeFileSync(file, t);
  console.log(`${locale}: ${applied}/${pairs.length}`);
}
if (missed) process.exitCode = 1;
