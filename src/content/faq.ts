/**
 * FAQ — answers are drawn only from what the property publishes.
 * Where the property states no policy (rates, cancellation), the answer points the
 * guest to reservations rather than inventing a figure. Check-in and check-out are
 * stated — the owner gave them in August 2026 — and `stay` in site.ts is their source.
 */

export interface Faq {
  question: string;
  answer: string;
  /**
   * Which group the question sits under on /faq. Optional, and deliberately
   * so: questions authored in the CMS carry no topic, and a question with no
   * topic is not lost — it falls into the last group rather than out of the
   * page. The labels themselves live in the message catalogue, because a
   * grouping a reader can see is a grouping they have to be able to read.
   */
  topic?: FaqTopic;
}

export type FaqTopic = "finding" | "rooms" | "staying" | "help";

export const faqs: Faq[] = [
  {
    topic: "finding",
    question: "Where exactly is the hotel?",
    answer:
      "In the centre of the medieval old town of Rethymno, Crete, a few steps from the Venetian harbour and under the Fortezza. You arrive at House of Europe, Nikolaou Plastira 4 — that is the reception, where all seven suites are, and where check-in happens for every building including the Residence. Phos, the second building, is on Fotaki 10. The hotel also holds addresses at Psaron 2 and Damvergi 26; you are walked to yours from reception.",
  },
  {
    topic: "rooms",
    question: "What is the difference between House of Europe and Phos?",
    answer:
      "House of Europe is the first building, at Nikolaou Plastira 4. Reception is there, breakfast is served there for every guest, and all seven suites are there. It was once the University of Crete's guest house. Phos, whose name is the Greek word for light, is the second building, a short walk away: seven rooms, numbered one to seven, and the quieter of the two. The Residence of the Old Port is a separate house by the harbour.",
  },
  {
    topic: "staying",
    question: "Is breakfast included?",
    answer:
      "Buffet breakfast is available for a supplement and is served at House of Europe, including for guests staying at Phos. It can also be served in your room for an extra charge. Rates and inclusions are confirmed at the time of booking.",
  },
  {
    topic: "rooms",
    question: "Do any of the rooms have a pool or a hot tub?",
    answer:
      "Four of the seven suites have their own water. Evexia has a private hot tub set into its terrace, above the waterfront; Eros and Zoi each have one in a courtyard of their own. Harmony has a heated private plunge pool in its own secluded interior courtyard, so the water is warm whatever the month. There is no communal pool — the sea is a short walk away.",
  },
  {
    topic: "help",
    question: "Is the hotel accessible?",
    answer:
      "The suite Agapi was designed for accessibility: step-free access with a private entrance from the side street, a walk-in shower, and a toilet with grab rails, built to the standards of safe and comfortable hygiene care for wheelchair users. Please contact us before booking so we can confirm the route into the building suits you — the old town is historic, and its lanes are cobbled.",
  },
  {
    topic: "rooms",
    question: "Are any rooms adults only?",
    answer:
      "Pathos and Elpida take adults only. Every other suite and room welcomes families; Zoi has two bedrooms and two bathrooms and is the one most often taken with children.",
  },
  {
    topic: "staying",
    question: "What time does reception close?",
    answer:
      "Reception is open until 23:00, at House of Europe, Nikolaou Plastira 4. If your flight lands later than that, tell us in advance and somebody will be there to meet you.",
  },
  {
    topic: "staying",
    question: "What time is check-in?",
    answer:
      "Check-in is from 16:00 and check-out is by 11:00. Tell us when you land and your key will be ready when you reach the first building.",
  },
  {
    topic: "finding",
    question: "Is there parking?",
    answer:
      "Parking in the area around the hotel is free, in the parking lot across the street. Guests of the Gateway Suites receive a parking card, subject to availability.",
  },
  {
    topic: "staying",
    question: "Can I bring my dog?",
    answer: "Pets are not accommodated.",
  },
  {
    topic: "staying",
    question: "How noisy is it?",
    answer:
      "The old town is alive, and that is much of its pleasure. The property notes that sea-facing rooms sit closest to the cafés and bars and can be lively. Rooms have soundproof windows. If you sleep lightly, ask us and we will place you accordingly.",
  },
  {
    topic: "help",
    question: "What languages are spoken?",
    answer: "English, Greek, Dutch and French.",
  },
  {
    topic: "finding",
    question: "How do I get here from the airport?",
    answer:
      "Rethymno sits between Chania and Heraklion airports. Our own chauffeur can meet you at either airport, or at the port, and bring you in — let us know your arrival and we will arrange it.",
  },
  {
    topic: "staying",
    question: "Is there Wi-Fi?",
    answer: "Yes, free Wi-Fi throughout, and soundproofed rooms with a desk to work at.",
  },
  {
    topic: "rooms",
    question: "When were the rooms last renovated?",
    answer:
      "House of Europe was renovated in May 2020, and Phos in June 2019. Housekeeping is arranged with each stay — typically every two days.",
  },
];
