import Image from "next/image";

import { Container, Section } from "@/components/ui/section";
import { InkAnchor } from "@/components/ui/ink-link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { contact } from "@/content/site";
import { EVEXIA_IMAGES, ZOI_IMAGES } from "@/content/generated/suite-images";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Six stills, and a link to the account.
 *
 * Deliberately NOT an Instagram embed. Their script is ~200 kB, sets
 * third-party cookies — which would put a consent banner back on a site that
 * currently needs none — and renders a widget nobody controls the design of.
 * It also breaks whenever Meta changes an endpoint, which for a hotel means a
 * blank rectangle on the homepage on a random Tuesday.
 *
 * These are the property's own photographs, already in the repository, laid out
 * the way the rest of the site lays out photographs. The link goes to the
 * account for anyone who wants the live feed.
 *
 * The captions say what is in the frame rather than pretending to be posts:
 * inventing "3 days ago" or a like count would be fabricating a record.
 *
 * WAITING ON OWNER: when a real feed matters, the honest version is a
 * build-time fetch of the six most recent posts via the Instagram Basic
 * Display API, cached — same layout, real content, still no third-party script
 * in the browser. That needs a token from the owner's account.
 */
const FRAMES = [
  { src: EVEXIA_IMAGES[0]!, key: "evexiaTub" },
  { src: "/media/05c09d32efa814812ba4598083de9b4c.webp", key: "harbour" },
  { src: ZOI_IMAGES[0]!, key: "zoiYard" },
  { src: "/media/0dc83ffb4bd879a312c00e50c8bda2fc.webp", key: "lane" },
  { src: "/media/9053c1c0aa924fb16769460a7c06ae29.webp", key: "pool" },
  { src: "/media/1a25f40128eeefbed32d4cf75cb7faf8.webp", key: "lighthouse" },
] as const;

export function TheFeed({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  const alts = m.home.feedAlts;

  return (
    <Section name="TheFeed" ground="paper" size="md">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--hairline)] pb-6">
          <p className="label text-[color:var(--fg-3)]">{m.home.feedEyebrow}</p>
          <InkAnchor
            href={contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="label"
          >
            {m.home.feedHandle} ↗
          </InkAnchor>
        </div>

        <RevealGroup className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {FRAMES.map(({ src, key }) => (
            <RevealItem key={src}>
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden focus-visible:outline-offset-4"
              >
                <Image
                  src={src}
                  alt={alts[key as keyof typeof alts]}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  quality={62}
                  className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
