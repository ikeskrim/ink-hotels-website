import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/ui/section";
import { MapFacade } from "@/components/location/map-facade";
import { OldTownPlan } from "@/components/place/old-town-plan";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/content/site";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { label } from "@/i18n/labels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.location.t,
    description: m.pageMeta.location.d,
    path: "/location",
    locale,
  });
}

/* Distances and durations are only stated where the property itself states
   them, or where they follow from its own published figures. */
const NEARBY = [
  { name: "The Venetian harbour", detail: "A few minutes on foot" },
  { name: "The Fortezza", detail: "A few minutes on foot" },
  { name: "Archaeological Museum", detail: "400 m from the Residence" },
  { name: "Koumbes beach", detail: "1.6 km from the Residence" },
  { name: "Arkadi Monastery", detail: "23 km east" },
];

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Location", path: "/location" },
        ])}
      />

      <PageHero
        eyebrow="Rethymno · Crete"
        title={
          <>
            Inside the
            <br />
            old town
          </>
        }
        lede="Not near it, not above it — inside it. You arrive at House of Europe on Nikolaou Plastira, where reception and all seven suites are; Phos is a short walk away, and the residence stands by the Venetian harbour."
        image="/media/05c09d32efa814812ba4598083de9b4c.webp"
        imageAlt={m.photoAlt.harbourLighthouse}
        height="sm"
      />

      <Section ground="paper" size="md">
        <Container>
          <MapFacade />

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            {/* ── Addresses ─────────────────────────────────────────── */}
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label mb-7 text-[color:var(--fg-3)]">
                  The addresses
                </p>
                <address className="not-italic">
                  <dl className="border-t border-[color:var(--hairline)]">
                    {contact.buildings.map((b) => (
                      <div
                        key={b.street}
                        className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-4"
                      >
                        <dt className="label text-[color:var(--fg-3)]">
                          {label(b.label, m)}
                        </dt>
                        <dd className="spec text-right">{b.street}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="spec mt-6 text-[color:var(--fg-2)]">
                    {contact.registeredAddress.locality}{" "}
                    {contact.registeredAddress.postalCode}, {m.common.creteGreece}
                  </p>
                  <p className="spec mt-1 text-[color:var(--fg-3)]">
                    {contact.coordinates.lat.toFixed(4)}° N ·{" "}
                    {contact.coordinates.lng.toFixed(4)}° E
                  </p>
                </address>

                <InkAnchor
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label mt-8 inline-block"
                >
                  Open in Google Maps →
                </InkAnchor>
              </Reveal>
            </div>

            {/* ── Getting here ──────────────────────────────────────── */}
            <div className="lg:col-span-7">
              <Reveal delay={0.08}>
                <p className="label mb-7 text-[color:var(--fg-3)]">
                  Getting here
                </p>

                <div className="prose-ink measure-wide">
                  <p>
                    Rethymno sits between the airports of Chania and Heraklion,
                    on the north coast of Crete. A chauffeur can meet you at
                    either airport, or at the port, and bring you in — tell us
                    your arrival and we will arrange it.
                  </p>
                  <p>
                    The old town is historic and its lanes are narrow and
                    cobbled. Free parking is available off-site within a hundred
                    metres; the Residence of the Old Port has private parking of
                    its own.
                  </p>
                </div>

                <div className="mt-10">
                  <p className="label mb-5 text-[color:var(--fg-3)]">
                    What is near
                  </p>
                  <dl className="border-t border-[color:var(--hairline)]">
                    {NEARBY.map((n) => (
                      <div
                        key={n.name}
                        className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-3.5"
                      >
                        <dt className="text-[color:var(--fg-2)]">{n.name}</dt>
                        <dd className="spec text-right text-[color:var(--fg-3)]">
                          {n.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                  <InkLink href="/rethymno" className="label">
                    What is around you →
                  </InkLink>
                  <InkLink href="/contact" className="label">
                    Contact →
                  </InkLink>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── The quarter, plotted ──────────────────────────────────────────
          Below the interactive map facade rather than instead of it: that one
          is Google's, loads on request and can route you; this one is four
          verified positions and a scale bar, costs nothing, and answers the
          question a guest actually asks at the door — which way, and how far. */}
      <Section ground="paper" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="label mb-5 text-[color:var(--fg-3)]">
                {m.home.landmarksEyebrow}
              </p>
              <h2 className="font-display text-[length:var(--text-d3)] leading-tight">
                {m.mapPlan.title}
              </h2>
              <InkLink href="/rethymno" className="label mt-8 inline-block">
                {m.nav.rethymno} →
              </InkLink>
            </div>
            <div className="lg:col-span-7">
              <OldTownPlan locale={locale} />
            </div>
          </div>
        </Container>
      </Section>

      <Section ground="shade" size="md">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {contact.phones.map((p) => (
              <div key={p.href}>
                <p className="label mb-3 text-[color:var(--fg-3)]">{label(p.label, m)}</p>
                <InkAnchor href={p.href} className="spec">
                  {p.value}
                </InkAnchor>
              </div>
            ))}
            <div>
              <p className="label mb-3 text-[color:var(--fg-3)]">{m.common.general}</p>
              <InkAnchor
                href={`mailto:${contact.emails.general}`}
                className="spec break-all"
              >
                {contact.emails.general}
              </InkAnchor>
            </div>
            <div>
              <p className="label mb-3 text-[color:var(--fg-3)]">
                {m.common.reservationsEmail}
              </p>
              <InkAnchor
                href={`mailto:${contact.emails.reservations}`}
                className="spec break-all"
              >
                {contact.emails.reservations}
              </InkAnchor>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
