/**
 * Carry the new Eros / Zoi / Pathos / Elpida copy into the four overlays.
 *
 *   node scripts/patch-suite-copy.mjs
 *
 * The overlay wins field by field, so an English description rewritten to add
 * a hot tub is invisible in Greek, German, French and Dutch until the same
 * field is rewritten there. A guest reading the site in their own language
 * would have been told Eros has a patio and not that it has a hot tub in it.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** Replace `description:` (and optionally `outdoor:`) inside a room entry. */
function setField(text, slug, field, value) {
  const key = /^[a-z][a-z0-9]*$/.test(slug) ? `    ${slug}: {` : `    "${slug}": {`;
  const start = text.indexOf(key);
  if (start < 0) throw new Error(`room not found: ${slug}`);
  const end = text.indexOf("\n    },", start);
  const block = text.slice(start, end);
  const fi = block.indexOf(`      ${field}:`);
  if (fi < 0) throw new Error(`${slug}: no ${field}`);
  const qs = block.indexOf('"', fi);
  let qe = qs + 1;
  while (qe < block.length && !(block[qe] === '"' && block[qe - 1] !== "\\")) qe++;
  const next = block.slice(0, qs) + JSON.stringify(value) + block.slice(qe + 1);
  return text.slice(0, start) + next + text.slice(end);
}

const COPY = {
  el: {
    eros: {
      description:
        "Ένα μείγμα γαλήνης και πολυτέλειας. Τριάντα τετραγωνικά σε δύο υπνοδωμάτια, με δική τους πόρτα αντί για διάδρομο, που ανοίγουν σε μια σκιερή αυλή με δικό της υδρομασάζ, ξύλινο παραβάν για ιδιωτικότητα και σεζλόνγκ πάνω στο γρασίδι. Φτιαγμένη για ζευγάρια — και για μήνες του μέλιτος, που είναι και ο συνηθέστερος λόγος που ζητείται.",
      outdoor: "Αυλή με ιδιωτικό υδρομασάζ",
    },
    zoi: {
      description:
        "Zoi θα πει ζωή. Δύο υπνοδωμάτια και δύο μπάνια σε τριάντα τετραγωνικά — η μόνη σουίτα εδώ όπου κανείς δεν περιμένει στη σειρά το πρωί — με ιδιωτική είσοδο και δική της πίσω αυλή, περιφραγμένη με ξύλο, φυτεμένη κατά μήκος του τοίχου, με υδρομασάζ αρκετά μεγάλο και για τους τέσσερίς σας. Αυτή που παίρνει κανείς με παιδιά, ή με ένα δεύτερο ζευγάρι.",
      outdoor: "Πίσω αυλή με ιδιωτικό υδρομασάζ",
    },
    pathos: {
      description:
        "Pathos θα πει πάθος, και το δωμάτιο είναι στημένο γύρω από ένα τολμηρό στοιχείο: μια γυάλινη διπλή καμπίνα ντους που στέκει δίπλα στο κρεβάτι, όχι κρυμμένη πίσω από πόρτα. Είναι όλος ο σχεδιασμός — τίποτε άλλο στη σουίτα δεν του κλέβει την προσοχή — και γι' αυτό είναι εκείνη που τα ζευγάρια ζητούν με το όνομά της. Μια μικρή junior σουίτα σε ιδιωτική, απόμερη γωνιά του ξενοδοχείου, με αυλή ακριβώς απ' έξω για πρωινό καφέ κάτω από τον λαμπερό ελληνικό ήλιο, ή ένα ποτό στο φως του φεγγαριού. Μόνο για ενήλικες.",
    },
    elpida: {
      description:
        "Elpida θα πει ελπίδα, και δύο σχεδιαστικές κινήσεις κρατούν όλο το δωμάτιο. Ένα λιτό τσιμεντένιο τραπέζι-νιπτήρας στέκει δίπλα στο κρεβάτι, με καθρέφτη και μαύρο νιπτήρα — υδραυλικά σαν έπιπλο, όχι κρυμμένα. Απέναντι, ένας καναπές είναι χτισμένος μέσα στα παράθυρα και γεμάτος μαξιλάρια, ώστε η καλύτερη θέση της σουίτας να είναι εκείνη μέσα στο φως. Διαβάστε εκεί το πρωί με τον καφέ, ή καθίστε το βράδυ με κρασί και ακούστε τη φεγγαρόλουστη πόλη. Μόνο για ενήλικες.",
    },
  },
  de: {
    eros: {
      description:
        "Eine Mischung aus Ruhe und Luxus. Dreißig Quadratmeter über zwei Schlafzimmer, betreten durch eine eigene Tür statt über einen Flur, mit einer beschatteten Terrasse, einem eigenen Whirlpool darin, einem Holzschirm für die Privatsphäre und Liegestühlen im Gras. Für Paare gebaut — und für Hochzeitsreisen, weswegen sie am häufigsten angefragt wird.",
      outdoor: "Terrasse mit eigenem Whirlpool",
    },
    zoi: {
      description:
        "Zoi bedeutet Leben. Zwei Schlafzimmer und zwei Bäder auf dreißig Quadratmetern — die einzige Suite hier, in der morgens niemand warten muss — mit eigenem Eingang und eigenem Hinterhof, holzumzäunt, entlang der Mauer bepflanzt und mit einem Whirlpool, der für alle vier reicht. Die Suite für Kinder oder für ein zweites Paar.",
      outdoor: "Hinterhof mit eigenem Whirlpool",
    },
    pathos: {
      description:
        "Pathos bedeutet Leidenschaft, und das Zimmer ist um ein gewagtes Stück gebaut: eine gläserne Doppeldusche, die neben dem Bett steht statt hinter einer Tür zu verschwinden. Sie ist der ganze Entwurf — nichts anderes in der Suite tritt dagegen an — und darum ist sie die, nach der Paare namentlich fragen. Eine intime Juniorsuite in einer geschützten, privaten Ecke des Hotels, mit einem Hof direkt davor für den Morgenkaffee unter der hellen griechischen Sonne oder einen Drink im Mondlicht. Nur für Erwachsene.",
    },
    elpida: {
      description:
        "Elpida bedeutet Hoffnung, und zwei gestalterische Elemente tragen den ganzen Raum. Ein schlichter Waschtisch aus Beton steht neben dem Bett und trägt Spiegel und schwarzes Becken — Sanitär als Möbel behandelt, nicht versteckt. Gegenüber ist ein Sofa in die Fensternische eingebaut und mit Kissen bestückt, sodass der beste Platz der Suite der im Licht ist. Dort morgens beim Kaffee lesen oder abends beim Wein sitzen und der Stadt im Mondlicht zuhören. Nur für Erwachsene.",
    },
  },
  fr: {
    eros: {
      description:
        "Un mélange de sérénité et de luxe. Trente mètres carrés répartis en deux chambres, avec une porte à soi plutôt qu'un couloir, ouvrant sur un patio ombragé doté de son propre bain à remous, d'un paravent de bois pour l'intimité et de transats posés sur l'herbe. Conçue pour les couples — et pour les voyages de noces, ce pour quoi on la demande le plus souvent.",
      outdoor: "Patio avec bain à remous privé",
    },
    zoi: {
      description:
        "Zoi veut dire la vie. Deux chambres et deux salles de bains sur trente mètres carrés — la seule suite ici où personne n'attend son tour le matin — avec une entrée privée et une cour arrière à soi, close de bois, plantée le long du mur et pourvue d'un bain à remous assez grand pour vous quatre. Celle que l'on prend avec des enfants, ou avec un second couple.",
      outdoor: "Cour arrière avec bain à remous privé",
    },
    pathos: {
      description:
        "Pathos veut dire passion, et la chambre est bâtie autour d'un geste osé : une douche double en verre posée à côté du lit plutôt que cachée derrière une porte. C'est tout le projet — rien d'autre dans la suite ne lui dispute l'attention — et c'est pour cela que les couples la demandent par son nom. Une junior suite intime dans un angle privé et abrité de l'hôtel, avec une cour juste devant pour le café du matin sous le soleil grec, ou un verre au clair de lune. Adultes uniquement.",
    },
    elpida: {
      description:
        "Elpida veut dire espoir, et deux gestes de conception tiennent toute la chambre. Une table-vasque en béton, minimale, se tient près du lit et porte un miroir et une vasque noire — la plomberie traitée comme du mobilier, non dissimulée. En face, un canapé est bâti dans l'embrasure des fenêtres et garni de coussins, de sorte que la meilleure place de la suite soit celle qui est dans la lumière. Lisez-y le matin avec un café, ou asseyez-vous le soir avec un verre de vin et écoutez la ville au clair de lune. Adultes uniquement.",
    },
  },
  nl: {
    eros: {
      description:
        "Een mengeling van rust en luxe. Dertig vierkante meter verdeeld over twee slaapkamers, met een eigen deur in plaats van een gang, uitkomend op een beschaduwd terras met een eigen bubbelbad, een houten scherm voor de privacy en ligstoelen in het gras. Gemaakt voor stellen — en voor huwelijksreizen, waarvoor er het vaakst naar gevraagd wordt.",
      outdoor: "Terras met eigen bubbelbad",
    },
    zoi: {
      description:
        "Zoi betekent leven. Twee slaapkamers en twee badkamers op dertig vierkante meter — de enige suite hier waar 's ochtends niemand hoeft te wachten — met een eigen ingang en een eigen achtertuin, omheind met hout, beplant langs de muur, en met een bubbelbad dat groot genoeg is voor jullie vieren. De suite die je neemt met kinderen, of met een tweede stel.",
      outdoor: "Achtertuin met eigen bubbelbad",
    },
    pathos: {
      description:
        "Pathos betekent passie, en de kamer is gebouwd rond één gedurfd element: een glazen dubbele douchecabine die náást het bed staat in plaats van achter een deur te verdwijnen. Het is het hele ontwerp — niets anders in de suite doet ertegen mee — en daarom is dit de kamer waar stellen bij naam om vragen. Een intieme juniorsuite in een besloten, private hoek van het hotel, met een binnenplaats vlak buiten voor koffie in de ochtendzon of een glas in het maanlicht. Alleen volwassenen.",
    },
    elpida: {
      description:
        "Elpida betekent hoop, en twee ontwerpgrepen dragen de hele kamer. Een sobere betonnen wastafel staat naast het bed met een spiegel en een zwarte kom — sanitair behandeld als meubel, niet weggewerkt. Ertegenover is een bank in de vensternis gebouwd en volgestapeld met kussens, zodat de beste plek van de suite die in het licht is. Lees er 's ochtends met koffie, of zit er 's avonds met wijn en luister naar de stad in het maanlicht. Alleen volwassenen.",
    },
  },
};

for (const [locale, rooms] of Object.entries(COPY)) {
  const file = path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  for (const [slug, fields] of Object.entries(rooms)) {
    for (const [field, value] of Object.entries(fields)) {
      t = setField(t, slug, field, value);
    }
  }
  fs.writeFileSync(file, t);
  console.log(`${locale}: eros, zoi, pathos, elpida updated`);
}
