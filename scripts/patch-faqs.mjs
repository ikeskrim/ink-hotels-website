/**
 * Bring the French and Dutch FAQ overlays back in step with the English list.
 *
 *   node scripts/patch-faqs.mjs
 *
 * Anchored on the opening words of each entry rather than on the whole string:
 * French uses narrow no-break spaces before ? : and ; , which are invisible in
 * a diff and impossible to retype, so matching a full paragraph by hand fails.
 *
 * `localiseFaqs` falls back to English wholesale when the arrays are different
 * lengths, so an overlay that is two entries short silently reverts a whole
 * language — which is why this is a script and not four careful edits.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** Replace the `answer:` that follows the question beginning with `qStart`. */
function replaceAnswer(text, qStart, answer) {
  const qi = text.indexOf(`question: "${qStart}`);
  if (qi < 0) throw new Error(`question not found: ${qStart}`);
  const ai = text.indexOf('answer:', qi);
  if (ai < 0) throw new Error(`answer not found after: ${qStart}`);
  /* The value runs from the first quote after `answer:` to the quote that
     closes it — allowing for escaped quotes, of which there are none, and for
     the value being on its own line, which is how prettier leaves the long
     ones. */
  const start = text.indexOf('"', ai);
  let end = start + 1;
  while (end < text.length && !(text[end] === '"' && text[end - 1] !== "\\")) end++;
  return text.slice(0, start) + JSON.stringify(answer) + text.slice(end + 1);
}

/** Also rewrite a question, matched on its opening words. */
function replaceQuestion(text, qStart, question) {
  const qi = text.indexOf(`question: "${qStart}`);
  if (qi < 0) throw new Error(`question not found: ${qStart}`);
  const start = text.indexOf('"', qi);
  let end = start + 1;
  while (end < text.length && !(text[end] === '"' && text[end - 1] !== "\\")) end++;
  return text.slice(0, start) + JSON.stringify(question) + text.slice(end + 1);
}

/** Insert entries immediately after the entry whose question starts `qStart`. */
function insertAfter(text, qStart, entries) {
  const qi = text.indexOf(`question: "${qStart}`);
  if (qi < 0) throw new Error(`question not found: ${qStart}`);
  /* Walk to the `},` that closes this object. */
  const close = text.indexOf("\n    },", qi);
  if (close < 0) throw new Error(`close not found after: ${qStart}`);
  const at = close + "\n    },".length;
  const block = entries
    .map(
      (e) =>
        `\n    {\n      question: ${JSON.stringify(e.q)},\n      answer:\n        ${JSON.stringify(e.a)},\n    },`,
    )
    .join("");
  return text.slice(0, at) + block + text.slice(at);
}

const PATCHES = {
  fr: (t) => {
    t = replaceAnswer(
      t,
      "Où se trouve exactement",
      "Au centre de la vieille ville médiévale de Réthymnon, en Crète, à quelques pas du port vénitien et sous la Fortezza. Vous arrivez à House of Europe, au 4 rue Nikolaou Plastira — c'est là que se trouvent la réception et les sept suites. Phos, le deuxième bâtiment, est au 10 rue Fotaki. L'hôtel possède aussi des adresses au 2 rue Psaron et au 26 rue Damvergi ; on vous accompagne à la vôtre depuis la réception.",
    );
    t = replaceAnswer(
      t,
      "Quelle est la différence",
      "House of Europe est le premier bâtiment, au 4 rue Nikolaou Plastira. La réception y est, le petit-déjeuner y est servi pour tous les clients, et les sept suites y sont. C'était autrefois la maison d'hôtes de l'Université de Crète. Phos, dont le nom est le mot grec pour lumière, est le deuxième bâtiment, à quelques pas : sept chambres, numérotées de un à sept, et le plus calme des deux. The Residence of the Old Port est une maison à part, près du port.",
    );
    t = replaceAnswer(
      t,
      "Le petit-déjeuner est-il",
      "Le petit-déjeuner buffet est disponible en supplément et servi à House of Europe, y compris pour les clients logés à Phos. Il peut aussi être servi en chambre moyennant un supplément. Les tarifs et les prestations incluses sont confirmés au moment de la réservation.",
    );
    t = replaceQuestion(
      t,
      "Y a-t-il des chambres avec piscine",
      "Y a-t-il des chambres avec piscine ou bain à remous ?",
    );
    t = replaceAnswer(
      t,
      "Y a-t-il des chambres avec piscine",
      "Deux des sept suites ont leur propre eau. Evexia dispose d'un bain à remous privé encastré dans sa terrasse, au-dessus du front de mer. Harmony dispose d'un bassin privé dans sa propre cour intérieure, à l'abri des regards. Il n'y a pas de piscine commune — la mer est à quelques minutes à pied.",
    );
    t = replaceAnswer(
      t,
      "L'hôtel est-il accessible",
      "La suite Agapi a été conçue pour l'accessibilité : accès de plain-pied par une entrée privée depuis la rue latérale, douche à l'italienne, et toilettes équipées de barres d'appui, construites aux normes d'une hygiène sûre et confortable pour les utilisateurs de fauteuil roulant. Contactez-nous avant de réserver, afin que nous puissions confirmer que le chemin jusqu'au bâtiment vous convient — la vieille ville est historique, et ses ruelles sont pavées.",
    );
    t = insertAfter(t, "L'hôtel est-il accessible", [
      {
        q: "Certaines chambres sont-elles réservées aux adultes ?",
        a: "Pathos et Elpida n'accueillent que des adultes. Toutes les autres suites et chambres accueillent les familles ; Zoi, avec ses deux chambres et ses deux salles de bains, est celle que l'on demande le plus souvent avec des enfants.",
      },
      {
        q: "À quelle heure ferme la réception ?",
        a: "La réception est ouverte jusqu'à 23h00, à House of Europe, 4 rue Nikolaou Plastira. Si votre vol atterrit plus tard, prévenez-nous à l'avance et quelqu'un sera là pour vous accueillir.",
      },
    ]);
    t = replaceAnswer(t, "Quelles langues", "L'anglais, le grec, le néerlandais et le français.");
    return t;
  },

  nl: (t) => {
    t = replaceAnswer(
      t,
      "Waar ligt het hotel",
      "In het centrum van de middeleeuwse oude stad van Rethymno op Kreta, op een paar stappen van de Venetiaanse haven en onder de Fortezza. U komt aan bij House of Europe, Nikolaou Plastira 4 — daar is de receptie, en daar liggen alle zeven suites. Phos, het tweede gebouw, staat aan de Fotaki 10. Het hotel heeft ook adressen aan de Psaron 2 en de Damvergi 26; vanaf de receptie brengt iemand u naar het uwe.",
    );
    t = replaceAnswer(
      t,
      "Wat is het verschil",
      "House of Europe is het eerste gebouw, Nikolaou Plastira 4. Daar is de receptie, daar wordt voor alle gasten het ontbijt geserveerd, en daar liggen alle zeven suites. Het was ooit het gastenverblijf van de Universiteit van Kreta. Phos, het Griekse woord voor licht, is het tweede gebouw, een paar stappen verderop: zeven kamers, genummerd van één tot zeven, en het stillere van de twee. The Residence of the Old Port is een apart huis bij de haven.",
    );
    t = replaceAnswer(
      t,
      "Is het ontbijt",
      "Het ontbijtbuffet is tegen een toeslag beschikbaar en wordt geserveerd in House of Europe, ook voor gasten die in Phos verblijven. Tegen een toeslag wordt het ook op de kamer geserveerd. Tarieven en wat is inbegrepen worden bij de boeking bevestigd.",
    );
    t = replaceQuestion(
      t,
      "Heeft een van de kamers",
      "Heeft een van de kamers een zwembad of bubbelbad?",
    );
    t = replaceAnswer(
      t,
      "Heeft een van de kamers",
      "Twee van de zeven suites hebben hun eigen water. Evexia heeft een eigen bubbelbad, verzonken in het terras, boven de boulevard. Harmony heeft een eigen plunge pool op een afgeschermde binnenplaats. Een gemeenschappelijk zwembad is er niet — de zee ligt op korte loopafstand.",
    );
    t = replaceAnswer(
      t,
      "Is het hotel toegankelijk",
      "De suite Agapi is ontworpen op toegankelijkheid: drempelloze toegang met een eigen ingang aan de zijstraat, een inloopdouche en een toilet met wandbeugels, gebouwd volgens de normen voor veilige en comfortabele hygiënische verzorging voor rolstoelgebruikers. Neem vóór het boeken contact met ons op, zodat wij kunnen bevestigen dat de route naar het gebouw voor u werkt — de oude stad is historisch en de stegen zijn geplaveid.",
    );
    t = insertAfter(t, "Is het hotel toegankelijk", [
      {
        q: "Zijn er kamers alleen voor volwassenen?",
        a: "Pathos en Elpida nemen alleen volwassenen. Alle andere suites en kamers zijn geschikt voor gezinnen; Zoi heeft twee slaapkamers en twee badkamers en wordt het vaakst met kinderen geboekt.",
      },
      {
        q: "Tot hoe laat is de receptie open?",
        a: "De receptie is open tot 23:00 uur, in House of Europe, Nikolaou Plastira 4. Landt uw vlucht later, laat het ons vooraf weten en er is iemand aanwezig.",
      },
    ]);
    t = replaceAnswer(t, "Welke talen", "Engels, Grieks, Nederlands en Frans.");
    return t;
  },

  de: (t) => replaceAnswer(t, "Welche Sprachen", "Englisch, Griechisch, Niederländisch und Französisch."),
};

for (const [locale, patch] of Object.entries(PATCHES)) {
  const file = path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  const before = fs.readFileSync(file, "utf8");
  const after = patch(before);
  fs.writeFileSync(file, after);
  console.log(`${locale}: ${before.length} → ${after.length}`);
}
