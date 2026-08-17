/**
 * Sanity connection settings.
 *
 * The site is designed to run with or without a CMS. If `projectId` is absent
 * every fetcher falls back to the content files in `src/content/`, the Studio
 * route returns a setup page instead of crashing, and the site builds and
 * serves exactly as it does today.
 *
 * That is what makes the cutover safe: the CMS can be connected, seeded and
 * checked without the live site ever depending on it mid-migration.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Pinned: an API version is a contract, and "latest" silently changes it. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** Server-only. Needed to write (the seed script) and to read drafts. */
export const token = process.env.SANITY_API_TOKEN ?? "";

export const isSanityConfigured = Boolean(projectId);

/** Where the Studio lives. */
export const studioBasePath = "/studio";
