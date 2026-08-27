/**
 * English — the source of truth.
 *
 * Every other catalogue is typed against this shape, so a missing key is a
 * compile error rather than a blank space on a page in production.
 *
 * Voice: short declaratives, one idea per sentence. Metric. British spelling.
 * No exclamation marks. Never: unique, stunning, breathtaking, nestled, oasis,
 * hidden gem, boasts, indulge, pamper, unforgettable, iconic, luxurious.
 */
export const en = {
  meta: {
    tagline: "Small hotel. Long story.",
  },

  nav: {
    rooms: "Rooms",
    staying: "Staying",
    rethymno: "Rethymno",
    gallery: "Gallery",
    story: "Story",
    arrival: "Arrival",
    contact: "Contact",
    home: "Home",
    faq: "Frequently asked",
    accessibility: "Accessibility",
    careers: "Careers",
    privacy: "Privacy policy",
    terms: "Terms of use",
    location: "Location",
  },

  actions: {
    bookNow: "Book now",
    askUs: "Ask us",
    seeRooms: "Where you sleep",
    allRooms: "All {count} rooms",
    allExperiences: "All {count} experiences",
    readStory: "Read the whole story",
    writeToUs: "Write to us",
    directions: "Directions",
    directionsAndContact: "Directions and contact",
    openInMaps: "Open in Google Maps",
    loadMap: "Load the map",
    scroll: "Scroll",
    close: "Close",
    clear: "Clear",
    everythingElse: "Everything else",
    seeTheSuite: "See the suite",
    theWholeArrival: "The whole arrival",
    seeCollection: "See the whole collection",
    more: "More",
  },

  booking: {
    arriving: "Arriving",
    leaving: "Leaving",
    guests: "Guests",
    rooms: "Rooms",
    guest_one: "{count} guest",
    guest_other: "{count} guests",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    reservingAs: "Reserving as",
    findYourDates: "Find your dates",
    opensInNewTab: "Opens our reservation system in a new tab. Or call {phone}.",
    handoffNote:
      "Dates and rates open in our booking system, inkhotels.reserve-online.net, in a new tab.",
    orCall: "Or call {phone} or {phone2}. We speak {languages}.",
    speakToSomeone: "Prefer to speak to someone? Call {phone}.",
    /* Shown only on the suites the reservation engine cannot yet link to
       directly, so the button never lands a guest on a front page with no
       way forward. */
    byNameNote: "This suite is reserved by name rather than through the search — write or call and it is held for you:",
    bookDirectTitle: "Booking direct",
    bookDirectKeys: "You are dealing with the family who hold the keys, not a call centre.",
    bookDirectArrange: "Arrangements are made before you arrive — a transfer, the Fiat, a cot, a quieter floor.",
    bookDirectAnswer: "A direct question gets a direct answer, by phone or WhatsApp, until 23:00.",
  },

  concierge: {
    title: "Ask us anything",
    eyebrow: "The desk",
    intro:
      "A room, a boat, a table, a step-free route through the old town. We answer in {languages}.",
    callReception: "Call reception",
    mobile: "Mobile",
    whatsapp: "WhatsApp",
    /* Plain on purpose. A prefilled message that reads like marketing gets
       answered like marketing. */
    whatsappGreeting:
      "Hello — I am looking at the Ink Hotels site and have a question.",
    whatsappNote: "Free from abroad",
    writeToUs: "Write to us",
    greekTime: "Rethymno, Greek time",
    urgent: "For anything urgent",
    withinADay: "We answer within a day",
    orFindDates: "Or find your dates",
    villasLine: "Villas and houses across Crete — {group}",
  },

  home: {
    heroEyebrow: "Rethymno · Crete",
    heroTitleLine1: "The Gateway Suites.",
    heroTitleLine2: "Seven of them, in the old town.",
    heroLede:
      "All seven are at House of Europe, on Nikolaou Plastira — three with a private hot tub, one with a plunge pool in its own courtyard. Phos, a few steps away, has seven rooms of its own. Both are houses of the 1700s, under the Fortezza, minutes from the Venetian harbour. One of them was a printing press: it gave the hotel its name.",

    pressEyebrow: "The name",
    pressTitle: "A hotel named after what the building used to make",
    pressLede: "This was a printing shop.",
    /* The imprint line, set beneath the mark the way a colophon sits at the
       foot of a title page. */
    pressImprint: "Set, inked and pressed · Rethymno, Crete",
    /* The newspaper is named once, in prose, where it reads as provenance —
       not at display scale, where four Greek capitals ask an international
       reader to decode rather than to feel. */
    pressBody1:
      "A press stood in this building. It printed a newspaper — ΑΓΩΝ — published by Fotakis, a lawyer who later became a congressman and a public prosecutor in Athens. The type was set by hand, one letter at a time, and pulled on paper in this room.",
    pressBody2:
      "The central house has been called the House of Europe ever since it was the guest house of the University of Crete. Professors and researchers stayed here between lectures. Art exhibitions are still part of the place.",
    pressPull: "Ink is not a colour here. It is what this building did for a living.",

    markEyebrow: "The mark",
    markTitle: "A fingerprint, pressed into paper",
    markBody1:
      "The hotel's mark is a thumbprint — rings pressed into a surface, spreading from a single point of contact. It is the same act the building performed for a living: type, pressure, an impression left behind.",
    markBody2:
      "It is also the oldest way of saying this was mine, I was here. Which is, in the end, what a stay is for.",

    lightEyebrow: "The second building",
    lightBody1:
      "The second building is called Phos. It is the Greek word for light, and it is the quieter of the two — seven rooms, numbered one to seven, a short walk from reception and breakfast at House of Europe.",
    lightBody2:
      "Ink and light are the same act. A mark is pressed into a surface; light thrown across it at a low angle is what makes the mark readable. One building is named for the mark, the other for what reveals it.",
    lightSpec: "Seven rooms · Renovated June 2019",

    settingEyebrow: "The setting",
    settingTitle: "Under the shadow of the Fortezza",
    settingBody1:
      "Ink sits beneath the Fortezza — the fortress the pirate Barbarossa once invaded — and a few steps from the sea and the medieval Venetian port, where merchants traded goods from all over the world.",
    settingBody2:
      "Walk the streets around Ink and you find the alleys knights once rode through, small local luncheonettes with good food, and a quarter that stays alive well after dark.",
    settingCaption1: "The lanes, four minutes from the door",
    settingCaption2: "The Venetian harbour and its lighthouse",

    roomsEyebrow: "Where you sleep",
    roomsTitle: "Twenty ways to stay",
    roomsLede:
      "Seven suites at House of Europe, seven rooms at Phos, and one whole residence by the harbour — from twelve square metres under the roof to forty with a heated courtyard pool.",
    promiseHouseOfEurope:
      "The first building, and the reception. All seven suites are here — three with a private hot tub, one of them above the water, and one with a heated plunge pool in its own courtyard — along with the sea-facing rooms and breakfast.",
    promisePhos:
      "The quieter building. Seven rooms, numbered one to seven, and terraces that open over the rooftops of the old town.",
    promiseResidence:
      "A two-bedroom house of your own, a hundred metres from the Venetian harbour, with a kitchen and private parking.",
    roomsRenovated: "Renovated 2019 · 2020",

    waterEyebrow: "The water",
    waterTitle: "Four of the seven come with their own water.",
    waterBody:
      "Evexia has a private hot tub set into its terrace, with the sea running the full width of the view behind it. Eros and Zoi each have one in a courtyard of their own. Harmony has a heated plunge pool in a secluded interior courtyard — the water is warm whatever the month — forty square metres on the ground floor, with a king bed, a lounge and marble underfoot. Not one of them is shared with anybody.",
    waterSpec: "Three private hot tubs · one heated private plunge pool",

    agapiEyebrow: "Agapi",
    agapiMeaning: "love",
    agapiTitle: "A suite designed so the door is never the problem",
    agapiBody1:
      "Agapi is named for the care invested in its design, particularly for people with special needs. It is on the ground floor, with a private entrance from the side street. The bathroom is built to the standards of safe and comfortable hygiene care, for wheelchair users.",
    agapiBody2:
      "Thirty square metres, marble floors, a Coco-Mat mattress, and a serene inner courtyard with a picturesque old well — the kind of place a Cretan neighbourhood has always sat outside in.",

    stayingEyebrow: "The art of staying",
    stayingTitle: "Anyone can sell you a room",
    stayingLede:
      "The difference is the hours you spend outside it. Twenty-two arrangements — a boat of your own, a morning nobody else knows about.",

    familyEyebrow: "Crete Holiday Home",
    familyTitle: "A family, not a chain",
    familyBody1:
      "Ink is run by Crete Holiday Home — a family-owned boutique hotel and villas company that has been letting rooms, houses and villas along this coast for years. Their promise is authentic Greek hospitality, and it is the reason the desk here can answer questions a front desk usually cannot.",
    familyBody2:
      "Which beach is empty on a Sunday in August. Which taverna is still worth it in February. Which lane floods after rain. That knowledge is not in any guidebook, and it is the actual difference between a room and a stay.",

    factsEyebrow: "Worth knowing",
    factsTitle: "The plain facts, before you ask",
    whereEyebrow: "Where we are",
    whereTitle: "In the middle of the medieval town",

    datesEyebrow: "Now the dates",
    datesTitle: "Come and stay",
    settingP1: "Ink sits beneath the Fortezza — the fortress the pirate Barbarossa once invaded — and a few steps from the sea and the medieval Venetian port, where merchants traded goods from all over the world.",
    settingP2: "Walk the streets around Ink and you find the alleys knights once rode through, small local luncheonettes with good food, and a quarter that stays alive well after dark.",
    settingCaptionLanes: "The lanes, four minutes from the door",
    settingCaptionHarbour: "The Venetian harbour and its lighthouse",
    arrangeEyebrow: "The art of staying",
    arrangeTitle: "Anyone can sell you a room",
    arrangeLede: "The difference is the hours you spend outside it. Twenty-two arrangements — a boat of your own, a morning nobody else knows about.",
    agapiP1: "Agapi is named for the care invested in its design, particularly for people with special needs. It is on the ground floor, with a private entrance from the side street. The bathroom is built to the standards of safe and comfortable hygiene care, for wheelchair users.",
    agapiP2: "Thirty square metres, marble floors, a Coco-Mat mattress, and a serene inner courtyard with a picturesque old well — the kind of place a Cretan neighbourhood has always sat outside in.",
    agapiFeatureEntrance: "Step-free private entrance",
    agapiFeatureShower: "Walk-in shower",
    agapiFeatureRails: "Toilet with grab rails",
    agapiFeatureGround: "Ground floor throughout",
    familyP1: "Ink is run by Crete Holiday Home — a family-owned boutique hotel & villas company that has been letting rooms, houses and villas along this coast for years. Their promise is authentic Greek hospitality and the ultimate in simple, effortless charm, and it is the reason the desk here can answer questions a front desk usually cannot.",
    familyP2: "Which beach is empty on a Sunday in August. Which taverna is still worth it in February. Which lane floods after rain. That knowledge is not in any guidebook, and it is the actual difference between a room and a stay.",
    familyProofVillasTerm: "Villas & hotels",
    familyProofVillasBody: "Thalasses Villas, Villa Thetis, Ikaros, Casa Vitae and a dozen more along this coast — the same family, the same standards.",
    familyProofOfficesTerm: "Three offices",
    familyProofOfficesBody: "Rethymno, Heraklion and Athens.",
    familyProofLocalTerm: "Local, not chain",
    familyProofLocalBody: "Nobody here is following a brand manual. The advice you get at the desk is the advice they would give a friend.",
    rethymnoPremise: "You do not travel to it. You walk out into it.",
    harbourEyebrow: "Four minutes from the door",
    harbourTitle: "The harbour, at the end of the day",
    landmarksEyebrow: "What stands around you",
    landmarksTitle: "Seven things worth the walk",
    feedEyebrow: "From the account",
    feedHandle: "@ink_hotels",
    feedAlts: {
      evexiaTub: "The private hot tub on the Evexia terrace, the sea behind it",
      harbour: "The Venetian harbour of Rethymno with its Egyptian lighthouse",
      zoiYard: "The hot tub in the fenced backyard of the Zoi suite",
      lane: "A narrow lane of the old town, wooden Venetian balconies overhead",
      pool: "The heated private plunge pool in the interior courtyard of the Harmony suite",
      lighthouse: "The Egyptian lighthouse at the Venetian harbour at dusk",
    },
    guestsTitle: "What guests said",
  },

  arrival: {
    eyebrow: "Arrival",
    title: "You are met at one door",
    lede: "The hotel occupies two buildings in the old town, and a residence by the harbour. You come to one door — House of Europe, the first building, at Nikolaou Plastira 4 — and somebody walks you to your room from there.",
    receptionLabel: "First building · Reception",
    howItGoes: "How it goes",
    fromAirport: "From the airport to the key",
    worthKnowing: "Worth knowing before you set off",
    whoMeetsYou: "Who meets you",
  },

  rooms: {
    eyebrow: "{count} ways to stay · Seven suites · Two buildings",
    title: "Twenty ways to stay",
    gatewaySuites: "The Gateway Suites",
    theSuites: "The Gateway Suites",
    theRooms: "The rooms",
    whoIsComing: "Who is coming",
    whatYouWakeTo: "What you wake up to",
    any: "Any",
    two: "Two",
    three: "Three",
    four: "Four",
    everything: "Everything",
    seaView: "Sea view",
    balcony: "Balcony",
    terrace: "Terrace",
    hotTub: "Jacuzzi / hot tub",
    plungePool: "Heated private plunge pool",
    wheelchair: "Designed for wheelchair users",
    badgeHotTub: "Private hot tub",
    badgePlungePool: "Heated plunge pool",
    badgeAccessible: "Step-free",
    badgeAdultsOnly: "Adults only",
    tour360: "Walk through it in 360°",
    tour360Note: "Opens the property's own virtual tour in a new tab.",
    tour360Facade: "Loads nothing until you open it — the tour is hosted by the property's own viewer.",
    tour360Live: "The property's own 360° viewer, running in this page.",    allCount: "All {count} rooms",
    matchCount_one: "{count} room matches",
    matchCount_other: "{count} rooms match",
    noMatch: "Nothing matches that combination",
    noMatchBody:
      "Try widening it — or write to us and we will find the right room for you.",
    theRoom: "The room",
    whatIsInIt: "What is in it",
    alsoInHouse: "Also in {house}",
    size: "Size",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    sleeps: "Sleeps",
    beds: "Beds",
    outlook: "Outlook",
    outdoor: "Outdoor",
    level: "Level",
    renovated: "Renovated",
    oneResidence: "One residence",
    roomTypesCount: "{count} room types",
    bedKing: { one: "king bed", other: "king beds" },
    bedDouble: { one: "double bed", other: "double beds" },
    bedSingle: { one: "single bed", other: "single beds" },
    bedSofa: { one: "sofa bed", other: "sofa beds" },
    bedBunk: { one: "bunk bed", other: "bunk beds" },
    bedRoom: { one: "bedroom", other: "bedrooms" },
    bedroomCount: { one: "bedroom", other: "bedrooms" },    readyWhenYouAre: "Ready when you are",
    oftenArranged: "Often arranged with this suite",
    oftenArrangedRoom: "Often arranged with this room",
  },

  story: {
    figureCaption: "The buildings constitute a historic spot of Rethymno's life",
    madeOfEyebrow: "What Ink is made of",
    madeOfTitle: "Three separate historic buildings",
    seeTheRooms: "See the rooms",
    quarterEyebrow: "The quarter",
    whatIsAround: "What is around you",
  },
  gallery: {
    title: "The whole place",
    lede: "The houses, the rooms, the courtyards, and the town they sit in.",
    count: "{count} photographs",
    everything: "Everything",
    water: "Pool & hot tub",
    suites: "The suites",
    houseOfEurope: "House of Europe",
    phos: "Phos",
    residence: "The Residence",
    breakfast: "Breakfast",
    collections: "Collections",    roomsSuites: "Rooms & Suites",
    houses: "The Houses",
    town: "Rethymno",
    experiences: "Experiences",
  },

  contact: {
    eyebrow: "Contact",
    title: "How can we help?",
    lede: "Ask us anything — a room, a quiet floor, a boat, a wheelchair route through the old town. We answer in {languages}.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending",
    received: "Received",
    thanks: "Thank you — your message has reached us.",
    thanksBody:
      "We answer in {languages}, usually within a day. If it is urgent, call {phone}.",
    privacyNote: "We keep what you send us to answer you, and nothing else.",
    reachDirectly: "Or reach us directly",
    findUs: "Find us",
    bookingDirect: "Booking direct",
    reception: "Reception",
    general: "General",
    reservations: "Reservations",
    errFirstName: "Please tell us your first name",
    errLastName: "Please tell us your last name",
    errEmail: "That does not look like an email address",
    errEmailRequired: "We need an address to reply to",
    errMessage: "A little more detail will help us answer well",
    errTooLong: "That is longer than we can store",
    failed: "We could not send that just now.",
    failedBody: "Please write to {email} or call {phone}.",
  },

  common: {
    language: "Language",
    chooseLanguage: "Choose a language",
    navPrimary: "Primary",
    navFooter: "Footer",
    speakToTheDesk: "Speak to the desk",
    creteGreece: "Crete, Greece",
    skipToContent: "Skip to content",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    error500:
      "Error 500",
    serverErrorTitle:
      "The press has jammed.",
    serverErrorBody:
      "Something on our side failed while this page was being made. It is not something you did, and nothing you were doing has been lost. Try again in a moment — or call the desk and somebody will help you directly.",
    tryAgain:
      "Try again",
    offlineTitle:
      "The ink has not reached you.",
    offlineBody:
      "This page needs a connection and there does not seem to be one. Nothing is wrong with your booking or with the hotel — the page simply could not be fetched. Reconnect and try again.",
    offlineLabel:
      "Offline",
    error404: "Error 404",
    notFoundTitle: "This page ran out of ink.",
    notFoundBody:
      "The page you asked for does not exist — it may have moved, or the link that brought you here may have been mistyped.",
    tryInstead: "Try instead",
    theHotel: "The hotel",
    stay: "Stay",
    information: "Information",
    elsewhere: "Elsewhere",
    arriveHere: "Arrive here",
    alsoOccupies:
      "The hotel also occupies {streets}. You are walked to yours from reception.",
    licence:
      "This property operates under Greek National Tourism Organisation licence no. {licence} · VAT {vat}.",
    allRights: "All rights reserved.",
    photographOf: "Photograph {n} of {total}",
    openPhotograph: "Open photograph",
    previousPhoto: "Previous photograph",
    nextPhoto: "Next photograph",
    ext: "ext.",
    /* The plain-facts list. Every line is a fact a guest would otherwise open
       a review site to find, so it is stated here, unsoftened, in their own
       language — an English-only facts table is the one table that has to be
       readable. `{languages}` and `{time}` are filled at render. */
    factReceptionTerm: "Reception",
    factReception: "Open until {time}. Later arrivals are arranged in advance — tell us your flight and somebody will be there.",
    factCheckinTerm: "Check-in & check-out",
    factCheckin: "Check-in from {checkin}. Check-out by {checkout}.",
    factBreakfastTerm: "Breakfast",
    factBreakfast:
      "Buffet breakfast at House of Europe, including for guests staying at Phos. It can also be served in your room for an extra charge.",
    factNoiseTerm: "Noise",
    factNoise:
      "The old town is alive, and that is much of its pleasure. Sea-facing rooms sit closest to the cafés and bars. All rooms have soundproof windows; tell us if you sleep lightly.",
    factParkingTerm: "Parking",
    factParking:
      "Free in the area around the hotel — the parking lot across the street. Guests of the Gateway Suites receive a parking card, subject to availability.",
    factHousekeepingTerm: "Housekeeping",
    factHousekeeping: "Every two days.",
    factPetsTerm: "Pets",
    factPets: "Not accommodated.",
    factLanguagesTerm: "Languages",
    factLanguages: "We speak {languages}.",
    factEcoTerm: "Sustainability",
    factEco:
      "Bioclimatic architecture, low energy consumption, and eco-friendly cleaning products throughout.",
    footerBlurb:
      "Seven suites, seven rooms and a residence in the medieval old town of Rethymno — between the Venetian harbour and the Fortezza.",
    receptionUntil: "Reception is open until {time}",
    breakfastFact: "Buffet breakfast at House of Europe, and in your room for a small charge.",
    lede: "Everything you would otherwise open a review site to find out. If something is missing, ask us.",
    accessHeading: "Arriving with access needs",
    accessBody: "The suite Agapi was designed for wheelchair users.",
    general: "General",
    reservations: "Reservations",
    reservationsEmail: "Reservations email",
    gntoLicence: "GNTO licence",
    vat: "VAT",
    ratesInEngine: "Availability and rates are handled in our reservation system.",
    stillWondering: "Still wondering",
    weAnswerIn: "We answer in {languages}, usually within a day.",
    offersTitle: "Offers, a few times a year",
    offersPlaceholder: "Your email",
    offersSubmit: "Sign up",
    offersConsent: "A few emails a year about rooms and quiet seasons. Nothing else, never shared, and one click to leave.",
    offersThanks: "Thank you — you are on the list.",
    offersError: "That did not send. Please write to us instead.",
  },

  /* Structural strings from content/site.ts, keyed by their English
     value so site.ts stays the single record of fact. */
  labels: {
    "House of Europe · first building": "House of Europe · first building",
    "Phos · second building": "Phos · second building",
    "Also in the old town": "Also in the old town",
    "Reception": "Reception",
    "Mobile": "Mobile",
    "Seven rooms": "Seven rooms",
    "Reception · all seven suites": "Reception · all seven suites",
    "The garden at Thalasses Villas": "The garden at Thalasses Villas",
  },

  /* Page <title> and <meta description>, per route.
     hreflang already pointed Google at all five versions; without these it
     followed the pointer and found an English title on a German page.
     `{phone}`, `{ext}`, `{time}` and `{count}` are filled at render from
     content/site.ts, which stays the record of those facts. */
  voice: {
    standoutEvexia:
      "A private hot tub set into the terrace, the sea running the full width behind it. You will not share the water, or the view, with anybody.",
    standoutHarmony:
      "A heated plunge pool in a courtyard of its own — warm whatever the month — forty square metres on the ground floor, marble underfoot. The city is four minutes away and cannot reach you here.",
    standoutAgapi:
      "A suite designed so the door is never the problem: step-free from the side street, a walk-in shower, grab rails, and a serene inner courtyard with an old well. Care, built in.",
    standoutPhos:
      "Light is what makes a mark readable. The second house is named for it — seven quiet rooms over the rooftops, a short walk from breakfast.",
    storyQuote:
      "Set by hand, one letter at a time, and pulled on paper in this room. The press is gone; the name stayed.",
    pressEyebrow: "Set, inked, pressed",
    pressSetTerm: "Set",
    pressSetBody:
      "Type laid by hand in this building, and the newspaper ΑΓΩΝ pulled from it by Fotakis — later a congressman and a prosecutor in Athens.",
    pressInkedTerm: "Inked",
    pressInkedBody:
      "The House of Europe became the guest house of the University of Crete. Professors and researchers came to lecture, and the walls have carried exhibitions ever since.",
    pressPressedTerm: "Pressed",
    pressPressedBody:
      "Three buildings of the 1700s, still standing, now a hotel. The press is gone; the impression it left is the name over the door.",
    waterStripTitle: "Four come with their own water",
    waterHotTub: "Private hot tub",
    waterPlunge: "Heated plunge pool",
    diptychTitle: "Light and ink",
    diptychInkBody:
      "The first building, and the one you arrive at: reception, breakfast, and all seven suites. The press was here.",
    diptychLightBody:
      "Φως means light. Seven quiet rooms over the rooftops, four minutes from the sea and a short walk from breakfast.",
  },

  photoAlt: {
    evexiaTiles:
      "The private hot tub on the Evexia terrace, painted Cretan tiles behind it and the sea beyond",
    atInkHotels:
      "{name} at Ink Hotels",
    openDoor:
      "An open door onto the light at Ink Hotels, near the reception at {street}",
    arrivalDoor:
      "A green Venetian door in the old town of Rethymno, lanterns either side",
    family:
      "The family team behind Ink Hotels and Crete Holiday Home",
    morningLight:
      "Morning light across a whitewashed wall and beamed ceiling inside Ink",
    oldTownLane:
      "A narrow lane of the old town, wooden Venetian balconies overhead",
    harbourLighthouse:
      "The Venetian harbour of Rethymno with its Egyptian lighthouse",
    lighthouseDusk:
      "The Egyptian lighthouse at the Venetian harbour of Rethymno at dusk",
    agapiStepFree:
      "The Agapi suite at Ink, with marble floor and step-free access",
    agapiAccess:
      "The Agapi suite, with marble floor and step-free access from the side street",
    arrivalCourtyard:
      "A sunlit courtyard at Ink, deckchair and terracotta pots against warm plaster",
    team:
      "The team at Ink Hotels, Rethymno",
    boat:
      "A private boat on the turquoise water off the Cretan coast",
    rooftops:
      "Rethymno old town seen from above, rooftops running down to the sea",
    suiteBeams:
      "A suite at Ink Hotels with beamed ceiling and whitewashed walls",
    historicBuilding:
      "The historic building of Ink Hotels in the old town of Rethymno",
    fortezzaAbove:
      "The Fortezza fortress above the old town of Rethymno",
  },

  galleryAlt: {
    evexiaHotTub:
      "The private hot tub on the Evexia terrace, above the waterfront at Rethymno — photograph {n}",
    harmonyPlunge:
      "The heated private plunge pool in the interior courtyard of the Harmony suite",
    zoiBackyard: "The Zoi suite and its backyard — photograph {n}",
    courtyards: "The suite courtyards at House of Europe, from above",
    placeIn: "{name}, Rethymno",
    townFromAbove: "Rethymno old town and the Venetian harbour from above",
    roomPhoto: "{name} at Ink Hotels — photograph {n}",
    suiteAtHouse: "The {name} suite at House of Europe — photograph {n}",
    houseOfEurope: "House of Europe, Nikolaou Plastira — photograph {n}",
    phosBuilding: "Phos, the second building — photograph {n}",
    housesAndTown: "Ink Hotels, Rethymno — the houses and the old town",
    breakfast: "Breakfast at House of Europe — photograph {n}",
    experienceArranged: "{title} — arranged by Ink Hotels, Rethymno",
    rethymnoCrete: "Rethymno, Crete",
  },

  mapPlan: {
    title: "The quarter, from the door",
    north: "N",
    reception: "Reception",
    metres: "{n} m",
    note: "Straight-line distances from reception, plotted from OpenStreetMap positions. The walk is always a little longer — these are lanes, not lines.",
  },

  faqPage: {
    eyebrow: "Worth knowing",
    title: "The plain facts",
    finding: "Finding us",
    rooms: "The rooms",
    staying: "Staying here",
    help: "Getting help",
    openUntil: "Open until {time}",
  },

  pageMeta: {
    home: { t: "Ink Hotels — A small hotel in the old town of Rethymno, Crete", d: "Small hotel. Long story. Seven suites at House of Europe — three with a private hot tub, one with a heated plunge pool — seven rooms at Phos, and a residence by the Venetian harbour, in the medieval old town of Rethymno." },
    rooms: { t: "Rooms", d: "Twenty ways to stay in the old town of Rethymno — seven suites at House of Europe, three with a private hot tub and one with a heated plunge pool, seven rooms at Phos, and one whole residence by the Venetian harbour." },
    experiences: { t: "The Art of Staying", d: "A boat of your own, wine in the hills above Rethymno, a therapist, a quiet morning. Twenty-two things the desk at Ink Hotels arranges — most of them a phone call we have made a hundred times." },
    gallery: { t: "Gallery", d: "{count} photographs of Ink Hotels — the private hot tub and plunge pool, the seven suites, the two houses, the Residence of the Old Port, and the medieval old town of Rethymno around them." },
    story: { t: "The story", d: "Ink is named after a printing press. From this building was published the newspaper ΑΓΩΝ — Struggle. The central house was the University of Crete's guest house. Two historic houses of the 1700s in the medieval old town of Rethymno, and a residence by the harbour." },
    rethymno: { t: "Rethymno", d: "The old town, the Venetian harbour, the Fortezza, the beaches, the food and the mountains behind — what a week in Rethymno actually looks like, from a hotel inside the medieval quarter." },
    arrival: { t: "Arrival", d: "Ink Hotels occupies two buildings in the old town of Rethymno, and a residence by the harbour. You arrive at one door — House of Europe, the first building, at Nikolaou Plastira 4 — where somebody is expecting you and walks you to your room. Reception is open until 23:00." },
    location: { t: "Location", d: "Ink Hotels sits inside the medieval old town of Rethymno, Crete — a few minutes from the Venetian harbour and under the Fortezza. Two buildings and a residence: addresses, coordinates and directions." },
    contact: { t: "Contact", d: "Write to Ink Hotels in the old town of Rethymno, Crete, or call {phone} (ext. {ext}). Reception is open until {time}. We answer in English, Greek, Dutch and French." },
    faq: { t: "Frequently asked", d: "Breakfast, parking, noise, accessibility, pets, languages and how to reach Ink Hotels in the old town of Rethymno — answered plainly." },
    accessibility: { t: "Accessibility", d: "The suite Agapi at Ink Hotels was designed for wheelchair users: step-free private entrance, walk-in shower, toilet with grab rails, thirty square metres on the ground floor in the old town of Rethymno." },
    careers: { t: "Careers", d: "Become one of us. Ink Hotels in Rethymno, Crete — a team that shares more than the same employer." },
    privacy: { t: "Privacy policy", d: "What personal data Ink Hotels collects, why, how long it is kept, and your rights under the GDPR." },
    terms: { t: "Terms of use", d: "Terms of use for the Ink Hotels website and for reservations made through it." },
  },
} as const;

/**
 * The catalogue shape, with every leaf widened from its literal to `string`.
 *
 * Without this, `as const` would type each English value as its own literal, and
 * a German translation of "Small hotel. Long story." would be a type error
 * rather than the point. The nesting and the key names stay exact, so a missing
 * or misspelled key in any catalogue is still a compile error.
 */
type Widen<T> = T extends string
  ? string
  : { [K in keyof T]: Widen<T[K]> };

export type Messages = Widen<typeof en>;
