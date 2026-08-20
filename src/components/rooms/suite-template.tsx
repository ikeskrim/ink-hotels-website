import Image from "next/image";

import { blurFor } from "@/content/generated/blur";
import type { Room } from "@/content/rooms";
import { contact } from "@/content/site";
import { getMessages } from "@/i18n";
import { bedPhrase } from "@/i18n/specs";
import type { Locale } from "@/i18n/config";
import { Container, Heading, Section } from "@/components/ui/section";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { RoomGallery } from "@/components/rooms/room-gallery";
import { RoomBadges } from "@/components/rooms/room-badges";
import { TourFacade } from "@/components/rooms/tour-facade";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { BookDirect } from "@/components/booking/book-direct";
import { InkAnchor } from "@/components/ui/ink-link";

/**
 * The suite page, rebuilt on lead-with-distinction.
 *
 * The old page opened with a breadcrumb, a name, a badge row and a paragraph —
 * four pieces of chrome before the first thing worth knowing. This one opens
 * with the photograph and the single line that makes this suite unlike the
 * other nineteen, and everything a reader might want to check is one disclosure
 * away rather than four screens down.
 *
 * ── The three panels ───────────────────────────────────────────────────────
 * Layout, occupancy and amenities, on the Stage 6.3 disclosure. Each keeps a
 * `meta` line visible while closed — "30 m²", "sleeps 2", "9 listed" — so the
 * page still answers the quick questions without being opened at all. A
 * disclosure that hides the summary as well as the detail just makes you click.
 *
 * ── The rail ───────────────────────────────────────────────────────────────
 * Sticky, and it carries the deep link into the engine for this exact suite,
 * with the phone number beside it rather than under it. Some suites have no
 * `bookingId` yet; those say so in words and lead with the phone, because a
 * button that lands a reader on a list of twenty rooms is worse than a
 * sentence telling them to call.
 *
 * ── Photographs ────────────────────────────────────────────────────────────
 * The whole set, whatever the set is. The brief asked for 25–35 "where the set
 * allows" and it mostly does not: one room has 42 frames, the median is 11,
 * and Evexia — the first migration — has 19. Padding a suite with photographs
 * of a different suite is the one thing a hotel site must never do, so the
 * gallery shows what exists and the count on the plate is the true one.
 */
export function SuiteTemplate({
  room,
  houseName,
  locale,
  standout,
  children,
}: {
  room: Room;
  houseName: string;
  locale: Locale;
  /** The lead-with-distinction line, where one has been written. */
  standout?: string;
  /** Related suites and anything else the route appends below. */
  children?: React.ReactNode;
}) {
  const m = getMessages(locale);
  const hero = room.images[0];

  const layout = [
    room.sizeSqm ? { term: m.rooms.size, value: `${room.sizeSqm} m²` } : null,
    room.bedrooms ? { term: m.rooms.bedrooms, value: String(room.bedrooms) } : null,
    room.bathrooms ? { term: m.rooms.bathrooms, value: String(room.bathrooms) } : null,
    room.level ? { term: m.rooms.level, value: room.level } : null,
    room.outlook ? { term: m.rooms.outlook, value: room.outlook } : null,
    room.outdoor ? { term: m.rooms.outdoor, value: room.outdoor } : null,
    room.renovated ? { term: m.rooms.renovated, value: String(room.renovated) } : null,
  ].filter((x): x is { term: string; value: string } => x !== null);

  /* Built the same way the existing page builds it — per bed, through the
     shared formatter, so plurals come from the catalogue rather than from
     adding an "s" to an English noun. */
  const beds = room.beds
    .map((bed) => bedPhrase(bed.label, bed.count, m, locale))
    .join(", ");
  const occupancy = [
    {
      term: m.rooms.sleeps,
      value: room.maxGuests
        ? `${room.guests} · ${room.maxGuests}`
        : String(room.guests),
    },
    ...(beds ? [{ term: m.rooms.beds, value: beds }] : []),
  ];

  return (
    <>
      {/* ── The signature frame ─────────────────────────────────────────── */}
      <section
        data-ground="ink"
        className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden"
        aria-label={room.displayName}
      >
        {hero && (
          <div className="absolute inset-0 -z-10" data-decorative>
            <Image
              src={hero}
              alt={m.photoAlt.atInkHotels.replace("{name}", room.name)}
              fill
              /* This is the largest paint on the page by design, so it is the
                 one image that earns priority. */
              priority
              sizes="100vw"
              quality={80}
              placeholder={blurFor(hero) ? "blur" : "empty"}
              blurDataURL={blurFor(hero)}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
          </div>
        )}

        <Container className="relative pb-[clamp(3rem,7vh,5rem)] pt-[clamp(9rem,16vh,12rem)]">
          <p className="label mb-5 text-phos">{houseName}</p>
          <Heading level={1} size="d1" className="max-w-[13ch] text-paper">
            {room.displayName}
          </Heading>

          {standout ? (
            <p className="measure-wide mt-8 font-display text-[length:var(--text-d4)] leading-[1.3] text-paper/90">
              {standout}
            </p>
          ) : (
            <p className="measure-wide mt-8 text-lg text-paper/85">
              {room.description}
            </p>
          )}

          {/* The official name, verbatim — so what is browsed here matches what
              is reserved in the engine, with nothing lost at handoff. */}
          <p className="spec mt-8 text-olive">{room.name}</p>
          <RoomBadges room={room} tone="inline" className="mt-6" />
        </Container>
      </section>

      {/* ── What it is, and the rail ────────────────────────────────────── */}
      <Section ground="paper" size="lg" wash="ink">
        <Container>
          <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              {/* When the hero carried the standout line, the description has
                  not been said yet and belongs here. When it did not, the hero
                  already carried it and repeating it would be padding. */}
              {standout && (
                <p className="measure-wide text-lg text-[color:var(--fg-2)]">
                  {room.description}
                </p>
              )}

              {room.notes.length > 0 && (
                <div className="mt-8 space-y-2">
                  {room.notes.map((n) => (
                    <p key={n} className="text-sm text-[color:var(--fg-2)]">
                      {n}
                    </p>
                  ))}
                </div>
              )}

              <h2 className="sr-only">{m.rooms.theRoom}</h2>
              <Accordion
                type="multiple"
                defaultValue={["layout"]}
                className="mt-[clamp(2.5rem,5vw,3.5rem)] border-t border-[color:var(--hairline)]"
              >
                <AccordionItem
                  value="layout"
                  label={m.rooms.theRoom}
                  headingLevel={3}
                  meta={layout
                    .slice(0, 2)
                    .map((l) => l.value)
                    .join(" · ")}
                >
                  <dl className="grid gap-x-8 sm:grid-cols-2">
                    {layout.map((l) => (
                      <div
                        key={l.term}
                        className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-3"
                      >
                        <dt className="label text-[color:var(--fg-3)]">{l.term}</dt>
                        <dd className="spec text-right">{l.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>

                <AccordionItem
                  value="occupancy"
                  label={m.rooms.whoIsComing}
                  headingLevel={3}
                  meta={occupancy.map((o) => o.value).join(" · ")}
                >
                  <dl className="grid gap-x-8 sm:grid-cols-2">
                    {occupancy.map((o) => (
                      <div
                        key={o.term}
                        className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-3"
                      >
                        <dt className="label text-[color:var(--fg-3)]">{o.term}</dt>
                        <dd className="spec text-right">{o.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>

                <AccordionItem
                  value="amenities"
                  label={m.rooms.whatIsInIt}
                  headingLevel={3}
                  meta={String(room.amenities.length)}
                >
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {room.amenities.map((a) => (
                      <li
                        key={a}
                        className="flex items-baseline gap-3 border-b border-[color:var(--hairline)] pb-3"
                      >
                        <span
                          aria-hidden="true"
                          className="block h-px w-3 shrink-0 translate-y-[-0.35em] bg-[color:var(--border)]"
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              </Accordion>

              {room.tourUrl && room.images[0] && (
                <TourFacade
                  url={room.tourUrl}
                  poster={room.images[0]}
                  posterAlt={`${room.displayName} — ${m.rooms.tour360}`}
                  className="mt-[clamp(2.5rem,5vw,3.5rem)]"
                />
              )}
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <div className="border border-[color:var(--border)] p-6 lg:p-7">
                <p className="label mb-2 text-[color:var(--fg-3)]">
                  {m.booking.reservingAs}
                </p>
                <p className="spec mb-6 leading-relaxed">{room.name}</p>

                <AvailabilityForm
                  tone="dark"
                  layout="stack"
                  roomId={room.bookingId ?? undefined}
                />

                {/* The phone sits beside the button, not under the fold. Half
                    the people who bounce off a booking engine would rather ask
                    a person, and on this property somebody always answers. */}
                <p className="mt-6 border-t border-[color:var(--hairline)] pt-5 text-sm text-[color:var(--fg-2)]">
                  {m.booking.speakToSomeone.split("{phone}")[0]}
                  <InkAnchor href={contact.phones[1].href}>
                    {contact.phones[1].value}
                  </InkAnchor>
                  {m.booking.speakToSomeone.split("{phone}")[1]}
                </p>

                {/* Where the engine has no id for this suite yet, the button can
                    only open its front page. Saying so, with a way to reserve
                    by name beside it, is the difference between a handoff and a
                    dead end. Remove when `bookingId` is filled in. */}
                {!room.bookingId && (
                  <p className="mt-5 border-l-2 border-[color:var(--link)] pl-4 text-sm text-[color:var(--fg-2)]">
                    {m.booking.byNameNote}{" "}
                    <InkAnchor href={`mailto:${contact.emails.general}`}>
                      {contact.emails.general}
                    </InkAnchor>
                  </p>
                )}
              </div>

              <BookDirect className="mt-7" />
            </aside>
          </div>
        </Container>
      </Section>

      {/* ── The whole set ───────────────────────────────────────────────── */}
      <Section ground="shade" size="lg">
        <Container>
          <h2 className="label mb-8 text-[color:var(--fg-3)]">
            {m.gallery.count.replace("{count}", String(room.images.length))}
          </h2>
          <RoomGallery images={room.images} roomName={room.name} />
        </Container>
      </Section>

      {children}
    </>
  );
}
