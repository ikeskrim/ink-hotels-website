/**
 * Stage 5.2 — the chaptered trailer — prepared, measured and switched off.
 *
 * The homepage runs fifteen sections. The plan calls for slimming it to a
 * trailer and relocating the depth into `/rooms`, `/story` and `/rethymno`,
 * deleting nothing. Which sections a hotel's front page keeps is a marketing
 * decision and the owner's to make, so this ships built and dark: with
 * `TRAILER` false the homepage renders exactly what it renders today and the
 * deep pages are untouched.
 *
 * ── The one rule this had to obey ──────────────────────────────────────────
 * Nothing is deleted and no new copy is written. Every section in RELOCATED is
 * rendered on its destination page when the flag is on, so flipping the switch
 * moves eight blocks of copy — in five languages — rather than losing them.
 * That is the whole reason this is a relocation table and not a shorter
 * homepage: a shorter homepage is easy and would quietly cost the site eight
 * translated sections.
 *
 * ── How to flip it ─────────────────────────────────────────────────────────
 * Set TRAILER to true, run the checks, look at the screenshot artifact. To go
 * back, set it to false. There is no build step and no environment variable;
 * the state of the proposal is one boolean in a diff. See PROPOSALS.md.
 */
export const TRAILER = false;

/**
 * What the front page keeps: seven beats, in reading order.
 *
 * Drawn only from sections that already exist. The brief's retention set maps
 * onto the components one to one — the hero, the water suites, Agapi, one
 * story beat, the old-town beat, the plain facts, and the booking block.
 */
export const RETAINED = [
  "Hero",
  "TheName",
  "TheOldTown",
  "TheWater",
  "TheOpenDoor",
  "PlainFacts",
  "NowTheDates",
] as const;

/**
 * Where each relocated section goes, and why that page.
 *
 * `/rooms`, `/story` and `/rethymno` are the three destinations the plan
 * names. Nothing is sent anywhere else, and nothing is dropped.
 */
export const RELOCATED = [
  {
    section: "WhereYouSleep",
    to: "/rooms",
    because: "The three houses, which is what /rooms is for.",
  },
  {
    section: "TheImpression",
    to: "/story",
    because: "The press and the impression it leaves — the story page's subject.",
  },
  {
    section: "TheLight",
    to: "/story",
    because: "Light on the building, beside the chapter that explains the name.",
  },
  {
    section: "TheFamily",
    to: "/story",
    because: "Who runs it belongs with how it came to be.",
  },
  {
    section: "WhatGuestsSaid",
    to: "/story",
    because:
      "Guest quotes sit with the family beat. Renders nothing today — reviews.ts is empty pending the owner's six to ten real quotes — so this relocation is structural, not visual.",
  },
  {
    section: "TheArrival",
    to: "/rethymno",
    because:
      "Arriving in the quarter. The full step-by-step already lives on /arrival; this is the trailer that used to sit on the homepage.",
  },
  {
    section: "WhatWeArrange",
    to: "/rethymno",
    because: "What there is to do in the town, on the page about the town.",
  },
  {
    section: "TheFeed",
    to: "/rethymno",
    because: "The feed is the town as it looks this week.",
  },
] as const;

/** The sections a given destination page picks up when the flag is on. */
export function relocatedTo(path: "/rooms" | "/story" | "/rethymno") {
  return RELOCATED.filter((r) => r.to === path).map((r) => r.section);
}
