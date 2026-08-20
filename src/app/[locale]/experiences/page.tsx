import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Heading, Section } from "@/components/ui/section";
import { Gk } from "@/components/ui/greek";
import { InkLink } from "@/components/ui/ink-link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getMessages } from "@/i18n";
import { folio } from "@/lib/utils";
import { getExperienceGroups, getExperiences } from "@/lib/sanity/content";
import { defaultLocale, isLocale } from "@/i18n/config";

/* The URL stays `/experiences` — it is what guests search for and it already
   carries twenty-one indexed pages. Only the language changes. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.experiences.t,
    description: m.pageMeta.experiences.d,
    path: "/experiences",
    locale,
  });
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);
  const experienceGroups = await getExperienceGroups(locale);
  const experiences = await getExperiences(locale);
  const experiencesInGroup = (id: string) =>
    experiences.filter((e) => e.category === id);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
        ])}
      />

      <PageHero
        eyebrow={`${experiences.length} arrangements`}
        title={
          <>
            The art
            <br />
            of staying
          </>
        }
        lede="Anyone can sell you a room. The difference is what happens in the hours you are not in it — and most of that begins with a conversation at the desk."
        image="/media/ad673daf2a28fd3d6003a0eccc3e06a0.webp"
        imageAlt={m.photoAlt.boat}
      />

      {experienceGroups.map((group, gi) => {
        const items = experiencesInGroup(group.id);
        const ground = gi % 2 === 0 ? "paper" : "shade";

        return (
          <Section key={group.id} id={group.id} ground={ground} size="md">
            <Container>
              <div className="mb-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-6 border-b border-[color:var(--hairline)] pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="label mb-4 flex items-baseline gap-3 text-[color:var(--fg-3)]">
                    <span aria-hidden="true">{folio(gi + 1)}</span>
                    <span
                      aria-hidden="true"
                      className="block h-px w-8 bg-[color:var(--hairline)]"
                    />
                    <Gk>{group.greek}</Gk>
                  </p>
                  <Heading size="d2">{group.title}</Heading>
                </div>
                <p className="measure text-[color:var(--fg-2)]">{group.blurb}</p>
              </div>

              <RevealGroup className="grid gap-x-[clamp(1.5rem,2.5vw,2.5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
                {items.map((exp) => (
                  <RevealItem key={exp.slug}>
                    <article className="group">
                      <Link
                        href={`/experiences/${exp.slug}`}
                        className="block focus-visible:outline-offset-4"
                      >
                        <div className="relative aspect-[3/2] overflow-hidden bg-[color:var(--bg-lift)]">
                          {exp.image && (
                            <Image
                              src={exp.image}
                              /* Named by the heading in the same link. */
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                              quality={70}
                              className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]"
                            />
                          )}
                        </div>
                        <h3 className="mt-5 font-display text-[length:var(--text-d4)] leading-tight">
                          <span className="relative inline-block">
                            {exp.title}
                            <span
                              aria-hidden="true"
                              className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[600ms] ease-settle group-hover:origin-left group-hover:scale-x-100"
                            />
                          </span>
                        </h3>
                        <p className="measure mt-2.5 text-[color:var(--fg-2)]">
                          {exp.summary}
                        </p>
                      </Link>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Container>
          </Section>
        );
      })}

      <Section ground="ink" size="md">
        <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label mb-5 text-phos">Tell us what you want</p>
            <Heading size="d3" className="max-w-[20ch] text-paper">
              Nothing here is a package. Everything is arranged.
            </Heading>
          </div>
          <InkLink href="/contact" className="label text-[color:var(--link)]">
            Write to us →
          </InkLink>
        </Container>
      </Section>
    </>
  );
}
