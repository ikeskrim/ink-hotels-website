import { Container, Heading, Section } from "@/components/ui/section";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { BookDirect } from "@/components/booking/book-direct";
import { InkAnchor } from "@/components/ui/ink-link";
import { Reveal } from "@/components/motion/reveal";
import { contact, reception } from "@/content/site";
import { getMessages } from "@/i18n";
import { fill } from "@/i18n/fill";
import { label } from "@/i18n/labels";
import { spokenLanguages } from "@/i18n/languages";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * The handoff.
 *
 * A silent domain change at the moment of payment is where small-hotel funnels
 * bleed, so the change is stated out loud, with the destination named. No
 * price, no "from €", no invented availability, no countdown — a hotel this
 * size does not need urgency theatre, and it converts on the phone as often
 * as on the form.
 */
export function NowTheDates({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  const reception0 = contact.phones[0];
  const mobile = contact.phones[1];

  return (
    <Section name="NowTheDates" id="book" ground="ink" size="lg" wash="paper">
      <Container>
        <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label mb-6 text-phos">{m.home.datesEyebrow}</p>
              <Heading size="d2" className="max-w-[12ch] text-paper">
                {m.home.datesTitle}
              </Heading>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="border-t border-paper/25 pt-8">
                <AvailabilityForm tone="light" />
              </div>

              <BookDirect tone="ink" className="mt-8" />

              <p className="mt-8 text-paper/70">
                {fill(m.booking.orCall, {
                  phone: (
                    <InkAnchor href={reception0?.href ?? "#"} className="text-paper">
                      {reception0?.value}
                    </InkAnchor>
                  ),
                  phone2: (
                    <InkAnchor href={mobile?.href ?? "#"} className="text-paper">
                      {mobile?.value}
                    </InkAnchor>
                  ),
                  languages: spokenLanguages(locale),
                })}
              </p>

              {/* The hours belong here rather than only on the facts list: this
                  is the moment somebody with a late flight decides whether to
                  book or to write and ask first. */}
              <p className="mt-3 text-paper/50">
                {m.common.receptionUntil.replace("{time}", reception.openUntil)}
                {reception0?.ext
                  ? ` · ${label(reception0.label, m)} ${m.common.ext} ${reception0.ext}`
                  : ""}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
