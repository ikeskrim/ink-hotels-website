import type { Metadata } from "next";

import { Container, Heading, Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, legal, reception } from "@/content/site";
import { getMessages } from "@/i18n";
import { label } from "@/i18n/labels";
import { spokenLanguages } from "@/i18n/languages";
import { defaultLocale, isLocale } from "@/i18n/config";

/* The number here was `+30 2831 051957` — a line that exists nowhere else in
   the property's data and that we cannot verify anybody answers. A wrong
   telephone number in a meta description is the worst kind of error: it is
   what a search result shows, and it is dialled before the site is ever
   opened. It now reads from the same record the footer does. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.contact.t,
    description: m.pageMeta.contact.d
      .replace("{phone}", contact.phones[0].value)
      .replace("{ext}", contact.phones[0].ext ?? "")
      .replace("{time}", reception.openUntil),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
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
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Section ground="paper" size="none" className="pt-[clamp(8rem,14vh,11rem)]">
        <Container>
          <p className="label mb-6 text-[color:var(--fg-3)]">
            {m.contact.eyebrow}
          </p>
          {/* An explicit break rather than a `ch` max-width: the `ch` unit is
              measured from the active font, so it changes at swap time and the
              heading re-wraps, moving everything under it. */}
          <Heading level={1} size="d1">
            {m.contact.title}
          </Heading>
          {/* Floor reserved in em: the fallback face takes one line more than
              Commissioner, and without this the section below jumps at swap. */}
          <p className="measure-wide mt-7 min-h-[4.9em] text-lg text-[color:var(--fg-2)]">
            {m.contact.lede.replace("{languages}", spokenLanguages(locale))}
          </p>
        </Container>
      </Section>

      <Section ground="paper" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>

            <aside className="lg:col-span-5 lg:pl-8">
              <Reveal delay={0.08}>
                <div className="border-t border-[color:var(--hairline)] pt-8">
                  <p className="label mb-5 text-[color:var(--fg-3)]">
                    Or reach us directly
                  </p>
                  <div className="space-y-4">
                    {contact.phones.map((p) => (
                      <p key={p.href}>
                        <span className="label mr-3 text-[color:var(--fg-3)]">
                          {label(p.label, m)}
                        </span>
                        <InkAnchor href={p.href} className="spec">
                          {p.value}
                        </InkAnchor>
                      </p>
                    ))}
                    <p>
                      <span className="label mr-3 text-[color:var(--fg-3)]">
                        {m.common.general}
                      </span>
                      <InkAnchor
                        href={`mailto:${contact.emails.general}`}
                        className="spec break-all"
                      >
                        {contact.emails.general}
                      </InkAnchor>
                    </p>
                    <p>
                      <span className="label mr-3 text-[color:var(--fg-3)]">
                        {m.common.reservations}
                      </span>
                      <InkAnchor
                        href={`mailto:${contact.emails.reservations}`}
                        className="spec break-all"
                      >
                        {contact.emails.reservations}
                      </InkAnchor>
                    </p>
                  </div>
                </div>

                <div className="mt-10 border-t border-[color:var(--hairline)] pt-8">
                  <p className="label mb-5 text-[color:var(--fg-3)]">Find us</p>
                  <address className="not-italic text-[color:var(--fg-2)]">
                    {contact.buildings.map((b) => (
                      <p key={b.street} className="spec">
                        <span className="text-[color:var(--fg-3)]">
                          {label(b.label, m)} ·{" "}
                        </span>
                        {b.street}
                      </p>
                    ))}
                    <p className="spec pt-1">
                      {contact.registeredAddress.locality}{" "}
                      {contact.registeredAddress.postalCode}, Crete, Greece
                    </p>
                  </address>
                  <InkLink href="/location" className="label mt-6 inline-block">
                    Directions →
                  </InkLink>
                </div>

                <div className="mt-10 border-t border-[color:var(--hairline)] pt-8">
                  <p className="label mb-5 text-[color:var(--fg-3)]">
                    Booking direct
                  </p>
                  <p className="measure text-[color:var(--fg-2)]">
                    {m.common.ratesInEngine}
                  </p>
                  <InkAnchor
                    href={contact.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label mt-6 inline-block"
                  >
                    Book now →
                  </InkAnchor>
                </div>

                <p className="spec mt-10 text-[color:var(--fg-3)]">
                  {m.common.gntoLicence} {legal.gntoLicence} · {m.common.vat}{" "}
                  {legal.vat}
                </p>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
