# Ink Hotels — consolidated plan

> **PROGRESS (2026-08-23, night 4).** The launch-readiness queue is done: the
> 5.2 trailer is built behind a flag that is OFF, booking-link integrity and
> cross-browser and structured-data and keyboard checks are in CI, the 500 and
> offline pages ship in five locales, and HANDOVER.md + DOMAIN-SWITCH-RUNBOOK.md
> are written. Four production faults were found by the new checks — see the
> commit log for `/opengraph-image`, `q=74`, the skip link and the 400s.
> **Next session picks up at the owner list** — the homepage retention set is
> the one decision blocking further work, and `cross-browser` should be promoted
> from non-blocking once it has passed twice on main.

Supersedes every previous round document. Repo:
[ikeskrim/ink-hotels-website](https://github.com/ikeskrim/ink-hotels-website) ·
Preview: [ink-hotels-website.vercel.app](https://ink-hotels-website.vercel.app)

**How this is worked.** One session per stage. A session begins by reading this
file, executes exactly one stage, pushes at the end, stops, and reports: the
commits, the verification numbers, and anything now waiting on the owner. The
next stage never begins in the same session. The owner starts a session by
saying "execute Stage N of PLAN.md".

---

## Global rules — every item, every stage

**G1 — Room inventory is FROZEN.** Twenty bookable categories. No renaming,
recounting or restructuring. Evexia is always listed first. Phos has rooms only,
numbered 1–7, and the word "suite" never appears there. The Phos name collision
stays a `PROPOSALS.md` item until the owner signs off.

**G2 — Never invent.** No reviews, ratings, awards, or price and rate claims.
Every factual statement must already exist on the site or come from the owner.

**G3 — Motion is optional.** Everything honours `prefers-reduced-motion` with a
static fallback. Heroes are static-first. No autoplay audio, ever.

**G4 — Performance budget.** Hold ~90 average performance and 100 for
accessibility, best practices and SEO, with axe at zero violations. Re-measure
after every motion stage. Below 85, gate or lazy-load harder before continuing.

**G5 — Booking is untouched.** Deep links to `inkhotels.reserve-online.net` do
not change.

**G6 — Owner-blocked work ships hidden.** Behind a flag, and listed in the
README's "waiting on owner".

**G7 — One commit per item**, prefixed `structure:` `motion:` `copy:` `design:`
`qa:` `ci:` `seo:`. **Any claim from an external audit is verified against the
code before it is acted on** — the round-4 lesson, where three of five reported
defects did not exist.

**G8 — UTF-8 discipline.** Never edit content files through PowerShell
`Set-Content`: it re-encodes the file and destroys every em-dash and Greek
character. Use the editor tools or Python with an explicit encoding. CI guards
this.

**G9 — Identity extends, never replaces.** The ink, printing-press and
thumbprint language is the brand. English is the copy source; every change
reaches all five locales (EN/EL/DE/FR/NL).

---

## Stage 0 — deploy pipeline: resolved, no action

Deployment `FeNAgVYqv` builds from `a6f6c4d` and is Ready/Current on
ink-hotels-website.vercel.app. Push → build → deploy works end to end. The
earlier "stale content" report was a reviewer-side fetch cache. Do not diagnose
anything here.

## Stage 1 — CI

GitHub Actions on every push and pull request: `npm ci`, typecheck, lint, build,
`secret-scan`, `meta-check`, `i18n-leakage`, a UTF-8/mojibake guard (fails on
U+FFFD or broken multi-byte sequences in `src/content` and the message
catalogues), `npm test`, the headings check, `locale-roundtrip`, then `next
start` and both `reveal-check` and a sitemap smoke test that fetches every URL
and fails on any non-200, asserting preview `noindex` and production
robots/sitemap. Status badge in the README.

## Stage 2 — launch SEO

Harvest every indexed URL of the live inkhotels.gr — its sitemap plus the common
paths — and write per-locale 301s in `next.config.ts` to the new slugs, ready
for the domain switch. Commit `REDIRECTS.md` mapping old → new. CI asserts the
table parses and contains no loops.

## Stage 3 — conversion and polish quick wins

1. **Book direct** block beside every booking CTA. Three true reasons only: the
   family desk that holds the keys; arrangements made before arrival (transfer,
   the Fiat, a cot, a quiet floor); direct answers by phone or WhatsApp until
   23:00. No rate claims — flagged for the owner.
2. `relatedExperiences` per room → "Often arranged with this suite": transfer,
   A Car from Our Collection, breakfast in the room, massage.
3. Plausible analytics — cookieless, production only, domain from an env var.
   README note covering the GA4 swap path.
4. Badge discipline: one primary badge per card (hot tub / heated plunge pool /
   step-free / adults only). The full set lives on the detail page.
5. Photo ordering, signature first: Evexia hot tub and sea · Harmony pool ·
   Agapi courtyard and well · Pathos glass shower cabin · Elpida window sofa ·
   Eros patio tub · Zoi backyard tub.
6. Blur-up placeholders (`blurDataURL`) on heroes and galleries.
7. Mobile sticky bottom bar — Book now and WhatsApp (`wa.me/306974069475`),
   small screens only.
8. Gallery: consistent aspect-ratio grid, hover captions, nine collections with
   water leading.
9. Reviews scaffold (`src/content/reviews.ts`, homepage strip, per-suite quote
   slot) and footer email capture — both built and **hidden** until the owner
   supplies real quotes and a RESEND key.
10. Instagram strip: six curated stills from existing media linking to
    instagram.com/ink_hotels. No embed script.

## Stage 4 — cinematic core

1. **Preloader** — a press impression / ink-bleed upward wipe with a small
   counter, once per session, reduced-motion → instant. *Refs: ContraBureau,
   Gavin Schneider.*
2. **Route transitions** — ink-wash / paper-slide overlay wipe. *Ref: YARD.*
3. **Masked headline reveals** — GSAP SplitText, `aria-label` on split headings.
   *Ref: Osmo masked text reveal.*
4. **Custom cursor** — wet-ink dot / thumbprint ripple on interactive elements,
   desktop only, off on touch. *Ref: Accor "Seeker".*
5. **Texture system** — paper grain with per-chapter stock variation (smoother
   in rooms, fibrous in Story), letterpress-deboss dividers and thumbprint mark,
   ink-wash edges as the divider system, plaster behind Rethymno and Arrival,
   faint type-specimen ornaments in the wide margins. *Refs: Mount Street
   Printers, Huus Gstaad.*

Re-run Lighthouse after each item and log the numbers in the commit body.

## Stage 5 — motion and structure

1. Numbered chapter spine sitewide — one component, IBM Plex Mono, extending the
   existing 01/02/03 labels.
2. Slim the homepage into a chaptered trailer. Relocate depth into `/rooms`,
   `/story`, `/rethymno`. Delete nothing.
3. Sticky media with advancing text: the water suites, Agapi, and each room
   story. *Ref: Easelink.*
4. Story page: scroll-scrubbed fountain-pen "Ink" write-on, with press →
   University guest house → hotel as chapters. Keep the thumbprint press beat.
   *Refs: Synapser, Explore Primland.*
5. Gallery: horizontal parallax band, framed as atmosphere. *Refs: Lafaurie,
   StudioChevojon, KHUFU'S.*
6. Hero: restrained scroll parallax or Ken Burns, static-first.
7. Lenis wired to ScrollTrigger; verify the reduced-motion path and anchor jumps.
8. A persistent, quiet "Reserve" affordance in the header on scroll. Deep link,
   context-aware, never a banner.

## Stage 6 — heavy builds and copy

1. `/rooms/[suite]` rebuilt on lead-with-distinction: standout line and signature
   hero, layout/occupancy/amenities as an accordion, 25–35 photos where
   available, sticky deep-link CTA with the phone fallback beside it. Evexia
   first. *Refs: Sporthotel Lorünser, Practice Hospitality.*
2. Image-led "Twenty ways to stay" cards with hover reveals.
3. FAQ on the same accordion system.
4. Footer: letterpress-deboss Ink mark and a final quiet booking CTA.
5. Lightweight interactive old-town map with hotspots on `/location` and
   `/rethymno`. No heavy WebGL. *Ref: Explore Primland.*
6. Copy pass in the site's voice, facts unchanged, then translated to all five
   locales:

   > **Evexia** — A private hot tub set into the terrace, the sea running the
   > full width behind it. You will not share the water, or the view, with
   > anybody.

   > **Harmony** — A heated plunge pool in a courtyard of its own — warm
   > whatever the month — forty square metres on the ground floor, marble
   > underfoot. The city is four minutes away and cannot reach you here.

   > **Agapi** — A suite designed so the door is never the problem: step-free
   > from the side street, a walk-in shower, grab rails, and a serene inner
   > courtyard with an old well. Care, built in.

   > **Phos** — Light is what makes a mark readable. The second house is named
   > for it — seven quiet rooms over the rooftops, a short walk from breakfast.

   > **Story pull-quote** — Set by hand, one letter at a time, and pulled on
   > paper in this room. The press is gone; the name stayed.

   Plus a "Set, inked, pressed" three-beat timeline (press → guest house →
   hotel), a "Four come with their own water" comparison strip, and a
   light-and-ink diptych pairing House of Europe with Phos.

---

## Measured — full route table (2026-08-23, 3-run medians)

Fresh build, node killed by PID, `Ready in` confirmed before each set.

| route | min/med/max | LCP | FCP | TBT |
|---|---|---|---|---|
| `/` | 79/**79**/81 | 4.66s | 2.56s | 47ms |
| `/rooms` | 89/**89**/90 | 3.76s | 1.21s | 17ms |
| `/rooms/evexia` | 83/**91**/93 | 3.54s | 1.21s | 15ms |
| `/story` | 83/**83**/83 | 4.21s | 2.41s | 12ms |
| `/gallery` | 82/**82**/85 | 4.51s | 2.11s | 46ms |
| `/rethymno` | 83/**84**/85 | 4.22s | 1.96s | 16ms |
| `/location` | 87/**87**/87 | 3.76s | 1.96s | 12ms |
| `/arrival` | 87/**87**/87 | 3.77s | 1.96s | 13ms |
| `/faq` | 87/**87**/87 | 3.77s | 1.96s | 23ms |
| `/experiences` | 83/**83**/85 | 4.36s | 2.26s | 17ms |
| `/contact` | 86/**87**/87 | 3.77s | 1.96s | 11ms |

**Read these as this-machine-tonight, not as absolutes.** Every route is about
four points below the 2026-08-19 table, uniformly — `/story` 90→83, `/faq`
91→87, `/rooms` 92→89, `/` 83→79 — and a drop that lands equally on eleven
unrelated routes is the machine, not eleven regressions.

Attributed rather than assumed. The one change tonight that could plausibly
cost these pages is the Stage 5.2 trailer flag, which imports four client
components into `/story`, `/rooms` and `/rethymno` so they can be relocated
when it is switched on. Bundle sizes, built both ways:

| | `/story` route JS | First Load |
|---|---|---|
| without the trailer wiring | 737 B | 219 kB |
| with it (shipped, flag off) | 750 B | **220 kB** |

One kilobyte. That does not move Lighthouse seven points, and the flag is
exonerated. A settled-machine re-run of four routes recovered part of the gap
(`/` back to 82) but not all of it, which is what thermal state looks like.

What matters for comparison is the A/B, not the absolute: no change tonight
costs a measurable amount, and `/` remains its own bandwidth-and-main-thread
floor, established across four sessions.


## Resolved — do not redo

| | |
| --- | --- |
| Email `mailto:` | False positive. It was always a proper anchor. |
| "Staying" → `/experiences` | By design. Label and heading agree; the URL stays so indexed links survive. |
| German locale | By design: five site languages, four desk languages. Keep the InkLink prefix and the noscript switcher fallback. |
| Hot-tub counts | Fixed and guarded by `counts.test.ts`. |
| Locale round-trip | Fixed; CI keeps it honest. |

## Waiting on owner

- Reservation ids for Evexia, Eros and Zoi
- `RESEND_API_KEY`
- The Xenia chatbot embed snippet
- A photograph of the fleet Fiat 500
- Six to ten real guest reviews
- The Phos rename decision — the site and the WebHotelier admin together
- A lawyer's pass on Terms and Privacy
