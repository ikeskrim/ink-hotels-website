/**
 * Bring the four content overlays in line with the new property structure.
 *
 *   node scripts/patch-content-overlays.mjs
 *
 * Three things changed underneath them:
 *   - `gateway-suites` is no longer a building. All seven suites are at House
 *     of Europe, so the overlay's house block is rewritten to three buildings.
 *   - Two Phos rooms lost the word "suite" and with it their slugs, so the
 *     overlay keys have to follow or the translation silently stops applying.
 *   - Evexia, Eros and Zoi are new and had no entry in any language.
 *
 * Idempotent: re-running finds the new keys already present and does nothing.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const HOUSES = {
  el: `  houses: {
    "house-of-europe": {
      name: "House of Europe",
      subtitle: "Το πρώτο κτίριο · ρεσεψιόν",
      intro:
        "Το κτίριο που έδωσε στο ξενοδοχείο την καρδιά του: κάποτε ο ξενώνας του Πανεπιστημίου Κρήτης, όπου έμεναν επισκέπτες καθηγητές και ερευνητές. Εδώ είναι η ρεσεψιόν, εδώ σερβίρεται το πρωινό, και εδώ βρίσκονται και οι επτά σουίτες. Ανακαινίστηκε τον Μάιο του 2020.",
    },
    phos: {
      name: "Phos",
      subtitle: "Φως · το δεύτερο κτίριο",
      intro:
        "Επτά δωμάτια, με αρίθμηση από το ένα ως το επτά, στο πιο ήσυχο από τα δύο κτίρια — λίγα βήματα από το House of Europe, όπου είναι η ρεσεψιόν και το πρωινό. Ανακαινίστηκε τον Ιούνιο του 2019.",
    },
    residence: {
      name: "The Residence of the Old Port",
      subtitle: "Ένα σπίτι δικό σας",
      intro:
        "Μία κατοικία με δύο υπνοδωμάτια, δική της κουζίνα και ιδιωτικό πάρκινγκ, εκατό μέτρα από το ενετικό λιμάνι.",
    },
  },`,
  de: `  houses: {
    "house-of-europe": {
      name: "House of Europe",
      subtitle: "Das erste Gebäude · Rezeption",
      intro:
        "Das Haus, das dem Hotel sein Herz gab: einst das Gästehaus der Universität Kreta, in dem Professoren und Forscher auf Besuch wohnten. Hier ist die Rezeption, hier wird das Frühstück serviert, und hier liegen alle sieben Suiten. Renoviert im Mai 2020.",
    },
    phos: {
      name: "Phos",
      subtitle: "Licht · das zweite Gebäude",
      intro:
        "Sieben Zimmer, von eins bis sieben nummeriert, im ruhigeren der beiden Gebäude — ein kurzer Weg zum House of Europe, wo Rezeption und Frühstück sind. Renoviert im Juni 2019.",
    },
    residence: {
      name: "The Residence of the Old Port",
      subtitle: "Ein Haus für Sie allein",
      intro:
        "Eine Residenz mit zwei Schlafzimmern, eigener Küche und privatem Parkplatz, hundert Meter vom venezianischen Hafen.",
    },
  },`,
  fr: `  houses: {
    "house-of-europe": {
      name: "House of Europe",
      subtitle: "Le premier bâtiment · réception",
      intro:
        "La maison qui a donné son cœur à l'hôtel : autrefois la maison d'hôtes de l'Université de Crète, où logeaient professeurs et chercheurs de passage. La réception est ici, le petit-déjeuner est servi ici, et les sept suites sont ici. Rénovée en mai 2020.",
    },
    phos: {
      name: "Phos",
      subtitle: "Lumière · le deuxième bâtiment",
      intro:
        "Sept chambres, numérotées de un à sept, dans le plus calme des deux bâtiments — à quelques pas de House of Europe, où se trouvent la réception et le petit-déjeuner. Rénové en juin 2019.",
    },
    residence: {
      name: "The Residence of the Old Port",
      subtitle: "Une maison à vous",
      intro:
        "Une résidence de deux chambres avec sa propre cuisine et un parking privé, à cent mètres du port vénitien.",
    },
  },`,
  nl: `  houses: {
    "house-of-europe": {
      name: "House of Europe",
      subtitle: "Het eerste gebouw · receptie",
      intro:
        "Het huis dat het hotel zijn hart gaf: ooit het gastenverblijf van de Universiteit van Kreta, waar bezoekende hoogleraren en onderzoekers verbleven. Hier is de receptie, hier wordt het ontbijt geserveerd, en hier liggen alle zeven suites. Gerenoveerd in mei 2020.",
    },
    phos: {
      name: "Phos",
      subtitle: "Licht · het tweede gebouw",
      intro:
        "Zeven kamers, genummerd van één tot zeven, in het stillere van de twee gebouwen — op loopafstand van House of Europe, waar de receptie en het ontbijt zijn. Gerenoveerd in juni 2019.",
    },
    residence: {
      name: "The Residence of the Old Port",
      subtitle: "Een eigen huis",
      intro:
        "Eén woning met twee slaapkamers, een eigen keuken en privéparkeerplaats, honderd meter van de Venetiaanse haven.",
    },
  },`,
};

/** The three new suites, per language. */
const NEW_ROOMS = {
  el: `    evexia: {
      displayName: "Evexia",
      description:
        "Ευεξία — και η σουίτα είναι οργανωμένη γύρω από μία: ένα ιδιωτικό υδρομασάζ χωμένο στη δική της βεράντα, με τη θάλασσα να απλώνεται σε όλο το πλάτος της θέας από πίσω. Ο τοίχος γύρω του είναι ντυμένος με ζωγραφιστά κρητικά πλακάκια και ένας κάκτος στέκει στο στηθαίο — μια ταράτσα φτιαγμένη για να τη ζεις, όχι για να την κοιτάς. Τριάντα τετραγωνικά από κάτω, με είσοδο κατευθείαν από τον δρόμο, δική τους αυλή, υπνοδωμάτιο, μπάνιο και μια γωνιά για καφέ.",
      notes: [],
      outlook: "Το μέτωπο της θάλασσας",
      outdoor: "Βεράντα με ιδιωτικό υδρομασάζ",
    },
    eros: {
      displayName: "Eros",
      description:
        "Ένα μείγμα γαλήνης και πολυτέλειας. Τριάντα τετραγωνικά σε δύο υπνοδωμάτια, με δική τους πόρτα αντί για διάδρομο, που ανοίγουν σε μια σκιερή αυλή με ξύλινο παραβάν για ιδιωτικότητα και σεζλόνγκ πάνω στο γρασίδι. Φτιαγμένη για ζευγάρια — και για μήνες του μέλιτος, που είναι και ο συνηθέστερος λόγος που ζητείται.",
      notes: [],
      outlook: "Ιδιωτική αυλή",
      outdoor: "Αυλή",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi θα πει ζωή. Δύο υπνοδωμάτια και δύο μπάνια σε τριάντα τετραγωνικά — η μόνη σουίτα εδώ όπου κανείς δεν περιμένει στη σειρά το πρωί — με ιδιωτική είσοδο και δική της πίσω αυλή, περιφραγμένη με ξύλο και φυτεμένη κατά μήκος του τοίχου. Αυτή που παίρνει κανείς με παιδιά, ή με ένα δεύτερο ζευγάρι.",
      notes: [],
      outlook: "Ιδιωτική πίσω αυλή",
      outdoor: "Πίσω αυλή",
    },
`,
  de: `    evexia: {
      displayName: "Evexia",
      description:
        "Evexia ist das griechische Wort für Wohlbefinden, und die Suite ist um eines herum gebaut: ein eigener Whirlpool, in die eigene Terrasse eingelassen, mit dem Meer über die ganze Breite des Blicks dahinter. Die Mauer ringsum ist mit bemalten kretischen Fliesen besetzt, ein Kaktus steht an der Brüstung — ein Dach zum Leben, nicht zum Anschauen. Dreißig Quadratmeter darunter, direkt von der Straße betreten, mit eigenem Hinterhof, Schlafzimmer, Bad und einer Ecke für den Kaffee.",
      notes: [],
      outlook: "Zur Uferstraße",
      outdoor: "Terrasse mit eigenem Whirlpool",
    },
    eros: {
      displayName: "Eros",
      description:
        "Eine Mischung aus Ruhe und Luxus. Dreißig Quadratmeter über zwei Schlafzimmer, betreten durch eine eigene Tür statt über einen Flur, mit einer beschatteten Terrasse, einem Holzschirm für die Privatsphäre und Liegestühlen im Gras. Für Paare gebaut — und für Hochzeitsreisen, weswegen sie am häufigsten angefragt wird.",
      notes: [],
      outlook: "Privater Innenhof",
      outdoor: "Terrasse",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi bedeutet Leben. Zwei Schlafzimmer und zwei Bäder auf dreißig Quadratmetern — die einzige Suite hier, in der morgens niemand warten muss — mit eigenem Eingang und eigenem Hinterhof, holzumzäunt und entlang der Mauer bepflanzt. Die Suite für Kinder oder für ein zweites Paar.",
      notes: [],
      outlook: "Eigener Hinterhof",
      outdoor: "Hinterhof",
    },
`,
  fr: `    evexia: {
      displayName: "Evexia",
      description:
        "Evexia est le mot grec pour le bien-être, et la suite est organisée autour d'un seul : un bain à remous privé encastré dans sa propre terrasse, la mer occupant toute la largeur de la vue derrière lui. Le mur qui l'entoure est habillé de carreaux crétois peints et un cactus se dresse au parapet — un toit fait pour être vécu, pas regardé. Trente mètres carrés en dessous, avec une entrée directe sur la rue, une cour à soi, une chambre, une salle de bains et un coin pour le café.",
      notes: [],
      outlook: "Le front de mer",
      outdoor: "Terrasse avec bain à remous privé",
    },
    eros: {
      displayName: "Eros",
      description:
        "Un mélange de sérénité et de luxe. Trente mètres carrés répartis en deux chambres, avec une porte à soi plutôt qu'un couloir, ouvrant sur un patio ombragé, un paravent de bois pour l'intimité et des transats posés sur l'herbe. Conçue pour les couples — et pour les voyages de noces, ce pour quoi on la demande le plus souvent.",
      notes: [],
      outlook: "Cour privée",
      outdoor: "Patio",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi veut dire la vie. Deux chambres et deux salles de bains sur trente mètres carrés — la seule suite ici où personne n'attend son tour le matin — avec une entrée privée et une cour arrière à soi, close de bois et plantée le long du mur. Celle que l'on prend avec des enfants, ou avec un second couple.",
      notes: [],
      outlook: "Cour arrière privée",
      outdoor: "Cour arrière",
    },
`,
  nl: `    evexia: {
      displayName: "Evexia",
      description:
        "Evexia is het Griekse woord voor welbevinden, en de suite is om er één heen gebouwd: een eigen bubbelbad, verzonken in het eigen terras, met de zee over de volle breedte van het uitzicht erachter. De muur eromheen is bekleed met beschilderde Kretenzische tegels en er staat een cactus bij de borstwering — een dak om op te leven, niet om naar te kijken. Dertig vierkante meter eronder, rechtstreeks vanaf de straat te betreden, met een eigen achtertuin, slaapkamer, badkamer en een hoek voor de koffie.",
      notes: [],
      outlook: "De boulevard",
      outdoor: "Terras met eigen bubbelbad",
    },
    eros: {
      displayName: "Eros",
      description:
        "Een mengeling van rust en luxe. Dertig vierkante meter verdeeld over twee slaapkamers, met een eigen deur in plaats van een gang, uitkomend op een beschaduwd terras met een houten scherm voor de privacy en ligstoelen in het gras. Gemaakt voor stellen — en voor huwelijksreizen, waarvoor er het vaakst naar gevraagd wordt.",
      notes: [],
      outlook: "Eigen binnenplaats",
      outdoor: "Terras",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi betekent leven. Twee slaapkamers en twee badkamers op dertig vierkante meter — de enige suite hier waar 's ochtends niemand hoeft te wachten — met een eigen ingang en een eigen achtertuin, omheind met hout en beplant langs de muur. De suite die je neemt met kinderen, of met een tweede stel.",
      notes: [],
      outlook: "Eigen achtertuin",
      outdoor: "Achtertuin",
    },
`,
};

/** Display names for the two Phos rooms that lost the word "suite". */
const PHOS_RENAMES = {
  el: { terrace: "Δωμάτιο με βεράντα", balcony: "Superior δωμάτιο με μπαλκόνι" },
  de: { terrace: "Zimmer mit Terrasse", balcony: "Superior-Zimmer mit Balkon" },
  fr: { terrace: "Chambre avec terrasse", balcony: "Chambre supérieure avec balcon" },
  nl: { terrace: "Kamer met terras", balcony: "Superior kamer met balkon" },
};

for (const locale of ["el", "de", "fr", "nl"]) {
  const file = path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  const before = t.length;

  /* 1 — the buildings. Replace the whole block: it went from four to three. */
  const hStart = t.indexOf("  houses: {");
  if (hStart >= 0) {
    const hEnd = t.indexOf("\n  },", hStart) + "\n  },".length;
    t = t.slice(0, hStart) + HOUSES[locale] + t.slice(hEnd);
  }

  /* 2 — the renamed Phos slugs, and their display names. */
  t = t.replace('"suite-with-terrace-phos"', '"room-with-terrace-phos"');
  t = t.replace('"suite-with-balcony-phos"', '"superior-room-with-balcony-phos"');
  {
    const i = t.indexOf('"room-with-terrace-phos"');
    if (i >= 0) {
      const d = t.indexOf("displayName:", i);
      const s = t.indexOf('"', d);
      let e = s + 1;
      while (t[e] !== '"') e++;
      t = t.slice(0, s) + JSON.stringify(PHOS_RENAMES[locale].terrace) + t.slice(e + 1);
    }
  }
  {
    const i = t.indexOf('"superior-room-with-balcony-phos"');
    if (i >= 0) {
      const d = t.indexOf("displayName:", i);
      const s = t.indexOf('"', d);
      let e = s + 1;
      while (t[e] !== '"') e++;
      t = t.slice(0, s) + JSON.stringify(PHOS_RENAMES[locale].balcony) + t.slice(e + 1);
    }
  }

  /* 3 — the three new suites, at the head of the room list. */
  if (!t.includes("    evexia: {")) {
    const anchor = "  rooms: {\n";
    const i = t.indexOf(anchor);
    if (i >= 0) t = t.slice(0, i + anchor.length) + NEW_ROOMS[locale] + t.slice(i + anchor.length);
  }

  fs.writeFileSync(file, t);
  console.log(`${locale}: ${before} → ${t.length}`);
}
