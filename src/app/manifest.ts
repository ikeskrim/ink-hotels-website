import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * The web app manifest, served at /manifest.webmanifest.
 *
 * It was missing entirely — the route answered 404 — which is why a guest who
 * added the site to a phone home screen got the URL as its name and a
 * screenshot as its icon.
 *
 * Deliberately not a "web app": `display: "browser"` rather than `standalone`.
 * A hotel site installed as a standalone app loses the browser's address bar
 * and its back button, and this site's whole booking flow hands off to a
 * third-party engine in a new tab — a standalone shell is where that handoff
 * becomes a dead end with no way back. The manifest exists to name and colour
 * the thing, not to pretend it is an application.
 *
 * The colours are the site's own: paper for the background, ink for the theme,
 * matching the `themeColor` in the root layout.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.legalName,
    short_name: site.name,
    description: site.shortDescription,
    start_url: "/",
    display: "browser",
    background_color: "#F2EDE3",
    theme_color: "#191512",
    lang: "en-GB",
    icons: [
      {
        /* One SVG, which every browser that reads a manifest can scale. The
           site has no raster icon set and inventing one from the wordmark at
           six sizes is a design decision, not a build step. */
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
