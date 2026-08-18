import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/ui/section";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { ParallaxBand } from "@/components/gallery/parallax-band";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { galleryCategories, galleryItems } from "@/content/gallery";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.gallery.t,
    description: m.pageMeta.gallery.d.replace("{count}", String(galleryItems.length)),
    path: "/gallery",
    locale,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  /* The filter labels live in the message catalogue; the category ids live
     with the content. Mapping here keeps the content file free of English. */
  const LABELS: Record<string, string> = {
    all: m.gallery.everything,
    water: m.gallery.water,
    suites: m.gallery.suites,
    "house-of-europe": m.gallery.houseOfEurope,
    phos: m.gallery.phos,
    residence: m.gallery.residence,
    town: m.gallery.town,
    breakfast: m.gallery.breakfast,
    experiences: m.gallery.experiences,
  };

  const categories = galleryCategories.map((c) => ({
    id: c.id,
    label: LABELS[c.id] ?? c.label,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />

      <PageHero
        eyebrow={m.gallery.count.replace("{count}", String(galleryItems.length))}
        title={m.gallery.title}
        lede={m.gallery.lede}
        image="/media/181f84a843edadbabe1510574f25768f.webp"
        imageAlt="Rethymno old town seen from above, rooftops running down to the sea"
        height="sm"
      />

      {/* A drift of frames between the hero and the index — the room read
          before the catalogue. Decorative and clipped; every photograph in it
          appears properly below. */}
      <Section ground="shade" size="sm" grain={false} wash="paper">
        <ParallaxBand
          images={galleryItems
            .filter((_, i) => i % 5 === 0)
            .slice(0, 9)
            .map((g) => ({ src: g.src, alt: g.alt }))}
        />
      </Section>

      <Section ground="paper" size="md">
        <Container wide>
          <GalleryGrid
            items={galleryItems}
            categories={categories}
            label={m.gallery.collections}
            countLabel={m.gallery.count}
          />
        </Container>
      </Section>
    </>
  );
}
