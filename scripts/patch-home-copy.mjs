/**
 * Translate the four homepage movements that were still assembling English in
 * JSX: the setting, the arrangements, Agapi, and the family.
 *
 * These are long-form editorial paragraphs, so they go into the message
 * catalogues rather than the content overlay — the overlay carries facts that a
 * member of staff may edit in Sanity, and this is authored voice.
 *
 * The Crete Holiday Home paragraph is written out per language rather than
 * interpolating `contact.group.descriptor` and `.promise`. Those two are the
 * company's own English words; splicing them into a Greek sentence produced a
 * half-English clause in the middle of the trust section — the one paragraph on
 * the page whose whole job is sounding like a person rather than a template.
 *
 * Run: node scripts/patch-home-copy.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const KEYS = {
  /* ── The setting ────────────────────────────────────────────────────── */
  settingEyebrow: {
    en: "The setting",
    el: "Το σκηνικό",
    de: "Der Ort",
    fr: "Le cadre",
    nl: "De omgeving",
  },
  settingTitle: {
    en: "Under the shadow of the Fortezza",
    el: "Στη σκιά της Φορτέτζας",
    de: "Im Schatten der Fortezza",
    fr: "À l'ombre de la Fortezza",
    nl: "In de schaduw van de Fortezza",
  },
  settingP1: {
    en: "Ink sits beneath the Fortezza — the fortress the pirate Barbarossa once invaded — and a few steps from the sea and the medieval Venetian port, where merchants traded goods from all over the world.",
    el: "Το Ink βρίσκεται κάτω από τη Φορτέτζα — το φρούριο που κάποτε λεηλάτησε ο πειρατής Μπαρμπαρόσα — και λίγα βήματα από τη θάλασσα και το μεσαιωνικό ενετικό λιμάνι, όπου έμποροι αντάλλασσαν αγαθά από όλο τον κόσμο.",
    de: "Ink liegt unterhalb der Fortezza — der Festung, in die einst der Pirat Barbarossa eindrang — und wenige Schritte vom Meer und vom mittelalterlichen venezianischen Hafen entfernt, wo Händler Waren aus aller Welt umschlugen.",
    fr: "Ink se trouve au pied de la Fortezza — la forteresse que le pirate Barberousse a jadis envahie — et à quelques pas de la mer et du port vénitien médiéval, où les marchands échangeaient des marchandises venues du monde entier.",
    nl: "Ink ligt onder de Fortezza — het fort waar de piraat Barbarossa ooit binnenviel — en op een paar passen van de zee en de middeleeuwse Venetiaanse haven, waar kooplieden goederen uit de hele wereld verhandelden.",
  },
  settingP2: {
    en: "Walk the streets around Ink and you find the alleys knights once rode through, small local luncheonettes with good food, and a quarter that stays alive well after dark.",
    el: "Περπατήστε στους δρόμους γύρω από το Ink και θα βρείτε τα σοκάκια απ' όπου περνούσαν κάποτε ιππότες, μικρά τοπικά μαγειρεία με καλό φαγητό, και μια συνοικία που μένει ζωντανή πολύ μετά το σούρουπο.",
    de: "Gehen Sie durch die Straßen rund um Ink, und Sie finden die Gassen, durch die einst Ritter ritten, kleine einheimische Imbisse mit gutem Essen und ein Viertel, das noch lange nach Einbruch der Dunkelheit lebendig bleibt.",
    fr: "Parcourez les rues autour d'Ink et vous trouverez les ruelles où passaient jadis les chevaliers, de petites gargotes locales à la bonne cuisine, et un quartier qui reste vivant bien après la tombée de la nuit.",
    nl: "Loop door de straten rond Ink en u vindt de steegjes waar ooit ridders doorheen reden, kleine plaatselijke eethuisjes met goed eten, en een wijk die nog lang na donker levendig blijft.",
  },
  settingCaptionLanes: {
    en: "The lanes, four minutes from the door",
    el: "Τα σοκάκια, τέσσερα λεπτά από την πόρτα",
    de: "Die Gassen, vier Minuten von der Tür",
    fr: "Les ruelles, à quatre minutes de la porte",
    nl: "De steegjes, vier minuten van de deur",
  },
  settingCaptionHarbour: {
    en: "The Venetian harbour and its lighthouse",
    el: "Το ενετικό λιμάνι και ο φάρος του",
    de: "Der venezianische Hafen und sein Leuchtturm",
    fr: "Le port vénitien et son phare",
    nl: "De Venetiaanse haven en haar vuurtoren",
  },

  /* ── The arrangements ───────────────────────────────────────────────── */
  arrangeEyebrow: {
    en: "The art of staying",
    el: "Η τέχνη της διαμονής",
    de: "Die Kunst des Bleibens",
    fr: "L'art du séjour",
    nl: "De kunst van het verblijven",
  },
  arrangeTitle: {
    en: "Anyone can sell you a room",
    el: "Δωμάτιο μπορεί να σας πουλήσει ο καθένας",
    de: "Ein Zimmer kann Ihnen jeder verkaufen",
    fr: "N'importe qui peut vous vendre une chambre",
    nl: "Een kamer kan iedereen u verkopen",
  },
  arrangeLede: {
    en: "The difference is the hours you spend outside it. Twenty-one arrangements — a boat of your own, a chef in the room, a morning nobody else knows about.",
    el: "Η διαφορά είναι οι ώρες που περνάτε έξω από αυτό. Είκοσι ένα πράγματα που κανονίζουμε — ένα σκάφος δικό σας, ένας σεφ στο δωμάτιο, ένα πρωινό που δεν το ξέρει κανείς άλλος.",
    de: "Der Unterschied sind die Stunden, die Sie außerhalb davon verbringen. Einundzwanzig Arrangements — ein eigenes Boot, ein Koch im Zimmer, ein Morgen, von dem sonst niemand weiß.",
    fr: "La différence, ce sont les heures passées en dehors. Vingt et un arrangements — un bateau à vous, un chef dans la chambre, un matin que personne d'autre ne connaît.",
    nl: "Het verschil zijn de uren die u erbuiten doorbrengt. Eenentwintig arrangementen — een eigen boot, een kok op de kamer, een ochtend waar niemand anders van weet.",
  },

  /* ── Agapi ──────────────────────────────────────────────────────────── */
  agapiMeaning: {
    en: "— love",
    el: "— αγάπη",
    de: "— Liebe",
    fr: "— amour",
    nl: "— liefde",
  },
  agapiTitle: {
    en: "A suite designed so the door is never the problem",
    el: "Μια σουίτα σχεδιασμένη ώστε η πόρτα να μην είναι ποτέ το πρόβλημα",
    de: "Eine Suite, bei der die Tür nie das Problem ist",
    fr: "Une suite conçue pour que la porte ne soit jamais le problème",
    nl: "Een suite waarbij de deur nooit het probleem is",
  },
  agapiP1: {
    en: "Agapi is named for the care invested in its design, particularly for people with special needs. It is on the ground floor, with a private entrance from the side street. The bathroom is built to the standards of safe and comfortable hygiene care, for wheelchair users.",
    el: "Η Agapi πήρε το όνομά της από τη φροντίδα που επενδύθηκε στον σχεδιασμό της, ιδίως για ανθρώπους με ειδικές ανάγκες. Βρίσκεται στο ισόγειο, με ιδιωτική είσοδο από τον παράδρομο. Το μπάνιο είναι φτιαγμένο με τις προδιαγραφές ασφαλούς και άνετης φροντίδας υγιεινής, για χρήστες αναπηρικού αμαξιδίου.",
    de: "Agapi ist nach der Sorgfalt benannt, die in ihre Gestaltung geflossen ist, insbesondere für Menschen mit besonderen Bedürfnissen. Sie liegt im Erdgeschoss und hat einen eigenen Eingang von der Seitenstraße. Das Bad ist nach den Standards sicherer und komfortabler Hygienepflege für Rollstuhlfahrer gebaut.",
    fr: "Agapi doit son nom au soin investi dans sa conception, en particulier pour les personnes à besoins spécifiques. Elle est au rez-de-chaussée, avec une entrée privée depuis la rue latérale. La salle de bains est construite selon les normes d'une hygiène sûre et confortable, pour les utilisateurs de fauteuil roulant.",
    nl: "Agapi is genoemd naar de zorg die in het ontwerp is gestoken, in het bijzonder voor mensen met een beperking. De suite ligt op de begane grond, met een eigen ingang aan de zijstraat. De badkamer is gebouwd volgens de normen voor veilige en comfortabele hygiënezorg, voor rolstoelgebruikers.",
  },
  agapiP2: {
    en: "Thirty square metres, marble floors, a Coco-Mat mattress, and a serene inner courtyard with a picturesque old well — the kind of place a Cretan neighbourhood has always sat outside in.",
    el: "Τριάντα τετραγωνικά μέτρα, μαρμάρινα δάπεδα, στρώμα Coco-Mat, και μια γαλήνια εσωτερική αυλή με ένα γραφικό παλιό πηγάδι — από εκείνα τα μέρη όπου μια κρητική γειτονιά πάντα καθόταν έξω.",
    de: "Dreißig Quadratmeter, Marmorböden, eine Coco-Mat-Matratze und ein stiller Innenhof mit einem malerischen alten Brunnen — die Art von Ort, an dem eine kretische Nachbarschaft schon immer draußen gesessen hat.",
    fr: "Trente mètres carrés, sols en marbre, un matelas Coco-Mat, et une cour intérieure paisible avec un vieux puits pittoresque — le genre d'endroit où un quartier crétois s'est toujours assis dehors.",
    nl: "Dertig vierkante meter, marmeren vloeren, een Coco-Mat-matras, en een serene binnenplaats met een schilderachtige oude put — precies het soort plek waar een Kretenzische buurt altijd al buiten zat.",
  },
  agapiFeatureEntrance: {
    en: "Step-free private entrance",
    el: "Ιδιωτική είσοδος χωρίς σκαλιά",
    de: "Stufenloser eigener Eingang",
    fr: "Entrée privée de plain-pied",
    nl: "Drempelloze eigen ingang",
  },
  agapiFeatureShower: {
    en: "Walk-in shower",
    el: "Ντους χωρίς κατώφλι",
    de: "Ebenerdige Dusche",
    fr: "Douche à l'italienne",
    nl: "Inloopdouche",
  },
  agapiFeatureRails: {
    en: "Toilet with grab rails",
    el: "Τουαλέτα με χειρολαβές",
    de: "WC mit Haltegriffen",
    fr: "Toilettes avec barres d'appui",
    nl: "Toilet met steunbeugels",
  },
  agapiFeatureGround: {
    en: "Ground floor throughout",
    el: "Όλα στο ισόγειο",
    de: "Durchgehend im Erdgeschoss",
    fr: "Tout de plain-pied au rez-de-chaussée",
    nl: "Volledig op de begane grond",
  },

  /* ── The family ─────────────────────────────────────────────────────── */
  familyTitle: {
    en: "A family, not a chain",
    el: "Μια οικογένεια, όχι μια αλυσίδα",
    de: "Eine Familie, keine Kette",
    fr: "Une famille, pas une chaîne",
    nl: "Een familie, geen keten",
  },
  familyP1: {
    en: "Ink is run by Crete Holiday Home — a family-owned boutique hotel & villas company that has been letting rooms, houses and villas along this coast for years. Their promise is authentic Greek hospitality and the ultimate in simple, effortless charm, and it is the reason the desk here can answer questions a front desk usually cannot.",
    el: "Το Ink το κρατά η Crete Holiday Home — μια οικογενειακή εταιρεία boutique ξενοδοχείων και βιλών που νοικιάζει δωμάτια, σπίτια και βίλες σε αυτή την ακτή εδώ και χρόνια. Η υπόσχεσή τους είναι αυθεντική ελληνική φιλοξενία και η απόλυτη, αβίαστη απλότητα — και είναι ο λόγος που η ρεσεψιόν εδώ απαντά σε ερωτήσεις που μια ρεσεψιόν συνήθως δεν απαντά.",
    de: "Ink wird von Crete Holiday Home geführt — einem familiengeführten Unternehmen für Boutiquehotels und Villen, das seit Jahren Zimmer, Häuser und Villen an dieser Küste vermietet. Ihr Versprechen ist authentische griechische Gastfreundschaft und ein Höchstmaß an schlichtem, mühelosem Charme — und genau deshalb kann man hier an der Rezeption Fragen beantworten, die eine Rezeption sonst nicht beantworten kann.",
    fr: "Ink est dirigé par Crete Holiday Home — une entreprise familiale d'hôtels de charme et de villas qui loue des chambres, des maisons et des villas sur cette côte depuis des années. Leur promesse, c'est une hospitalité grecque authentique et le comble du charme simple et sans effort — et c'est la raison pour laquelle la réception ici sait répondre à des questions auxquelles une réception ne sait généralement pas répondre.",
    nl: "Ink wordt gerund door Crete Holiday Home — een familiebedrijf in boutiquehotels en villa's dat al jaren kamers, huizen en villa's aan deze kust verhuurt. Hun belofte is authentieke Griekse gastvrijheid en het toppunt van eenvoudige, moeiteloze charme — en daarom kan de receptie hier vragen beantwoorden die een receptie doorgaans niet kan beantwoorden.",
  },
  familyP2: {
    en: "Which beach is empty on a Sunday in August. Which taverna is still worth it in February. Which lane floods after rain. That knowledge is not in any guidebook, and it is the actual difference between a room and a stay.",
    el: "Ποια παραλία είναι άδεια μια Κυριακή του Αυγούστου. Ποια ταβέρνα αξίζει ακόμη τον Φεβρουάριο. Ποιο σοκάκι πλημμυρίζει μετά τη βροχή. Αυτή η γνώση δεν υπάρχει σε κανέναν ταξιδιωτικό οδηγό, και είναι η πραγματική διαφορά ανάμεσα σε ένα δωμάτιο και μια διαμονή.",
    de: "Welcher Strand an einem Sonntag im August leer ist. Welche Taverne sich auch im Februar noch lohnt. Welche Gasse nach Regen überschwemmt wird. Dieses Wissen steht in keinem Reiseführer, und es ist der eigentliche Unterschied zwischen einem Zimmer und einem Aufenthalt.",
    fr: "Quelle plage est vide un dimanche d'août. Quelle taverne vaut encore le détour en février. Quelle ruelle est inondée après la pluie. Ce savoir n'est dans aucun guide, et c'est la vraie différence entre une chambre et un séjour.",
    nl: "Welk strand leeg is op een zondag in augustus. Welke taverne in februari nog de moeite waard is. Welk steegje na regen onderloopt. Die kennis staat in geen enkele reisgids, en dat is het echte verschil tussen een kamer en een verblijf.",
  },
  familyProofVillasTerm: {
    en: "Villas & hotels",
    el: "Βίλες και ξενοδοχεία",
    de: "Villen & Hotels",
    fr: "Villas et hôtels",
    nl: "Villa's en hotels",
  },
  familyProofVillasBody: {
    en: "Thalasses Villas, Villa Thetis, Villa Ikaros, Casa Vitae and a dozen more along this coast — the same family, the same standards.",
    el: "Thalasses Villas, Villa Thetis, Villa Ikaros, Casa Vitae και άλλες δώδεκα σε αυτή την ακτή — η ίδια οικογένεια, οι ίδιες προδιαγραφές.",
    de: "Thalasses Villas, Villa Thetis, Villa Ikaros, Casa Vitae und ein Dutzend weitere an dieser Küste — dieselbe Familie, dieselben Maßstäbe.",
    fr: "Thalasses Villas, Villa Thetis, Villa Ikaros, Casa Vitae et une douzaine d'autres sur cette côte — la même famille, les mêmes exigences.",
    nl: "Thalasses Villas, Villa Thetis, Villa Ikaros, Casa Vitae en een dozijn andere aan deze kust — dezelfde familie, dezelfde maatstaven.",
  },
  familyProofOfficesTerm: {
    en: "Three offices",
    el: "Τρία γραφεία",
    de: "Drei Büros",
    fr: "Trois bureaux",
    nl: "Drie kantoren",
  },
  familyProofOfficesBody: {
    en: "Rethymno, Heraklion and Athens.",
    el: "Ρέθυμνο, Ηράκλειο και Αθήνα.",
    de: "Rethymno, Heraklion und Athen.",
    fr: "Réthymnon, Héraklion et Athènes.",
    nl: "Rethymno, Heraklion en Athene.",
  },
  familyProofLocalTerm: {
    en: "Local, not chain",
    el: "Ντόπιοι, όχι αλυσίδα",
    de: "Lokal, keine Kette",
    fr: "Local, pas une chaîne",
    nl: "Lokaal, geen keten",
  },
  familyProofLocalBody: {
    en: "Nobody here is following a brand manual. The advice you get at the desk is the advice they would give a friend.",
    el: "Κανείς εδώ δεν ακολουθεί εγχειρίδιο μάρκας. Η συμβουλή που παίρνετε στη ρεσεψιόν είναι η συμβουλή που θα έδιναν σε φίλο.",
    de: "Hier folgt niemand einem Markenhandbuch. Der Rat, den Sie an der Rezeption bekommen, ist der Rat, den man einem Freund geben würde.",
    fr: "Personne ici ne suit un manuel de marque. Le conseil qu'on vous donne à la réception est celui qu'on donnerait à un ami.",
    nl: "Niemand hier volgt een merkhandboek. Het advies dat u aan de balie krijgt, is het advies dat ze een vriend zouden geven.",
  },
};

const q = (s) => JSON.stringify(s);

for (const locale of ["en", "el", "de", "fr", "nl"]) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  const groupAt = src.indexOf("  home: {");
  if (groupAt === -1) throw new Error(`${locale}: no home group`);
  const groupEnd = src.indexOf("\n  },", groupAt);
  const existing = src.slice(groupAt, groupEnd);

  const lines = [];
  for (const [key, values] of Object.entries(KEYS)) {
    if (new RegExp(`\\b${key}:`).test(existing)) continue;
    lines.push(`    ${key}: ${q(values[locale])},`);
  }

  if (!lines.length) {
    console.log(`${locale}: no change`);
    continue;
  }
  src = src.slice(0, groupEnd) + "\n" + lines.join("\n") + src.slice(groupEnd);
  writeFileSync(file, src);
  console.log(`${locale}: home +${lines.length}`);
}
