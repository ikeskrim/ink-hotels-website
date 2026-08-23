import type { NextConfig } from "next";

import { buildRedirects } from "./redirects.mjs";

/**
 * Content Security Policy, in Report-Only.
 *
 * Report-Only on purpose and for now: a CSP that is wrong does not degrade a
 * page, it breaks it — a blocked script is a booking form that does nothing —
 * and the only honest way to find out whether this one is right is to watch
 * real traffic violate it. It is enforced by changing one header name, once
 * the reports are quiet.
 *
 * Every origin below is one this site actually uses:
 *
 *   plausible.io          the analytics script, loaded only in production and
 *                         only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set
 *   cdn.sanity.io         CMS images, when the CMS is connected
 *   vtours.pepita.io      the property's own 360 tour, in an iframe that is
 *                         created only when a guest asks for it
 *   reserve-online.net    the reservation engine; a form target and a link,
 *                         never an embed — so form-action, not frame-src
 *
 * `'unsafe-inline'` for styles is not laziness: Next inlines critical CSS and
 * this site sets CSS custom properties inline for the grounds. Removing it
 * needs nonces threaded through the streaming renderer, which is a project.
 * Scripts do NOT get it — that is the half of the policy that matters.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://*.reserve-online.net",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://plausible.io https://cdn.sanity.io",
  "frame-src 'self' https://vtours.pepita.io",
  "manifest-src 'self'",
  /* Both spellings, because browsers disagree about which one they read.
     `report-uri` is deprecated and universally supported; `report-to` is the
     replacement and is what WebKit requires — without it Safari discards the
     policy entirely and says so: "the policy will have no effect". A
     Report-Only header that reports to nowhere is decoration, and Safari is
     most of the mobile traffic a Greek hotel sees. */
  "report-uri /api/csp-report",
  "report-to csp-endpoint",
  /* `upgrade-insecure-requests` is deliberately NOT here. A report-only policy
     ignores it and logs a notice saying so on every page load — noise that
     would sit on top of the real reports this header exists to collect. Add it
     in the same change that renames the header to enforcing. */
].join("; ");

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
    /* 74 is DepthImage's default. It was missing here, so every chapter plate
       on /rethymno — and every other DepthImage rendered without an explicit
       quality — asked for /_next/image?q=74 and got a 400 back: four broken
       photographs in production, and only in production, because dev serves
       the original file. Found by the cross-browser smoke; see
       scripts/check-media.mjs, which now reads defaults as well as literals. */
    qualities: [45, 58, 62, 70, 74, 78, 80, 88],
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
  /* The launch redirect map — see redirects.mjs.
     Inert until the domain switch: these sources are the old inkhotels.gr
     paths, and nothing requests them while the site lives on another host. */
  async redirects() {
    return buildRedirects();
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
          /* Enforcing, and cheap: nothing on this site is meant to be framed,
             and clickjacking a booking page is a real thing that happens to
             hotels. CSP's frame-ancestors says the same thing but is
             Report-Only below, so this is the one actually refusing. */
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /* Names the endpoint the `report-to` directive above refers to.
             Without this header the directive points at nothing. */
          {
            key: "Reporting-Endpoints",
            value: 'csp-endpoint="/api/csp-report"',
          },
          /* Report-Only. Watch the reports in the runtime log, then rename
             this header to `Content-Security-Policy` to enforce it — and add
             `upgrade-insecure-requests` in the same change. */
          { key: "Content-Security-Policy-Report-Only", value: CSP },
          /* NO HSTS TONIGHT — deliberately.
             Strict-Transport-Security tells every browser that visited to
             refuse plain HTTP for `max-age` seconds, and it cannot be recalled
             once sent: a browser that has seen it will not come back over HTTP
             even if the certificate later fails. On a preview deployment,
             before the domain is attached, that is a promise made on behalf of
             a hostname the site does not own yet. Add it on domain day, after
             HTTPS is confirmed working on inkhotels.gr, starting at a short
             max-age. DOMAIN-SWITCH-RUNBOOK.md carries the step. */
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
