import type { Metadata } from "next";

import { Container, Heading, Section } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { InkBlot, PenUnderline } from "@/components/brand/ink-blot";
import { contact } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Offline — the ink has not reached you.
 *
 * Third in the set with the 404 and the 500: same paper, same blot, same
 * hand-drawn rule, and a sentence that says what happened plainly. A guest who
 * loses signal in the old town — which is a stone quarter with thick walls and
 * patchy coverage — should meet the hotel's own voice rather than the
 * browser's dinosaur.
 *
 * ── It is a page, not a service worker ─────────────────────────────────────
 * This route exists and is translated. Nothing registers a service worker to
 * serve it yet, and that is deliberate rather than unfinished.
 *
 * A service worker is the least reversible thing you can add to a website. It
 * installs into the browser and keeps serving from its cache until it is
 * explicitly unregistered — so a caching bug does not just look wrong, it
 * keeps looking wrong for readers who have already visited, after the fix is
 * deployed. On a site whose rates, availability and room descriptions change,
 * that is a real risk to weigh rather than a switch to flip unattended.
 *
 * So the page is built, checked and translated, and the registration is left
 * for a decision made in daylight. HANDOVER.md carries what it would involve.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);
  return {
    title: { absolute: `${m.common.offlineLabel} — ${m.meta.tagline}` },
    /* Never indexed: it is a fallback, and a search result promising it would
       be a search result promising nothing. */
    robots: { index: false, follow: false },
  };
}

export default async function OfflinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return (
    <Section
      ground="paper"
      size="none"
      plaster
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <Container className="relative py-[clamp(6rem,14vh,10rem)]">
        <div className="grid items-center gap-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label mb-8 text-[color:var(--fg-3)]">
              {m.common.offlineLabel}
            </p>

            <Heading level={1} size="d1" className="max-w-[13ch]">
              {m.common.offlineTitle}
            </Heading>
            <PenUnderline
              className="mt-3 h-4 w-[min(20rem,80%)] text-[color:var(--link)]"
              delay={0.45}
            />

            <p className="measure mt-8 text-[color:var(--fg-2)]">
              {m.common.offlineBody}
            </p>

            {/* The telephone works when the network for a web page does not —
                a call needs far less signal than a page of photographs. */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <InkLink href="/" className="label">
                {m.nav.home}
              </InkLink>
              <a
                href={contact.phones[1].href}
                className="spec underline underline-offset-4"
              >
                {contact.phones[1].value}
              </a>
              {/* The same mobile, and on a bad connection a message gets
                  through where a page of photographs does not. */}
              <a
                href={contact.whatsapp.url(m.concierge.whatsappGreeting)}
                className="spec underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.concierge.whatsapp}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InkBlot className="mx-auto h-auto w-[min(22rem,70%)] text-ink/85" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
