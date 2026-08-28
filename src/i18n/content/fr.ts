import type { ContentText } from "./types";

export const fr: ContentText = {
  houses: {
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
  },

  rooms: {
    evexia: {
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
        "Un mélange de sérénité et de luxe. Trente mètres carrés répartis en deux chambres, avec une porte à soi plutôt qu'un couloir, ouvrant sur un patio ombragé doté de son propre bain à remous, d'un paravent de bois pour l'intimité et de transats posés sur l'herbe. Conçue pour les couples — et pour les voyages de noces, ce pour quoi on la demande le plus souvent.",
      notes: [],
      outlook: "Cour privée",
      outdoor: "Patio avec bain à remous privé",
    },
    zoi: {
      displayName: "Zoi",
      description:
        "Zoi veut dire la vie. Deux chambres et deux salles de bains sur trente mètres carrés — la seule suite ici où personne n'attend son tour le matin — avec une entrée privée et une cour arrière à soi, close de bois, plantée le long du mur et pourvue d'un bain à remous assez grand pour vous quatre. Celle que l'on prend avec des enfants, ou avec un second couple.",
      notes: [],
      outlook: "Cour arrière privée",
      outdoor: "Cour arrière avec bain à remous privé",
    },
    harmony: {
      displayName: "Harmony",
      description:
        "La plus grande des quatre. Une cour intérieure à l'abri des regards, avec un bassin privé, pour se reposer sans distraction ni interruption — la journée qui s'écoule au bord de l'eau, sous un ciel bleu vif, ou au clair de lune avec un verre de vin grec. À l'intérieur : un coin salon, un lit king-size de 1,80 m, un téléviseur de 55 pouces avec HDMI, deux fauteuils convertibles en lits, et un marbre élégant sous les pieds. La kitchenette réunit toutes les sortes de cafetières, une bouilloire, une plaque électrique et un four à micro-ondes.",
      notes: ["Tous les produits de bain sont écologiques."],
      outlook: "Cour intérieure privée",
      outdoor: "Cour avec bassin privé",
      level: "Rez-de-chaussée",
    },
    agapi: {
      displayName: "Agapi",
      description:
        "Agapi veut dire amour — le nom vient du soin apporté à sa conception, en particulier pour les personnes en situation de handicap. Elle a une entrée privée depuis la rue latérale, et une salle de bains entièrement construite aux normes d'une hygiène sûre et confortable, conçue pour les utilisateurs de fauteuil roulant. La cour intérieure paisible, avec son vieux puits pittoresque, est faite pour s'asseoir dehors comme on l'a toujours fait dans les quartiers crétois. Sols en marbre lisse dans toute la suite.",
      notes: ["Tous les produits de bain sont écologiques.", "Matelas Coco-Mat."],
      outlook: "Cour intérieure avec un vieux puits",
      outdoor: "Cour privée",
      level: "Rez-de-chaussée",
    },
    pathos: {
      displayName: "Pathos",
      description:
        "Pathos veut dire passion, et la chambre est bâtie autour d'un geste osé : une douche double en verre posée à côté du lit plutôt que cachée derrière une porte. C'est tout le projet — rien d'autre dans la suite ne lui dispute l'attention — et c'est pour cela que les couples la demandent par son nom. Une junior suite intime dans un angle privé et abrité de l'hôtel, avec une cour juste devant pour le café du matin sous le soleil grec, ou un verre au clair de lune. Adultes uniquement.",
      notes: ["Tous les produits de bain sont écologiques."],
      outlook: "Cour extérieure",
      outdoor: "Terrasse",
      level: "Niveau supérieur",
    },
    elpida: {
      displayName: "Elpida",
      description:
        "Elpida veut dire espoir, et deux gestes de conception tiennent toute la chambre. Une table-vasque en béton, minimale, se tient près du lit et porte un miroir et une vasque noire — la plomberie traitée comme du mobilier, non dissimulée. En face, un canapé est bâti dans l'embrasure des fenêtres et garni de coussins, de sorte que la meilleure place de la suite soit celle qui est dans la lumière. Lisez-y le matin avec un café, ou asseyez-vous le soir avec un verre de vin et écoutez la ville au clair de lune. Adultes uniquement.",
      notes: [],
      outlook: "Sur la vieille ville",
      outdoor: "Terrasse",
      level: "Premier étage",
    },

    "sea-view-balcony-house-of-europe": {
      displayName: "Vue mer avec balcon",
      description:
        "Une chambre chaleureuse de bois rustique et de murs blanchis à la chaux, face à la mer, avec un balcon pour la regarder.",
      notes: [
        "Les chambres côté mer peuvent être animées — ce sont les plus proches des cafés et des bars.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Vue mer",
      outdoor: "Balcon",
    },
    "sea-view-house-of-europe": {
      displayName: "Vue mer",
      description:
        "Quinze mètres carrés face à l'eau, dans le bâtiment qui fut la maison d'hôtes de l'Université de Crète.",
      notes: [
        "Les chambres côté mer peuvent être animées — ce sont les plus proches des cafés et des bars.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Vue mer",
    },
    "side-sea-view-balcony-house-of-europe": {
      displayName: "Vue mer latérale avec balcon",
      description:
        "La mer arrive ici de biais, encadrée entre les toits de la vieille ville, avec un balcon d'où regarder la lumière changer.",
      notes: ["Ménage tous les deux jours."],
      outlook: "Vue mer latérale",
      outdoor: "Balcon",
    },
    "balcony-house-of-europe": {
      displayName: "Chambre avec balcon",
      description:
        "Une chambre compacte tournée vers la vieille ville, avec un balcon au-dessus de la ruelle.",
      notes: ["Ménage tous les deux jours."],
      outlook: "Sur la vieille ville",
      outdoor: "Balcon",
    },
    "standard-house-of-europe": {
      displayName: "Chambre standard",
      description:
        "Quatorze mètres carrés tranquilles dans le bâtiment central, à une minute du petit-déjeuner.",
      notes: ["Ménage tous les deux jours."],
      outlook: "Sur la vieille ville",
    },
    "two-bedroom-apartment-house-of-europe": {
      displayName: "Appartement deux chambres",
      description:
        "Trente mètres carrés répartis sur deux chambres — la formule à retenir pour une famille, ou pour deux couples qui voyagent ensemble.",
      notes: [
        "Les chambres côté mer peuvent être animées — ce sont les plus proches des cafés et des bars.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
    },

    "room-with-terrace-phos": {
      displayName: "Chambre avec terrasse",
      description:
        "Une petite suite dont la vraie pièce est dehors — une terrasse privée au-dessus des toits de la vieille ville.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
      outdoor: "Terrasse",
    },
    "superior-balcony-phos": {
      displayName: "Chambre supérieure avec balcon",
      description:
        "La plus grande chambre de Phos : dix-huit mètres carrés et un balcon, pour trois personnes.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
      outdoor: "Balcon",
    },
    "superior-room-with-balcony-phos": {
      displayName: "Chambre supérieure avec balcon",
      description:
        "Vingt mètres carrés avec balcon, agencés pour dormir à quatre : un lit double, un canapé-lit et un lit superposé.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
      outdoor: "Balcon",
    },
    "standard-phos": {
      displayName: "Chambre standard",
      description:
        "Quinze mètres carrés dans la maison la plus calme, bois et plâtre blanc, volets sur la ruelle.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
    },
    "triple-phos": {
      displayName: "Chambre triple",
      description: "Un lit double et un lit simple, pour trois personnes qui voyagent ensemble.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
    },
    "quadruple-phos": {
      displayName: "Chambre quadruple",
      description: "Un lit double et deux lits superposés — la chambre familiale de Phos.",
      notes: [
        "Le petit-déjeuner est servi à House of Europe.",
        "Ménage tous les deux jours.",
      ],
      outlook: "Sur la vieille ville",
    },

    "residence-of-the-old-port": {
      displayName: "The Residence of the Old Port",
      description:
        "Une maison de deux chambres à vous seul, à cent mètres du port vénitien et à quatre cents mètres du Musée archéologique, avec parking privé et cuisine. La plage de Koumbes est à 1,6 kilomètre. Un petit-déjeuner continental est disponible.",
      notes: [],
      outlook: "Vieille ville de Réthymnon",
      outdoor: "Balcon et terrasse",
    },
  },

  experienceGroups: {
    table: {
      title: "À table",
      blurb:
        "La Crète mange mieux que presque partout ailleurs en Méditerranée. Voici les portes d'entrée.",
    },
    sea: {
      title: "Sur l'eau",
      blurb: "La côte est à quatre minutes à pied. Tout ce qui suit en part.",
    },
    land: {
      title: "Vers l'intérieur",
      blurb:
        "Des gorges, des villages de montagne, des monastères, et des routes qui ne mènent qu'à un endroit. Organisé pour vous.",
    },
    self: {
      title: "Pour vous",
      blurb: "Des arrangements plus discrets, à votre rythme.",
    },
  },

  experiences: {
    "rent-a-car": {
      title: "Une voiture de notre collection",
      summary:
        "Une Fiat 500 Cabrio, la nôtre et non celle d'un loueur — pour les jours où l'île est le sujet.",
      body: [
        "La baignade la plus proche est la plage de la ville elle-même, à quelques minutes à pied de la porte : elle commence là où finit la vieille ville et court vers l'est sur des kilomètres — du sable, une eau peu profonde, et assez d'espace pour qu'août ne la remplisse jamais tout à fait. On peut être dans la mer avant le petit-déjeuner et rentrer pour lui.",
        "La meilleure baignade est plus loin, dans des criques accessibles seulement par bateau, et sur la côte sud où l'eau change entièrement de couleur. Un bateau peut être pris en privé pour la journée. La réception l'organise.",
      ],
    },
    "kourtaliotiko-gorge": {
      title: "Les gorges de Kourtaliotiko",
      summary:
        "Une journée dans les gorges qui descendent vers Preveli — organisée avec Routes, la société d'excursions de la famille.",
      body: [
        "Les gorges de Kourtaliotiko traversent vers le sud les montagnes derrière Réthymnon et débouchent à Preveli, où une rivière bordée de palmiers rejoint la mer. De la roche à pic des deux côtés, des cascades au bas d'un long escalier, et une chapelle taillée dans la falaise.",
        "C'est une journée, pas une promenade : la route pour y aller, la descente, l'eau, et la plage au bout. Nous l'organisons avec Routes — la société d'excursions de la famille — pour que le guide soit quelqu'un que la réception connaît par son nom.",
      ],
    },
    "learn-the-secrets-of-cretan-cuisine": {
      title: "Les secrets de la cuisine crétoise",
      summary: "Goûtez la cuisine crétoise — et apprenez comment elle se fait.",
      body: ["Goûtez la cuisine crétoise, et découvrez les secrets qui la font."],
    },
    "wine-tasting": {
      title: "Dégustation de vins",
      summary:
        "Des vins remarquables, des saveurs distinctes, et la culture du vin de la Grèce antique qui les porte.",
      body: [
        "Goûtez des vins remarquables et des saveurs distinctes, et découvrez le vin, la culture viticole de la Grèce antique et les cépages propres à la Grèce.",
      ],
    },
    "wine-production": {
      title: "La production du vin",
      summary: "Le vin de Crète est connu dans le monde entier. Voyez comment il se fait.",
      body: [
        "Le vin de Crète est connu dans le monde entier. Venez avec nous explorer la manière dont il est produit dans les caves réputées de l'île.",
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
    "breakfast-on-the-beach": {
      title: "Petit-déjeuner sur la plage",
      summary: "Le petit-déjeuner, dressé sur le sable.",
      body: ["Prenez votre petit-déjeuner sur la plage. Cela s'organise."],
    },

    "private-boat-trip": {
      title: "Un bateau à vous",
      summary:
        "Des criques qu'on n'atteint que par la mer, une eau turquoise, et l'île vue comme il faut la voir.",
      body: [
        "Notre but est de vous montrer notre île depuis le confort de votre propre bateau. Nous disposons de bateaux loués exclusivement pour vous ou votre groupe, et nous organisons des croisières dans toute la Crète.",
        "Les nombreuses criques accessibles seulement par bateau, les plages de sable, les habitats marins à l'eau turquoise et le paysage rocheux composent un cadre remarquable pour le repos, l'exploration, la pêche et le plaisir.",
      ],
    },
    "scuba-diving": {
      title: "Plongée sous-marine",
      summary: "La Crète est aussi remarquable sous la surface qu'au-dessus.",
      body: [
        "La Crète offre des paysages envoûtants à sa surface comme sous la mer.",
        "L'eau bleue et claire donne assez envie pour s'y baigner. Mais que se passe-t-il en dessous ? Vous pouvez le découvrir — et passer un brevet de plongée en même temps.",
      ],
    },
    "water-sports": {
      title: "Sports nautiques",
      summary:
        "Jet-ski et safari en jet-ski, parachute ascensionnel, ski nautique — avec un maître-nageur en poste toute la journée.",
      body: [
        "Nous travaillons avec le meilleur opérateur de sports nautiques de Réthymnon. Notre partenaire fournit un matériel professionnel tenu à des normes de sécurité élevées.",
        "Le jet-ski et le safari en jet-ski, le parachute ascensionnel et le ski nautique ne sont qu'une partie des activités. Un maître-nageur est en poste toute la journée, et le matériel est vérifié chaque jour par du personnel spécialisé.",
      ],
    },
    "wedding-on-the-beach": {
      title: "Un mariage sur la plage",
      summary: "Le sable sous les pieds, le soleil au-dessus.",
      body: [
        "Vous rêvez d'un mariage sur la plage, le sable sous les pieds et le soleil au-dessus de la tête ? Parlez-nous-en, et nous l'organiserons.",
      ],
    },

    "jeep-safari": {
      title: "Safari en jeep",
      summary:
        "Les endroits difficiles à trouver du sud de la Crète, loin de la foule — en une seule journée.",
      body: [
        "Une sortie vers les endroits difficiles à trouver de la Crète, loin de la foule : des vues spectaculaires et le plaisir de rouler hors des routes à travers les paysages du sud de l'île — le tout en une seule journée.",
      ],
    },
    "quad-safari": {
      title: "Safari en quad",
      summary: "Vers les montagnes de Réthymnon, à travers gorges et rivières peu profondes.",
      body: [
        "Un itinéraire qui monte vers les montagnes de Réthymnon, à travers des gorges impressionnantes aux formations rocheuses remarquables, en traversant des rivières peu profondes en chemin.",
      ],
    },
    hiking: {
      title: "Randonnée",
      summary: "Demandez-nous des itinéraires. Les sentiers d'ici sont remarquables.",
      body: [
        "Demandez-nous des itinéraires à travers la Crète. Explorez les sentiers envoûtants et les paysages qu'ils ouvrent.",
      ],
    },
    "bike-tours": {
      title: "Sorties à vélo",
      summary: "Des vélos, et des itinéraires qui valent la peine.",
      body: ["Demandez-nous des vélos, et explorez les itinéraires de la Crète."],
    },
    "exclusive-tour": {
      title: "Une visite privée",
      summary: "L'histoire, la mythologie et la culture de la Crète, en visite privée.",
      body: [
        "Une visite personnelle et privée à travers l'histoire, la mythologie et la culture de la Crète. Parlez-nous-en pour les détails.",
      ],
    },
    running: {
      title: "Course à pied",
      summary: "Des parcours pour le matin, avant la chaleur.",
      body: [
        "Demandez-nous des itinéraires à travers la Crète. Explorez les sentiers envoûtants et les paysages qu'ils ouvrent.",
      ],
    },

    massage: {
      title: "Massage",
      summary: "Réservé pour vous, dans votre chambre.",
      body: ["Réservez votre rendez-vous pour un massage relaxant."],
    },
    therapist: {
      title: "Un thérapeute",
      summary: "Paix intérieure, équilibre et vitalité — dans la vie et dans les relations.",
      body: [
        "Trouvez votre espace de soin. Un thérapeute peut vous aider à trouver la paix intérieure, l'équilibre et la vitalité, dans la vie et dans les relations.",
      ],
    },
    "personal-trainer": {
      title: "Coaching personnel",
      summary: "Rester en forme en vacances, en privé.",
      body: [
        "Restez en forme pendant vos vacances. Un coach personnel peut venir jusqu'à vous, en toute discrétion et en toute sécurité.",
        "Nous pouvons aussi fournir du matériel TRX, un ballon de Pilates ou des vitamines.",
      ],
    },
    "chauffeur": {
      title: "Transferts aéroport et port",
      summary:
        "Accueil à Chania, à Héraklion ou au port, puis conduits jusqu'ici.",
      body: [
        "Vous avez organisé vos vacances sans savoir comment venir depuis l'aéroport ou le port ? Dites-le-nous, et nous vous attendrons à l'arrivée pour vous conduire. Notre propre chauffeur peut vous accueillir et vous amener.",
        "Les ruelles de la vieille ville sont étroites et le plus souvent à sens unique, et House of Europe se trouve à l'intérieur. Être déposé au bon coin avec ses bagages vaut d'être organisé — c'est la différence entre arriver et chercher son chemin.",
      ],
    },
    "private-helipad": {
      title: "Hélisurface privée",
      summary: "Disponible à Thalasses Villas, notre propriété sœur sur la côte crétoise.",
      body: [
        "Thalasses Villas — notre propriété sœur, qui domine largement la mer de Crète — est le seul domaine de villas en bord de mer de cette côte à disposer d'une hélisurface privée sur son terrain. L'arrivée peut être organisée par nos soins.",
      ],
    },
  },

  places: {
    "town-beach": {
      name: "La plage de la ville",
      distance: "À quelques minutes à pied",
      body:
        "La baignade la plus proche est la plage de la ville elle-même : elle commence là où finit la vieille ville et court vers l'est sur des kilomètres — du sable, une eau peu profonde, et assez d'espace pour qu'août ne la remplisse jamais tout à fait. C'est à quelques minutes à pied de la porte, pas un trajet en voiture : on peut y aller avant le petit-déjeuner et rentrer pour lui.",
    },
    "venetian-harbour": {
      name: "Le port vénitien",
      distance: "À quelques minutes à pied",
      body: "Voisin du port moderne et de son phare égyptien, c'est l'un des coins les plus pittoresques de la vieille ville. Il fonctionnait à l'époque byzantine, après 961, et prospéra sous les Vénitiens, qui entreprirent au XIVe siècle de grands travaux pour contenir l'ensablement qui le gêne encore. Des tavernes de bord de mer bordent le quai.",
    },
    fortezza: {
      name: "La Fortezza",
      distance: "À quelques minutes à pied",
      body: "La forteresse domine la colline de Palékastro, à côté de la vieille ville, et compte parmi les plus vastes de l'époque vénitienne. Elle s'élève sur le site de la citadelle de l'antique Rithimna et du temple d'Artémis Rokkéa. Le grand fort pentagonal fut bâti en 1573 ; son périmètre court sur 1 300 mètres, et quatre bastions se dressent le long des murs — Saint-Luc, Saint-Élie, Saint-Paul et Saint-Nicolas.",
    },
    "archaeological-museum": {
      name: "Musée archéologique",
      distance: "Dans la vieille ville",
      body:
        "La collection archéologique de la ville, dans l'ancienne église Saint-François — une église conventuelle vénitienne à quelques ruelles du port. Le musée s'y est installé en 2016, quittant son emplacement précédent près de la porte de la Fortezza.",
    },
    "historical-folklore-museum": {
      name: "Musée historique et folklorique",
      distance: "Dans la vieille ville",
      body: "Une demeure vénitienne de la vieille ville, monument classé du XVIIe siècle, abrite le musée historique et folklorique de la ville. Cinq salles réunissent une collection permanente d'artisanat traditionnel et d'art populaire — et le travail du musée protège le bâtiment lui-même.",
    },
    "arkadi-monastery": {
      name: "Le monastère d'Arkadi",
      distance: "23 km à l'est",
      body: "Près du village d'Amnatos, bâti à 500 mètres sur un plateau fertile d'oliveraies, de vignes, de pins, de cyprès et de chênes. Des chapelles pittoresques l'entourent, et les gorges d'Arkadi commencent là.",
    },
    "ancient-eleftherna": {
      name: "Le musée d'Eleftherna antique",
      distance: "Dans l'arrière-pays de Réthymnon",
      body: "Le premier musée de Crète construit à l'intérieur d'un site archéologique, à côté de la cité antique d'Eleftherna. Ses trois salles portent toute l'histoire du lieu, de 3000 av. J.-C. à 1300 apr. J.-C., à travers des objets du quotidien et des œuvres d'art.",
    },
  },

  chapters: {
    "old-town": {
      eyebrow: "Chapitre un",
      title: "La vieille ville",
      body: [
        "Le quartier autour d'Ink est une trame de ruelles trop étroites pour les voitures, tracée par les Vénitiens et habitée depuis. Les portes portent des linteaux sculptés vieux de quatre cents ans. En été, la bougainvillée passe par-dessus les murs et retombe dans la rue.",
        "Ce n'est pas un quartier mis sous cloche. Des gens y vivent — du linge, des chats, des scooters, une dispute deux étages plus haut — et c'est précisément ce qui rend la promenade de huit heures du soir meilleure que n'importe quelle excursion.",
      ],
      imageAlt:
        "Une rue de la vieille ville de Réthymnon vue d'un balcon, maisons ocre de part et d'autre",
      notes: [{ term: "Depuis la porte", def: "Vous y êtes déjà" }],
    },
    venetian: {
      eyebrow: "Chapitre deux",
      title: "La pierre vénitienne",
      body: [
        "La Fortezza se dresse sur la colline de Palékastro au-dessus de la ville, bâtie en 1573 sur le site de la citadelle de l'antique Rithimna et du temple d'Artémis Rokkéa. Ses murs courent sur 1 300 mètres, avec quatre bastions — Saint-Luc, Saint-Élie, Saint-Paul et Saint-Nicolas.",
        "En contrebas, le port vénitien s'enroule derrière son phare égyptien. Il fonctionnait à l'époque byzantine, après 961, et prospéra sous les Vénitiens, qui entreprirent au XIVe siècle de grands travaux contre l'ensablement qui le gêne encore aujourd'hui.",
      ],
      imageAlt: "La forteresse Fortezza au-dessus de la vieille ville de Réthymnon",
      notes: [
        { term: "Fortezza", def: "Bâtie en 1573 · 1 300 m de murs" },
        { term: "Port", def: "En service depuis le Xe siècle" },
      ],
    },
    sea: {
      eyebrow: "Chapitre trois",
      title: "L'eau",
      body: [
        "La plage de la ville commence là où la vieille ville s'arrête et file vers l'est sur des kilomètres — du sable, de l'eau peu profonde, et assez d'espace pour que le mois d'août ne la remplisse jamais tout à fait.",
        "Les meilleures baignades sont plus loin, dans des criques qu'on n'atteint qu'en bateau, et sur la côte sud où l'eau change entièrement de couleur. Un bateau peut être pris en privé pour la journée. La réception l'organise.",
      ],
      imageAlt:
        "Le port et le littoral de Réthymnon vus d'en haut, eau turquoise contre la ville",
      notes: [{ term: "Plage de Koumbes", def: "À 1,6 km de la Residence" }],
    },
    table: {
      eyebrow: "Chapitre quatre",
      title: "Ce que mange la Crète",
      body: [
        "La cuisine crétoise est le plus ancien argument en faveur du régime méditerranéen, et ce n'est pas ici une discipline de santé — c'est le déjeuner. Herbes sauvages, fromage de brebis, biscotte d'orge, huile d'olive versée comme si elle ne coûtait rien, et agneau cuit lentement avec ce qui poussait le plus près.",
        "Le vin de Crète est connu dans le monde entier, et les domaines des collines derrière Réthymnon vous montreront comment il se fait. Plus près, ces ruelles abritent de petites cantines qui font des salades et des jus frais, et des bars qui préparent les meilleurs cocktails glacés de l'été.",
      ],
      imageAlt: "Une table dressée au bord de la mer à Réthymnon",
      notes: [
        { term: "Petit-déjeuner", def: "Cuisine locale, à House of Europe" },
        { term: "Organisé", def: "Dégustation de vins, une ferme" },
      ],
    },
    inland: {
      eyebrow: "Chapitre cinq",
      title: "Derrière la ville",
      body: [
        "À vingt minutes dans les terres, la côte cesse de compter. Des gorges s'ouvrent, des villages se tiennent au bout de routes uniques, et les montagnes montent vers des neiges qui durent jusqu'en mai.",
        "Le monastère d'Arkadi est à 23 kilomètres à l'est, bâti à 500 mètres sur un plateau d'oliviers, de vignes, de pins, de cyprès et de chênes, les gorges d'Arkadi commençant en contrebas. Plus loin, le musée d'Ancient Eleftherna — le premier musée de Crète construit à l'intérieur d'un site archéologique — porte toute l'histoire du lieu, de 3000 av. J.-C. à 1300 apr. J.-C.",
        "Au sud, les gorges de Kourtaliotiko descendent vers Preveli, où une rivière bordée de palmiers se jette dans la mer. Celles-là font une journée et non un après-midi, et nous les organisons avec Routes, la société d'excursions de la famille.",
      ],
      imageAlt: "Les montagnes et les gorges de l'arrière-pays de Réthymnon",
      notes: [
        { term: "Arkadi", def: "23 km à l'est · 500 m d'altitude" },
        { term: "Eleftherna", def: "3000 av. J.-C. – 1300 apr. J.-C." },
      ],
    },
    hidden: {
      eyebrow: "Chapitre six",
      title: "Ce que vous ne trouveriez pas",
      body: [
        "Chaque ville a une version d'elle-même qui ne s'ouvre qu'à ceux qui connaissent quelqu'un. Quelle ruelle est inondée après la pluie. Quelle plage se vide le dimanche. Quelle taverne vaut encore le déplacement en février, quand la plupart ont fermé pour l'hiver.",
        "C'est là le véritable argument pour loger dans une maison de famille plutôt que dans un établissement à charte de marque. Demandez à la réception, et la réponse vient de quelqu'un qui vit ici.",
      ],
      imageAlt: "Une porte vénitienne verte dans une ruelle calme de la vieille ville",
    },
  },

  rethymnoIntro: {
    title: "Une ville bâtie sur elle-même",
    lede: "L'antique Rithimna, un port byzantin, un fort vénitien, des ruelles ottomanes et deux maisons des années 1700 — superposés sur un même promontoire, et assez petits pour se parcourir en un après-midi.",
    body: [
      "Réthymnon se tient à mi-chemin de la côte nord de la Crète, entre La Canée et Héraklion, une montagne derrière elle et la mer de Crète devant. Sa vieille ville est l'une des mieux conservées de Grèce : personne ne l'a rasée, si bien que les portes vénitiennes, les fontaines ottomanes et les balcons de bois sont encore là où on les a posés.",
      "Ce que cela change pour un séjour est simple. On ne vous conduit pas à des attractions. Vous franchissez une porte et vous y êtes.",
    ],
  },

  history: {
    eyebrow: "Autrefois",
    title: "Une imprimerie, un journal, une maison d'hôtes",
    paragraphs: [
      "Le bâtiment devenu Ink était une imprimerie. On y publiait le journal ΑΓΩΝ — Combat — de Fotakis, qui fut ensuite député et procureur à Athènes.",
      "Le bâtiment central, connu sous le nom de House of Europe, était la maison d'hôtes de l'Université de Crète. Ses hôtes étaient des professeurs et des chercheurs venus donner des conférences qui comptaient pour la communauté scientifique et pour la ville. Les expositions d'art font depuis longtemps partie de la vie de la maison.",
      "Trois bâtiments historiques distincts des années 1700, au centre de la vieille ville médiévale. Ils sont un point d'ancrage de la vie de Réthymnon.",
    ],
  },

  neighbourhood: {
    title: "À l'ombre de la Fortezza",
    paragraphs: [
      "Ink se tient sous l'imposante Fortezza — la forteresse que le pirate Barbarossa envahit jadis — et à quelques pas de la mer et du port vénitien médiéval, où les marchands échangeaient autrefois des marchandises venues du monde entier.",
      "Marchez dans les rues autour d'Ink et vous trouverez les ruelles où passaient les chevaliers, de petites cantines locales à la bonne cuisine, aux salades et aux jus frais. Et ce quartier bien vivant compte des bars qui vous serviront les meilleurs cocktails glacés de l'été.",
    ],
  },

  faqs: [
    {
      question: "Où se trouve exactement l'hôtel ?",
      answer:
        "Au centre de la vieille ville médiévale de Réthymnon, en Crète, à quelques pas du port vénitien et sous la Fortezza. Vous arrivez à House of Europe, au 4 rue Nikolaou Plastira — c'est là que se trouvent la réception et les sept suites. Phos, le deuxième bâtiment, est au 10 rue Fotaki. L'hôtel possède aussi des adresses au 2 rue Psaron et au 26 rue Damvergi ; on vous accompagne à la vôtre depuis la réception. L'enregistrement se fait ici pour tous les bâtiments, y compris la Residence du vieux port.",
    },
    {
      question: "Quelle est la différence entre House of Europe et Phos ?",
      answer:
        "House of Europe est le premier bâtiment, au 4 rue Nikolaou Plastira. La réception y est, le petit-déjeuner y est servi pour tous les clients, et les sept suites y sont. C'était autrefois la maison d'hôtes de l'Université de Crète. Phos, dont le nom est le mot grec pour lumière, est le deuxième bâtiment, à quelques pas : sept chambres, numérotées de un à sept, et le plus calme des deux. The Residence of the Old Port est une maison à part, près du port.",
    },
    {
      question: "Le petit-déjeuner est-il inclus ?",
      answer:
        "Le petit-déjeuner buffet est disponible en supplément et servi à House of Europe, y compris pour les clients logés à Phos. Il peut aussi être servi en chambre moyennant un supplément. Les tarifs et les prestations incluses sont confirmés au moment de la réservation.",
    },
    {
      question: "Y a-t-il des chambres avec piscine ou bain à remous ?",
      answer:
        "Quatre des sept suites ont leur propre eau. Evexia dispose d'un bain à remous privé encastré dans sa terrasse, au-dessus du front de mer ; Eros et Zoi en ont chacune un, dans une cour à elles. Harmony dispose d'un bassin privé chauffé — l'eau est chaude quel que soit le mois — dans sa propre cour intérieure, à l'abri des regards. Il n'y a pas de piscine commune — la mer est à quelques minutes à pied.",
    },
    {
      question: "L'hôtel est-il accessible ?",
      answer:
        "La suite Agapi a été conçue pour l'accessibilité : accès de plain-pied par une entrée privée depuis la rue latérale, douche à l'italienne, et toilettes équipées de barres d'appui, construites aux normes d'une hygiène sûre et confortable pour les utilisateurs de fauteuil roulant. Contactez-nous avant de réserver, afin que nous puissions confirmer que le chemin jusqu'au bâtiment vous convient — la vieille ville est historique, et ses ruelles sont pavées.",
    },
    {
      question: "Certaines chambres sont-elles réservées aux adultes ?",
      answer:
        "Pathos et Elpida n'accueillent que des adultes. Toutes les autres suites et chambres accueillent les familles ; Zoi, avec ses deux chambres et ses deux salles de bains, est celle que l'on demande le plus souvent avec des enfants.",
    },
    {
      question: "À quelle heure ferme la réception ?",
      answer:
        "La réception est ouverte jusqu'à 23h00, à House of Europe, 4 rue Nikolaou Plastira. Si votre vol atterrit plus tard, prévenez-nous à l'avance et quelqu'un sera là pour vous accueillir.",
    },
    {
      question: "À quelle heure se fait l'arrivée ?",
      answer:
        "L'arrivée se fait à partir de 16h00 et le départ avant 11h00. Dites-nous quand vous atterrissez et votre clé sera prête à votre arrivée au premier bâtiment.",
    },
    {
      question: "Y a-t-il un parking ?",
      answer:
        "Le stationnement dans le quartier de l'hôtel est gratuit, sur le parking d'en face. Les clients des Gateway Suites reçoivent une carte de stationnement, selon disponibilité. The Residence of the Old Port a son propre parking privé.",
    },
    {
      question: "Puis-je venir avec mon chien ?",
      answer: "Les animaux ne sont pas acceptés.",
    },
    {
      question: "Est-ce bruyant ?",
      answer:
        "La vieille ville est vivante, et c'est une bonne part de son plaisir. L'établissement signale que les chambres côté mer sont les plus proches des cafés et des bars et peuvent être animées. Les chambres ont des fenêtres insonorisées. Si vous avez le sommeil léger, dites-le-nous et nous vous placerons en conséquence.",
    },
    {
      question: "Quelles langues sont parlées ?",
      answer: "L'anglais, le grec, le néerlandais et le français.",
    },
    {
      question: "Comment venir depuis l'aéroport ?",
      answer:
        "Réthymnon se situe entre les aéroports de La Canée et d'Héraklion. Notre propre chauffeur peut vous accueillir à l'un ou l'autre aéroport, ou au port, et vous amener — indiquez-nous votre arrivée et nous l'organiserons.",
    },
    {
      question: "Y a-t-il le Wi-Fi ?",
      answer:
        "Oui, Wi-Fi gratuit partout, et des chambres insonorisées avec un bureau pour travailler.",
    },
    {
      question: "Quand les chambres ont-elles été rénovées pour la dernière fois ?",
      answer:
        "House of Europe a été rénové en mai 2020, et Phos en juin 2019. Le ménage est organisé pour chaque séjour — généralement tous les deux jours.",
    },
  ],

  arrival: {
    title: "Vous êtes accueilli à une seule porte",
    lede: "L'hôtel occupe deux bâtiments de la vieille ville, plus une résidence près du port. Vous arrivez à une seule porte — House of Europe, le premier bâtiment, au 4 rue Nikolaou Plastira — et quelqu'un vous conduit ensuite jusqu'à votre chambre.",
    receptionHeading: "Nikolaou Plastira 4",
    receptionLabel: "Premier bâtiment · Réception",
    receptionBody: [
      "C'est la porte. Pas le deuxième bâtiment, pas le troisième — le premier, sur Nikolaou Plastira, à quelques minutes du port vénitien et sous la Fortezza.",
      "Quelle que soit la chambre retenue, quelle que soit la maison où elle se trouve, vous commencez ici. Quelqu'un vous attend, votre clé est prête, et le trajet jusqu'à votre bâtiment est court et fait avec vous.",
    ],
    steps: [
      {
        title: "Dites-nous quand vous atterrissez",
        body: "Envoyez-nous votre heure d'arrivée et votre façon de voyager. Notre propre chauffeur peut vous accueillir à l'aéroport de La Canée ou d'Héraklion, ou au port, et vous amener — les ruelles de la vieille ville sont étroites, et se faire conduire jusqu'au bon angle vaut la peine d'être organisé.",
      },
      {
        title: "Venez au premier bâtiment",
        body: "Nikolaou Plastira 4. C'est la réception de tout l'hôtel, et les sept suites y sont. Elle est ouverte jusqu'à 23h00. Le stationnement est gratuit dans le quartier, sur le parking d'en face ; les clients des Gateway Suites reçoivent une carte de stationnement, selon disponibilité. L'enregistrement se fait ici pour tous les bâtiments, y compris la Residence du vieux port.",
      },
      {
        title: "Nous vous accompagnons",
        body: "Personne ne reçoit un plan et un code de porte. Votre clé, votre bâtiment et le chemin pour y aller vous sont remis en personne — avec les deux ou trois choses sur ce quartier que seul quelqu'un qui y vit vous dirait.",
      },
      {
        title: "La journée vous appartient",
        body: "Un bateau, une table, un itinéraire accessible en fauteuil, un étage calme, une bouteille qui attend dans la chambre. Demandez à la réception. La plupart du temps, c'est un appel que nous avons déjà passé cent fois.",
      },
    ],
    facts: [
      { term: "Réception", def: "House of Europe, Nikolaou Plastira 4 — le premier bâtiment. Ouverte jusqu'à 23h00." },
      { term: "Arrivée", def: "À partir de 16h00. Départ avant 11h00." },
      { term: "Par téléphone", def: "+30 211 444 5757, poste 1" },
      { term: "WhatsApp", def: "+30 697 406 9475" },
      { term: "Petit-déjeuner", def: "Buffet au House of Europe pour tous les clients, et en chambre moyennant un léger supplément" },
      { term: "Stationnement", def: "Gratuit, sur le parking d'en face" },
      { term: "Voitures et transferts", def: "Transferts aéroport et port, et une Fiat 500 Cabrio à louer" },
      { term: "Langues", def: "Anglais, grec, néerlandais et français" },
      { term: "Arrivée de plain-pied", def: "La suite Agapi a sa propre entrée sur rue" },
    ],
    closingHeading: "L'hospitalité commence avant la clé",
    closingBody:
      "La famille qui tient Ink loue des chambres et des maisons dans cette partie de la Crète depuis des années, sous le nom de Crete Holiday Home. Concrètement, cela veut dire que la personne qui vous remet une clé sait quelle taverne vaut le déplacement en février, et quelle plage est vide le dimanche.",
  },

  amenities: {
    "Air conditioning": "Climatisation",
    "Free Wi-Fi": "Wi-Fi gratuit",
    "Satellite flat-screen TV": "Téléviseur à écran plat avec satellite",
    "Private shower room": "Salle d'eau privée",
    "Mini fridge": "Mini-réfrigérateur",
    Safe: "Coffre-fort",
    "Hair dryer": "Sèche-cheveux",
    "Soundproof windows": "Fenêtres insonorisées",
    "Smoke detector": "Détecteur de fumée",
    "Nespresso machine & kettle": "Machine Nespresso et bouilloire",
    "Iron & ironing board": "Fer et planche à repasser",
    "Marble floors": "Sols en marbre",
    "Eco-friendly bathroom amenities": "Produits de bain écologiques",
    "Fire extinguisher": "Extincteur",
    "Private plunge pool": "Bassin privé",
    "Kitchenette with electric stove & microwave":
      "Kitchenette avec plaque électrique et micro-ondes",
    "Lounge area": "Coin salon",
    Terrace: "Terrasse",
    "Step-free access & private entrance": "Accès de plain-pied et entrée privée",
    "Walk-in shower": "Douche à l'italienne",
    "Toilet with grab rails": "Toilettes avec barres d'appui",
    "Coco-Mat mattress": "Matelas Coco-Mat",
    "Glass double shower cabin": "Cabine de douche double en verre",
    "Room closet": "Placard",
    "Window seat": "Banquette de fenêtre",
    Balcony: "Balcon",
    "Private terrace": "Terrasse privée",
    "Flat-screen TV": "Téléviseur à écran plat",
    "Full kitchen & kitchenette": "Cuisine complète et kitchenette",
    "Coffee maker": "Cafetière",
    "Dining table": "Table à manger",
    "Sitting area & desk": "Coin salon et bureau",
    "Private parking": "Parking privé",
    "Backyard": "Cour",
    "Built-in window sofa": "Banquette intégrée sous la fenêtre",
    "Concrete vanity table with black washbasin": "Plan-vasque en béton avec vasque noire",
    "Family friendly": "Adapté aux familles",
    "Glass double shower cabin beside the bed": "Cabine de douche double en verre près du lit",
    "Heating & air conditioning": "Chauffage et climatisation",
    "Patio / balcony": "Patio ou balcon",
    "Private entrance": "Entrée privée",
    "Private hot tub": "Bain à remous privé",
    "Private plunge pool / jacuzzi": "Petite piscine privée avec jacuzzi",
    "Private street entrance": "Entrée privée sur rue",
    "Two bathrooms": "Deux salles de bains",
    "Two bedrooms": "Deux chambres",
    "Waterfront position": "Situation en bord de mer",
    "Heated private plunge pool / jacuzzi": "Petite piscine privée chauffée avec jacuzzi",
    "Private interior courtyard": "Cour intérieure privée",
  },
};
