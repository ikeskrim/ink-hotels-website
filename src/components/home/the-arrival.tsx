import { Container, Heading } from "@/components/ui/section";
import { CinematicFrame, DepthLayer } from "@/components/motion/depth";
import { InkLink } from "@/components/ui/ink-link";
import { reception } from "@/content/site";
import { folio } from "@/lib/utils";
import { getMessages } from "@/i18n";
import { localiseArrival } from "@/i18n/content";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Arrival, on the homepage.
 *
 * Two houses and a residence in a medieval quarter is genuinely unusual, and a guest who
 * discovers it at check-in discovers it as a problem. Told here, before
 * booking, it becomes the opposite: somebody is expecting you.
 *
 * The frame is pinned while the copy passes over it — the one camera move on
 * the homepage, and it belongs here because arriving is literally a movement
 * through space.
 */
export function TheArrival({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  const arrival = localiseArrival(locale);

  return (
    <>
      <CinematicFrame
        src="/media/461f62e27fac13a619b832a11fb81846.webp"
        alt="A green Venetian door in the old town of Rethymno, lanterns either side"
        height="145vh"
      >
        <DepthLayer drift={-12} fade>
          <p className="label mb-6 text-phos">{m.arrival.eyebrow}</p>
          <Heading size="d1" className="max-w-[13ch] text-paper">
            {arrival.title}
          </Heading>
          <p className="measure mt-7 text-lg text-paper/85">{arrival.lede}</p>
          <p className="spec mt-8 text-olive">
            {reception.street} · {reception.locality} {reception.postalCode}
          </p>
        </DepthLayer>
      </CinematicFrame>

      {/* The steps, on the warmest ground on the site. */}
      <section data-ground="sun" className="grain relative py-section">
        <Container>
          <div className="mb-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-6 border-b border-[color:var(--hairline)] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <Heading size="d3" className="max-w-[16ch]">
              {m.arrival.fromAirport}
            </Heading>
            <InkLink href="/arrival" className="label whitespace-nowrap">
              {m.actions.theWholeArrival} →
            </InkLink>
          </div>

          <ol className="grid gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {arrival.steps.map((step, i) => (
              <li key={step.title}>
                <span
                  className="spec mb-4 block text-[color:var(--fg-3)]"
                  aria-hidden="true"
                >
                  {folio(i + 1)}
                </span>
                <h3 className="font-display text-[length:var(--text-d4)] leading-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-[color:var(--fg-2)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
