import { Container, Heading } from "@/components/ui/section";
import { CinematicFrame, DepthLayer } from "@/components/motion/depth";
import { InkLink } from "@/components/ui/ink-link";
import { reception } from "@/content/site";
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
        alt={m.photoAlt.arrivalDoor}
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

      {/* The trailer, not the itinerary.

          What stood here was `arrival.steps` rendered as four numbered
          cards — the same four steps, from the same array, that /arrival
          renders in full four sections down its own page. Two copies of one
          list is not depth on the homepage; it is the homepage answering a
          question the reader has not asked yet, and then /arrival answering
          it again.

          Nothing is lost: the steps are on /arrival, complete, and the line
          below goes straight to them. */}
      <section data-ground="sun" className="grain relative py-section">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Heading size="d3" className="max-w-[16ch]">
              {m.arrival.fromAirport}
            </Heading>
            <InkLink href="/arrival" className="label whitespace-nowrap">
              {m.actions.theWholeArrival} →
            </InkLink>
          </div>
        </Container>
      </section>
    </>
  );
}
