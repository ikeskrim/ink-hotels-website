import { ArrowUpRight } from "lucide-react";

import { contact, legal, nav, reception, site } from "@/content/site";
import { spokenLanguages } from "@/i18n/languages";
import { getMessages } from "@/i18n";
import { label } from "@/i18n/labels";
import { OffersSignup } from "@/components/layout/offers-signup";
import { localePath, type Locale } from "@/i18n/config";
import { houses } from "@/content/rooms";
import { Wordmark } from "@/components/layout/wordmark";
import { InkSignature } from "@/components/brand/ink-signature";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";

/* Server component: messages come in as a prop rather than through context, so
   the footer costs nothing on the client. */
export function SiteFooter({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const year = new Date().getFullYear();
  const L = (path: string) => localePath(locale, path);

  return (
    <footer data-ground="ink" className="relative grain">
      <div className="mx-auto w-full max-w-[1680px] px-6 pb-14 pt-[clamp(4rem,7vw,7rem)] sm:px-8 lg:px-12">
        {/* ── Masthead ─────────────────────────────────────────────────── */}
        <div className="grid gap-12 border-b border-paper/12 pb-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Wordmark markColor="inherit" className="h-7 w-auto" />
            <p className="measure mt-8 font-display text-2xl leading-[1.15] text-paper/90">
              {m.common.footerBlurb}
            </p>
            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label group mt-10 inline-flex h-13 items-center gap-3 bg-paper px-7 py-4 text-ink transition-colors duration-500 ease-settle hover:bg-sea hover:text-paper"
            >
              {m.actions.bookNow}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </a>
          </div>

          <address className="not-italic">
            <h2 className="label mb-6 text-phos">{m.contact.findUs}</h2>
            <div className="space-y-6 text-sm leading-relaxed text-paper/75">
              {/* The reception is given its own weight: it is the one address
                  a guest actually needs, and the other three are where they
                  sleep, not where they arrive. */}
              <div>
                <p className="label mb-2 text-phos">{m.common.arriveHere}</p>
                <p className="text-paper">{reception.street}</p>
                <p>
                  {reception.locality} {reception.postalCode}, Crete, Greece
                </p>
                <p className="pt-3 text-paper/50">
                  {m.common.alsoOccupies.replace(
                    "{streets}",
                    contact.buildings
                      .filter((b) => !b.isReception)
                      .map((b) => b.street)
                      .join(", "),
                  )}
                </p>
              </div>

              <div className="space-y-1">
                {contact.phones.map((p) => (
                  <p key={p.href}>
                    <span className="text-paper/45">{label(p.label, m)} · </span>
                    <InkAnchor href={p.href}>{p.value}</InkAnchor>
                    {p.ext && (
                      <span className="text-paper/45">
                        {" "}
                        ({m.common.ext} {p.ext})
                      </span>
                    )}
                  </p>
                ))}
                <OffersSignup className="pb-2 pt-4" />
                <p className="pt-1 text-paper/50">
                  {m.common.receptionUntil.replace("{time}", reception.openUntil)}
                </p>
                <p>
                  <InkAnchor href={`mailto:${contact.emails.general}`}>
                    {contact.emails.general}
                  </InkAnchor>
                </p>
                <p className="pt-2 text-paper/50">
                  {contact.internationalOffices
                    .map((o) => `${o.label} ${o.value}`)
                    .join(" · ")}
                </p>
                <p className="text-paper/50">
                  {m.common.factLanguages.replace(
                    "{languages}",
                    spokenLanguages(locale),
                  )}
                </p>
              </div>

              <p>
                <InkAnchor
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {m.actions.openInMaps}
                </InkAnchor>
              </p>
            </div>
          </address>
        </div>

        {/* ── Directory ────────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="grid gap-10 border-b border-paper/12 py-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <h2 className="label mb-5 text-phos">{m.common.theHotel}</h2>
            <ul className="space-y-2.5 text-sm text-paper/75">
              {nav.map((item) => (
                <li key={item.href}>
                  <InkLink href={L(item.href)}>{m.nav[item.key]}</InkLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label mb-5 text-phos">{m.common.stay}</h2>
            <ul className="space-y-2.5 text-sm text-paper/75">
              {houses
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((h) => (
                  <li key={h.id}>
                    <InkLink href={L(`/rooms#${h.id}`)}>{h.name}</InkLink>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h2 className="label mb-5 text-phos">{m.common.information}</h2>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li>
                <InkLink href={L("/faq")}>{m.nav.faq}</InkLink>
              </li>
              <li>
                <InkLink href={L("/careers")}>{m.nav.careers}</InkLink>
              </li>
              <li>
                <InkLink href={L("/privacy")}>{m.nav.privacy}</InkLink>
              </li>
              <li>
                <InkLink href={L("/terms")}>{m.nav.terms}</InkLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label mb-5 text-phos">{m.common.elsewhere}</h2>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li>
                <InkAnchor
                  href={contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </InkAnchor>
              </li>
              <li>
                <InkAnchor
                  href={contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </InkAnchor>
              </li>
              <li>
                <InkAnchor
                  href={contact.group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.group.name}
                </InkAnchor>
              </li>
            </ul>
          </div>
        </nav>

        {/* ── Colophon ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 pt-10 text-[0.6875rem] leading-relaxed text-paper/45 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-xl flex-col gap-5">
            {/* The same signature the hero writes, at rest. A mark that is
                made once at the top of the page and simply present at the
                bottom of it — the way a letter is signed, not branded. */}
            <InkSignature
              animate={false}
              className="h-10 w-auto text-phos/80"
            />
            <p>
              © {year} {site.legalName}. All rights reserved. This property
              operates under Greek National Tourism Organisation licence no.{" "}
              <span className="font-mono">{legal.gntoLicence}</span> · VAT{" "}
              <span className="font-mono">{legal.vat}</span>.
            </p>
          </div>
          <p className="font-mono uppercase tracking-[0.24em]">
            Rethymno · Crete · 35.3714° N, 24.4754° E
          </p>
        </div>
      </div>
    </footer>
  );
}
