import Image from "next/image";
import { blurFor } from "@/content/generated/blur";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The opening of every page that is not the homepage.
 *
 * A photograph under the same three-part grade as the hero, an eyebrow, a
 * title and one line of orientation — so a visitor who lands deep in the site
 * from search gets the same footing a visitor who came through the front door
 * would have.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  children,
  height = "md",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  image: string;
  imageAlt: string;
  children?: ReactNode;
  height?: "sm" | "md" | "lg";
}) {
  return (
    <section
      data-ground="ink"
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden",
        height === "sm" && "min-h-[52svh] pt-32",
        height === "md" && "min-h-[68svh] pt-32",
        height === "lg" && "min-h-[86svh] pt-32",
      )}
    >
      <div className="absolute inset-0 -z-10" data-decorative>
        <Image
          src={image}
          placeholder={blurFor(image) ? "blur" : "empty"}
          blurDataURL={blurFor(image)}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          /* Under the same scrim as the homepage hero. */
          quality={58}
          sizes="100vw"
          className="object-cover [filter:saturate(0.98)_contrast(1.04)_brightness(1.04)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/25 to-transparent" />
        <div
          aria-hidden="true"
          data-decorative
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(60% 55% at 78% 18%, rgb(245 201 123 / 0.26) 0%, rgb(245 201 123 / 0.08) 42%, transparent 70%)",
          }}
        />
      </div>

      <span
        className="register-mark left-6 top-24 hidden lg:block"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1680px] px-6 pb-[clamp(2.5rem,5vw,4rem)] sm:px-8 lg:px-12">
        <p className="label mb-5 text-paper/70">{eyebrow}</p>
        <h1 className="font-display text-[length:var(--text-d1)] leading-[0.96] tracking-[-0.02em] text-paper">
          {title}
        </h1>
        {lede && (
          /* Reserved in em, so it scales with the type. The fallback face sets
             wider than the webfont and takes an extra line; without a floor
             here the whole hero grows, then snaps back at swap time. */
          <div className="measure-wide mt-6 min-h-[4.9em] text-paper/85 lg:min-h-[4.6em] lg:text-lg">
            {lede}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
