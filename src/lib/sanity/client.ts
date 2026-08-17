import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  token,
} from "../../../sanity/env";

/**
 * The read client.
 *
 * `useCdn` is on and content is tagged for revalidation rather than polled:
 * pages are statically generated, and a webhook from Sanity (or the
 * `/api/revalidate` route) is what makes an edit appear. That keeps the site
 * as fast as it is now — an editor's change should not cost every visitor a
 * round trip to a CMS.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/** Write/draft client. Server-only — never import this into a client component. */
export const sanityWriteClient: SanityClient | null =
  isSanityConfigured && token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
        perspective: "drafts",
      })
    : null;

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Build a URL for a Sanity image.
 *
 * Returns null when Sanity is not configured, which is the signal to the
 * caller to use its local fallback path instead.
 */
export function imageUrl(
  source: SanityImageSource | undefined | null,
  opts: { width?: number; height?: number; quality?: number } = {},
): string | null {
  if (!builder || !source) return null;
  let b = builder.image(source).auto("format").fit("max");
  if (opts.width) b = b.width(opts.width);
  if (opts.height) b = b.height(opts.height);
  b = b.quality(opts.quality ?? 78);
  return b.url();
}

/**
 * Run a query, and never let a CMS problem take the site down.
 *
 * A network blip, an expired token or a malformed document returns null and
 * the caller falls back to local content. A hotel website that 500s because a
 * CMS is briefly unreachable is a worse outcome than one showing yesterday's
 * words.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { tags: tags.length ? tags : undefined, revalidate: 3600 },
    });
  } catch (error) {
    console.error("[sanity] query failed, falling back to local content:", error);
    return null;
  }
}
