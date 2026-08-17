/**
 * FAQ — answers are drawn only from what the property publishes.
 * Where the property states no policy (check-in times, rates, cancellation), the answer
 * points the guest to reservations rather than inventing a figure.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Where exactly is the hotel?",
    answer:
      "In the centre of the medieval old town of Rethymno, Crete, a few steps from the Venetian harbour and under the Fortezza. You arrive at House of Europe, Nikolaou Plastira 4 — that is the reception, and where all seven suites are. Phos, the second building, is on Fotaki 10. The hotel also holds addresses at Psaron 2 and Damvergi 26; you are walked to yours from reception.",
  },
  {
    question: "What is the difference between House of Europe and Phos?",
    answer:
      "House of Europe is the first building, at Nikolaou Plastira 4. Reception is there, breakfast is served there for every guest, and all seven suites are there. It was once the University of Crete's guest house. Phos, whose name is the Greek word for light, is the second building, a short walk away: seven rooms, numbered one to seven, and the quieter of the two. The Residence of the Old Port is a separate house by the harbour.",
  },
  {
    question: "Is breakfast included?",
    answer:
      "Buffet breakfast is available for a supplement and is served at House of Europe, including for guests staying at Phos. It can also be served in your room for an extra charge. Rates and inclusions are confirmed at the time of booking.",
  },
  {
    question: "Do any of the rooms have a pool or a hot tub?",
    answer:
      "Four of the seven suites have their own water. Evexia has a private hot tub set into its terrace, above the waterfront; Eros and Zoi each have one in a courtyard of their own. Harmony has a private plunge pool in its own secluded interior courtyard. There is no communal pool — the sea is a short walk away.",
  },
  {
    question: "Is the hotel accessible?",
    answer:
      "The suite Agapi was designed for accessibility: step-free access with a private entrance from the side street, a walk-in shower, and a toilet with grab rails, built to the standards of safe and comfortable hygiene care for wheelchair users. Please contact us before booking so we can confirm the route into the building suits you — the old town is historic, and its lanes are cobbled.",
  },
  {
    question: "Are any rooms adults only?",
    answer:
      "Pathos and Elpida take adults only. Every other suite and room welcomes families; Zoi has two bedrooms and two bathrooms and is the one most often taken with children.",
  },
  {
    question: "What time does reception close?",
    answer:
      "Reception is open until 23:00, at House of Europe, Nikolaou Plastira 4. If your flight lands later than that, tell us in advance and somebody will be there to meet you.",
  },
  {
    question: "Is there parking?",
    answer:
      "Free parking is available off-site within 100 metres. The Residence of the Old Port has its own private parking.",
  },
  {
    question: "Can I bring my dog?",
    answer: "Pets are not accommodated.",
  },
  {
    question: "How noisy is it?",
    answer:
      "The old town is alive, and that is much of its pleasure. The property notes that sea-facing rooms sit closest to the cafés and bars and can be lively. Rooms have soundproof windows. If you sleep lightly, ask us and we will place you accordingly.",
  },
  {
    question: "What languages are spoken?",
    answer: "English, Greek, Dutch and French.",
  },
  {
    question: "How do I get here from the airport?",
    answer:
      "Rethymno sits between Chania and Heraklion airports. A chauffeur can meet you at either airport, or at the port, and bring you in — let us know your arrival and we will arrange it.",
  },
  {
    question: "Is there Wi-Fi?",
    answer: "Yes, free Wi-Fi throughout, and soundproofed rooms with a desk to work at.",
  },
  {
    question: "When were the rooms last renovated?",
    answer:
      "House of Europe was renovated in May 2020, and Phos in June 2019. Housekeeping is every two days.",
  },
];
