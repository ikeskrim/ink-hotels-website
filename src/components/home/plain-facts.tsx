import { Container, Heading, Section, SectionHead } from "@/components/ui/section";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { Reveal } from "@/components/motion/reveal";
import { contact, reception, stay } from "@/content/site";
import { getMessages } from "@/i18n";
import { label } from "@/i18n/labels";
import { spokenLanguages } from "@/i18n/languages";
import { defaultLocale, type Locale } from "@/i18n/config";
import { timeSep } from "@/i18n/time";

/**
 * The plain facts.
 *
 * Everything a guest would otherwise open a review site to find out — hours,
 * noise, parking, breakfast, pets — stated here before they leave. Nothing is
 * softened; the old town is lively, and saying so is what makes the rest
 * credible.
 *
 * Reception hours lead, because they are the fact that decides whether a late
 * flight is a problem, and every other page defers to this one for them.
 */
export function PlainFacts({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);

  const FACTS: { term: string; def: string }[] = [
    {
      term: m.common.factReceptionTerm,
      def: m.common.factReception.replace("{time}", reception.openUntil),
    },
    {
      term: m.common.factCheckinTerm,
      def: m.common.factCheckin
        .replace("{checkin}", stay.checkIn.replace(":", timeSep(locale)))
        .replace("{checkout}", stay.checkOut.replace(":", timeSep(locale))),
    },
    { term: m.common.factBreakfastTerm, def: m.common.factBreakfast },
    { term: m.common.factNoiseTerm, def: m.common.factNoise },
    { term: m.common.factParkingTerm, def: m.common.factParking },
    { term: m.common.factHousekeepingTerm, def: m.common.factHousekeeping },
    { term: m.common.factPetsTerm, def: m.common.factPets },
    {
      term: m.common.factLanguagesTerm,
      def: m.common.factLanguages.replace("{languages}", spokenLanguages(locale)),
    },
    { term: m.common.factEcoTerm, def: m.common.factEco },
  ];

  return (
    <Section name="PlainFacts" ground="paper" size="lg" plaster chapter="03">
      <Container>
        <div className="grid gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead index={3} eyebrow={m.home.factsEyebrow} className="mb-10">
              <Heading size="d3" className="max-w-[16ch]">
                {m.home.factsTitle}
              </Heading>
            </SectionHead>

            <Reveal>
              <dl className="border-t border-[color:var(--hairline)]">
                {FACTS.map((fact) => (
                  <div
                    key={fact.term}
                    className="grid gap-2 border-b border-[color:var(--hairline)] py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
                  >
                    <dt className="label pt-1 text-[color:var(--fg-3)]">
                      {fact.term}
                    </dt>
                    <dd className="measure-wide text-[color:var(--fg-2)]">
                      {fact.def}
                    </dd>
                  </div>
                ))}
              </dl>
              <InkLink href="/faq" className="label mt-8 inline-block">
                {m.actions.everythingElse} →
              </InkLink>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <SectionHead eyebrow={m.home.whereEyebrow} className="mb-10">
              <Heading size="d4" className="max-w-[18ch]">
                {m.home.whereTitle}
              </Heading>
            </SectionHead>

            <Reveal>
              <div className="space-y-7 text-[color:var(--fg-2)]">
                <address className="not-italic">
                  <p className="mb-2 text-[color:var(--fg)]">
                    Ink Hotels — House of Europe &amp; Phos
                  </p>
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
                    {contact.registeredAddress.postalCode}, {m.common.creteGreece}
                  </p>
                </address>

                <div className="space-y-1.5">
                  {contact.phones.map((p) => (
                    <p key={p.href} className="spec">
                      <span className="text-[color:var(--fg-3)]">
                        {label(p.label, m)} ·{" "}
                      </span>
                      <InkAnchor href={p.href}>{p.value}</InkAnchor>
                      {p.ext && (
                        <span className="text-[color:var(--fg-3)]">
                          {" "}
                          ({m.common.ext} {p.ext})
                        </span>
                      )}
                    </p>
                  ))}
                  {/* The mobile above, on the channel that costs a guest
                      abroad nothing. */}
                  <p className="spec">
                    <span className="text-[color:var(--fg-3)]">
                      {m.concierge.whatsapp} ·{" "}
                    </span>
                    <InkAnchor
                      href={contact.whatsapp.url(m.concierge.whatsappGreeting)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contact.phones[1].value}
                    </InkAnchor>
                  </p>
                  <p className="spec">
                    <InkAnchor href={`mailto:${contact.emails.general}`}>
                      {contact.emails.general}
                    </InkAnchor>
                  </p>
                </div>

                <p className="spec text-[color:var(--fg-3)]">
                  35.3714° N · 24.4754° E
                </p>

                <InkLink href="/location" className="label inline-block">
                  {m.actions.directionsAndContact} →
                </InkLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
