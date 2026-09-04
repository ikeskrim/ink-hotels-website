# Ink Hotels — consolidated plan

> **PROGRESS (2026-09-04, consolidation).** The five motion features shipped
> on 1 September are consolidated: measured (table below, no regression
> attributable to any of them), made to hold up under a keyboard and under
> reduced motion (`features-check.mjs` in CI — it found and fixed a booking
> sheet that Tab could walk out of), and the amenity bento grid now covers all
> seven Gateway suites with thirteen verified frames described in five
> languages (`grid-check.mjs` in CI — it found that the grid had been showing
> no photographs at all in four of the five languages since it shipped). The
> Pathos correction (private hot tub in the courtyard) is in: four hot tubs,
> five suites with their own water, James published. Screenshots refreshed,
> nine routes × five languages, Pathos added to the set.
> **Parking copy is untouched — still waiting on the owner's wording.**
> **Next session picks up at the owner list below.**

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

## Stage 7 — owner feedback round (27 Aug 2026)

The site was shown to the family; these are their corrections, all shipped.
One commit each, each pushed, the full sweep green after every one.

| | what changed | where |
| --- | --- | --- |
| **A1** | The collection is **The Gateway Suites** — all seven, not the original four | rooms.ts `collection`, schema `isPartOf`, suite eyebrow, five catalogues |
| **A2** | Check-in is at the first building for **every** building, the Residence included | arrival step 2, first FAQ answer, five locales |
| **A3** | The chauffeur is **ours** — not "a chauffeur" | arrival, FAQ, the transfer experience, `/location` (a follow-up commit: that page's prose is hardcoded English and the string sweep missed it) |
| **A4** | The private chef is a **Thalasses villa service** and is gone from Ink. Count corrected 21 → 22, which was already wrong before the change | experiences.ts (23→22), four overlays, rooms cross-sell, four prose strings ×5, `/en/chef-in-villa` → `/experiences` |
| **A5** | The family list is Thalasses, Thetis, **Villa Ikaros, Casa Vitae** — Villa Mavi out | five catalogues, and `patch-home-copy.mjs`, which would have resurrected Mavi |
| **A6** | Three Greek offices — **Rethymno, Heraklion, Athens** — and the +44 and +31 numbers withdrawn everywhere | five catalogues, `internationalOffices: []`, the footer's empty-list guard |
| **B1** | **Check-in 16:00, check-out 11:00**, stated in every place that states them | new `stay` in site.ts, facts list, a new FAQ ×5, arrival facts ×5, `checkinTime`/`checkoutTime`, HANDOVER, and `stay.test.ts` to hold the prose to the constant |
| **B2** | Parking is **free in the area, in the lot across the street**, and Gateway Suites guests get a **parking card** | facts, FAQ, arrival step and facts, `/location`, the schema amenity — all ×5 |
| **B3** | **A number never appears alone** — extension and WhatsApp travel with it | new `ReachUs`, thirteen surfaces, and `phone-check.mjs` in CI |
| **B4** | Housekeeping is **arranged with each stay — typically every two days** | facts and FAQ ×5 |
| **C1** | A **photo intake**: `incoming/` plus `npm run photos` | new `scripts/photos.mjs`, documented in HANDOVER |
| **C3** | The **Rethymno-only audit** — nine frames that are not Crete, listed with routes, nothing deleted | [PHOTO-AUDIT.md](PHOTO-AUDIT.md) |

Deferred by the owner: **C2**, the new jacuzzi and breakfast sets, which are
still being prepared. The intake built in C1 is what they will come in through.

### The four holds, answered 27 Aug 2026

| | the owner's answer | what shipped |
| --- | --- | --- |
| **Ikaros** | **Villa Ikaros**, as Crete Holiday Home brands it, parallel to Villa Thetis | five catalogues and the copy patcher |
| **The nine photographs** | All nine go; the Rethymno-only rule stands | files deleted, keys removed, `WITHDRAWN_FRAMES` added so a regeneration cannot restore them, `NoFrame` for the cards, cross-sell rebalanced so no strip is left picture-less |
| **Residence parking** | Restore the one line; the B2 facts stay exactly as written | each locale's own sentence recovered from the B2 commit and appended in the three places it was removed from |
| **Room notes** | Follow the B4 wording — a factual correction, not an inventory change | 60 strings across twelve rooms and five locales, plus a test tying them to the facts line |

A withdrawn arrangement is now described in words alone. No card was given a
different photograph: a genuine frame of the organic farm on a card headed
"Massage" is the same lie the stock was, in better clothes.

Three new guards were added and each was proved to bite before it was
committed — a planted regression failed it, and the revert passed:

- `stay.test.ts` — the times in five languages, held to one constant
- `phone-check.mjs` — extension and WhatsApp, judged per occurrence, by
  distance in rendered text rather than in markup
- `photos.mjs` — a referenced photograph with no alt text exits 1
- `housekeeping.test.ts` — sixty room notes held to the facts line they are
  supposed to agree with, which is how they came to disagree in the first place

---

## Measured — full route table (2026-09-04, 3-run medians)

Fresh build, node killed by PID, `Ready in` confirmed before each set. Taken
after the five motion features (StampText heading, ground-aware header, amenity
bento grid, drag-up booking sheet, gallery ripple) and the Pathos correction,
against the 2026-08-23 table below.

| route | min/med/max | LCP | FCP | TBT | vs 08-23 |
|---|---|---|---|---|---|
| `/` | 76/**81**/81 | 4.37s | 2.56s | 53ms | +2 |
| `/rooms` | 80/**89**/89 | 3.76s | 1.21s | 41ms | 0 |
| `/rooms/evexia` | 81/**86**/93 | 4.00s | 1.66s | 99ms | −5, see below |
| `/story` | 81/**81**/89 | 4.37s | 2.56s | 79ms | −2 |
| `/gallery` | 81/**82**/86 | 4.37s | 2.11s | 93ms | 0 |
| `/rethymno` | 81/**83**/86 | 4.22s | 2.26s | 90ms | −1 |
| `/location` | 87/**87**/90 | 3.76s | 1.96s | 82ms | 0 |
| `/arrival` | 86/**86**/90 | 3.91s | 1.96s | 42ms | −1 |
| `/faq` | 86/**90**/92 | 3.47s | 1.96s | 56ms | +3 |
| `/experiences` | 86/**86**/92 | 3.92s | 2.26s | 34ms | +3 |
| `/contact` | 86/**90**/90 | 3.47s | 1.96s | 32ms | +3 |

Ten of eleven routes are within two points of the baseline in either
direction; the gallery ripple, which lives on `/gallery`, cost nothing.

**`/rooms/evexia` was attributed before anything was touched, and nothing was
touched.** Four A/B legs on the identical machine, same evening:

| leg | build | runs | min/med/max | LCP | FCP |
|---|---|---|---|---|---|
| A | shipped | 3 | 81/**86**/93 | 4.00s | 1.66s |
| A′ | + booking-sheet focus trap | 3 | 83/**84**/90 | 4.29s | 2.11s |
| B | A′ + sheet loaded on demand (`next/dynamic`) | 3 | 82/**83**/92 | 4.37s | 1.67s |
| C | A′ with Evexia's amenity grid off | 5 | 82/**90**/93 | 3.54s | 1.21s |
| D | A′ + grid code-split | 5 | 82/**83**/94 | 4.38s | 2.12s |
| D again | same build, twenty minutes later | 9 | 82/**89**/93 | 3.54s | 1.21s |

The last row is the finding. The same build reads 83 and 89 depending on when
it is measured; the simulated LCP is always exactly 3.54s or exactly 4.37s and
never in between. This machine has two modes for this route, the 08-23 baseline
of 91 was taken in the high one (its own min was 83), and every leg, including
the one with the grid removed, lands in both. Neither the sheet's static import
(B) nor the grid's module weight (D) moves the median; both edits were reverted
rather than kept without evidence. TBT, which looked like the tell in the first
table (15→99ms), swung 26–98ms across builds with no relevant change and is
noise at this level.

Nothing was "fixed" for `/rooms/evexia`, because nothing about it was shown to
be broken. The next session should read that row against both modes.

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
| "The Gateway Suites" | **Superseded 24 Aug.** It was a heritage label on the original four; the owner's decision is that all seven are presented under it. Engine names untouched — four still spell it verbatim, and that is what a guest reserves. |
| Locale round-trip | Fixed; CI keeps it honest. |

## Superseded — the wellness facts

The note that Pathos has no hydromassage is **superseded, 2 September 2026**.
The owner confirmed a private hot tub in its courtyard. The jacuzzi set is now
**Evexia, Eros, Zoi and Pathos** — four — and the suites with water of their
own are **five**, those four plus Harmony's heated plunge pool.

Pathos keeps the glass double shower cabin as its signature and stays adults
only; the hot tub was added, nothing was removed. Its card now shows the tub as
the draw and adults-only as a constraint tag, which is a distinction
`room-badges.tsx` did not previously make — with one badge slot the tub would
have pushed the constraint off the card.

The correction released a real guest review that had been held for a fortnight:
James praised "the hot tub" in Pathos, the record said there was none, and the
site treated the guest as the error. Worth remembering the next time a review
disagrees with the inventory.

No photograph of it exists. Recorded in `incoming/README.md` under Wanted.

## Waiting on owner

Updated 2026-09-04. Real guest reviews are no longer on this list — fourteen
approved rows are published, James among them since the Pathos correction.

- The parking wording — the copy on the site is untouched until it arrives
- The two Google figures (rating and review count) for the scores strip
- Reservation ids for Evexia, Eros and Zoi
- `RESEND_API_KEY`
- The Lightroom export folder — and, from it, a frame of the Pathos courtyard
  hot tub, which is the one amenity in the grid still rendered as type
- The Xenia chatbot embed snippet
- The Phos rename decision — the site and the WebHotelier admin together
- A lawyer's pass on Terms and Privacy
- A photograph of the fleet Fiat 500
