import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { NoFrame } from "@/components/media/no-frame";
import Link from "next/link";

import { bookingUrlFor, relatedFor, rooms, roomsBySlug } from "@/content/rooms";
import { getExperiences, getHouses, getRooms } from "@/lib/sanity/content";
import { getMessages } from "@/i18n";
import { bedPhrase } from "@/i18n/specs";
import { defaultLocale, isLocale } from "@/i18n/config";
import { contact } from "@/content/site";
import { Container, Heading, Rule, Section } from "@/components/ui/section";
import { RoomGallery } from "@/components/rooms/room-gallery";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomBadges } from "@/components/rooms/room-badges";
import { TourFacade } from "@/components/rooms/tour-facade";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { BookDirect } from "@/components/booking/book-direct";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, roomSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { usesSuiteTemplate } from "@/content/suite-template";
import { SuiteTemplate } from "@/components/rooms/suite-template";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const base = roomsBySlug.get(slug);
  if (!base) return {};

  /* The description below is the room's own prose, so it has to come through
     the localisation layer. Reading `roomsBySlug` directly — which is the
     English source — put an English sentence in the meta description of every
     room page in all five languages, on twenty pages that are otherwise fully
     translated. */
  const localised = (await getRooms(locale)).find((r) => r.slug === slug);
  const room = localised ?? base;
  const m = getMessages(locale);
  const house = (await getHouses(locale)).find((h) => h.id === room.house);
  const facts = [
    room.sizeSqm ? `${room.sizeSqm} m²` : null,
    room.guests ? `sleeps ${room.maxGuests ?? room.guests}` : null,
    room.outlook,
    room.outdoor,
  ]
    .filter(Boolean)
    .join(", ");

  return pageMetadata({
    /* The seven suites are titled by their collection; everything else by the
       building it is in. */
    title:
      room.collection === "gateway"
        ? `${room.displayName} — ${m.rooms.gatewaySuites}`
        : `${room.displayName} — ${house?.name}`,
    description: `${room.description.slice(0, 150)}… ${facts}. Ink Hotels, Rethymno.`,
    path: `/rooms/${room.slug}`,
    /* Without this every localised room page declared the English URL as its
       canonical and og:locale=en_GB — telling Google that eighty pages were
       duplicates of twenty. Every other page on the site passed it; this was
       the one that did not. */
    locale,
    image: room.images[0] ?? "/opengraph-image",
  });
}

/**
 * The suites that have a line of their own, by slug.
 *
 * Deliberately partial. Three rooms carry a distinction worth leading with —
 * private water, a heated courtyard pool, a step-free suite built for access —
 * and writing one of these for all twenty would flatten the three that mean
 * something. Everything else leads with its description, exactly as before.
 */
const STANDOUT: Record<string, "standoutEvexia" | "standoutHarmony" | "standoutAgapi" | undefined> = {
  evexia: "standoutEvexia",
  harmony: "standoutHarmony",
  agapi: "standoutAgapi",
};

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const m = getMessages(locale);
  const localised = await getRooms(locale);
  const room = localised.find((r) => r.slug === slug);
  if (!room) notFound();

  const house = (await getHouses(locale)).find((h) => h.id === room.house);

  /* Cross-sell, resolved through the content layer so the titles are the
     reader's language and a slug that no longer exists simply drops out
     rather than rendering a link to nothing. */
  const wanted = relatedFor(room);
  const allExperiences = await getExperiences(locale);
  const related = wanted
    .map((slug) => allExperiences.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const siblings = localised
    .filter((r) => r.house === room.house && r.slug !== room.slug)
    .slice(0, 3);

  const specs: { term: string; value: string }[] = [
    ...(room.sizeSqm ? [{ term: m.rooms.size, value: `${room.sizeSqm} m²` }] : []),
    ...(room.bedrooms && room.bedrooms > 1
      ? [{ term: m.rooms.bedrooms, value: String(room.bedrooms) }]
      : []),
    ...(room.bathrooms && room.bathrooms > 1
      ? [{ term: m.rooms.bathrooms, value: String(room.bathrooms) }]
      : []),
    ...(room.guests
      ? [
          {
            term: m.rooms.sleeps,
            value: room.maxGuests
              ? `${room.guests} · ${room.maxGuests}`
              : `${room.guests}`,
          },
        ]
      : []),
    {
      term: m.rooms.beds,
      value: room.beds.map((b) => bedPhrase(b.label, b.count, m, locale)).join(", "),
    },
    ...(room.outlook ? [{ term: m.rooms.outlook, value: room.outlook }] : []),
    ...(room.outdoor ? [{ term: m.rooms.outdoor, value: room.outdoor }] : []),
    ...(room.level ? [{ term: m.rooms.level, value: room.level }] : []),
    ...(room.renovated ? [{ term: m.rooms.renovated, value: room.renovated }] : []),
  ];

  /* Stage 6.1, behind a flag. With the flag off for this slug the function
     returns below and today's page is rendered untouched — the new template is
     not even constructed. See content/suite-template.ts. */
  if (usesSuiteTemplate(room.slug)) {
    return (
      <>
        <JsonLd
          data={[
            roomSchema(room),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Rooms", path: "/rooms" },
              { name: room.displayName, path: `/rooms/${room.slug}` },
            ]),
          ]}
        />
        <SuiteTemplate
          room={room}
          houseName={house?.name ?? ""}
          locale={locale}
          standout={STANDOUT[room.slug] ? m.voice[STANDOUT[room.slug]!] : undefined}
        >
          {/* Deliberately re-stated rather than hoisted out of the block
              below. Hoisting would edit the page that is still live for the
              other nineteen rooms, and the guardrail on this rebuild is that
              today's pages are not touched until a suite is migrated. The
              duplication lasts exactly as long as the flag does. */}
          {related.length > 0 && (
            <Section ground="sun" size="md">
              <Container>
                <h2 className="label mb-8 text-[color:var(--fg-3)]">
                  {room.kind === "suite"
                    ? m.rooms.oftenArranged
                    : m.rooms.oftenArrangedRoom}
                </h2>
                <ul className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 sm:grid-cols-3">
                  {related.map((exp) => (
                    <li key={exp.slug}>
                      <Link
                        href={`/experiences/${exp.slug}`}
                        className="group block focus-visible:outline-offset-4"
                      >
                        {/* The box is rendered either way. Three cards in a
                            row where one has no picture and therefore no
                            height above its title look broken; a hairline
                            frame looks intended. */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {exp.image ? (
                            /* Decorative: the heading directly beneath is
                               inside the same link and already names the
                               experience, so an alt repeating it gives a
                               screen reader the title twice. axe flags this
                               as image-redundant-alt, and it is right. */
                            <Image
                              src={exp.image}
                              alt=""
                              fill
                              sizes="(min-width: 640px) 30vw, 100vw"
                              quality={70}
                              className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]"
                            />
                          ) : (
                            <NoFrame />
                          )}
                        </div>
                        <h3 className="mt-4 font-display text-[length:var(--text-d4)] leading-tight">
                          {exp.title}
                        </h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          )}
        </SuiteTemplate>
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={[
          roomSchema(room),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Rooms", path: "/rooms" },
            { name: room.displayName, path: `/rooms/${room.slug}` },
          ]),
        ]}
      />

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <Section ground="paper" size="none" className="pt-[clamp(7rem,12vh,9rem)]">
        <Container>
          <nav aria-label="Breadcrumb" className="label mb-8 text-[color:var(--fg-3)]">
            <Link href="/rooms" className="hover:text-[color:var(--fg)]">
              {m.nav.rooms}
            </Link>
            <span aria-hidden="true" className="mx-3">
              /
            </span>
            <span>{house?.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Heading level={1} size="d1" className="mb-5">
                {room.displayName}
              </Heading>
              {/* The official name, verbatim — so what is browsed here matches
                  what is reserved in the engine, with nothing lost at handoff. */}
              <p className="spec text-[color:var(--fg-3)]">{room.name}</p>
              <RoomBadges room={room} tone="inline" className="mt-6" />
            </div>
            <div className="lg:col-span-5">
              {/* Lead with what makes this suite unlike the other nineteen.
                  Only three have a line written for them; the rest lead with
                  their description, which is what they had before. A standout
                  line invented for every room would be twenty standout lines
                  and therefore none. */}
              {STANDOUT[room.slug] ? (
                <p className="measure font-display text-[length:var(--text-d4)] leading-[1.3] text-[color:var(--fg-1)]">
                  {m.voice[STANDOUT[room.slug]!]}
                </p>
              ) : null}
              <p
                className={cn(
                  "measure text-lg text-[color:var(--fg-2)]",
                  STANDOUT[room.slug] && "mt-6 text-base",
                )}
              >
                {room.description}
              </p>
              {/* The property publishes its own walkthrough for some suites.
                  It is embedded behind a facade rather than linked away: the
                  tour is several megabytes of third-party viewer, so nothing
                  is fetched until a guest asks — and when they do, they stay
                  on the page with the booking rail rather than losing it to
                  another tab. */}
              {room.tourUrl && room.images[0] && (
                <TourFacade
                  url={room.tourUrl}
                  poster={room.images[0]}
                  posterAlt={`${room.displayName} — ${m.rooms.tour360}`}
                  className="mt-8"
                />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Photographs and the booking rail ───────────────────────────── */}
      <Section ground="paper" size="none" className="pt-[clamp(2.5rem,5vw,4rem)]">
        <Container>
          <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
            <div className="lg:col-span-8">
              <RoomGallery images={room.images} roomName={room.name} />
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="border border-[color:var(--border)] p-6 lg:p-7">
                  <p className="label mb-2 text-[color:var(--fg-3)]">
                    {m.booking.reservingAs}
                  </p>
                  <p className="spec mb-6 leading-relaxed">{room.name}</p>
                  <Rule className="mb-6" />
                  <AvailabilityForm
                    tone="dark"
                    layout="stack"
                    roomId={room.bookingId ?? undefined}
                  />
                </div>

                {/* Where the engine has no id for this room yet, the button
                    can only open its front page. Saying so, with a way to
                    reserve the suite by name right beside it, is the
                    difference between a handoff and a dead end. Remove this
                    the moment `bookingId` is filled in. */}
                {!room.bookingId && (
                  <p className="mt-5 border-l-2 border-[color:var(--link)] pl-4 text-sm text-[color:var(--fg-2)]">
                    {m.booking.byNameNote}{" "}
                    <InkAnchor href={`mailto:${contact.emails.general}`}>
                      {contact.emails.general}
                    </InkAnchor>{" "}
                    <span aria-hidden="true">·</span>{" "}
                    <InkAnchor href={contact.phones[1].href}>
                      {contact.phones[1].value}
                    </InkAnchor>
                  </p>
                )}

                <BookDirect className="mt-7" />

                <p className="mt-5 text-sm text-[color:var(--fg-2)]">
                  {m.booking.speakToSomeone.split("{phone}")[0]}
                  <InkAnchor href={contact.phones[1].href}>
                    {contact.phones[1].value}
                  </InkAnchor>
                  {m.booking.speakToSomeone.split("{phone}")[1]}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ── Specification and amenities ────────────────────────────────── */}
      <Section ground="shade" size="md" className="mt-[clamp(3rem,6vw,5rem)]">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label mb-7 text-[color:var(--fg-3)]">{m.rooms.theRoom}</p>
              <dl className="border-t border-[color:var(--hairline)]">
                {specs.map((s) => (
                  <div
                    key={s.term}
                    className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-4"
                  >
                    <dt className="label text-[color:var(--fg-3)]">{s.term}</dt>
                    <dd className="spec text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {room.notes.length > 0 && (
                <div className="mt-8 space-y-2">
                  {room.notes.map((n) => (
                    <p key={n} className="text-sm text-[color:var(--fg-2)]">
                      {n}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <p className="label mb-7 text-[color:var(--fg-3)]">
                {m.rooms.whatIsInIt}
              </p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {room.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-baseline gap-3 border-b border-[color:var(--hairline)] pb-3 text-[color:var(--fg-2)]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-3 shrink-0 translate-y-[-0.35em] bg-[color:var(--border)]"
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Often arranged with it ─────────────────────────────────────── */}
      {related.length > 0 && (
        <Section ground="sun" size="md">
          <Container>
            {/* An h2, not a styled paragraph. The experience titles below are
                h3s, and without a level between them and the page's h1 the
                heading order jumps — which axe flags and a screen-reader user
                hears as a missing section. It still looks like a label. */}
            <h2 className="label mb-8 text-[color:var(--fg-3)]">
              {room.kind === "suite"
                ? m.rooms.oftenArranged
                : m.rooms.oftenArrangedRoom}
            </h2>
            <ul className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 sm:grid-cols-3">
              {related.map((exp) => (
                <li key={exp.slug}>
                  <Link
                    href={`/experiences/${exp.slug}`}
                    className="group block focus-visible:outline-offset-4"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {exp.image ? (
                        <Image
                          src={exp.image}
                          alt={exp.title}
                          fill
                          sizes="(min-width: 640px) 30vw, 100vw"
                          quality={70}
                          className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]"
                        />
                      ) : (
                        <NoFrame />
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-[length:var(--text-d4)] leading-tight">
                      <span className="relative inline-block">
                        {exp.title}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[600ms] ease-settle group-hover:origin-left group-hover:scale-x-100"
                        />
                      </span>
                    </h3>
                    <p className="measure mt-2 text-sm text-[color:var(--fg-2)]">
                      {exp.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ── The rest of the house ──────────────────────────────────────── */}
      {siblings.length > 0 && (
        <Section ground="paper" size="md">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-[color:var(--hairline)] pb-6">
              <Heading size="d3">
                {m.rooms.alsoInHouse.replace("{house}", house?.name ?? "")}
              </Heading>
              <InkLink href="/rooms" className="label whitespace-nowrap">
                {m.actions.allRooms.replace("{count}", String(rooms.length))} →
              </InkLink>
            </div>
            <div className="grid gap-x-[clamp(1.5rem,2.5vw,2.5rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((r) => (
                <RoomCard key={r.slug} room={r} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Handoff ────────────────────────────────────────────────────── */}
      <Section ground="ink" size="md">
        <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label mb-5 text-phos">{m.rooms.readyWhenYouAre}</p>
            <Heading size="d3" className="max-w-[16ch] text-paper">
              {room.displayName}, at Ink
            </Heading>
          </div>
          <a
            href={bookingUrlFor(room)}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex h-14 items-center justify-center bg-paper px-9 text-ink transition-colors duration-500 ease-settle hover:bg-sea hover:text-paper"
            aria-label={`${m.actions.bookNow} — ${room.name}`}
          >
            {m.actions.bookNow}
          </a>
        </Container>
      </Section>
    </>
  );
}
