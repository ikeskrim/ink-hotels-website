import { Container, Heading, Section } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { InkBlot, PenUnderline } from "@/components/brand/ink-blot";
import { nav } from "@/content/site";

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
 */
export default function NotFound() {
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
            <p className="label mb-8 text-[color:var(--fg-3)]">Error 404</p>

            <Heading level={1} size="d1" className="max-w-[13ch]">
              This page ran out of ink.
            </Heading>
            <PenUnderline
              className="mt-3 h-4 w-[min(20rem,80%)] text-[color:var(--link)]"
              delay={0.45}
            />

            <p className="measure mt-8 text-[color:var(--fg-2)]">
              The page you asked for does not exist — it may have moved, or the
              link that brought you here may have been mistyped. Everything else
              is still on the press.
            </p>

            <nav aria-label="Site" className="mt-12">
              <p className="label mb-5 text-[color:var(--fg-3)]">Try instead</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                <li>
                  <InkLink
                    href="/"
                    className="font-display text-[length:var(--text-d4)]"
                  >
                    Home
                  </InkLink>
                </li>
                {nav.map((item) => (
                  <li key={item.href}>
                    <InkLink
                      href={item.href}
                      className="font-display text-[length:var(--text-d4)] capitalize"
                    >
                      {item.key}
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
