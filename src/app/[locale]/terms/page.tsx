import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-layout";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { pageMetadata } from "@/lib/seo";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";
import { contact, legal, site } from "@/content/site";
import { ReachUs } from "@/components/contact/reach-us";

/* See the note on /privacy: `noindex` still needs a readable tab. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return {
    ...pageMetadata({
      title: m.pageMeta.terms.t,
      description: m.pageMeta.terms.d,
      path: "/terms",
      locale,
    }),
    robots: { index: false, follow: true },
  };
}

/* Takes its params for the same reason /privacy does: rendered under
   `[locale]` with no way to read it, the page cannot hand a locale to
   anything that needs one — here, the contact line at the foot. */
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <LegalPage eyebrow="Legal" title="Terms of use" updated="August 2026">
      <p>
        These terms apply to this website and to reservations made through it.
        By using the site you agree to them.
      </p>

      <h2>Who we are</h2>
      <p>
        {site.legalName} is a company incorporated under the laws of Greece,
        with its registered address at {contact.registeredAddress.street},{" "}
        {contact.registeredAddress.locality}{" "}
        {contact.registeredAddress.postalCode}, Crete.
      </p>
      <ul>
        <li>
          Greek National Tourism Organisation licence:{" "}
          <span className="spec">{legal.gntoLicence}</span>
        </li>
        <li>
          VAT registration: <span className="spec">{legal.vat}</span>
        </li>
        <li>
          Chamber of Commerce registration:{" "}
          <span className="spec">{legal.companyRegistration}</span>
        </li>
      </ul>

      <h2>Reservations</h2>
      <p>
        Availability, rates and reservation terms are handled in our reservation
        system at{" "}
        <InkAnchor
          href={contact.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          inkhotels.reserve-online.net
        </InkAnchor>
        , which opens in a new tab. The cancellation, prepayment and no-show
        terms that apply to your stay are those shown against the rate you
        select, and are repeated in your confirmation email. They vary by rate
        and by room, and some rates are non-refundable.
      </p>
      <p>
        Applicable taxes, including any city or tourist tax, may be charged by
        the property. To review, change or cancel a reservation, follow the
        instructions in your confirmation email, or contact us directly.
      </p>

      <h2>Prices and errors</h2>
      <p>
        Prices are shown per room for the stay and include VAT and other taxes
        unless stated otherwise at the time of booking. Obvious errors and
        misprints are not binding.
      </p>

      <h2>Arrival</h2>
      <p>
        If you will arrive late or the following day, please tell us, so that
        your room is held and no no-show charge is applied.
      </p>

      <h2>Content on this site</h2>
      <p>
        The text, photographs and design of this site belong to us or to our
        suppliers. You may not reproduce, scrape or republish them for
        commercial purposes without our written permission. Photographs show the
        property as it was at the time they were taken; individual rooms of the
        same type may differ.
      </p>

      <h2>Liability</h2>
      <p>
        We take reasonable care to keep the information on this site accurate
        and current, but we do not warrant that it is free of error, and we are
        not liable for interruptions to the site itself. Nothing in these terms
        limits any liability that cannot be limited under Greek law, including
        liability for death or personal injury caused by negligence.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms and our services are governed by Greek law, and any dispute
        arising from them is subject to the exclusive jurisdiction of the
        competent courts of Greece.
      </p>

      <h2>Contact</h2>
      <p>
        Write to{" "}
        <InkAnchor href={`mailto:${contact.emails.general}`}>
          {contact.emails.general}
        </InkAnchor>{" "}
        or call{" "}
        <ReachUs locale={locale} />
        . See also our <InkLink href="/privacy">privacy policy</InkLink>.
      </p>
    </LegalPage>
  );
}
