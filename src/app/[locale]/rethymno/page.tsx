import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Heading, Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { CinematicFrame, DepthImage, DepthLayer } from "@/components/motion/depth";
import { InkLink } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getChapters, getPlaces } from "@/lib/sanity/content";
import { localiseRethymnoIntro } from "@/i18n/content";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { folio } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.rethymno.t,
    description: m.pageMeta.rethymno.d,
    path: "/rethymno",
    locale,
  });
}

export default async function RethymnoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);
  const rethymnoIntro = localiseRethymnoIntro(locale);
  const chapters = await getChapters(locale);
  const places = await getPlaces(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Rethymno", path: "/rethymno" },
        ])}
      />

      <PageHero
        eyebrow={rethymnoIntro.eyebrow}
        title={
          <>
            A town built
            <br />
            over itself
          </>
        }
        lede={rethymnoIntro.lede}
        image="/media/181f84a843edadbabe1510574f25768f.webp"
        imageAlt="Rethymno old town from above, rooftops running down to the sea"
      />

      {/* ── The premise ────────────────────────────────────────────────── */}
      <Section ground="paper" size="lg">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading size="d3" className="max-w-[14ch]">
                {m.home.rethymnoPremise}
              </Heading>
            </div>
            <div className="lg:col-span-7 lg:pt-2">
              <div className="prose-ink measure-wide">
                {rethymnoIntro.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Six chapters, alternating with depth ───────────────────────── */}
      {chapters.map((chapter, i) => {
        const flip = i % 2 === 1;
        const ground = i % 3 === 0 ? "paper" : i % 3 === 1 ? "sun" : "shade";

        return (
          <Section
            key={chapter.id}
            id={chapter.id}
            ground={ground}
            size="lg"
            className="scroll-mt-24"
          >
            <Container>
              <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <DepthImage
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    className="aspect-[4/3]"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    travel={12}
                  />
                </div>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <DepthLayer drift={-6} fade={false}>
                    <Reveal>
                      <p className="label mb-5 flex items-center gap-4 text-[color:var(--fg-3)]">
                        <span aria-hidden="true">{folio(i + 1)}</span>
                        <span
                          aria-hidden="true"
                          className="block h-px w-8 bg-[color:var(--hairline)]"
                        />
                        {chapter.eyebrow}
                      </p>
                      <Heading size="d2" className="mb-7 max-w-[14ch]">
                        {chapter.title}
                      </Heading>
                      <div className="prose-ink measure">
                        {chapter.body.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>

                      {chapter.notes && (
                        <dl className="mt-8 border-t border-[color:var(--hairline)]">
                          {chapter.notes.map((n) => (
                            <div
                              key={n.term}
                              className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-3"
                            >
                              <dt className="label text-[color:var(--fg-3)]">
                                {n.term}
                              </dt>
                              <dd className="spec text-right">{n.def}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </Reveal>
                  </DepthLayer>
                </div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* ── A cinematic beat ───────────────────────────────────────────── */}
      <CinematicFrame
        src="/media/1a25f40128eeefbed32d4cf75cb7faf8.webp"
        alt="The Egyptian lighthouse at the Venetian harbour of Rethymno at dusk"
        height="150vh"
      >
        <DepthLayer drift={-14} fade>
          <p className="label mb-6 text-phos">{m.home.harbourEyebrow}</p>
          <Heading size="d1" className="max-w-[14ch] text-paper">
            {m.home.harbourTitle}
          </Heading>
        </DepthLayer>
      </CinematicFrame>

      {/* ── The landmarks, as an index ─────────────────────────────────── */}
      <Section ground="paper" size="lg">
        <Container>
          <div className="mb-[clamp(2.5rem,5vw,4rem)] border-b border-[color:var(--hairline)] pb-8">
            <p className="label mb-5 text-[color:var(--fg-3)]">
              {m.home.landmarksEyebrow}
            </p>
            <Heading size="d2" className="max-w-[16ch]">
              {m.home.landmarksTitle}
            </Heading>
          </div>

          <dl className="grid gap-x-[clamp(2rem,4vw,4rem)]">
            {places.map((place, i) => (
              <div
                key={place.slug}
                /* Anchorable. The old site gave each landmark its own page —
                   /en/article/1351 was Arkadi Monastery — and those URLs are
                   indexed. The launch redirects send them to `#arkadi-monastery`
                   here, which only lands correctly if the id exists.
                   `scroll-mt` keeps the fixed header off the heading. */
                id={place.slug}
                className="grid scroll-mt-28 gap-4 border-b border-[color:var(--hairline)] py-8 lg:grid-cols-12 lg:gap-8"
              >
                <dt className="lg:col-span-4">
                  <span
                    className="spec mb-2 block text-[color:var(--fg-3)]"
                    aria-hidden="true"
                  >
                    {folio(i + 1)}
                  </span>
                  <Heading size="d4">{place.name}</Heading>
                  {place.distance && (
                    <span className="label mt-2 block text-[color:var(--fg-3)]">
                      {place.distance}
                    </span>
                  )}
                </dt>
                <dd className="measure-wide text-[color:var(--fg-2)] lg:col-span-8">
                  {place.body}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <InkLink href="/experiences" className="label">
              How to spend the days →
            </InkLink>
            <InkLink href="/arrival" className="label">
              Arriving →
            </InkLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
