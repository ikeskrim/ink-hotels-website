/**
 * The launch redirect map: every URL the live inkhotels.gr publishes today,
 * pointed at where that page now lives.
 *
 * The new site replaces the old one on the same hostname. The moment DNS moves,
 * every URL Google holds in its index is requested against this codebase, and
 * every one that 404s is a ranking thrown away — for a hotel, in the weeks
 * before a season, that is bookings. These are 301s (`permanent: true`) because
 * the move is permanent and only a 301 passes ranking on.
 *
 * Sources come from `scripts/live-urls.json`, harvested with
 * `scripts/harvest-live-urls.mjs` from the old site's own sitemap. Thirty-six
 * URLs, all of them under `/en/` — the old site prefixed English, this one
 * serves it unprefixed, so nothing maps one-to-one and every row below is a
 * decision rather than a rewrite.
 *
 * `scripts/redirect-check.mjs` asserts this parses, has no duplicate sources,
 * no loops, and no destination that 404s. It runs in CI.
 *
 * Nothing here is live until the domain switch: the new site is on a different
 * hostname, so these rules simply never match until inkhotels.gr points at it.
 */

/** The locales whose prefix must survive a redirect. */
export const LOCALES = ["el", "de", "fr", "nl"];

/**
 * Old path → new path. Sources are exact and without a trailing slash; Next
 * matches the normalised form.
 *
 * Typed as tuples rather than left to inference: with
 * `noUncheckedIndexedAccess` on, a `string[][]` destructures to
 * `string | undefined` and next.config.ts will not accept the result.
 *
 * @type {[string, string][]}
 */
export const MAP = [
  /* ── Experiences ────────────────────────────────────────────────────────
     The old site kept each experience at the site root. They are now under
     /experiences, and four changed slug: the names had drifted from what the
     property calls them, including a misspelling in the old URL that has to be
     matched exactly to be redirected at all. */
  ["/en/experiences", "/experiences"],
  ["/en/bike-tours", "/experiences/bike-tours"],
  ["/en/breakfast-on-the-beach", "/experiences/breakfast-on-the-beach"],
  ["/en/chauffeur", "/experiences/chauffeur"],
  ["/en/exclusive-tour", "/experiences/exclusive-tour"],
  ["/en/hiking", "/experiences/hiking"],
  ["/en/jeep-safari", "/experiences/jeep-safari"],
  [
    "/en/learn-the-secrets-of-cretan-cuisine",
    "/experiences/learn-the-secrets-of-cretan-cuisine",
  ],
  ["/en/massage", "/experiences/massage"],
  ["/en/personal-trainer", "/experiences/personal-trainer"],
  ["/en/private-boat-trip", "/experiences/private-boat-trip"],
  ["/en/private-helipad", "/experiences/private-helipad"],
  ["/en/quad-safari", "/experiences/quad-safari"],
  ["/en/running", "/experiences/running"],
  ["/en/scuba-diving", "/experiences/scuba-diving"],
  ["/en/therapist", "/experiences/therapist"],
  ["/en/water-sports", "/experiences/water-sports"],
  ["/en/wine-production", "/experiences/wine-production"],
  ["/en/wine-tasting", "/experiences/wine-tasting"],

  /* Renamed. The old slug is kept as the source verbatim — including
     "weadding", which is how it is spelled in the indexed URL. Correcting the
     spelling here would simply fail to match. */
  ["/en/biological-vegetable-garden", "/experiences/organic-farm"],
  /* The old site published a chef-in-villa page. A private chef is a villa
     service at Thalasses and is not offered at Ink, so the page is gone and
     the indexed URL lands on the arrangements index rather than 404ing. The
     source stays exactly as the old site spelled it. */
  ["/en/chef-in-villa", "/experiences"],
  ["/en/dream-weadding-on-the-beach", "/experiences/wedding-on-the-beach"],

  /* ── Rethymno landmarks ─────────────────────────────────────────────────
     Each was its own numeric article page. They are now entries on one page,
     so each redirect carries the anchor of its own entry: a reader who
     searched for Arkadi Monastery lands on Arkadi, not on the top of a long
     page to hunt for it. The ids are set on /rethymno for exactly this. */
  ["/en/article/1349", "/rethymno#venetian-harbour"],
  ["/en/article/1350", "/rethymno#fortezza"],
  ["/en/article/1351", "/rethymno#arkadi-monastery"],
  ["/en/article/1352", "/rethymno#ancient-eleftherna"],
  ["/en/article/1353", "/rethymno#historical-folklore-museum"],
  ["/en/articles/384", "/rethymno"],

  /* ── History ────────────────────────────────────────────────────────────
     "Back in times" and "HISTORY" are both the building's story, which is now
     one page. */
  ["/en/article/1347", "/story"],
  ["/en/articles/382", "/story"],

  /* ── Careers ────────────────────────────────────────────────────────────
     Three old pages, one destination. "Hotel management" was a role listing
     rather than a page about management. */
  ["/en/become-one-of-us", "/careers"],
  ["/en/career-opportunities", "/careers"],
  ["/en/hotel-management", "/careers"],

  /* ── No equivalent ──────────────────────────────────────────────────────
     Two pages have no counterpart and are not being invented one.

     The Covid measures page is spent: the measures it described are no longer
     in force, and a hotel republishing them would be stating something untrue.
     It goes to the FAQ, which is where a guest with a practical question about
     staying here is actually served.

     "Ink Special Announcements" was a noticeboard with nothing standing on it.
     It goes to the homepage rather than to a page invented to receive it. */
  ["/en/article/2184", "/faq"],
  ["/en/articles/665", "/"],
];

/**
 * Build the rules Next consumes.
 *
 * Two rules per row:
 *
 *   the source as indexed — `/en/massage` → `/experiences/massage`
 *
 *   the same source under each locale prefix — `/el/en/massage` →
 *     `/el/experiences/massage`. The old site answered `/el/...` with a
 *     redirect rather than a page, so few of these are indexed, but a stray
 *     link or an old bookmark costs one rule and keeps the reader in their
 *     language instead of dropping them into English.
 *
 * `permanent: true` is a 308 in Next, which is a 301 that additionally
 * promises the method will not change. Search engines treat it as a 301 and
 * pass ranking through it.
 */
export function buildRedirects() {
  /** @type {{ source: string, destination: string, permanent: true }[]} */
  const rules = [];

  for (const [from, to] of MAP) {
    rules.push({ source: from, destination: to, permanent: true });

    for (const locale of LOCALES) {
      /* An anchor has to stay on the end, after the locale prefix is added.
         Split by index rather than by destructuring: the destructured form is
         `string | undefined` under noUncheckedIndexedAccess, and next.config.ts
         rejects a Redirect whose destination might be undefined. */
      const at = to.indexOf("#");
      const path = at === -1 ? to : to.slice(0, at);
      const hash = at === -1 ? "" : to.slice(at);
      const base = path === "/" ? "" : path;
      rules.push({
        source: `/${locale}${from}`,
        destination: `/${locale}${base}${hash}`,
        permanent: true,
      });
    }
  }

  return rules;
}
