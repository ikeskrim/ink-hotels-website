import type { Metadata } from "next";
import Image from "next/image";
import { NoFrame } from "@/components/media/no-frame";
import Link from "next/link";
import { notFound } from "next/navigation";

import { experiences } from "@/content/experiences";
import { getExperienceGroups, getExperiences } from "@/lib/sanity/content";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { label } from "@/i18n/labels";
import { contact } from "@/content/site";
import { Container, Heading, Section } from "@/components/ui/section";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ReachUs } from "@/components/contact/reach-us";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const exp = (await getExperiences(locale)).find((e) => e.slug === slug);
  if (!exp) return {};

  return pageMetadata({
    title: exp.title,
    description: `${exp.summary} Ink Hotels, Rethymno.`,
    path: `/experiences/${exp.slug}`,
    locale,
    image: exp.image || "/opengraph-image",
  });
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const m = getMessages(locale);
  const localised = await getExperiences(locale);
  const exp = localised.find((e) => e.slug === slug);
  if (!exp) notFound();

  const group = (await getExperienceGroups(locale)).find((g) => g.id === exp.category);
  /* Transfers and the car answer the same question from opposite ends, so
     each names the other rather than leaving a guest to find it. */
  const pair = exp.seeAlso
    ? localised.find((e) => e.slug === exp.seeAlso)
    : undefined;
  const siblings = localised
    .filter((e) => e.category === exp.category && e.slug !== exp.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: exp.title, path: `/experiences/${exp.slug}` },
        ])}
      />

      <Section ground="paper" size="none" className="pt-[clamp(7rem,12vh,9rem)]">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="label mb-8 text-[color:var(--fg-3)]"
          >
            <Link href="/experiences" className="hover:text-[color:var(--fg)]">
              Experiences
            </Link>
            <span aria-hidden="true" className="mx-3">
              /
            </span>
            <Link
              href={`/experiences#${exp.category}`}
              className="hover:text-[color:var(--fg)]"
            >
              {group?.title}
            </Link>
          </nav>

          <Heading level={1} size="d1" className="max-w-[18ch]">
            {exp.title}
          </Heading>
        </Container>
      </Section>

      <Section ground="paper" size="none" className="pt-[clamp(2.5rem,5vw,4rem)]">
        <Container>
          {/* An arrangement whose photograph was withdrawn does not get a
              large empty rectangle where the picture was — that reads as a
              page that failed to load. The figure is simply not rendered, and
              the words take the column back. See WITHDRAWN_FRAMES in
              content/experiences.ts. */}
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            {exp.image && (
              <figure className="lg:col-span-7">
                <MaskReveal className="aspect-[3/2]">
                  <Image
                    src={exp.image}
                    alt={exp.imageAlt ?? exp.title}
                    width={1400}
                    height={933}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    quality={80}
                    priority
                    className="h-full w-full object-cover"
                  />
                </MaskReveal>
              </figure>
            )}

            <div className={exp.image ? "lg:col-span-5" : "lg:col-span-8"}>
              <Reveal>
                <div className="prose-ink measure">
                  {exp.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                {/* Where the thing belongs to a named business rather than to
                    the hotel, say whose it is and link to them. A guest paying
                    for a day in a gorge deserves to know who is guiding it. */}
                {exp.link && (
                  <p className="mt-8">
                    <InkAnchor
                      href={exp.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label"
                    >
                      {label(exp.link.label, m)} ↗
                    </InkAnchor>
                  </p>
                )}

                <div className="mt-10 border-t border-[color:var(--hairline)] pt-8">
                  <p className="label mb-4 text-[color:var(--fg-3)]">
                    To arrange it
                  </p>
                  <p className="measure text-[color:var(--fg-2)]">
                    Tell us when you are staying and we will set it up before you
                    arrive. Write to{" "}
                    <InkAnchor href={`mailto:${contact.emails.general}`}>
                      {contact.emails.general}
                    </InkAnchor>{" "}
                    or call{" "}
                    <ReachUs locale={locale} />
                    .
                  </p>
                  <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                    <InkLink href="/contact" className="label inline-block">
                      Write to us →
                    </InkLink>
                    {pair && (
                      <InkLink
                        href={`/experiences/${pair.slug}`}
                        className="label inline-block"
                      >
                        {pair.title} →
                      </InkLink>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {siblings.length > 0 && (
        <Section ground="shade" size="md" className="mt-[clamp(3rem,6vw,5rem)]">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-[color:var(--hairline)] pb-6">
              <Heading size="d3">More in {group?.title}</Heading>
              <InkLink href="/experiences" className="label whitespace-nowrap">
                All →
              </InkLink>
            </div>
            <div className="grid gap-x-[clamp(1.5rem,2.5vw,2.5rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((e) => (
                <article key={e.slug} className="group">
                  <Link
                    href={`/experiences/${e.slug}`}
                    className="block focus-visible:outline-offset-4"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      {e.image ? (
                        <Image
                          src={e.image}
                          /* The heading directly beneath names it; repeating
                             the title here makes a screen reader say it twice. */
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 31vw, 46vw"
                          quality={70}
                          className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]"
                        />
                      ) : (
                        <NoFrame />
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-[length:var(--text-d4)] leading-tight">
                      {e.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
