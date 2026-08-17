/**
 * Localised <title> and <meta description> for every static route.
 *
 * Fourteen of sixteen routes shipped English metadata to all five locales
 * (`scripts/meta-audit.mjs`). hreflang was already correct, which made this the
 * worse half of the pair: Google was told "here is the German version", followed
 * it, and found an English title and an English description. A German search
 * result read in English, and so did the browser tab.
 *
 * Two descriptions interpolate live values — the phone number and reception hour
 * on /contact, the photograph count on /gallery — so those carry `{phone}`,
 * `{ext}`, `{time}` and `{count}` and are filled at render from the same
 * `site.ts` records as before. Nothing here restates a fact; it translates one.
 *
 * Run: node scripts/patch-page-meta.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

/** route key → { title, description } per locale. */
const META = {
  home: {
    en: {
      t: "Ink Hotels — A small hotel in the old town of Rethymno, Crete",
      d: "Small hotel. Long story. Seven suites at House of Europe — one with a private hot tub, one with a plunge pool — seven rooms at Phos, and a residence by the Venetian harbour, in the medieval old town of Rethymno.",
    },
    el: {
      t: "Ink Hotels — Ένα μικρό ξενοδοχείο στην παλιά πόλη του Ρεθύμνου",
      d: "Μικρό ξενοδοχείο. Μεγάλη ιστορία. Επτά σουίτες στο House of Europe — μία με ιδιωτικό υδρομασάζ, μία με μικρή πισίνα — επτά δωμάτια στο Phos, και μια κατοικία δίπλα στο ενετικό λιμάνι, μέσα στη μεσαιωνική παλιά πόλη του Ρεθύμνου.",
    },
    de: {
      t: "Ink Hotels — Ein kleines Hotel in der Altstadt von Rethymno, Kreta",
      d: "Kleines Hotel. Lange Geschichte. Sieben Suiten im House of Europe — eine mit eigenem Whirlpool, eine mit Tauchpool — sieben Zimmer im Phos, und eine Residenz am venezianischen Hafen, mitten in der mittelalterlichen Altstadt von Rethymno.",
    },
    fr: {
      t: "Ink Hotels — Un petit hôtel dans la vieille ville de Réthymnon, Crète",
      d: "Petit hôtel. Longue histoire. Sept suites au House of Europe — une avec bain à remous privé, une avec petite piscine — sept chambres au Phos, et une résidence près du port vénitien, au cœur de la vieille ville médiévale de Réthymnon.",
    },
    nl: {
      t: "Ink Hotels — Een klein hotel in de oude stad van Rethymno, Kreta",
      d: "Klein hotel. Lang verhaal. Zeven suites in House of Europe — één met eigen bubbelbad, één met dompelbad — zeven kamers in Phos, en een residentie bij de Venetiaanse haven, midden in de middeleeuwse oude stad van Rethymno.",
    },
  },

  rooms: {
    en: {
      t: "Rooms",
      d: "Twenty ways to stay in the old town of Rethymno — seven suites at House of Europe, one with a private hot tub and one with a plunge pool, seven rooms at Phos, and one whole residence by the Venetian harbour.",
    },
    el: {
      t: "Δωμάτια",
      d: "Είκοσι τρόποι να μείνετε στην παλιά πόλη του Ρεθύμνου — επτά σουίτες στο House of Europe, μία με ιδιωτικό υδρομασάζ και μία με μικρή πισίνα, επτά δωμάτια στο Phos, και μια ολόκληρη κατοικία δίπλα στο ενετικό λιμάνι.",
    },
    de: {
      t: "Zimmer",
      d: "Zwanzig Arten, in der Altstadt von Rethymno zu wohnen — sieben Suiten im House of Europe, eine mit eigenem Whirlpool und eine mit Tauchpool, sieben Zimmer im Phos, und eine ganze Residenz am venezianischen Hafen.",
    },
    fr: {
      t: "Chambres",
      d: "Vingt façons de séjourner dans la vieille ville de Réthymnon — sept suites au House of Europe, une avec bain à remous privé et une avec petite piscine, sept chambres au Phos, et une résidence entière près du port vénitien.",
    },
    nl: {
      t: "Kamers",
      d: "Twintig manieren om in de oude stad van Rethymno te verblijven — zeven suites in House of Europe, één met eigen bubbelbad en één met dompelbad, zeven kamers in Phos, en een hele residentie bij de Venetiaanse haven.",
    },
  },

  experiences: {
    en: {
      t: "The Art of Staying",
      d: "A boat of your own, a chef in the room, wine in the hills above Rethymno, a therapist, a quiet morning. Twenty-one things the desk at Ink Hotels arranges — most of them a phone call we have made a hundred times.",
    },
    el: {
      t: "Η τέχνη της διαμονής",
      d: "Ένα σκάφος δικό σας, ένας σεφ στο δωμάτιο, κρασί στους λόφους πάνω από το Ρέθυμνο, ένας θεραπευτής, ένα ήσυχο πρωινό. Είκοσι ένα πράγματα που κανονίζει η ρεσεψιόν του Ink — τα περισσότερα ένα τηλεφώνημα που το έχουμε κάνει εκατό φορές.",
    },
    de: {
      t: "Die Kunst des Bleibens",
      d: "Ein eigenes Boot, ein Koch im Zimmer, Wein in den Hügeln über Rethymno, ein Therapeut, ein stiller Morgen. Einundzwanzig Dinge, die die Rezeption im Ink arrangiert — die meisten davon ein Anruf, den wir schon hundertmal gemacht haben.",
    },
    fr: {
      t: "L'art du séjour",
      d: "Un bateau à vous, un chef dans la chambre, du vin dans les collines au-dessus de Réthymnon, un thérapeute, un matin tranquille. Vingt et une choses que la réception d'Ink organise — pour la plupart un appel que nous avons passé cent fois.",
    },
    nl: {
      t: "De kunst van het verblijven",
      d: "Een eigen boot, een kok op de kamer, wijn in de heuvels boven Rethymno, een therapeut, een stille ochtend. Eenentwintig dingen die de receptie van Ink regelt — de meeste een telefoontje dat we al honderd keer hebben gepleegd.",
    },
  },

  gallery: {
    en: {
      t: "Gallery",
      d: "{count} photographs of Ink Hotels — the private hot tub and plunge pool, the seven suites, the two houses, the Residence of the Old Port, and the medieval old town of Rethymno around them.",
    },
    el: {
      t: "Φωτογραφίες",
      d: "{count} φωτογραφίες του Ink Hotels — το ιδιωτικό υδρομασάζ και η μικρή πισίνα, οι επτά σουίτες, τα δύο κτίρια, η κατοικία The Residence of the Old Port, και η μεσαιωνική παλιά πόλη του Ρεθύμνου γύρω τους.",
    },
    de: {
      t: "Galerie",
      d: "{count} Fotografien des Ink Hotels — der eigene Whirlpool und der Tauchpool, die sieben Suiten, die beiden Häuser, die Residence of the Old Port, und die mittelalterliche Altstadt von Rethymno ringsum.",
    },
    fr: {
      t: "Galerie",
      d: "{count} photographies d'Ink Hotels — le bain à remous privé et la petite piscine, les sept suites, les deux maisons, la Residence of the Old Port, et la vieille ville médiévale de Réthymnon tout autour.",
    },
    nl: {
      t: "Galerij",
      d: "{count} foto's van Ink Hotels — het eigen bubbelbad en het dompelbad, de zeven suites, de twee huizen, de Residence of the Old Port, en de middeleeuwse oude stad van Rethymno eromheen.",
    },
  },

  story: {
    en: {
      t: "The story",
      d: "Ink is named after a printing press. From this building was published the newspaper ΑΓΩΝ — Struggle. The central house was the University of Crete's guest house. Two historic houses of the 1700s in the medieval old town of Rethymno, and a residence by the harbour.",
    },
    el: {
      t: "Η ιστορία",
      d: "Το Ink πήρε το όνομά του από ένα τυπογραφείο. Από αυτό το κτίριο εκδιδόταν η εφημερίδα ΑΓΩΝ. Το κεντρικό σπίτι ήταν ο ξενώνας του Πανεπιστημίου Κρήτης. Δύο ιστορικά σπίτια του 1700 στη μεσαιωνική παλιά πόλη του Ρεθύμνου, και μια κατοικία δίπλα στο λιμάνι.",
    },
    de: {
      t: "Die Geschichte",
      d: "Ink ist nach einer Druckerpresse benannt. Aus diesem Gebäude erschien die Zeitung ΑΓΩΝ — Kampf. Das mittlere Haus war das Gästehaus der Universität Kreta. Zwei historische Häuser aus dem 18. Jahrhundert in der mittelalterlichen Altstadt von Rethymno, und eine Residenz am Hafen.",
    },
    fr: {
      t: "L'histoire",
      d: "Ink tient son nom d'une presse d'imprimerie. De ce bâtiment était publié le journal ΑΓΩΝ — Combat. La maison centrale était la maison d'hôtes de l'Université de Crète. Deux maisons historiques du XVIIIe siècle dans la vieille ville médiévale de Réthymnon, et une résidence près du port.",
    },
    nl: {
      t: "Het verhaal",
      d: "Ink is genoemd naar een drukpers. Vanuit dit gebouw verscheen de krant ΑΓΩΝ — Strijd. Het middelste huis was het gastenverblijf van de Universiteit van Kreta. Twee historische huizen uit de 18e eeuw in de middeleeuwse oude stad van Rethymno, en een residentie bij de haven.",
    },
  },

  rethymno: {
    en: {
      t: "Rethymno",
      d: "The old town, the Venetian harbour, the Fortezza, the beaches, the food and the mountains behind — what a week in Rethymno actually looks like, from a hotel inside the medieval quarter.",
    },
    el: {
      t: "Ρέθυμνο",
      d: "Η παλιά πόλη, το ενετικό λιμάνι, η Φορτέτζα, οι παραλίες, το φαγητό και τα βουνά πίσω — πώς είναι πραγματικά μια εβδομάδα στο Ρέθυμνο, από ένα ξενοδοχείο μέσα στη μεσαιωνική συνοικία.",
    },
    de: {
      t: "Rethymno",
      d: "Die Altstadt, der venezianische Hafen, die Fortezza, die Strände, das Essen und die Berge dahinter — wie eine Woche in Rethymno wirklich aussieht, aus einem Hotel mitten im mittelalterlichen Viertel.",
    },
    fr: {
      t: "Réthymnon",
      d: "La vieille ville, le port vénitien, la Fortezza, les plages, la cuisine et les montagnes derrière — à quoi ressemble vraiment une semaine à Réthymnon, depuis un hôtel au cœur du quartier médiéval.",
    },
    nl: {
      t: "Rethymno",
      d: "De oude stad, de Venetiaanse haven, de Fortezza, de stranden, het eten en de bergen daarachter — hoe een week in Rethymno er werkelijk uitziet, vanuit een hotel midden in de middeleeuwse wijk.",
    },
  },

  arrival: {
    en: {
      t: "Arrival",
      d: "Ink Hotels occupies two buildings in the old town of Rethymno, and a residence by the harbour. You arrive at one door — House of Europe, the first building, at Nikolaou Plastira 4 — where somebody is expecting you and walks you to your room. Reception is open until 23:00.",
    },
    el: {
      t: "Άφιξη",
      d: "Το Ink Hotels καταλαμβάνει δύο κτίρια στην παλιά πόλη του Ρεθύμνου, και μια κατοικία δίπλα στο λιμάνι. Φτάνετε σε μία πόρτα — στο House of Europe, το πρώτο κτίριο, Νικολάου Πλαστήρα 4 — όπου κάποιος σας περιμένει και σας συνοδεύει ως το δωμάτιό σας. Η ρεσεψιόν είναι ανοιχτή έως τις 23:00.",
    },
    de: {
      t: "Anreise",
      d: "Ink Hotels belegt zwei Gebäude in der Altstadt von Rethymno und eine Residenz am Hafen. Sie kommen zu einer Tür — House of Europe, dem ersten Gebäude, Nikolaou Plastira 4 — wo Sie jemand erwartet und zu Ihrem Zimmer bringt. Die Rezeption ist bis 23:00 Uhr geöffnet.",
    },
    fr: {
      t: "Arrivée",
      d: "Ink Hotels occupe deux bâtiments dans la vieille ville de Réthymnon, plus une résidence près du port. Vous arrivez à une seule porte — House of Europe, le premier bâtiment, au 4 rue Nikolaou Plastira — où quelqu'un vous attend et vous accompagne jusqu'à votre chambre. La réception est ouverte jusqu'à 23h00.",
    },
    nl: {
      t: "Aankomst",
      d: "Ink Hotels beslaat twee gebouwen in de oude stad van Rethymno, plus een residentie bij de haven. U komt aan bij één deur — House of Europe, het eerste gebouw, Nikolaou Plastira 4 — waar iemand u opwacht en naar uw kamer brengt. De receptie is open tot 23.00 uur.",
    },
  },

  location: {
    en: {
      t: "Location",
      d: "Ink Hotels sits inside the medieval old town of Rethymno, Crete — a few minutes from the Venetian harbour and under the Fortezza. Two buildings and a residence: addresses, coordinates and directions.",
    },
    el: {
      t: "Τοποθεσία",
      d: "Το Ink Hotels βρίσκεται μέσα στη μεσαιωνική παλιά πόλη του Ρεθύμνου — λίγα λεπτά από το ενετικό λιμάνι και κάτω από τη Φορτέτζα. Δύο κτίρια και μία κατοικία: διευθύνσεις, συντεταγμένες και οδηγίες.",
    },
    de: {
      t: "Lage",
      d: "Ink Hotels liegt mitten in der mittelalterlichen Altstadt von Rethymno auf Kreta — wenige Minuten vom venezianischen Hafen und unterhalb der Fortezza. Zwei Gebäude und eine Residenz: Adressen, Koordinaten und Anfahrt.",
    },
    fr: {
      t: "Situation",
      d: "Ink Hotels se trouve au cœur de la vieille ville médiévale de Réthymnon, en Crète — à quelques minutes du port vénitien et sous la Fortezza. Deux bâtiments et une résidence : adresses, coordonnées et itinéraires.",
    },
    nl: {
      t: "Ligging",
      d: "Ink Hotels ligt midden in de middeleeuwse oude stad van Rethymno, Kreta — een paar minuten van de Venetiaanse haven en onder de Fortezza. Twee gebouwen en een residentie: adressen, coördinaten en routes.",
    },
  },

  contact: {
    en: {
      t: "Contact",
      d: "Write to Ink Hotels in the old town of Rethymno, Crete, or call {phone} (ext. {ext}). Reception is open until {time}. We answer in English, Greek, Dutch and French.",
    },
    el: {
      t: "Επικοινωνία",
      d: "Γράψτε στο Ink Hotels στην παλιά πόλη του Ρεθύμνου, ή τηλεφωνήστε στο {phone} (εσωτ. {ext}). Η ρεσεψιόν είναι ανοιχτή έως τις {time}. Απαντάμε στα αγγλικά, ελληνικά, ολλανδικά και γαλλικά.",
    },
    de: {
      t: "Kontakt",
      d: "Schreiben Sie an Ink Hotels in der Altstadt von Rethymno, Kreta, oder rufen Sie {phone} (Durchwahl {ext}) an. Die Rezeption ist bis {time} geöffnet. Wir antworten auf Englisch, Griechisch, Niederländisch und Französisch.",
    },
    fr: {
      t: "Contact",
      d: "Écrivez à Ink Hotels dans la vieille ville de Réthymnon, en Crète, ou appelez le {phone} (poste {ext}). La réception est ouverte jusqu'à {time}. Nous répondons en anglais, grec, néerlandais et français.",
    },
    nl: {
      t: "Contact",
      d: "Schrijf naar Ink Hotels in de oude stad van Rethymno, Kreta, of bel {phone} (toestel {ext}). De receptie is open tot {time}. Wij antwoorden in het Engels, Grieks, Nederlands en Frans.",
    },
  },

  faq: {
    en: {
      t: "Frequently asked",
      d: "Breakfast, parking, noise, accessibility, pets, languages and how to reach Ink Hotels in the old town of Rethymno — answered plainly.",
    },
    el: {
      t: "Συχνές ερωτήσεις",
      d: "Πρωινό, πάρκινγκ, θόρυβος, προσβασιμότητα, κατοικίδια, γλώσσες και πώς φτάνετε στο Ink Hotels στην παλιά πόλη του Ρεθύμνου — απαντημένα απλά.",
    },
    de: {
      t: "Häufige Fragen",
      d: "Frühstück, Parken, Lärm, Barrierefreiheit, Haustiere, Sprachen und wie Sie das Ink Hotels in der Altstadt von Rethymno erreichen — schlicht beantwortet.",
    },
    fr: {
      t: "Questions fréquentes",
      d: "Petit-déjeuner, stationnement, bruit, accessibilité, animaux, langues et comment rejoindre Ink Hotels dans la vieille ville de Réthymnon — répondu simplement.",
    },
    nl: {
      t: "Veelgestelde vragen",
      d: "Ontbijt, parkeren, geluid, toegankelijkheid, huisdieren, talen en hoe u Ink Hotels in de oude stad van Rethymno bereikt — eenvoudig beantwoord.",
    },
  },

  accessibility: {
    en: {
      t: "Accessibility",
      d: "The suite Agapi at Ink Hotels was designed for wheelchair users: step-free private entrance, walk-in shower, toilet with grab rails, thirty square metres on the ground floor in the old town of Rethymno.",
    },
    el: {
      t: "Προσβασιμότητα",
      d: "Η σουίτα Agapi στο Ink Hotels σχεδιάστηκε για χρήστες αναπηρικού αμαξιδίου: ιδιωτική είσοδος χωρίς σκαλιά, ντους χωρίς κατώφλι, τουαλέτα με χειρολαβές, τριάντα τετραγωνικά στο ισόγειο, στην παλιά πόλη του Ρεθύμνου.",
    },
    de: {
      t: "Barrierefreiheit",
      d: "Die Suite Agapi im Ink Hotels wurde für Rollstuhlfahrer entworfen: stufenloser eigener Eingang, ebenerdige Dusche, WC mit Haltegriffen, dreißig Quadratmeter im Erdgeschoss, in der Altstadt von Rethymno.",
    },
    fr: {
      t: "Accessibilité",
      d: "La suite Agapi d'Ink Hotels a été conçue pour les utilisateurs de fauteuil roulant : entrée privée de plain-pied, douche à l'italienne, toilettes avec barres d'appui, trente mètres carrés au rez-de-chaussée, dans la vieille ville de Réthymnon.",
    },
    nl: {
      t: "Toegankelijkheid",
      d: "De suite Agapi in Ink Hotels is ontworpen voor rolstoelgebruikers: drempelloze eigen ingang, inloopdouche, toilet met steunbeugels, dertig vierkante meter op de begane grond, in de oude stad van Rethymno.",
    },
  },

  careers: {
    en: {
      t: "Careers",
      d: "Become one of us. Ink Hotels in Rethymno, Crete — a team that shares more than the same employer.",
    },
    el: {
      t: "Καριέρα",
      d: "Γίνετε ένας από εμάς. Ink Hotels στο Ρέθυμνο — μια ομάδα που μοιράζεται περισσότερα από τον ίδιο εργοδότη.",
    },
    de: {
      t: "Karriere",
      d: "Werden Sie einer von uns. Ink Hotels in Rethymno, Kreta — ein Team, das mehr teilt als denselben Arbeitgeber.",
    },
    fr: {
      t: "Carrières",
      d: "Devenez l'un des nôtres. Ink Hotels à Réthymnon, en Crète — une équipe qui partage plus que le même employeur.",
    },
    nl: {
      t: "Werken bij ons",
      d: "Word een van ons. Ink Hotels in Rethymno, Kreta — een team dat meer deelt dan dezelfde werkgever.",
    },
  },

  privacy: {
    en: {
      t: "Privacy policy",
      d: "What personal data Ink Hotels collects, why, how long it is kept, and your rights under the GDPR.",
    },
    el: {
      t: "Πολιτική απορρήτου",
      d: "Ποια προσωπικά δεδομένα συλλέγει το Ink Hotels, γιατί, για πόσο διατηρούνται, και τα δικαιώματά σας βάσει του GDPR.",
    },
    de: {
      t: "Datenschutzerklärung",
      d: "Welche personenbezogenen Daten Ink Hotels erhebt, warum, wie lange sie gespeichert werden, und Ihre Rechte nach der DSGVO.",
    },
    fr: {
      t: "Politique de confidentialité",
      d: "Quelles données personnelles Ink Hotels collecte, pourquoi, combien de temps elles sont conservées, et vos droits au titre du RGPD.",
    },
    nl: {
      t: "Privacybeleid",
      d: "Welke persoonsgegevens Ink Hotels verzamelt, waarom, hoe lang ze worden bewaard, en uw rechten onder de AVG.",
    },
  },

  terms: {
    en: {
      t: "Terms of use",
      d: "Terms of use for the Ink Hotels website and for reservations made through it.",
    },
    el: {
      t: "Όροι χρήσης",
      d: "Όροι χρήσης για τον ιστότοπο του Ink Hotels και για τις κρατήσεις που γίνονται μέσω αυτού.",
    },
    de: {
      t: "Nutzungsbedingungen",
      d: "Nutzungsbedingungen für die Website von Ink Hotels und für darüber vorgenommene Reservierungen.",
    },
    fr: {
      t: "Conditions d'utilisation",
      d: "Conditions d'utilisation du site d'Ink Hotels et des réservations effectuées par son intermédiaire.",
    },
    nl: {
      t: "Gebruiksvoorwaarden",
      d: "Gebruiksvoorwaarden voor de website van Ink Hotels en voor reserveringen die daarvia worden gemaakt.",
    },
  },
};

const q = (s) => JSON.stringify(s);

for (const locale of ["en", "el", "de", "fr", "nl"]) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");

  if (src.includes("\n  pageMeta: {")) {
    console.log(`${locale}: pageMeta already present — skipped`);
    continue;
  }

  const body = Object.entries(META)
    .map(([key, v]) => `    ${key}: { t: ${q(v[locale].t)}, d: ${q(v[locale].d)} },`)
    .join("\n");

  const anchor = src.indexOf("\n} as const;");
  if (anchor === -1) throw new Error(`${locale}: no object terminator`);

  src =
    src.slice(0, anchor) +
    `\n\n  /* Page <title> and <meta description>, per route.\n     hreflang already pointed Google at all five versions; without these it\n     followed the pointer and found an English title on a German page.\n     \`{phone}\`, \`{ext}\`, \`{time}\` and \`{count}\` are filled at render from\n     content/site.ts, which stays the record of those facts. */\n  pageMeta: {\n${body}\n  },` +
    src.slice(anchor);

  writeFileSync(file, src);
  console.log(`${locale}: pageMeta +${Object.keys(META).length} routes`);
}
