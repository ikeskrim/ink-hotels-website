/**
 * Translate the content added in this pass: the car, the transfers, the gorge,
 * the town beach, and the two Rethymno chapters whose text changed underneath
 * their overlays.
 *
 *   node scripts/patch-new-content.mjs
 *
 * The overlay falls back FIELD BY FIELD, which is the trap here: an English
 * paragraph added to a two-paragraph body does not appear in the four other
 * languages, it is silently dropped, because the translated array still has
 * one entry and `pick` prefers it. So anything whose shape changed is
 * rewritten, not just the wholly new entries.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const EXPERIENCES = {
  el: {
    "kourtaliotiko-gorge": {
      title: "Φαράγγι Κουρταλιώτικο",
      summary:
        "Μια μέρα στο φαράγγι που κατεβαίνει στον Πρέβελη — με τη Routes, την εταιρεία εκδρομών της οικογένειας.",
      body: [
        "Το Κουρταλιώτικο φαράγγι κόβει νότια τα βουνά πίσω από το Ρέθυμνο και βγαίνει στον Πρέβελη, εκεί όπου ένα ποτάμι με φοίνικες συναντά τη θάλασσα. Κάθετος βράχος εκατέρωθεν, καταρράκτες στο τέλος μιας μακριάς σκάλας, και ένα εκκλησάκι σκαλισμένο στον γκρεμό.",
        "Είναι εκδρομή ημέρας, όχι περίπατος: η διαδρομή ως εκεί, η κατάβαση, το νερό, και η παραλία στο τέλος. Το κανονίζουμε με τη Routes — τη δική μας εταιρεία εκδρομών — ώστε ο συνοδός να είναι κάποιος που η ρεσεψιόν ξέρει με το όνομά του.",
      ],
    },
    "rent-a-car": {
      title: "Ένα αυτοκίνητο από τη συλλογή μας",
      summary:
        "Ένα Fiat 500 Cabrio, δικό μας και όχι κάποιας εταιρείας ενοικίασης — για τις μέρες που το νησί είναι ο λόγος.",
      body: [
        "Οι επισκέπτες μπορούν να νοικιάσουν ένα Fiat 500 Cabrio από τη δική μας συλλογή. Δεν είναι κράτηση που προωθείται σε εταιρεία ενοικίασης στο αεροδρόμιο: το αυτοκίνητο είναι δικό μας, βρίσκεται εδώ όταν φτάνετε, και τα χαρτιά γίνονται στη ρεσεψιόν σε όσο χρόνο πίνετε έναν καφέ.",
        "Είναι το σωστό μέγεθος για αυτούς τους δρόμους. Τα σοκάκια πίσω από το Ρέθυμνο δεν φτιάχτηκαν για κάτι πλατύτερο, οι στροφές του βουνού ανταμείβουν κάτι μικρό και ελαφρύ, και με ανοιχτή οροφή η διαδρομή προς τον Πρέβελη ή προς το Αρκάδι παύει να είναι μετακίνηση.",
        "Πείτε μας τις μέρες που το θέλετε όταν κάνετε την κράτηση του δωματίου σας, και θα σας περιμένει.",
      ],
    },
    chauffeur: {
      title: "Μεταφορές από αεροδρόμιο και λιμάνι",
      summary: "Σας υποδεχόμαστε στα Χανιά, στο Ηράκλειο ή στο λιμάνι, και σας φέρνουμε.",
      body: [
        "Κανονίσατε τις διακοπές σας και δεν έχετε βρει πώς θα φτάσετε εδώ από το αεροδρόμιο ή το λιμάνι; Πείτε μας, και θα σας περιμένουμε στην άφιξη για να σας φέρουμε.",
        "Τα σοκάκια της παλιάς πόλης είναι στενά και κυρίως μονόδρομοι, και το House of Europe βρίσκεται μέσα σε αυτά. Το να σας αφήσουν με τις βαλίτσες στη σωστή γωνία αξίζει να κανονιστεί — είναι η διαφορά ανάμεσα στο να φτάνεις και στο να ψάχνεις.",
      ],
    },
    "organic-farm": {
      title: "Ο βιολογικός λαχανόκηπος",
      summary:
        "Ο λαχανόκηπος στις Thalasses Villas — φυτέψτε μαζί μας, και δοκιμάστε το στο πρωινό.",
      body: [
        "Ελάτε να ζήσετε μια μοναδική εμπειρία στον βιολογικό κήπο. Φυτέψτε μαζί μας, και δοκιμάστε φρέσκα βιολογικά λαχανικά στο καθημερινό σας πρωινό.",
        "Ο κήπος βρίσκεται στις Thalasses Villas, στην ακτή δυτικά από εδώ. Δεν είναι προμηθευτής από τον οποίο αγοράζουμε: είναι το κατάλυμα της ίδιας οικογένειας, με τους ίδιους ανθρώπους που κρατούν το Ink — γι' αυτό ό,τι μαζεύεται εκεί μπορεί να είναι στο τραπέζι του House of Europe το επόμενο πρωί.",
      ],
    },
  },
  de: {
    "kourtaliotiko-gorge": {
      title: "Kourtaliotiko-Schlucht",
      summary:
        "Ein Tag in der Schlucht, die nach Preveli hinunterführt — arrangiert mit Routes, dem Ausflugsunternehmen der Familie.",
      body: [
        "Die Kourtaliotiko-Schlucht schneidet nach Süden durch die Berge hinter Rethymno und endet bei Preveli, wo ein von Palmen gesäumter Fluss ins Meer mündet. Senkrechter Fels auf beiden Seiten, Wasserfälle am Fuß einer langen Treppe und eine in die Klippe geschlagene Kapelle.",
        "Es ist ein Tagesausflug, kein Spaziergang: die Fahrt hin, der Abstieg, das Wasser und der Strand am Ende. Wir arrangieren ihn mit Routes — dem eigenen Ausflugsunternehmen der Familie — damit der Führer jemand ist, den der Empfang beim Namen kennt.",
      ],
    },
    "rent-a-car": {
      title: "Ein Wagen aus unserer Sammlung",
      summary:
        "Ein Fiat 500 Cabrio, unserer statt der eines Mietschalters — für die Tage, an denen die Insel der Punkt ist.",
      body: [
        "Gäste können einen Fiat 500 Cabrio aus unserer eigenen Sammlung mieten. Es ist keine Buchung, die an eine Mietwagenfirma am Flughafen weitergereicht wird: der Wagen gehört uns, er steht bereit, wenn Sie ankommen, und die Formalitäten dauern an der Rezeption etwa so lange wie ein Kaffee.",
        "Er hat die richtige Größe für diese Straßen. Die Gassen hinter Rethymno wurden für nichts Breiteres angelegt, die Serpentinen in den Bergen belohnen etwas Kleines und Leichtes, und mit offenem Dach hört die Fahrt nach Preveli oder hinauf nach Arkadi auf, Transport zu sein.",
        "Sagen Sie uns bei der Zimmerbuchung, an welchen Tagen Sie ihn möchten, dann steht er bereit.",
      ],
    },
    chauffeur: {
      title: "Flughafen- und Hafentransfers",
      summary: "Empfang in Chania, Heraklion oder am Hafen — und hereingefahren.",
      body: [
        "Haben Sie Ihren Urlaub geplant und noch nicht geklärt, wie Sie vom Flughafen oder Hafen hierherkommen? Sagen Sie uns Bescheid, und wir warten bei der Ankunft auf Sie.",
        "Die Gassen der Altstadt sind eng und überwiegend Einbahnstraßen, und das House of Europe liegt mittendrin. Sich mit dem Gepäck an die richtige Ecke fahren zu lassen, lohnt die Absprache — es ist der Unterschied zwischen Ankommen und Suchen.",
      ],
    },
    "organic-farm": {
      title: "Der Biogarten",
      summary:
        "Der Gemüsegarten der Thalasses Villas — pflanzen Sie mit, und schmecken Sie es beim Frühstück.",
      body: [
        "Erleben Sie den biologischen Garten. Pflanzen Sie mit uns, und probieren Sie frisches Biogemüse in Ihrem täglichen Frühstück.",
        "Der Garten liegt bei den Thalasses Villas, an der Küste westlich von hier. Es ist kein Lieferant, bei dem wir einkaufen: es ist das Anwesen derselben Familie, geführt von denselben Menschen, die Ink führen — und darum kann, was dort geerntet wird, am nächsten Morgen im House of Europe auf dem Tisch stehen.",
      ],
    },
  },
  fr: {
    "kourtaliotiko-gorge": {
      title: "Les gorges de Kourtaliotiko",
      summary:
        "Une journée dans les gorges qui descendent vers Preveli — organisée avec Routes, la société d'excursions de la famille.",
      body: [
        "Les gorges de Kourtaliotiko traversent vers le sud les montagnes derrière Réthymnon et débouchent à Preveli, où une rivière bordée de palmiers rejoint la mer. De la roche à pic des deux côtés, des cascades au bas d'un long escalier, et une chapelle taillée dans la falaise.",
        "C'est une journée, pas une promenade : la route pour y aller, la descente, l'eau, et la plage au bout. Nous l'organisons avec Routes — la société d'excursions de la famille — pour que le guide soit quelqu'un que la réception connaît par son nom.",
      ],
    },
    "rent-a-car": {
      title: "Une voiture de notre collection",
      summary:
        "Une Fiat 500 Cabrio, la nôtre et non celle d'un loueur — pour les jours où l'île est le sujet.",
      body: [
        "Les clients peuvent louer une Fiat 500 Cabrio de notre propre collection. Ce n'est pas une réservation transmise à un loueur à l'aéroport : la voiture est à nous, elle est là à votre arrivée, et les papiers se règlent à la réception le temps d'un café.",
        "C'est la bonne taille pour ces routes. Les ruelles derrière Réthymnon n'ont pas été tracées pour plus large, les lacets de montagne récompensent ce qui est petit et léger, et capote baissée la route vers Preveli ou vers Arkadi cesse d'être un trajet.",
        "Dites-nous les jours où vous la voulez au moment de réserver votre chambre, et elle vous attendra.",
      ],
    },
    chauffeur: {
      title: "Transferts aéroport et port",
      summary: "Accueil à Chania, à Héraklion ou au port, puis conduits jusqu'ici.",
      body: [
        "Vous avez organisé vos vacances sans savoir comment venir depuis l'aéroport ou le port ? Dites-le-nous, et nous vous attendrons à l'arrivée pour vous conduire.",
        "Les ruelles de la vieille ville sont étroites et le plus souvent à sens unique, et House of Europe se trouve à l'intérieur. Être déposé au bon coin avec ses bagages vaut d'être organisé — c'est la différence entre arriver et chercher son chemin.",
      ],
    },
    "organic-farm": {
      title: "La ferme biologique",
      summary:
        "Le potager des Thalasses Villas — plantez avec nous, puis goûtez-le au petit-déjeuner.",
      body: [
        "Venez vivre une expérience unique au jardin biologique. Plantez avec nous, et goûtez des légumes bio frais à votre petit-déjeuner quotidien.",
        "Le jardin se trouve aux Thalasses Villas, sur la côte à l'ouest d'ici. Ce n'est pas un fournisseur auprès duquel nous achetons : c'est la propriété de la même famille, tenue par les mêmes personnes qui tiennent Ink — et c'est pourquoi ce qui y est cueilli peut être sur la table de House of Europe le lendemain matin.",
      ],
    },
  },
  nl: {
    "kourtaliotiko-gorge": {
      title: "De Kourtaliotiko-kloof",
      summary:
        "Een dag in de kloof die afdaalt naar Preveli — geregeld met Routes, het excursiebedrijf van de familie.",
      body: [
        "De Kourtaliotiko-kloof snijdt zuidwaarts door de bergen achter Rethymno en komt uit bij Preveli, waar een met palmen omzoomde rivier de zee bereikt. Steile rots aan weerszijden, watervallen onder aan een lange trap, en een kapel uitgehakt in de klif.",
        "Het is een dagtocht, geen wandeling: de rit erheen, de afdaling, het water, en het strand aan het eind. Wij regelen het met Routes — het eigen excursiebedrijf van de familie — zodat de gids iemand is die de receptie bij naam kent.",
      ],
    },
    "rent-a-car": {
      title: "Een auto uit onze collectie",
      summary:
        "Een Fiat 500 Cabrio, van ons en niet van een verhuurbalie — voor de dagen waarop het eiland het doel is.",
      body: [
        "Gasten kunnen een Fiat 500 Cabrio huren uit onze eigen collectie. Het is geen boeking die wordt doorgegeven aan een verhuurbedrijf op de luchthaven: de auto is van ons, hij staat er bij aankomst, en het papierwerk gebeurt aan de balie in de tijd die een koffie kost.",
        "Hij heeft het juiste formaat voor deze wegen. De stegen achter Rethymno zijn niet aangelegd voor iets breders, de haarspeldbochten in de bergen belonen iets kleins en lichts, en met het dak open is de rit naar Preveli of omhoog naar Arkadi geen vervoer meer.",
        "Laat ons bij het boeken van uw kamer weten welke dagen u hem wilt, en hij staat klaar.",
      ],
    },
    chauffeur: {
      title: "Transfers van luchthaven en haven",
      summary: "Opgehaald in Chania, Heraklion of bij de haven, en naar binnen gereden.",
      body: [
        "Hebt u uw vakantie geregeld maar nog niet uitgezocht hoe u hier vanaf de luchthaven of de haven komt? Laat het ons weten, dan staan wij bij aankomst klaar.",
        "De stegen van de oude stad zijn smal en meestal eenrichtingsverkeer, en House of Europe ligt er middenin. U met uw bagage op de juiste hoek laten afzetten is het regelen waard — het is het verschil tussen aankomen en zoeken.",
      ],
    },
    "organic-farm": {
      title: "De biologische tuin",
      summary:
        "De moestuin bij Thalasses Villas — plant met ons mee, en proef het bij het ontbijt.",
      body: [
        "Beleef iets bijzonders in de biologische tuin. Plant met ons mee, en proef verse biologische groenten bij uw dagelijkse ontbijt.",
        "De tuin ligt bij Thalasses Villas, aan de kust ten westen van hier. Het is geen leverancier waar wij inkopen: het is het pand van dezelfde familie, gerund door dezelfde mensen die Ink runnen — en daarom kan wat daar geoogst wordt de volgende ochtend op tafel staan in House of Europe.",
      ],
    },
  },
};

const PLACES = {
  el: {
    "town-beach": {
      name: "Η παραλία της πόλης",
      distance: "Λίγα λεπτά με τα πόδια",
      body: "Το πιο κοντινό μπάνιο είναι η παραλία της ίδιας της πόλης, που ξεκινά εκεί όπου τελειώνει η παλιά πόλη και τρέχει ανατολικά για χιλιόμετρα — άμμος, ρηχά νερά, και τόση έκταση ώστε ούτε ο Αύγουστος να τη γεμίζει. Είναι λίγα λεπτά με τα πόδια από την πόρτα, όχι διαδρομή με αυτοκίνητο: μπορείτε να πάτε πριν από το πρωινό και να γυρίσετε για αυτό.",
    },
  },
  de: {
    "town-beach": {
      name: "Der Stadtstrand",
      distance: "Wenige Minuten zu Fuß",
      body: "Das nächste Bad ist der Strand der Stadt selbst. Er beginnt dort, wo die Altstadt endet, und läuft kilometerweit nach Osten — Sand, flaches Wasser, und genug davon, dass ihn auch der August nie ganz füllt. Es sind wenige Minuten zu Fuß von der Tür, keine Fahrt: Sie können vor dem Frühstück hin und rechtzeitig zurück sein.",
    },
  },
  fr: {
    "town-beach": {
      name: "La plage de la ville",
      distance: "À quelques minutes à pied",
      body: "La baignade la plus proche est la plage de la ville elle-même : elle commence là où finit la vieille ville et court vers l'est sur des kilomètres — du sable, une eau peu profonde, et assez d'espace pour qu'août ne la remplisse jamais tout à fait. C'est à quelques minutes à pied de la porte, pas un trajet en voiture : on peut y aller avant le petit-déjeuner et rentrer pour lui.",
    },
  },
  nl: {
    "town-beach": {
      name: "Het stadsstrand",
      distance: "Een paar minuten lopen",
      body: "Het dichtstbijzijnde zwemwater is het strand van de stad zelf: het begint waar de oude stad ophoudt en loopt kilometers naar het oosten — zand, ondiep water, en zoveel ervan dat augustus het nooit helemaal vult. Het is een paar minuten lopen van de deur, geen ritje: u kunt vóór het ontbijt de zee in en op tijd terug zijn.",
    },
  },
};

/** Chapters whose English body changed shape underneath the overlay. */
const CHAPTERS = {
  el: {
    sea: [
      "Το πιο κοντινό μπάνιο είναι η παραλία της ίδιας της πόλης, λίγα λεπτά με τα πόδια από την πόρτα: ξεκινά εκεί όπου τελειώνει η παλιά πόλη και τρέχει ανατολικά για χιλιόμετρα — άμμος, ρηχά νερά, και τόση έκταση ώστε ούτε ο Αύγουστος να τη γεμίζει. Μπορείτε να είστε στη θάλασσα πριν από το πρωινό και πίσω για αυτό.",
      "Το καλύτερο κολύμπι είναι πιο έξω, σε όρμους που φτάνεις μόνο με βάρκα, και στη νότια ακτή όπου το νερό αλλάζει εντελώς χρώμα. Μια βάρκα μπορεί να ναυλωθεί ιδιωτικά για μια μέρα. Η ρεσεψιόν το κανονίζει.",
    ],
    inland: [
      "Είκοσι λεπτά στην ενδοχώρα και η ακτή παύει να μετράει. Ανοίγουν φαράγγια, χωριά κάθονται στο τέλος μονόδρομων, και τα βουνά ανεβαίνουν σε χιόνια που κρατούν ως τον Μάιο.",
      "Η Μονή Αρκαδίου είναι 23 χιλιόμετρα ανατολικά, χτισμένη στα 500 μέτρα σε ένα οροπέδιο με ελαιώνες, αμπέλια, πεύκα, κυπαρίσσια και βελανιδιές, με το φαράγγι του Αρκαδίου να ξεκινά από κάτω. Πιο πέρα, το Μουσείο Αρχαίας Ελεύθερνας — το πρώτο μουσείο στην Κρήτη χτισμένο μέσα σε αρχαιολογικό χώρο — κρατά όλη την ιστορία του τόπου, από το 3000 π.Χ. ως το 1300 μ.Χ.",
      "Νότια, το Κουρταλιώτικο φαράγγι κατεβαίνει στον Πρέβελη, όπου ένα ποτάμι με φοίνικες χύνεται στη θάλασσα. Αυτό είναι μέρα και όχι απόγευμα, και το κανονίζουμε με τη Routes, την εταιρεία εκδρομών της οικογένειας.",
    ],
  },
  de: {
    sea: [
      "Das nächste Bad ist der Strand der Stadt selbst, wenige Minuten zu Fuß von der Tür: er beginnt dort, wo die Altstadt endet, und läuft kilometerweit nach Osten — Sand, flaches Wasser, und genug davon, dass ihn auch der August nie ganz füllt. Sie können vor dem Frühstück im Meer sein und rechtzeitig zurück.",
      "Das bessere Schwimmen liegt weiter draußen, in Buchten, die nur mit dem Boot erreichbar sind, und an der Südküste, wo das Wasser die Farbe ganz wechselt. Ein Boot lässt sich für einen Tag privat nehmen. Der Empfang arrangiert es.",
    ],
    inland: [
      "Zwanzig Minuten landeinwärts hört die Küste auf, eine Rolle zu spielen. Schluchten öffnen sich, Dörfer sitzen am Ende einspuriger Straßen, und die Berge steigen zu Schnee auf, der bis in den Mai hält.",
      "Das Kloster Arkadi liegt 23 Kilometer östlich, auf 500 Metern auf einem Plateau aus Olivenhainen, Weinbergen, Pinien, Zypressen und Eichen, mit der Arkadi-Schlucht darunter. Weiter draußen trägt das Museum von Ancient Eleftherna — das erste Museum Kretas, das in einer Ausgrabungsstätte gebaut wurde — die ganze Geschichte des Ortes von 3000 v. Chr. bis 1300 n. Chr.",
      "Im Süden schneidet die Kourtaliotiko-Schlucht hinunter nach Preveli, wo ein von Palmen gesäumter Fluss ins Meer mündet. Das ist ein Tag und kein Nachmittag, und wir arrangieren es mit Routes, dem eigenen Ausflugsunternehmen der Familie.",
    ],
  },
  fr: {
    sea: [
      "La baignade la plus proche est la plage de la ville elle-même, à quelques minutes à pied de la porte : elle commence là où finit la vieille ville et court vers l'est sur des kilomètres — du sable, une eau peu profonde, et assez d'espace pour qu'août ne la remplisse jamais tout à fait. On peut être dans la mer avant le petit-déjeuner et rentrer pour lui.",
      "La meilleure baignade est plus loin, dans des criques accessibles seulement par bateau, et sur la côte sud où l'eau change entièrement de couleur. Un bateau peut être pris en privé pour la journée. La réception l'organise.",
    ],
    inland: [
      "À vingt minutes dans les terres, la côte cesse de compter. Des gorges s'ouvrent, des villages se tiennent au bout de routes uniques, et les montagnes montent vers des neiges qui durent jusqu'en mai.",
      "Le monastère d'Arkadi est à 23 kilomètres à l'est, bâti à 500 mètres sur un plateau d'oliviers, de vignes, de pins, de cyprès et de chênes, les gorges d'Arkadi commençant en contrebas. Plus loin, le musée d'Ancient Eleftherna — le premier musée de Crète construit à l'intérieur d'un site archéologique — porte toute l'histoire du lieu, de 3000 av. J.-C. à 1300 apr. J.-C.",
      "Au sud, les gorges de Kourtaliotiko descendent vers Preveli, où une rivière bordée de palmiers se jette dans la mer. Celles-là font une journée et non un après-midi, et nous les organisons avec Routes, la société d'excursions de la famille.",
    ],
  },
  nl: {
    sea: [
      "Het dichtstbijzijnde zwemwater is het strand van de stad zelf, een paar minuten lopen van de deur: het begint waar de oude stad ophoudt en loopt kilometers naar het oosten — zand, ondiep water, en zoveel ervan dat augustus het nooit helemaal vult. U kunt vóór het ontbijt in zee zijn en op tijd terug.",
      "Het betere zwemmen ligt verder weg, in baaien die alleen per boot bereikbaar zijn, en aan de zuidkust waar het water volledig van kleur verandert. Een boot kan voor een dag privé worden genomen. De receptie regelt het.",
    ],
    inland: [
      "Twintig minuten landinwaarts doet de kust er niet meer toe. Kloven openen zich, dorpen liggen aan het eind van eenbaanswegen, en de bergen lopen op naar sneeuw die tot in mei blijft liggen.",
      "Het klooster Arkadi ligt 23 kilometer naar het oosten, gebouwd op 500 meter op een plateau van olijfgaarden, wijngaarden, pijnbomen, cipressen en eiken, met de Arkadi-kloof die eronder begint. Verderop draagt het museum van Ancient Eleftherna — het eerste museum op Kreta dat binnen een archeologische vindplaats is gebouwd — de hele geschiedenis van de plek, van 3000 v.Chr. tot 1300 n.Chr.",
      "In het zuiden snijdt de Kourtaliotiko-kloof af naar Preveli, waar een met palmen omzoomde rivier in zee stroomt. Dat is een dag en geen middag, en wij regelen het met Routes, het excursiebedrijf van de familie.",
    ],
  },
};

const ind = (n) => " ".repeat(n);

function renderExperience(slug, e) {
  return (
    `${ind(4)}${JSON.stringify(slug)}: {\n` +
    `${ind(6)}title: ${JSON.stringify(e.title)},\n` +
    `${ind(6)}summary:\n${ind(8)}${JSON.stringify(e.summary)},\n` +
    `${ind(6)}body: [\n` +
    e.body.map((p) => `${ind(8)}${JSON.stringify(p)},\n`).join("") +
    `${ind(6)}],\n${ind(4)}},\n`
  );
}

function renderPlace(slug, p) {
  return (
    `${ind(4)}${JSON.stringify(slug)}: {\n` +
    `${ind(6)}name: ${JSON.stringify(p.name)},\n` +
    `${ind(6)}distance: ${JSON.stringify(p.distance)},\n` +
    `${ind(6)}body:\n${ind(8)}${JSON.stringify(p.body)},\n` +
    `${ind(4)}},\n`
  );
}

/** Replace an existing `key: { … }` block inside a named section. */
function replaceEntry(text, sectionKey, entryKey, replacement) {
  const sec = text.indexOf(`  ${sectionKey}: {`);
  if (sec < 0) return null;
  const start = text.indexOf(`${ind(4)}${JSON.stringify(entryKey)}: {`, sec);
  const startBare = start < 0 ? text.indexOf(`${ind(4)}${entryKey}: {`, sec) : start;
  if (startBare < 0) return null;
  const end = text.indexOf(`\n${ind(4)}},`, startBare);
  if (end < 0) return null;
  return text.slice(0, startBare) + replacement.replace(/\n$/, "") + text.slice(end + `\n${ind(4)}},`.length);
}

/** Insert at the head of a named section. */
function insertInSection(text, sectionKey, block) {
  const anchor = `  ${sectionKey}: {\n`;
  const i = text.indexOf(anchor);
  if (i < 0) return null;
  return text.slice(0, i + anchor.length) + block + text.slice(i + anchor.length);
}

/** Rewrite a chapter's `body: [...]` array. */
function replaceChapterBody(text, chapterId, paragraphs) {
  const ch = text.indexOf(`${ind(4)}${chapterId}: {`);
  if (ch < 0) return null;
  const b = text.indexOf(`${ind(6)}body: [`, ch);
  if (b < 0) return null;
  const end = text.indexOf(`\n${ind(6)}],`, b);
  if (end < 0) return null;
  const block =
    `${ind(6)}body: [\n` +
    paragraphs.map((p) => `${ind(8)}${JSON.stringify(p)},\n`).join("") +
    `${ind(6)}],`;
  return text.slice(0, b) + block + text.slice(end + `\n${ind(6)}],`.length);
}

for (const locale of ["el", "de", "fr", "nl"]) {
  const file = path.join(ROOT, "src", "i18n", "content", `${locale}.ts`);
  let t = fs.readFileSync(file, "utf8");
  const before = t.length;
  const notes = [];

  for (const [slug, e] of Object.entries(EXPERIENCES[locale])) {
    const block = renderExperience(slug, e);
    const replaced = replaceEntry(t, "experiences", slug, block);
    if (replaced) {
      t = replaced;
    } else {
      const inserted = insertInSection(t, "experiences", block);
      if (inserted) t = inserted;
      else notes.push(`experiences/${slug} NOT PLACED`);
    }
  }

  for (const [slug, p] of Object.entries(PLACES[locale])) {
    if (!t.includes(`"${slug}"`)) {
      const inserted = insertInSection(t, "places", renderPlace(slug, p));
      if (inserted) t = inserted;
      else notes.push(`places/${slug} NOT PLACED`);
    }
  }

  for (const [id, paragraphs] of Object.entries(CHAPTERS[locale])) {
    const out = replaceChapterBody(t, id, paragraphs);
    if (out) t = out;
    else notes.push(`chapters/${id} NOT PLACED`);
  }

  fs.writeFileSync(file, t);
  console.log(`${locale}: ${before} → ${t.length}${notes.length ? "  ⚠ " + notes.join(", ") : ""}`);
}
