"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { Container, Heading, Section } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { InkBlot, PenUnderline } from "@/components/brand/ink-blot";
import { contact } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * 500 — the press has jammed.
 *
 * The same register as the 404: paper, a blot, a hand-drawn rule, and a
 * sentence that says what happened without pretending it is smaller than it
 * is. A cinematic error page is a lie about how much a failure matters; a
 * jokey one is worse, because the reader may be mid-booking.
 *
 * ── Why the locale comes from params, not a header ─────────────────────────
 * An error boundary is a client component — it has to be, because it takes an
 * `error` and a `reset`. So the header trick the 404 uses is not available.
 * `useParams()` reads the `[locale]` segment this file lives under, which is
 * the same answer arrived at from the other side.
 *
 * ── What it offers ─────────────────────────────────────────────────────────
 * `reset()` first: most render failures are transient and trying again is the
 * cheapest thing that can work. Then the telephone, because a reader who hit a
 * 500 while booking should not be asked to hunt for it — this is the one page
 * where "call us" is the honest primary action.
 *
 * The error itself is logged to the console rather than shown. A stack trace
 * on a hotel page tells a guest nothing and tells everyone else too much.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : "";
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  useEffect(() => {
    /* The digest is what a server log can be searched by; keep them together. */
    console.error("Render failed", error.digest ?? "", error);
  }, [error]);

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
              {m.common.error500}
            </p>

            <Heading level={1} size="d1" className="max-w-[13ch]">
              {m.common.serverErrorTitle}
            </Heading>
            <PenUnderline
              className="mt-3 h-4 w-[min(20rem,80%)] text-[color:var(--link)]"
              delay={0.45}
            />

            <p className="measure mt-8 text-[color:var(--fg-2)]">
              {m.common.serverErrorBody}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                onClick={reset}
                className="label h-13 bg-ink px-7 text-paper transition-colors duration-500 ease-settle hover:bg-sea"
              >
                {m.common.tryAgain}
              </button>
              <InkLink href="/" className="label">
                {m.nav.home}
              </InkLink>
              <a href={contact.phones[1].href} className="spec underline underline-offset-4">
                {contact.phones[1].value}
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
