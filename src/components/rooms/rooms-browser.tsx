"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { House, Room } from "@/content/rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { Container, Heading, Rule } from "@/components/ui/section";
import { Gk } from "@/components/ui/greek";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/provider";

/**
 * The room index.
 *
 * Filters are client state, not routes — a filtered view is not a page worth
 * indexing, and every combination as a URL would be a thin-content farm.
 *
 * The accessibility filter returns exactly one room, and that is the point: a
 * guest who needs it should find it in one tap. No other room is offered under
 * that filter, because accessibility is evidenced for Agapi and for nothing else.
 */

type GuestFilter = "any" | "2" | "3" | "4";
type FeatureFilter =
  | "any"
  | "sea"
  | "balcony"
  | "terrace"
  | "hottub"
  | "pool"
  | "accessible";

const GUEST_KEYS = ["any", "two", "three", "four"] as const;
const GUEST_IDS: GuestFilter[] = ["any", "2", "3", "4"];

const FEATURE_KEYS = [
  "everything", "seaView", "balcony", "terrace", "hotTub", "plungePool", "wheelchair",
] as const;
const FEATURE_IDS: FeatureFilter[] = [
  "any", "sea", "balcony", "terrace", "hottub", "pool", "accessible",
];

function matchesGuests(room: Room, f: GuestFilter): boolean {
  if (f === "any") return true;
  const want = Number(f);
  const capacity = room.maxGuests ?? room.guests ?? 0;
  return capacity >= want;
}

/* The three that matter most read a declared fact rather than searching the
   amenity strings. A filter that depends on the word "step-free" surviving in
   a translated list is a filter that will one day quietly return nothing. */
function matchesFeature(room: Room, f: FeatureFilter): boolean {
  switch (f) {
    case "any":
      return true;
    case "sea":
      return (room.outlook ?? "").toLowerCase().includes("sea");
    case "balcony":
      return (room.outdoor ?? "").toLowerCase().includes("balcony");
    case "terrace":
      return (room.outdoor ?? "").toLowerCase().includes("terrace");
    case "hottub":
      /* Harmony's plunge pool is used as a jacuzzi, so it answers here too. */
      return room.hotTub === true || room.plungePool === true;
    case "pool":
      return room.plungePool === true;
    case "accessible":
      return room.accessible === true;
    default:
      return true;
  }
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "label h-9 shrink-0 whitespace-nowrap border px-4 transition-colors duration-300 ease-state",
        active
          ? "border-[color:var(--fg)] bg-[color:var(--fg)] text-[color:var(--bg)]"
          : "border-[color:var(--border)] text-[color:var(--fg-2)] hover:border-[color:var(--fg)] hover:text-[color:var(--fg)]",
      )}
    >
      {children}
    </button>
  );
}

export function RoomsBrowser({
  rooms,
  houses,
}: {
  /* Passed in already localised: this is a client component and cannot resolve
     the locale itself without shipping every catalogue to the browser. */
  rooms: Room[];
  houses: House[];
}) {
  const { m } = useI18n();
  const [guests, setGuests] = useState<GuestFilter>("any");
  const [feature, setFeature] = useState<FeatureFilter>("any");
  const reduced = useReducedMotion();

  const filtered = useMemo(
    () => rooms.filter((r) => matchesGuests(r, guests) && matchesFeature(r, feature)),
    [rooms, guests, feature],
  );

  const filtering = guests !== "any" || feature !== "any";
  const ordered = houses.slice().sort((a, b) => a.order - b.order);

  /** Split a building's rooms into suites and rooms, labelled only if both. */
  function bandsFor(inHouse: Room[]) {
    const suites = inHouse.filter((r) => r.kind === "suite");
    const others = inHouse.filter((r) => r.kind !== "suite");
    if (!suites.length || !others.length) {
      return [{ key: "all", label: null, rooms: inHouse }];
    }
    return [
      { key: "suites", label: m.rooms.theSuites, rooms: suites },
      { key: "rooms", label: m.rooms.theRooms, rooms: others },
    ];
  }

  return (
    <>
      {/* ── Filters ──────────────────────────────────────────────────── */}
      <Container className="pb-[clamp(2.5rem,5vw,4rem)]">
        <div className="border-t border-[color:var(--hairline)] pt-8">
          <div className="grid gap-7 lg:grid-cols-[auto_1fr] lg:gap-14">
            <fieldset>
              <legend className="label mb-4 text-[color:var(--fg-3)]">
                {m.rooms.whoIsComing}
              </legend>
              <div className="flex gap-2">
                {GUEST_IDS.map((id, i) => (
                  <Chip
                    key={id}
                    active={guests === id}
                    onClick={() => setGuests(id)}
                  >
                    {m.rooms[GUEST_KEYS[i]!]}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label mb-4 text-[color:var(--fg-3)]">
                {m.rooms.whatYouWakeTo}
              </legend>
              {/* One row that scrolls, rather than a block that wraps.
                  These chips carry long labels set in the mono face; when the
                  webfont swaps in at a different width a wrapping row re-flows
                  and everything below it jumps. A single non-wrapping row
                  cannot change height, so there is nothing to shift — and
                  swiping through filters is the better mobile gesture anyway. */}
              <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {FEATURE_IDS.map((id, i) => (
                  <Chip
                    key={id}
                    active={feature === id}
                    onClick={() => setFeature(id)}
                  >
                    {m.rooms[FEATURE_KEYS[i]!]}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </div>

          <p
            aria-live="polite"
            className="spec mt-7 text-[color:var(--fg-3)]"
          >
            {filtered.length === rooms.length
              ? m.rooms.allCount.replace("{count}", String(rooms.length))
              : (filtered.length === 1 ? m.rooms.matchCount_one : m.rooms.matchCount_other).replace("{count}", String(filtered.length))}
            {filtering && (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={() => {
                    setGuests("any");
                    setFeature("any");
                  }}
                  className="underline underline-offset-4 hover:text-[color:var(--fg)]"
                >
                  {m.actions.clear}
                </button>
              </>
            )}
          </p>
        </div>
      </Container>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <Container className="pb-section">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Heading size="d4" className="mb-4">
              {m.rooms.noMatch}
            </Heading>
            <p className="measure mx-auto text-[color:var(--fg-2)]">
              {m.rooms.noMatchBody}
            </p>
          </div>
        ) : (
          ordered.map((house, houseIndex) => {
            const inHouse = filtered.filter((r) => r.house === house.id);
            if (inHouse.length === 0) return null;

            return (
              <section
                key={house.id}
                id={house.id}
                className="scroll-mt-28 pt-[clamp(2.5rem,5vw,4rem)]"
              >
                <div className="mb-9 flex flex-col gap-4 border-b border-[color:var(--hairline)] pb-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="label mb-3 flex items-baseline gap-2.5 text-[color:var(--fg-3)]">
                      {house.greek && (
                        <>
                          <Gk>{house.greek}</Gk>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      {house.subtitle}
                    </p>
                    <Heading size="d3">{house.name}</Heading>
                  </div>
                  <p className="measure text-[color:var(--fg-2)]">
                    {house.intro}
                  </p>
                </div>

                {/* House of Europe holds two different things — the seven
                    suites and the sea-facing rooms — and running them together
                    as thirteen undifferentiated cards buries the suites. Where
                    a building has both, each band gets its own line. */}
                {bandsFor(inHouse).map((band, bandIndex) => (
                  <div key={band.key} className={bandIndex > 0 ? "mt-[clamp(3rem,5vw,4rem)]" : ""}>
                    {band.label && (
                      <p className="label mb-6 flex items-center gap-4 text-[color:var(--fg-3)]">
                        {band.label}
                        <span
                          aria-hidden="true"
                          className="h-px flex-1 bg-[color:var(--hairline)]"
                        />
                      </p>
                    )}
                    {/* Cards cross-fade rather than animating layout. A `layout`
                        animation here measures and repositions every card on
                        mount, which registers as cumulative layout shift on
                        first paint — the grid already places them correctly. */}
                    <div className="grid gap-x-[clamp(1.5rem,2.5vw,2.5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
                      {band.rooms.map((room, i) => (
                        <motion.div
                          key={room.slug}
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          {/* Only the first row of the first house is eager.
                              Marking three per house priority meant twelve
                              competing preloads and an LCP a second worse. */}
                          <RoomCard
                            room={room}
                            priority={houseIndex === 0 && bandIndex === 0 && i < 3}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            );
          })
        )}

        <Rule className="mt-[clamp(3.5rem,6vw,5rem)]" />
      </Container>
    </>
  );
}
