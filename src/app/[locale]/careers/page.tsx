import type { Metadata } from "next";
import Image from "next/image";

import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkAnchor } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { contact } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.careers.t,
    description: m.pageMeta.careers.d,
    path: "/careers",
    locale,
  });
}

/* Takes its params now. It never did — rendered under `[locale]` but with no
   way to know which locale, so every string on it was English in all five
   languages. Wiring the photograph's description was what surfaced that; the
   rest of the page is a wider job than this batch. */
export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />

      <Section ground="paper" size="none" className="pt-[clamp(8rem,14vh,11rem)]">
        <Container>
          <p className="label mb-6 text-[color:var(--fg-3)]">Careers</p>
          <Heading level={1} size="d1" className="max-w-[12ch]">
            Become one of us
          </Heading>
        </Container>
      </Section>

      <Section ground="paper" size="md">
        <Container>
          <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <figure className="lg:col-span-6">
              <MaskReveal className="aspect-[4/3]">
                <Image
                  src="/media/5c8561282159b358b4e7a2270cc972d9.webp"
                  alt={m.photoAlt.team}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  quality={80}
                  priority
                  className="graded h-full w-full object-cover"
                />
              </MaskReveal>
            </figure>

            <div className="lg:col-span-6">
              <Reveal>
                <div className="prose-ink measure">
                  <p>
                    Become part of our team — a team that shares more than the
                    same employer. We share a vision.
                  </p>
                  <p>
                    Push your ambitions in a working atmosphere characterised by
                    freedom, autonomy and a culture of growth.
                  </p>
                </div>

                <div className="mt-10 border-t border-[color:var(--hairline)] pt-8">
                  <p className="label mb-4 text-[color:var(--fg-3)]">
                    Send your CV
                  </p>
                  <InkAnchor
                    href={`mailto:${contact.emails.careers}?subject=${encodeURIComponent(
                      "Application — Ink Hotels",
                    )}`}
                    className="font-display text-[length:var(--text-d4)] leading-tight"
                  >
                    {contact.emails.careers}
                  </InkAnchor>
                  <p className="spec mt-5 text-[color:var(--fg-3)]">
                    We read everything that arrives.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
