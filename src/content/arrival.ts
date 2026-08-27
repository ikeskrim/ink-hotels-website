/**
 * The arrival journey.
 *
 * Ink is not one building with a lobby — it is two houses and a residence in a medieval
 * quarter of narrow lanes. That is unusual, and a guest who does not know it
 * arrives confused, dragging a case down a cobbled street looking for a door.
 *
 * So the arrival is designed, and told: one reception, at Nikolaou Plastira 4,
 * where somebody is expecting you and walks you the rest of the way.
 *
 * Everything below is factual. The check-in and check-out times are the
 * owner's, given in August 2026; `stay` in site.ts is their source and a unit
 * test holds this copy to it. The page still asks guests to send an arrival
 * time, which is what actually happens.
 */

export const arrival = {
  eyebrow: "Arrival",
  title: "You are met at one door",
  lede: "The hotel occupies two buildings in the old town, and a residence by the harbour. You come to one door — House of Europe, the first building, at Nikolaou Plastira 4 — and somebody walks you to your room from there.",

  reception: {
    heading: "Nikolaou Plastira 4",
    label: "First building · Reception",
    body: [
      "This is the door. Not the second building, not the third — the first, on Nikolaou Plastira, a few minutes from the Venetian harbour and under the Fortezza.",
      "Whichever room you have taken, whichever house it is in, you begin here. Someone is expecting you, your key is ready, and the walk to your building is short and made with you.",
    ],
  },

  /** What actually happens, in order. */
  steps: [
    {
      title: "Tell us when you land",
      body: "Send us your arrival time and how you are travelling. Our own chauffeur can meet you at Chania or Heraklion airport, or at the port, and bring you in — the old town's lanes are narrow, and being driven to the right corner of it is worth arranging.",
    },
    {
      title: "Come to the first building",
      body: "Nikolaou Plastira 4. It is the reception for the whole hotel, and where all seven suites are. It is open until 23:00. Free parking is available off-site within a hundred metres, and we will tell you exactly where before you set off. Check-in is here for every building, including the Residence of the Old Port.",
    },
    {
      title: "We walk you in",
      body: "Nobody is handed a map and a door code. Your key, your building and the way there are given to you in person — along with the two or three things about this quarter that only someone who lives in it would tell you.",
    },
    {
      title: "The day is yours to arrange",
      body: "A boat, a table, a wheelchair route, a quiet floor, a bottle waiting in the room. Ask at the desk. Most of it is a phone call we have already made a hundred times.",
    },
  ],

  /** Practical facts, all verifiable. */
  facts: [
    {
      term: "Reception",
      def: "House of Europe, Nikolaou Plastira 4 — the first building. Open until 23:00.",
    },
    { term: "Check-in", def: "From 16:00. Check-out by 11:00." },
    { term: "By phone", def: "+30 211 444 5757, extension 1" },
    {
      term: "Breakfast",
      def: "Buffet at House of Europe for all guests, and in your room for a small charge",
    },
    { term: "Parking", def: "Free, off-site, within 100 m" },
    { term: "Cars & transfers", def: "Airport and port transfers, and a Fiat 500 Cabrio to rent" },
    { term: "Languages", def: "English, Greek, Dutch and French" },
    { term: "Step-free arrival", def: "The Agapi suite has its own street entrance" },
  ],

  closing: {
    heading: "Hospitality begins before the key",
    body: "The family that runs Ink has been letting rooms and houses in this part of Crete for years, under the name Crete Holiday Home. What that means in practice is that the person handing you a key knows which taverna is worth the walk in February, and which beach is empty on a Sunday.",
  },
} as const;
