import type { Metadata, Viewport } from "next";

import { isSanityConfigured } from "../../../../sanity/env";
import { StudioClient } from "./studio-client";
import { SetupNotice } from "./setup-notice";

/**
 * The Studio route.
 *
 * `[[...tool]]` is a catch-all because Sanity does its own routing underneath
 * this path — the document you are editing, the tool you are in, the pane you
 * have open are all segments it owns.
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ink Hotels — content",
  robots: { index: false, follow: false },
};

/* The Studio manages its own scrolling and needs the full viewport. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!isSanityConfigured) return <SetupNotice />;
  return <StudioClient />;
}
