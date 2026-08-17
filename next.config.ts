import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // The full photo library is mirrored locally in /public/media, so Next can
    // resize and re-encode it at request time. AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
    /* Photographs uploaded through the CMS are served from Sanity's asset CDN.
       Scoped to this project's bucket rather than the whole host, so a stray
       URL from someone else's Sanity project cannot be proxied through our
       image optimiser. */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "*"}/**`,
      },
    ],
    /* Sources are capped at 2400px by scripts/optimise-media.mjs, so asking
       for anything larger only produces upscaled duplicates. */
    deviceSizes: [400, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [64, 96, 128, 200, 256, 320, 420],
    /**
     * The quality ladder. Seven values, each with a job:
     *
     *   45  filmstrip thumbnails, 96px wide
     *   58  hero frames — they sit under a three-part scrim that throws most
     *       of the tonal range away, so finer encoding buys nothing
     *   62  gallery masonry tiles
     *   70  parallax plates, sibling cards, the tour poster
     *   78  editorial figures and room cards
     *   80  detail plates a guest studies before booking
     *   88  the gallery lightbox, full screen
     *
     * DECLARING THIS IS NOT FREE. Next 16 requires it, and from the moment it
     * exists any quality NOT in the list is answered with a 400 — a broken
     * image, not a fallback. Adding `quality={72}` to a component without
     * adding 72 here breaks that image in production and nowhere else. Keep
     * components on the ladder rather than growing the list.
     */
    qualities: [45, 58, 62, 70, 78, 80, 88],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    /* `inlineCss: true` was measured and reverted. Lighthouse costs the two
       render-blocking stylesheets at 1,250 ms, but inlining them moved the
       homepage 86 -> 85 and the five-route median not at all, while adding
       16.5 kB to every HTML response. The 1,250 ms is an estimate the profile
       does not actually pay. */
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
