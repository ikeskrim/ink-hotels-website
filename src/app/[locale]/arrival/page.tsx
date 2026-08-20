import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getArrival } from "@/lib/sanity/content";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { contact, reception } from "@/content/site";
import { folio } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.arrival.t,
    description: m.pageMeta.arrival.d,
    path: "/arrival",
    locale,
  });
}

export default async function ArrivalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const arrival = await getArrival(locale);
  const m = getMessages(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Arrival", path: "/arrival" },
        ])}
      />

      <PageHero
        eyebrow={arrival.eyebrow}
        title={arrival.title}
        lede={arrival.lede}
        image="/media/6ad7bfa1e7f17c6e4db2f4b5cb933ecd.webp"
        imageAlt={m.photoAlt.arrivalCourtyard}
      />

      {/* ── The reception ──────────────────────────────────────────────── */}
      <Section ground="sun" size="lg">
        <Container>
          <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label mb-6 text-[color:var(--fg-3)]">
                  {arrival.reception.label}
                </p>
                <Heading size="d2" className="mb-8">
                  {arrival.reception.heading}
                </Heading>
                <div className="prose-ink measure">
                  {arrival.reception.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                  <InkAnchor
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label"
                  >
                    {m.actions.openInMaps} →
                  </InkAnchor>
                  <InkAnchor href={contact.phones[0].href} className="label">
                    {contact.phones[0].value}
                  </InkAnchor>
                </div>
              </Reveal>
            </div>

            <figure className="lg:col-span-7">
              <MaskReveal className="aspect-[4/3]">
                <Image
                  src="/media/eadfa8cf4ff79016e1ae3e27f1a2c530.webp"
                  alt={`An open door onto the light at Ink Hotels, near the reception at ${reception.street}`}
                  width={1400}
                  height={1050}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  quality={78}
                  className="graded h-full w-full object-cover"
                />
              </MaskReveal>
              <figcaption className="label mt-4 text-[color:var(--fg-3)]">
                {reception.street} · {reception.locality} {reception.postalCode}
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ── The journey, in order ──────────────────────────────────────── */}
      <Section ground="paper" size="lg">
        <Container>
          <div className="mb-[clamp(2.5rem,5vw,4rem)] border-b border-[color:var(--hairline)] pb-8">
            <p className="label mb-5 text-[color:var(--fg-3)]">
              {m.arrival.howItGoes}
            </p>
            <Heading size="d2" className="max-w-[18ch]">
              {m.arrival.fromAirport}
            </Heading>
          </div>

          <RevealGroup className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-12 sm:grid-cols-2">
            {arrival.steps.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="flex gap-6">
                  <span
                    className="spec shrink-0 pt-1 text-[color:var(--fg-3)]"
                    aria-hidden="true"
                  >
                    {folio(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-display text-[length:var(--text-d4)] leading-tight">
                      {step.title}
                    </h3>
                    <p className="measure mt-3 text-[color:var(--fg-2)]">
                      {step.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ── Practical ──────────────────────────────────────────────────── */}
      <Section ground="shade" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading size="d3" className="max-w-[14ch]">
                {m.arrival.worthKnowing}
              </Heading>
            </div>
            <div className="lg:col-span-7">
              <dl className="border-t border-[color:var(--hairline)]">
                {arrival.facts.map((f) => (
                  <div
                    key={f.term}
                    className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-4"
                  >
                    <dt className="label text-[color:var(--fg-3)]">{f.term}</dt>
                    <dd className="spec text-right">{f.def}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                <InkLink href="/location" className="label">
                  {m.actions.directionsAndContact} →
                </InkLink>
                <InkLink href="/faq" className="label">
                  {m.nav.faq} →
                </InkLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── The family behind it ───────────────────────────────────────── */}
      <Section ground="ink" size="lg">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label mb-6 text-phos">{m.arrival.whoMeetsYou}</p>
              <Heading size="d2" className="max-w-[14ch] text-paper">
                {arrival.closing.heading}
              </Heading>
            </div>
            <div className="lg:col-span-7 lg:pt-3">
              <p className="measure-wide text-lg leading-relaxed text-paper/85">
                {arrival.closing.body}
              </p>
              <InkAnchor
                href={contact.group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-9 inline-block text-[color:var(--link)]"
              >
                Crete Holiday Home →
              </InkAnchor>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
