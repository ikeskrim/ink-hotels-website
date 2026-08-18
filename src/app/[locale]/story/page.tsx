import type { Metadata } from "next";
import Image from "next/image";

import { TheName } from "@/components/home/the-name";
import {
  Container,
  Deboss,
  Heading,
  Section,
  Specimen,
  StickyMedia,
} from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkLink } from "@/components/ui/ink-link";
import { Gk } from "@/components/ui/greek";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getHistory, getHouses, getNeighbourhood } from "@/lib/sanity/content";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";
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
    title: m.pageMeta.story.t,
    description: m.pageMeta.story.d,
    path: "/story",
    locale,
  });
}

/* The three beats, in press order. Kept as a table so the markup below stays
   a loop rather than three near-identical blocks. */
const BEATS = [
  { term: "pressSetTerm", body: "pressSetBody" },
  { term: "pressInkedTerm", body: "pressInkedBody" },
  { term: "pressPressedTerm", body: "pressPressedBody" },
] as const;

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  /* Through the localisation layer, not around it. This page used to import
     `history`, `neighbourhood` and `houses` straight from `src/content/`,
     which is the English source — so the whole Story page rendered in English
     in all four other languages while the translations sat unused in the
     overlay. */
  const [history, neighbourhood, houses] = [
    getHistory(locale),
    getNeighbourhood(locale),
    await getHouses(locale),
  ];
  const ordered = houses.slice().sort((a, b) => a.order - b.order);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The story", path: "/story" },
        ])}
      />

      {/* The same section as the homepage, in its slow form: here the word is
          written by a nib rather than locked up as type, and the press answers
          it. The homepage gets the short version; this is the page that came
          for the story. */}
      <TheName mode="written" />

      {/* ── Back in times ─────────────────────────────────────────────── */}
      <Section ground="paper" size="lg" stock="laid" chapter="01">
        <Specimen className="left-[clamp(1rem,3vw,2.5rem)] top-[14%]">
          Ink · Rethymno · MMXXV
        </Specimen>
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label mb-6 text-[color:var(--fg-3)]">
                  {history.eyebrow}
                </p>
                <Heading level={1} size="d2" className="max-w-[14ch]">
                  {history.title}
                </Heading>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="prose-ink measure-wide">
                  {history.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <figure className="mt-[clamp(3rem,6vw,5rem)]">
            <MaskReveal className="aspect-[16/9]">
              <Image
                src="/media/74a4ef6ba01d4657fc483050a182533c.webp"
                alt="The historic building of Ink Hotels in the old town of Rethymno"
                width={1800}
                height={1013}
                sizes="100vw"
                quality={80}
                className="graded h-full w-full object-cover"
              />
            </MaskReveal>
            <figcaption className="label mt-4 text-[color:var(--fg-3)]">
              {m.story.figureCaption}
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* ── The buildings ─────────────────────────────────────────────── */}
      <Section ground="shade" size="lg" stock="laid" chapter="02">
        <Container>
          <Deboss mark className="mb-[clamp(3rem,6vw,5rem)]" />
          <div className="mb-[clamp(2.5rem,5vw,4rem)] border-b border-[color:var(--hairline)] pb-8">
            <p className="label mb-5 text-[color:var(--fg-3)]">
              {m.story.madeOfEyebrow}
            </p>
            <Heading size="d2" className="max-w-[18ch]">
              {m.story.madeOfTitle}
            </Heading>
          </div>

          <dl className="grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-10 sm:grid-cols-2">
            {ordered.map((house) => (
              <div key={house.id}>
                <dt className="mb-3">
                  <span className="label mb-3 flex items-baseline gap-2.5 text-[color:var(--fg-3)]">
                    {house.greek && (
                      <>
                        <Gk>{house.greek}</Gk>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    {house.subtitle}
                  </span>
                  <Heading size="d4">{house.name}</Heading>
                </dt>
                <dd className="measure mt-3 text-[color:var(--fg-2)]">
                  {house.intro}{" "}
                  <InkLink
                    href={`/rooms#${house.id}`}
                    className="whitespace-nowrap"
                  >
                    {m.story.seeTheRooms} →
                  </InkLink>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ── Set, inked, pressed ───────────────────────────────
          Three beats, and every fact under them is already on this page or in
          place.ts: the printing shop and ΑΓΩΝ, the University of Crete guest
          house, three buildings of the 1700s. The three verbs are the frame,
          not new claims. */}
      <Section ground="ink" size="lg" wash="shade" chapter="03">
        <Container>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="font-display text-[length:var(--text-d2)] italic leading-[1.15] text-paper">
              {m.voice.storyQuote}
            </p>
          </blockquote>

          <Deboss className="mx-auto mt-[clamp(3rem,6vw,5rem)] max-w-4xl" />

          <ol className="mx-auto mt-[clamp(3rem,6vw,5rem)] grid max-w-5xl gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-10 sm:grid-cols-3">
            {BEATS.map((beat, i) => (
              <li key={beat.term}>
                <span
                  className="spec mb-4 block text-olive"
                  aria-hidden="true"
                >
                  {folio(i + 1)}
                </span>
                <h3 className="font-display text-[length:var(--text-d4)] leading-tight text-paper">
                  {m.voice[beat.term]}
                </h3>
                <p className="mt-3 text-paper/75">{m.voice[beat.body]}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── The quarter ───────────────────────────────────────────────── */}
      <Section ground="paper" size="lg" stock="laid" chapter="04">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12 lg:items-start">
            <StickyMedia as="figure" className="lg:col-span-6">
              <MaskReveal className="aspect-[4/5] lg:aspect-auto lg:h-[clamp(24rem,56vh,34rem)]">
                <Image
                  src="/media/12fdb3e377a57fa420aa8dcbea7feaf4.webp"
                  alt="The Fortezza fortress above the old town of Rethymno"
                  width={1000}
                  height={1250}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  quality={80}
                  className="graded h-full w-full object-cover"
                />
              </MaskReveal>
            </StickyMedia>

            <div className="lg:col-span-6">
              <Reveal>
                <p className="label mb-6 text-[color:var(--fg-3)]">
                  {m.story.quarterEyebrow}
                </p>
                <Heading size="d3" className="mb-8 max-w-[16ch]">
                  {neighbourhood.title}
                </Heading>
                <div className="prose-ink measure">
                  {neighbourhood.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <InkLink href="/rethymno" className="label mt-9 inline-block">
                  {m.story.whatIsAround} →
                </InkLink>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
