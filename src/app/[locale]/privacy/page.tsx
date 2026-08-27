import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-layout";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { ReachUs } from "@/components/contact/reach-us";
import { pageMetadata } from "@/lib/seo";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";
import { contact, site } from "@/content/site";

/* `noindex`, so the title is not a search-result line — but it is still the
   browser tab a Greek reader is looking at, and it was in English. */
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
      title: m.pageMeta.privacy.t,
      description: m.pageMeta.privacy.d,
      path: "/privacy",
      locale,
    }),
    robots: { index: false, follow: true },
  };
}

/* Takes its params. Rendered under `[locale]` with no way to read it, so
   every string on the page was English in all five languages. */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy and cookies"
      updated="August 2026"
    >
      <p>
        Your privacy matters to us. This explains what we collect, why, and what
        you can ask us to do about it. {site.legalName} is the data controller.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you write to us.</strong> Your name, email address and
          the content of your message.
        </li>
        <li>
          <strong>When you reserve a room.</strong> Reservations are taken in
          our reservation system, which is operated for us by a third party. The
          data you enter there — name, contact details, payment details, stay
          preferences — is processed under that system&rsquo;s own privacy
          terms, shown at the point of booking.
        </li>
        <li>
          <strong>When you browse this site.</strong> Standard server logs, kept
          briefly for security and diagnostics.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        This website sets no advertising or analytics cookies, and there is no
        third-party tracking script on it. If you choose to load the map on our
        location page, that request goes to OpenStreetMap and is subject to
        their terms — nothing is loaded from them until you ask for it.
      </p>

      <h2>Why we use it, and on what basis</h2>
      <ul>
        <li>
          To answer your enquiry and arrange your stay — because it is necessary
          to take steps at your request and to perform our contract with you.
        </li>
        <li>
          To keep the site secure and working — our legitimate interest in
          running it safely.
        </li>
        <li>
          To meet accounting and tourism-licensing obligations under Greek law.
        </li>
      </ul>

      <h2>Who sees it</h2>
      <p>
        Our staff, and the suppliers who host this site, deliver our email and
        run our reservation system. We do not sell your data, and we do not
        share it for anyone else&rsquo;s marketing.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries are kept while we are dealing with them and for a reasonable
        period afterwards. Reservation and accounting records are kept for as
        long as Greek law requires.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the GDPR you may ask us for a copy of your data, ask us to correct
        or erase it, object to or restrict how we use it, and ask for it in a
        portable form. Write to{" "}
        <InkAnchor href={`mailto:${contact.emails.general}`}>
          {contact.emails.general}
        </InkAnchor>
        . You also have the right to complain to the Hellenic Data Protection
        Authority.
      </p>

      <h2>Contact</h2>
      <p>
        {contact.registeredAddress.street},{" "}
        {contact.registeredAddress.locality}{" "}
        {contact.registeredAddress.postalCode}, {m.common.creteGreece} ·{" "}
        <ReachUs locale={locale} />
        . See also our <InkLink href="/terms">terms of use</InkLink>.
      </p>
    </LegalPage>
  );
}
