import Script from "next/script";

/**
 * Plausible.
 *
 * Cookieless and without personal data, which is why there is no consent
 * banner anywhere on this site: under GDPR and the ePrivacy directive, consent
 * is required for storing or reading information on a visitor's device, and
 * Plausible does neither. A banner would be asking permission for something we
 * are not doing, and every guest would pay two clicks for it.
 *
 * It ships only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, and only in
 * production. That means:
 *
 *   - a developer's page views never reach the owner's dashboard
 *   - preview deployments do not pollute the numbers for the live site
 *   - the site runs unchanged with no analytics at all, which is the state it
 *     is in until the owner registers the domain
 *
 * The domain is an env var rather than a constant because it is the one thing
 * that differs between the preview and the live site, and it is not a secret —
 * it is the hostname, which is already public.
 *
 * `defer` rather than `async`: the script has no work to do before the page is
 * interactive, and deferring keeps it off the critical path that the
 * performance budget is measured on.
 *
 * ── Swapping to GA4 ────────────────────────────────────────────────────────
 * If the owner prefers Google Analytics, replace this component's body with
 * the gtag snippet and set `NEXT_PUBLIC_GA_ID`. Note what changes with it:
 * GA4 writes cookies and processes personal data, so a consent banner becomes
 * legally necessary, `robots`/CSP need reviewing, and the numbers stop being
 * comparable to whatever Plausible has already collected. It is a product
 * decision rather than a swap of one script tag for another.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!domain || process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
