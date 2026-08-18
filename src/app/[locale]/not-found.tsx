import { headers } from "next/headers";

import { Container, Heading, Section } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { InkBlot, PenUnderline } from "@/components/brand/ink-blot";
import { nav } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * 404 — the page that ran out of ink.
 *
 * The one place on the site where the press metaphor is allowed to be
 * literal, and the only page whose illustration is drawn rather than
 * photographed: a blot, spreading once and stopping, with a hand-drawn rule
 * under the line that explains it.
 *
 * It sits on the paper ground rather than over a darkened photograph. A 404 is
 * a small failure and a cinematic one is a lie about how much it matters; a
 * sheet of paper with a blot on it is the right register — and it loads in
 * nothing, which is what a page nobody meant to reach should cost.
 *
 * ── Why it reads a header for the locale ───────────────────────────────────
 * This is the one page on the site that cannot read `params`. Next renders
 * not-found outside the matched route, so the `[locale]` segment it lives
 * under is not available to it — which is how it came to be the last page
 * still hardcoded in English while every other string on the site was
 * translated. The middleware already knows the answer, so it forwards it as
 * `x-ink-locale` and this reads it.
 *
 * The cost is that the 404 is rendered per request rather than prerendered.
 * For the one page a reader arrives at by mistake, in whichever of five
 * languages they were reading a moment ago, that is the right trade.
 */
export default async function NotFound() {
  const raw = (await headers()).get("x-ink-locale") ?? "";
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
              {m.common.error404}
            </p>

            <Heading level={1} size="d1" className="max-w-[13ch]">
              {m.common.notFoundTitle}
            </Heading>
            <PenUnderline
              className="mt-3 h-4 w-[min(20rem,80%)] text-[color:var(--link)]"
              delay={0.45}
            />

            <p className="measure mt-8 text-[color:var(--fg-2)]">
              {m.common.notFoundBody}
            </p>

            <nav aria-label={m.common.theHotel} className="mt-12">
              <p className="label mb-5 text-[color:var(--fg-3)]">
                {m.common.tryInstead}
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                <li>
                  <InkLink
                    href="/"
                    className="font-display text-[length:var(--text-d4)]"
                  >
                    {m.nav.home}
                  </InkLink>
                </li>
                {nav.map((item) => (
                  <li key={item.href}>
                    {/* Was `{item.key}` capitalised — the raw English content
                        key printed as a label, so a Greek reader who mistyped a
                        URL was offered "rethymno", "gallery", "story". */}
                    <InkLink
                      href={item.href}
                      className="font-display text-[length:var(--text-d4)]"
                    >
                      {m.nav[item.key]}
                    </InkLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-5">
            <InkBlot className="mx-auto h-auto w-[min(22rem,70%)] text-ink/85" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
