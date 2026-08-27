import type { ContentText } from "./types";

export const nl: ContentText = {
  houses: {
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
  },

  rooms: {
    evexia: {
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
        "Een mengeling van rust en luxe. Dertig vierkante meter verdeeld over twee slaapkamers, met een eigen deur in plaats van een gang, uitkomend op een beschaduwd terras met een eigen bubbelbad, een houten scherm voor de privacy en ligstoelen in het gras. Gemaakt voor stellen — en voor huwelijksreizen, waarvoor er het vaakst naar gevraagd wordt.",
      notes: [],
      outlook: "Eigen binnenplaats",
      outdoor: "Terras met eigen bubbelbad",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi betekent leven. Twee slaapkamers en twee badkamers op dertig vierkante meter — de enige suite hier waar 's ochtends niemand hoeft te wachten — met een eigen ingang en een eigen achtertuin, omheind met hout, beplant langs de muur, en met een bubbelbad dat groot genoeg is voor jullie vieren. De suite die je neemt met kinderen, of met een tweede stel.",
      notes: [],
      outlook: "Eigen achtertuin",
      outdoor: "Achtertuin met eigen bubbelbad",
    },
    harmony: {
      displayName: "Harmony",
      description:
        "De grootste van de vier. Een afgeschermde binnenplaats met een privédompelbad, voor rust zonder afleiding of onderbreking — de dag die naast stromend water verstrijkt, onder een helderblauwe hemel, of bij maanlicht met een glas Griekse wijn. Binnen: een zithoek, een kingsize bed van 1,80 m, een 55-inch televisie met HDMI, twee fauteuils die in bedden veranderen, en elegant marmer onder de voet. In de kitchenette staat elk soort koffiezetapparaat, een waterkoker, een elektrische kookplaat en een magnetron.",
      notes: ["Alle badkamerproducten zijn milieuvriendelijk."],
      outlook: "Eigen binnenplaats",
      outdoor: "Binnenplaats met privédompelbad",
      level: "Begane grond",
    },
    agapi: {
      displayName: "Agapi",
      description:
        "Agapi betekent liefde — genoemd naar de zorg die in het ontwerp is gestoken, in het bijzonder voor mensen met een beperking. De suite heeft een eigen ingang aan de zijstraat en een badkamer die volledig is gebouwd volgens de normen voor veilige en comfortabele hygiënische verzorging, ontworpen voor rolstoelgebruikers. De rustige binnenplaats, met zijn schilderachtige oude put, is gemaakt om buiten te zitten zoals dat in Kretenzische buurten altijd is gedaan. Overal strakke marmeren vloeren.",
      notes: [
        "Alle badkamerproducten zijn milieuvriendelijk.",
        "Coco-Mat matras.",
      ],
      outlook: "Binnenplaats met een oude put",
      outdoor: "Eigen binnenplaats",
      level: "Begane grond",
    },
    pathos: {
      displayName: "Pathos",
      description:
        "Pathos betekent passie, en de kamer is gebouwd rond één gedurfd element: een glazen dubbele douchecabine die náást het bed staat in plaats van achter een deur te verdwijnen. Het is het hele ontwerp — niets anders in de suite doet ertegen mee — en daarom is dit de kamer waar stellen bij naam om vragen. Een intieme juniorsuite in een besloten, private hoek van het hotel, met een binnenplaats vlak buiten voor koffie in de ochtendzon of een glas in het maanlicht. Alleen volwassenen.",
      notes: ["Alle badkamerproducten zijn milieuvriendelijk."],
      outlook: "Buitenpatio",
      outdoor: "Terras",
      level: "Bovenverdieping",
    },
    elpida: {
      displayName: "Elpida",
      description:
        "Elpida betekent hoop, en twee ontwerpgrepen dragen de hele kamer. Een sobere betonnen wastafel staat naast het bed met een spiegel en een zwarte kom — sanitair behandeld als meubel, niet weggewerkt. Ertegenover is een bank in de vensternis gebouwd en volgestapeld met kussens, zodat de beste plek van de suite die in het licht is. Lees er 's ochtends met koffie, of zit er 's avonds met wijn en luister naar de stad in het maanlicht. Alleen volwassenen.",
      notes: [],
      outlook: "Over de oude stad",
      outdoor: "Terras",
      level: "Eerste verdieping",
    },

    "sea-view-balcony-house-of-europe": {
      displayName: "Zeezicht met balkon",
      description:
        "Een warme kamer van rustiek hout en witgekalkte muren, op de zee gericht, met een balkon om die vanaf te bekijken.",
      notes: [
        "Kamers aan zeezijde kunnen levendig zijn — ze liggen het dichtst bij de cafés en bars.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Zeezicht",
      outdoor: "Balkon",
    },
    "sea-view-house-of-europe": {
      displayName: "Zeezicht",
      description:
        "Vijftien vierkante meter aan het water, in het gebouw dat ooit het gastenverblijf van de Universiteit van Kreta was.",
      notes: [
        "Kamers aan zeezijde kunnen levendig zijn — ze liggen het dichtst bij de cafés en bars.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Zeezicht",
    },
    "side-sea-view-balcony-house-of-europe": {
      displayName: "Zijdelings zeezicht met balkon",
      description:
        "De zee komt hier onder een hoek binnen, ingelijst tussen de daken van de oude stad, met een balkon om het licht vanaf te zien veranderen.",
      notes: ["Huishouding om de twee dagen."],
      outlook: "Zijdelings zeezicht",
      outdoor: "Balkon",
    },
    "balcony-house-of-europe": {
      displayName: "Kamer met balkon",
      description:
        "Een compacte kamer die naar de oude stad is gekeerd, met een balkon boven de steeg beneden.",
      notes: ["Huishouding om de twee dagen."],
      outlook: "Over de oude stad",
      outdoor: "Balkon",
    },
    "standard-house-of-europe": {
      displayName: "Standaardkamer",
      description:
        "Veertien rustige vierkante meter in het centrale gebouw, een minuut van het ontbijt.",
      notes: ["Huishouding om de twee dagen."],
      outlook: "Over de oude stad",
    },
    "two-bedroom-apartment-house-of-europe": {
      displayName: "Appartement met twee slaapkamers",
      description:
        "Dertig vierkante meter verdeeld over twee slaapkamers — de kamer voor een gezin, of voor twee stellen die samen reizen.",
      notes: [
        "Kamers aan zeezijde kunnen levendig zijn — ze liggen het dichtst bij de cafés en bars.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
    },

    "room-with-terrace-phos": {
      displayName: "Kamer met terras",
      description:
        "Een kleine suite waarvan de eigenlijke ruimte buiten ligt — een privéterras boven de daken van de oude stad.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
      outdoor: "Terras",
    },
    "superior-balcony-phos": {
      displayName: "Superior met balkon",
      description:
        "De grootste kamer in Phos: achttien vierkante meter en een balkon, met slaapplaats voor drie.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
      outdoor: "Balkon",
    },
    "superior-room-with-balcony-phos": {
      displayName: "Superior kamer met balkon",
      description:
        "Twintig vierkante meter met een balkon, ingericht voor vier personen: één tweepersoonsbed, één slaapbank en één stapelbed.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
      outdoor: "Balkon",
    },
    "standard-phos": {
      displayName: "Standaardkamer",
      description:
        "Vijftien vierkante meter in het rustigere huis, hout en wit pleisterwerk, luiken die op de steeg uitkomen.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
    },
    "triple-phos": {
      displayName: "Driepersoonskamer",
      description:
        "Een tweepersoonsbed en een eenpersoonsbed, voor drie die samen reizen.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
    },
    "quadruple-phos": {
      displayName: "Vierpersoonskamer",
      description:
        "Eén tweepersoonsbed en twee stapelbedden — de gezinskamer in Phos.",
      notes: [
        "Het ontbijt wordt geserveerd in House of Europe.",
        "Huishouding om de twee dagen.",
      ],
      outlook: "Over de oude stad",
    },

    "residence-of-the-old-port": {
      displayName: "The Residence of the Old Port",
      description:
        "Een huis voor u alleen, met twee slaapkamers, op honderd meter van de Venetiaanse haven en vierhonderd meter van het Archeologisch Museum, met privéparkeerplaats en een keuken. Het strand van Koumbes ligt 1,6 kilometer verderop. Een continentaal ontbijt is beschikbaar.",
      notes: [],
      outlook: "De oude stad van Rethymno",
      outdoor: "Balkon en terras",
    },
  },

  experienceGroups: {
    table: {
      title: "Aan tafel",
      blurb:
        "Kreta eet beter dan bijna waar ook in het Middellandse Zeegebied. Dit zijn de manieren om er binnen te komen.",
    },
    sea: {
      title: "Op het water",
      blurb: "De kust ligt op vier minuten lopen. Alles hieronder begint daar.",
    },
    land: {
      title: "Het eiland in",
      blurb:
        "Kloven, bergdorpen, kloosters en wegen die maar één kant op gaan. Voor u geregeld.",
    },
    self: {
      title: "Voor uzelf",
      blurb: "Rustiger arrangementen, in uw eigen tijd.",
    },
  },

  experiences: {
    "rent-a-car": {
      title: "Een auto uit onze collectie",
      summary:
        "Een Fiat 500 Cabrio, van ons en niet van een verhuurbalie — voor de dagen waarop het eiland het doel is.",
      body: [
        "Het dichtstbijzijnde zwemwater is het strand van de stad zelf, een paar minuten lopen van de deur: het begint waar de oude stad ophoudt en loopt kilometers naar het oosten — zand, ondiep water, en zoveel ervan dat augustus het nooit helemaal vult. U kunt vóór het ontbijt in zee zijn en op tijd terug.",
        "Het betere zwemmen ligt verder weg, in baaien die alleen per boot bereikbaar zijn, en aan de zuidkust waar het water volledig van kleur verandert. Een boot kan voor een dag privé worden genomen. De receptie regelt het.",
      ],
    },
    "kourtaliotiko-gorge": {
      title: "De Kourtaliotiko-kloof",
      summary:
        "Een dag in de kloof die afdaalt naar Preveli — geregeld met Routes, het excursiebedrijf van de familie.",
      body: [
        "De Kourtaliotiko-kloof snijdt zuidwaarts door de bergen achter Rethymno en komt uit bij Preveli, waar een met palmen omzoomde rivier de zee bereikt. Steile rots aan weerszijden, watervallen onder aan een lange trap, en een kapel uitgehakt in de klif.",
        "Het is een dagtocht, geen wandeling: de rit erheen, de afdaling, het water, en het strand aan het eind. Wij regelen het met Routes — het eigen excursiebedrijf van de familie — zodat de gids iemand is die de receptie bij naam kent.",
      ],
    },
    "learn-the-secrets-of-cretan-cuisine": {
      title: "De geheimen van de Kretenzische keuken",
      summary: "Proef de Kretenzische keuken — en leer hoe zij wordt gemaakt.",
      body: ["Proef de Kretenzische keuken en leer de geheimen erachter."],
    },
    "wine-tasting": {
      title: "Wijnproeverij",
      summary:
        "Uitmuntende wijnen, uitgesproken smaken, en de oud-Griekse wijncultuur erachter.",
      body: [
        "Proef uitmuntende wijnen en uitgesproken smaken, en leer over wijn, de oud-Griekse wijncultuur en de eigen druivenrassen van Griekenland.",
      ],
    },
    "wine-production": {
      title: "Wijnproductie",
      summary: "De wijn van Kreta is wereldberoemd. Zie hoe hij wordt gemaakt.",
      body: [
        "De wijn van Kreta is wereldberoemd. Ga met ons mee en ontdek hoe de productie verloopt in de gevierde wijnhuizen op het eiland.",
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
    "breakfast-on-the-beach": {
      title: "Ontbijt op het strand",
      summary: "Ontbijt, geregeld op het zand.",
      body: ["Geniet van uw ontbijt op het strand. Het kan geregeld worden."],
    },

    "private-boat-trip": {
      title: "Een eigen boot",
      summary:
        "Baaien die alleen over zee bereikbaar zijn, turquoise water, en het eiland gezien zoals het hoort.",
      body: [
        "Ons doel is u ons eiland te tonen vanaf het comfort van uw eigen boot. Wij hebben boten die exclusief aan u of uw gezelschap worden verhuurd, en wij organiseren tochten rond heel Kreta.",
        "De vele baaien die alleen per boot bereikbaar zijn, de zandstranden, de zeehabitats met hun turquoise water en het rotslandschap vormen een bijzonder decor voor rust, verkenning, vissen en plezier.",
      ],
    },
    "scuba-diving": {
      title: "Duiken",
      summary: "Kreta is onder water even opmerkelijk als erboven.",
      body: [
        "Kreta heeft betoverende landschappen, zowel aan de oppervlakte als onder zee.",
        "Het heldere blauwe water nodigt uit om in te zwemmen. Maar wat gebeurt eronder? U kunt het ontdekken — en er meteen een duikbrevet bij halen.",
      ],
    },
    "water-sports": {
      title: "Watersport",
      summary:
        "Jetski en jetskisafari, parasailing, waterskiën — met de hele dag een badmeester op wacht.",
      body: [
        "Wij werken samen met de beste watersportaanbieder van Rethymno. Onze partner levert professionele uitrusting die aan hoge veiligheidsnormen voldoet.",
        "Jetskiën en jetskisafari, parasailing en waterskiën zijn maar enkele van de activiteiten. De hele dag is er een badmeester op wacht, en de uitrusting wordt dagelijks gecontroleerd door vakmensen.",
      ],
    },
    "wedding-on-the-beach": {
      title: "Een bruiloft op het strand",
      summary: "Zand onder de voeten, zon erboven.",
      body: [
        "Droomt u van een bruiloft op het strand, met het zand onder uw voeten en de zon boven uw hoofd? Spreek ons aan, en wij regelen het.",
      ],
    },

    "jeep-safari": {
      title: "Jeepsafari",
      summary:
        "De moeilijk te vinden delen van Zuid-Kreta, weg van de drukte — alles op één dag.",
      body: [
        "Een tocht naar de moeilijk te vinden plekken van Kreta, weg van de drukte: weidse uitzichten en het genoegen van offroad rijden door de landschappen van Zuid-Kreta — alles op één dag.",
      ],
    },
    "quad-safari": {
      title: "Quadsafari",
      summary: "De bergen van Rethymno in, door kloven en ondiepe rivieren.",
      body: [
        "Een route die de bergen van Rethymno in gaat, door indrukwekkende kloven met opmerkelijke rotsformaties, en onderweg door ondiepe rivieren.",
      ],
    },
    hiking: {
      title: "Wandelen",
      summary: "Vraag ons om routes. De paden hier zijn buitengewoon.",
      body: [
        "Vraag ons om routes over Kreta. Verken de mooie paden en de landschappen die zich erachter openen.",
      ],
    },
    "bike-tours": {
      title: "Fietstochten",
      summary: "Fietsen, en routes die het rijden waard zijn.",
      body: ["Vraag ons om fietsen en verken de routes rond Kreta."],
    },
    "exclusive-tour": {
      title: "Een privérondleiding",
      summary:
        "De geschiedenis, mythologie en cultuur van Kreta, privé begeleid.",
      body: [
        "Een persoonlijke, private rondleiding door de geschiedenis, mythologie en cultuur van Kreta. Spreek ons aan voor de details.",
      ],
    },
    running: {
      title: "Hardlopen",
      summary: "Routes voor 's ochtends, voor de hitte.",
      body: [
        "Vraag ons om routes over Kreta. Verken de mooie paden en de landschappen die zich erachter openen.",
      ],
    },

    massage: {
      title: "Massage",
      summary: "Voor u geboekt, op uw eigen kamer.",
      body: ["Boek uw afspraak voor een ontspannende massage."],
    },
    therapist: {
      title: "Een therapeut",
      summary: "Innerlijke rust, balans en vitaliteit — in het leven en in relaties.",
      body: [
        "Vind uw ruimte om te helen. Een therapeut kan u helpen innerlijke rust, balans en vitaliteit te vinden, in het leven en in relaties.",
      ],
    },
    "personal-trainer": {
      title: "Personal training",
      summary: "In vorm blijven op vakantie, privé.",
      body: [
        "Blijf fit tijdens uw vakantie. Een personal trainer kan naar u toe komen, in alle privacy en veiligheid.",
        "Wij kunnen ook TRX-materiaal, een pilatesbal of vitamines verzorgen.",
      ],
    },
    "chauffeur": {
      title: "Transfers van luchthaven en haven",
      summary:
        "Opgehaald in Chania, Heraklion of bij de haven, en naar binnen gereden.",
      body: [
        "Hebt u uw vakantie geregeld maar nog niet uitgezocht hoe u hier vanaf de luchthaven of de haven komt? Laat het ons weten, dan staan wij bij aankomst klaar. Onze eigen chauffeur kan u ophalen en binnenbrengen.",
        "De stegen van de oude stad zijn smal en meestal eenrichtingsverkeer, en House of Europe ligt er middenin. U met uw bagage op de juiste hoek laten afzetten is het regelen waard — het is het verschil tussen aankomen en zoeken.",
      ],
    },
    "private-helipad": {
      title: "Eigen helikopterplatform",
      summary:
        "Beschikbaar bij Thalasses Villas, ons zusterhuis aan de Kretenzische kust.",
      body: [
        "Thalasses Villas — ons zusterhuis, met weids uitzicht over de Kretenzische zee — is het enige villalandgoed aan deze kust met een eigen helikopterplatform op het terrein. De aankomst kan via ons worden geregeld.",
      ],
    },
  },

  places: {
    "town-beach": {
      name: "Het stadsstrand",
      distance: "Een paar minuten lopen",
      body:
        "Het dichtstbijzijnde zwemwater is het strand van de stad zelf: het begint waar de oude stad ophoudt en loopt kilometers naar het oosten — zand, ondiep water, en zoveel ervan dat augustus het nooit helemaal vult. Het is een paar minuten lopen van de deur, geen ritje: u kunt vóór het ontbijt de zee in en op tijd terug zijn.",
    },
    "venetian-harbour": {
      name: "De Venetiaanse haven",
      distance: "Enkele minuten lopen",
      body: "Naast de moderne haven, met haar Egyptische vuurtoren, ligt een van de schilderachtigste hoeken van de oude stad. Zij was in gebruik in de Byzantijnse tijd, na 961, en bloeide onder de Venetianen, die in de 14e eeuw met grote werken begonnen tegen de verzanding die haar nog altijd parten speelt. Aan de kade staan visrestaurants op een rij.",
    },
    fortezza: {
      name: "De Fortezza",
      distance: "Enkele minuten lopen",
      body: "Het fort beheerst de heuvel Palekastro naast de oude stad, een van de grootste uit de Venetiaanse tijd. Het staat op de plek van de burcht van het antieke Rithimna en de tempel van Artemis Rokkea. Het grote vijfhoekige fort werd in 1573 gebouwd; de omtrek meet 1.300 meter, en langs de muren staan vier bastions — Sint-Lucas, Sint-Elias, Sint-Paulus en Sint-Nicolaas.",
    },
    "archaeological-museum": {
      name: "Archeologisch Museum",
      distance: "In de oude stad",
      body:
        "De archeologische collectie van de stad, in de voormalige Sint-Franciscuskerk — een Venetiaanse kloosterkerk een paar straten achter de haven. Het museum verhuisde hier in 2016 naartoe, weg van zijn eerdere plek bij de poort van de Fortezza.",
    },
    "historical-folklore-museum": {
      name: "Historisch en Volkskundig Museum",
      distance: "In de oude stad",
      body: "Een Venetiaans herenhuis in de oude stad, een beschermd monument uit de 17e eeuw, herbergt het historisch en volkskundig museum van de stad. Vijf zalen tonen een vaste collectie traditioneel ambacht en volkskunst — en het werk van het museum beschermt het gebouw zelf.",
    },
    "arkadi-monastery": {
      name: "Klooster van Arkadi",
      distance: "23 km naar het oosten",
      body: "Bij het dorp Amnatos, gebouwd op 500 meter hoogte op een vruchtbaar plateau van olijfgaarden, wijngaarden, dennen, cipressen en eiken. Er staan schilderachtige kapellen omheen, en de kloof van Arkadi begint daar.",
    },
    "ancient-eleftherna": {
      name: "Het Museum van het antieke Eleftherna",
      distance: "Landinwaarts vanaf Rethymno",
      body: "Het eerste museum op Kreta dat binnen een archeologische vindplaats is gebouwd, naast de antieke stad Eleftherna. De drie zalen dragen de hele geschiedenis van de plek, van 3000 v.Chr. tot 1300 n.Chr., in alledaagse voorwerpen en kunstwerken.",
    },
  },

  chapters: {
    "old-town": {
      eyebrow: "Hoofdstuk één",
      title: "De oude stad",
      body: [
        "De buurt rond Ink is een raster van stegen die te smal zijn voor auto's, aangelegd door Venetianen en sindsdien onafgebroken bewoond. Deuropeningen dragen gebeeldhouwde lateien van vierhonderd jaar oud. Bougainville komt in de zomer over de muren en valt de straat in.",
        "Het is geen gemusealiseerde wijk. Hier wonen mensen — was aan de lijn, katten, scooters, een ruzie twee verdiepingen hoger — en juist dat maakt een wandeling om acht uur 's avonds beter dan welke excursie ook.",
      ],
      imageAlt:
        "Een straat in de oude stad van Rethymno gezien vanaf een balkon, okerkleurige huizen aan weerszijden",
      notes: [{ term: "Vanaf de deur", def: "U staat er al middenin" }],
    },
    venetian: {
      eyebrow: "Hoofdstuk twee",
      title: "Venetiaanse steen",
      body: [
        "De Fortezza staat op de heuvel Palekastro boven de stad, in 1573 gebouwd op de plek van de burcht van het antieke Rithimna en de tempel van Artemis Rokkea. De muren lopen 1.300 meter, met vier bastions — Sint-Lucas, Sint-Elias, Sint-Paulus en Sint-Nicolaas.",
        "Daaronder krult de Venetiaanse haven zich achter haar Egyptische vuurtoren. Zij werkte in de Byzantijnse tijd, na 961, en bloeide onder de Venetianen, die in de 14e eeuw met grote werken begonnen tegen de verzanding die haar tot op vandaag parten speelt.",
      ],
      imageAlt: "Het fort Fortezza boven de oude stad van Rethymno",
      notes: [
        { term: "Fortezza", def: "Gebouwd in 1573 · 1.300 m muur" },
        { term: "Haven", def: "In gebruik sinds de 10e eeuw" },
      ],
    },
    sea: {
      eyebrow: "Hoofdstuk drie",
      title: "Het water",
      body: [
        "Het stadsstrand begint waar de oude stad ophoudt en loopt kilometers naar het oosten — zand, ondiep water, en genoeg ervan dat augustus het nooit helemaal vult.",
        "Het betere zwemwater ligt verder weg, in baaien die alleen per boot bereikbaar zijn, en aan de zuidkust, waar het water volledig van kleur verandert. Een boot kan voor een dag privé worden gehuurd. De receptie regelt het.",
      ],
      imageAlt:
        "De haven en de kustlijn van Rethymno van bovenaf, turquoise water tegen de stad",
      notes: [{ term: "Strand van Koumbes", def: "1,6 km van The Residence" }],
    },
    table: {
      eyebrow: "Hoofdstuk vier",
      title: "Wat Kreta eet",
      body: [
        "De Kretenzische keuken is het oudste argument voor het mediterrane dieet, en het is hier geen gezondheidsregime — het is de lunch. Wilde groenten, schapenkaas, gerstebeschuit, olijfolie die wordt geschonken alsof ze niets kost, en lam dat langzaam wordt gegaard met wat het dichtstbij groeide.",
        "De wijn van Kreta is wereldberoemd, en de wijnhuizen in de heuvels achter Rethymno laten u zien hoe hij wordt gemaakt. Dichter bij huis zijn er in deze stegen kleine eethuizen met verse salades en sappen, en bars die de beste frozen cocktails van de zomer maken.",
      ],
      imageAlt: "Een gedekte tafel aan zee in Rethymno",
      notes: [
        { term: "Ontbijt", def: "Lokale keuken, in House of Europe" },
        { term: "Te regelen", def: "Wijnproeverij, een boerderij" },
      ],
    },
    inland: {
      eyebrow: "Hoofdstuk vijf",
      title: "Achter de stad",
      body: [
        "Twintig minuten landinwaarts doet de kust er niet meer toe. Kloven openen zich, dorpen liggen aan het eind van eenbaanswegen, en de bergen lopen op naar sneeuw die tot in mei blijft liggen.",
        "Het klooster Arkadi ligt 23 kilometer naar het oosten, gebouwd op 500 meter op een plateau van olijfgaarden, wijngaarden, pijnbomen, cipressen en eiken, met de Arkadi-kloof die eronder begint. Verderop draagt het museum van Ancient Eleftherna — het eerste museum op Kreta dat binnen een archeologische vindplaats is gebouwd — de hele geschiedenis van de plek, van 3000 v.Chr. tot 1300 n.Chr.",
        "In het zuiden snijdt de Kourtaliotiko-kloof af naar Preveli, waar een met palmen omzoomde rivier in zee stroomt. Dat is een dag en geen middag, en wij regelen het met Routes, het excursiebedrijf van de familie.",
      ],
      imageAlt: "De bergen en kloven landinwaarts vanaf Rethymno",
      notes: [
        { term: "Arkadi", def: "23 km naar het oosten · 500 m hoogte" },
        { term: "Eleftherna", def: "3000 v.Chr. – 1300 n.Chr." },
      ],
    },
    hidden: {
      eyebrow: "Hoofdstuk zes",
      title: "De delen die u zelf niet zou vinden",
      body: [
        "Elke stad heeft een versie van zichzelf die alleen opengaat voor wie iemand kent. Welke steeg na regen onderloopt. Welk strand op zondag leeg is. Welke taverna in februari de wandeling nog waard is, als de meeste voor de winter gesloten zijn.",
        "Dat is het werkelijke argument om in een familiebedrijf te logeren in plaats van in iets met een merkhandboek. Vraag het aan de receptie, en u krijgt antwoord van iemand die hier woont.",
      ],
      imageAlt: "Een groene Venetiaanse deur in een stille steeg van de oude stad",
    },
  },

  rethymnoIntro: {
    title: "Een stad gebouwd op zichzelf",
    lede: "Het antieke Rithimna, een Byzantijnse haven, een Venetiaans fort, Ottomaanse stegen en drie huizen uit de jaren 1700 — gelaagd op één landtong, en klein genoeg om in een middag door te lopen.",
    body: [
      "Rethymno ligt halverwege de noordkust van Kreta, tussen Chania en Heraklion, met een berg erachter en de Kretenzische Zee ervoor. De oude stad is een van de best bewaarde van Griekenland: niemand heeft haar gesloopt, dus de Venetiaanse deuromlijstingen, de Ottomaanse fonteinen en de houten balkons staan nog waar ze werden gezet.",
      "Wat dat voor een verblijf betekent, is eenvoudig. U wordt niet naar bezienswaardigheden gereden. U loopt een deur uit en staat er middenin.",
    ],
  },

  history: {
    eyebrow: "In vroeger tijden",
    title: "Een drukkerij, een krant, een gastenverblijf",
    paragraphs: [
      "Het gebouw dat Ink werd, was een drukkerij. Daar werd de krant ΑΓΩΝ — Strijd — uitgegeven door Fotakis, die later parlementslid en officier van justitie in Athene werd.",
      "Het centrale gebouw, bekend als House of Europe, was het gastenverblijf van de Universiteit van Kreta. Zijn gasten waren professoren en onderzoekers die lezingen kwamen geven die ertoe deden voor de wetenschappelijke en de lokale gemeenschap. Kunsttentoonstellingen horen al lang bij het leven van het huis.",
      "Drie afzonderlijke historische gebouwen uit de jaren 1700, in het hart van de middeleeuwse oude stad. Zij zijn een historische plek in het leven van Rethymno.",
    ],
  },

  neighbourhood: {
    title: "In de schaduw van de Fortezza",
    paragraphs: [
      "Ink ligt onder de imposante Fortezza — het fort waar de piraat Barbarossa ooit binnenviel — en op een paar stappen van de zee en de middeleeuwse Venetiaanse haven, waar kooplieden ooit handelden in goederen van over de hele wereld.",
      "Loop door de straten rond Ink en u vindt de stegen waar ooit ridders doorheen reden, en kleine buurteethuizen met goed eten, verse salades en sappen. En deze zeer levendige wijk heeft bars die u de beste frozen cocktails van de zomer schenken.",
    ],
  },

  faqs: [
    {
      question: "Waar ligt het hotel precies?",
      answer:
        "In het centrum van de middeleeuwse oude stad van Rethymno op Kreta, op een paar stappen van de Venetiaanse haven en onder de Fortezza. U komt aan bij House of Europe, Nikolaou Plastira 4 — daar is de receptie, en daar liggen alle zeven suites. Phos, het tweede gebouw, staat aan de Fotaki 10. Het hotel heeft ook adressen aan de Psaron 2 en de Damvergi 26; vanaf de receptie brengt iemand u naar het uwe. Het inchecken gebeurt hier voor alle gebouwen, ook voor de Residence aan de oude haven.",
    },
    {
      question: "Wat is het verschil tussen House of Europe en Phos?",
      answer:
        "House of Europe is het eerste gebouw, Nikolaou Plastira 4. Daar is de receptie, daar wordt voor alle gasten het ontbijt geserveerd, en daar liggen alle zeven suites. Het was ooit het gastenverblijf van de Universiteit van Kreta. Phos, het Griekse woord voor licht, is het tweede gebouw, een paar stappen verderop: zeven kamers, genummerd van één tot zeven, en het stillere van de twee. The Residence of the Old Port is een apart huis bij de haven.",
    },
    {
      question: "Is het ontbijt inbegrepen?",
      answer:
        "Het ontbijtbuffet is tegen een toeslag beschikbaar en wordt geserveerd in House of Europe, ook voor gasten die in Phos verblijven. Tegen een toeslag wordt het ook op de kamer geserveerd. Tarieven en wat is inbegrepen worden bij de boeking bevestigd.",
    },
    {
      question: "Heeft een van de kamers een zwembad of bubbelbad?",
      answer:
        "Vier van de zeven suites hebben hun eigen water. Evexia heeft een eigen bubbelbad, verzonken in het terras, boven de boulevard; Eros en Zoi hebben er elk een, op een eigen binnenplaats. Harmony heeft een verwarmd eigen dompelbad op een afgeschermde binnenplaats, dus het water is warm welke maand het ook is. Een gemeenschappelijk zwembad is er niet — de zee ligt op korte loopafstand.",
    },
    {
      question: "Is het hotel toegankelijk?",
      answer:
        "De suite Agapi is ontworpen op toegankelijkheid: drempelloze toegang met een eigen ingang aan de zijstraat, een inloopdouche en een toilet met wandbeugels, gebouwd volgens de normen voor veilige en comfortabele hygiënische verzorging voor rolstoelgebruikers. Neem vóór het boeken contact met ons op, zodat wij kunnen bevestigen dat de route naar het gebouw voor u werkt — de oude stad is historisch en de stegen zijn geplaveid.",
    },
    {
      question: "Zijn er kamers alleen voor volwassenen?",
      answer:
        "Pathos en Elpida nemen alleen volwassenen. Alle andere suites en kamers zijn geschikt voor gezinnen; Zoi heeft twee slaapkamers en twee badkamers en wordt het vaakst met kinderen geboekt.",
    },
    {
      question: "Tot hoe laat is de receptie open?",
      answer:
        "De receptie is open tot 23:00 uur, in House of Europe, Nikolaou Plastira 4. Landt uw vlucht later, laat het ons vooraf weten en er is iemand aanwezig.",
    },
    {
      question: "Hoe laat kan ik inchecken?",
      answer:
        "Inchecken kan vanaf 16:00 uur en uitchecken tot 11:00 uur. Laat ons weten wanneer u landt, dan ligt uw sleutel klaar zodra u bij het eerste gebouw aankomt.",
    },
    {
      question: "Is er parkeergelegenheid?",
      answer:
        "Parkeren in de buurt van het hotel is gratis, op de parkeerplaats aan de overkant. Gasten van de Gateway Suites krijgen een parkeerkaart, zolang er beschikbaarheid is.",
    },
    {
      question: "Mag mijn hond mee?",
      answer: "Huisdieren worden niet toegelaten.",
    },
    {
      question: "Hoeveel lawaai is er?",
      answer:
        "De oude stad leeft, en dat is een groot deel van het plezier. Het hotel meldt dat kamers aan zeezijde het dichtst bij de cafés en bars liggen en levendig kunnen zijn. De kamers hebben geluidsisolerende ramen. Slaapt u licht, laat het ons weten en wij delen u daarop in.",
    },
    {
      question: "Welke talen worden er gesproken?",
      answer: "Engels, Grieks, Nederlands en Frans.",
    },
    {
      question: "Hoe kom ik hier vanaf de luchthaven?",
      answer:
        "Rethymno ligt tussen de luchthavens van Chania en Heraklion. Onze eigen chauffeur kan u op een van beide luchthavens of in de haven ophalen en u naar binnen brengen — laat ons uw aankomst weten en wij regelen het.",
    },
    {
      question: "Is er wifi?",
      answer:
        "Ja, gratis wifi in het hele hotel, en geluidsgeïsoleerde kamers met een bureau om aan te werken.",
    },
    {
      question: "Wanneer zijn de kamers voor het laatst gerenoveerd?",
      answer:
        "House of Europe werd gerenoveerd in mei 2020, en Phos in juni 2019. De huishouding komt om de twee dagen.",
    },
  ],

  arrival: {
    title: "U wordt aan één deur ontvangen",
    lede: "Het hotel beslaat twee gebouwen in de oude stad, plus een woonhuis bij de haven. U komt naar één deur — House of Europe, het eerste gebouw, Nikolaou Plastira 4 — en vandaar loopt iemand met u mee naar uw kamer.",
    receptionHeading: "Nikolaou Plastira 4",
    receptionLabel: "Eerste gebouw · Receptie",
    receptionBody: [
      "Dit is de deur. Niet het tweede gebouw, niet het derde — het eerste, aan de Nikolaou Plastira, op een paar minuten van de Venetiaanse haven en onder de Fortezza.",
      "Welke kamer u ook hebt geboekt, in welk huis die ook ligt, u begint hier. Iemand verwacht u, uw sleutel ligt klaar, en de wandeling naar uw gebouw is kort en wordt met u gemaakt.",
    ],
    steps: [
      {
        title: "Laat ons weten wanneer u landt",
        body: "Stuur ons uw aankomsttijd en hoe u reist. Onze eigen chauffeur kan u ophalen op de luchthaven van Chania of Heraklion, of in de haven, en u naar binnen brengen — de stegen van de oude stad zijn smal, en tot de juiste hoek ervan gereden worden is het regelen waard.",
      },
      {
        title: "Kom naar het eerste gebouw",
        body: "Nikolaou Plastira 4. Dat is de receptie voor het hele hotel, en daar liggen alle zeven suites. Hij is open tot 23:00 uur. Parkeren is gratis in de buurt, op de parkeerplaats aan de overkant; gasten van de Gateway Suites krijgen een parkeerkaart, zolang er beschikbaarheid is. Het inchecken gebeurt hier voor alle gebouwen, ook voor de Residence aan de oude haven.",
      },
      {
        title: "Wij lopen met u mee",
        body: "Niemand krijgt een plattegrond en een deurcode in de hand gedrukt. Uw sleutel, uw gebouw en de weg ernaartoe krijgt u persoonlijk — samen met de twee of drie dingen over deze wijk die alleen iemand die er woont u vertelt.",
      },
      {
        title: "De dag is van u om in te richten",
        body: "Een boot, een tafel, een rolstoelroute, een rustige verdieping, een fles die klaarstaat op de kamer. Vraag het aan de receptie. Het meeste is een telefoontje dat wij al honderd keer hebben gepleegd.",
      },
    ],
    facts: [
      { term: "Receptie", def: "House of Europe, Nikolaou Plastira 4 — het eerste gebouw. Open tot 23.00 uur." },
      { term: "Inchecken", def: "Vanaf 16:00 uur. Uitchecken vóór 11:00 uur." },
      { term: "Telefonisch", def: "+30 211 444 5757, toestel 1" },
      { term: "WhatsApp", def: "+30 697 406 9475" },
      { term: "Ontbijt", def: "Buffet in House of Europe voor alle gasten, en op de kamer tegen een kleine vergoeding" },
      { term: "Parkeren", def: "Gratis, op de parkeerplaats aan de overkant" },
      { term: "Auto's en transfers", def: "Transfers van luchthaven en haven, en een Fiat 500 Cabrio te huur" },
      { term: "Talen", def: "Engels, Grieks, Nederlands en Frans" },
      { term: "Drempelloze aankomst", def: "De suite Agapi heeft een eigen ingang aan de straat" },
    ],
    closingHeading: "Gastvrijheid begint vóór de sleutel",
    closingBody:
      "De familie die Ink runt, verhuurt al jaren kamers en huizen in dit deel van Kreta, onder de naam Crete Holiday Home. Wat dat in de praktijk betekent: de persoon die u een sleutel overhandigt, weet welke taverna in februari de wandeling waard is en welk strand op zondag leeg is.",
  },

  amenities: {
    "Air conditioning": "Airconditioning",
    "Free Wi-Fi": "Gratis wifi",
    "Satellite flat-screen TV": "Flatscreen-tv met satellietzenders",
    "Private shower room": "Eigen doucheruimte",
    "Mini fridge": "Koelkastje",
    Safe: "Kluis",
    "Hair dryer": "Föhn",
    "Soundproof windows": "Geluidsisolerende ramen",
    "Smoke detector": "Rookmelder",
    "Nespresso machine & kettle": "Nespresso-apparaat en waterkoker",
    "Iron & ironing board": "Strijkijzer en strijkplank",
    "Marble floors": "Marmeren vloeren",
    "Eco-friendly bathroom amenities": "Milieuvriendelijke badkamerproducten",
    "Fire extinguisher": "Brandblusser",
    "Private plunge pool": "Privédompelbad",
    "Kitchenette with electric stove & microwave":
      "Kitchenette met elektrische kookplaat en magnetron",
    "Lounge area": "Zithoek",
    Terrace: "Terras",
    "Step-free access & private entrance": "Drempelloze toegang en eigen ingang",
    "Walk-in shower": "Inloopdouche",
    "Toilet with grab rails": "Toilet met wandbeugels",
    "Coco-Mat mattress": "Coco-Mat matras",
    "Glass double shower cabin": "Glazen dubbele douchecabine",
    "Room closet": "Kledingkast",
    "Window seat": "Zitbank in de vensternis",
    Balcony: "Balkon",
    "Private terrace": "Privéterras",
    "Flat-screen TV": "Flatscreen-tv",
    "Full kitchen & kitchenette": "Volledige keuken en kitchenette",
    "Coffee maker": "Koffiezetapparaat",
    "Dining table": "Eettafel",
    "Sitting area & desk": "Zithoek en bureau",
    "Private parking": "Eigen parkeerplaats",
    "Backyard": "Binnenplaats",
    "Built-in window sofa": "Ingebouwde vensterbank met bank",
    "Concrete vanity table with black washbasin": "Betonnen wastafelmeubel met zwarte wasbak",
    "Family friendly": "Gezinsvriendelijk",
    "Glass double shower cabin beside the bed": "Glazen dubbele douchecabine naast het bed",
    "Heating & air conditioning": "Verwarming en airconditioning",
    "Patio / balcony": "Patio of balkon",
    "Private entrance": "Eigen ingang",
    "Private hot tub": "Eigen bubbelbad",
    "Private plunge pool / jacuzzi": "Eigen dompelbad met jacuzzi",
    "Private street entrance": "Eigen ingang aan de straat",
    "Two bathrooms": "Twee badkamers",
    "Two bedrooms": "Twee slaapkamers",
    "Waterfront position": "Ligging aan het water",
    "Heated private plunge pool / jacuzzi": "Verwarmd eigen dompelbad met jacuzzi",
    "Private interior courtyard": "Eigen binnenplaats",
  },
};
