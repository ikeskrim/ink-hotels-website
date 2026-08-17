import type { Metadata } from "next";

import { Container, Heading, Section } from "@/components/ui/section";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getFaqs } from "@/lib/sanity/content";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { spokenLanguages } from "@/i18n/languages";
import { contact, reception } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.faq.t,
    description: m.pageMeta.faq.d,
    path: "/faq",
    locale,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);
  const faqs = await getFaqs(locale);

  return (
    <>
      <JsonLd
        data={[
          faqSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Frequently asked", path: "/faq" },
          ]),
        ]}
      />

      <Section ground="paper" size="none" className="pt-[clamp(8rem,14vh,11rem)]">
        <Container>
          <p className="label mb-6 text-[color:var(--fg-3)]">Worth knowing</p>
          <Heading level={1} size="d1" className="max-w-[14ch]">
            The plain facts
          </Heading>
          <p className="measure-wide mt-7 text-lg text-[color:var(--fg-2)]">
            {m.common.lede}
          </p>
        </Container>
      </Section>

      <Section ground="paper" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-8">
              {/* Radix renders each trigger inside an h3, so the page needs an
                  h2 here or the heading order skips a level. */}
              <h2 className="label mb-6 text-[color:var(--fg-3)]">
                Questions
              </h2>
              <Accordion
                type="multiple"
                className="border-t border-[color:var(--hairline)]"
              >
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.question}
                    value={`faq-${i}`}
                    question={f.question}
                  >
                    {f.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-[color:var(--border)] p-7">
                <p className="label mb-4 text-[color:var(--fg-3)]">
                  {m.common.stillWondering}
                </p>
                <p className="measure text-[color:var(--fg-2)]">
                  {m.common.weAnswerIn.replace(
                    "{languages}",
                    spokenLanguages(locale),
                  )}
                </p>
                <div className="mt-6 space-y-2">
                  <p>
                    <InkAnchor
                      href={`mailto:${contact.emails.general}`}
                      className="spec break-all"
                    >
                      {contact.emails.general}
                    </InkAnchor>
                  </p>
                  <p>
                    <InkAnchor href={contact.phones[0].href} className="spec">
                      {contact.phones[0].value}
                    </InkAnchor>
                    {contact.phones[0].ext && (
                      <span className="spec text-[color:var(--fg-3)]">
                        {" "}
                        ({m.common.ext} {contact.phones[0].ext})
                      </span>
                    )}
                  </p>
                  <p className="spec text-[color:var(--fg-3)]">
                    Open until {reception.openUntil}
                  </p>
                </div>
                <InkLink href="/contact" className="label mt-7 inline-block">
                  Write to us →
                </InkLink>
              </div>

              <div className="mt-8 border border-[color:var(--border)] p-7">
                <p className="label mb-4 text-[color:var(--fg-3)]">
                  {m.common.accessHeading}
                </p>
                <p className="measure text-[color:var(--fg-2)]">
                  {m.common.accessBody}
                </p>
                <InkLink href="/accessibility" className="label mt-6 inline-block">
                  Accessibility →
                </InkLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
