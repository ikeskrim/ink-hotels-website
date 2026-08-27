import type { Metadata } from "next";

import { Container, Heading, Section } from "@/components/ui/section";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { ReachUs } from "@/components/contact/reach-us";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getFaqs } from "@/lib/sanity/content";
import type { FaqTopic } from "@/content/faq";
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

/* Reading order, not authoring order. `help` is last because it is also the
   catch-all for anything the CMS adds without a topic. */
const GROUPS: FaqTopic[] = ["finding", "rooms", "staying", "help"];

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
          <p className="label mb-6 text-[color:var(--fg-3)]">
            {m.faqPage.eyebrow}
          </p>
          <Heading level={1} size="d1" className="max-w-[14ch]">
            {m.faqPage.title}
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
              {/* Grouped, because fourteen disclosures in one undifferentiated
                  stack is a list you scan rather than a page you read. Each
                  group is an h2 and Radix's triggers are h3s beneath it, so the
                  order runs 1 → 2 → 3 with nothing skipped.

                  Questions with no topic — anything authored in the CMS, which
                  has no topic field — fall into the last group rather than out
                  of the page. */}
              {GROUPS.map((topic) => {
                const inGroup = faqs.filter((f) =>
                  topic === GROUPS[GROUPS.length - 1]
                    ? f.topic === topic || !f.topic
                    : f.topic === topic,
                );
                if (!inGroup.length) return null;

                return (
                  <section key={topic} className="mb-[clamp(2.5rem,5vw,4rem)]">
                    <h2 className="label mb-2 text-[color:var(--fg-3)]">
                      {m.faqPage[topic]}
                    </h2>
                    <Accordion
                      type="multiple"
                      className="border-t border-[color:var(--hairline)]"
                    >
                      {inGroup.map((f) => (
                        <AccordionItem
                          key={f.question}
                          value={f.question}
                          label={f.question}
                          headingLevel={3}
                        >
                          {f.answer}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                );
              })}
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
                    <ReachUs locale={locale} className="spec" />
                  </p>
                  <p className="spec text-[color:var(--fg-3)]">
                    {m.faqPage.openUntil.replace("{time}", reception.openUntil)}
                  </p>
                </div>
                <InkLink href="/contact" className="label mt-7 inline-block">
                  {m.actions.writeToUs} →
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
                  {m.nav.accessibility} →
                </InkLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
