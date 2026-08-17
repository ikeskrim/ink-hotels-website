# Launch redirects

Every URL the live [inkhotels.gr](https://inkhotels.gr) publishes today, pointed at where that page now lives.

**Generated — do not edit.** The map lives in [`redirects.mjs`](redirects.mjs);
run `node scripts/write-redirects-doc.mjs` after changing it.

## Why this exists

The new site replaces the old one on the same hostname. The moment DNS moves,
every URL Google holds in its index is requested against this codebase, and
each one that 404s is a ranking thrown away. For a hotel, in the weeks before
a season, that is bookings.

All 36 indexed URLs are covered.
That is 35 mappings, expanded to **175 rules** —
each source also gets a variant under every locale prefix (el, de, fr, nl),
so an old link that arrives with a language on it keeps that language instead
of dropping the reader into English.

Every rule is a **301** (`permanent: true`, which Next serves as a 308).
A temporary redirect passes no ranking, which would defeat the purpose.

**These are inert until the domain switch.** The sources are old
inkhotels.gr paths; nothing requests them while the site lives on another
hostname. Nothing here needs to be timed with the cutover.

## The map

### Experiences

| old | new |
| --- | --- |
| `/en/experiences` | `/experiences` |
| `/en/bike-tours` | `/experiences/bike-tours` |
| `/en/breakfast-on-the-beach` | `/experiences/breakfast-on-the-beach` |
| `/en/chauffeur` | `/experiences/chauffeur` |
| `/en/exclusive-tour` | `/experiences/exclusive-tour` |
| `/en/hiking` | `/experiences/hiking` |
| `/en/jeep-safari` | `/experiences/jeep-safari` |
| `/en/learn-the-secrets-of-cretan-cuisine` | `/experiences/learn-the-secrets-of-cretan-cuisine` |
| `/en/massage` | `/experiences/massage` |
| `/en/personal-trainer` | `/experiences/personal-trainer` |
| `/en/private-boat-trip` | `/experiences/private-boat-trip` |
| `/en/private-helipad` | `/experiences/private-helipad` |
| `/en/quad-safari` | `/experiences/quad-safari` |
| `/en/running` | `/experiences/running` |
| `/en/scuba-diving` | `/experiences/scuba-diving` |
| `/en/therapist` | `/experiences/therapist` |
| `/en/water-sports` | `/experiences/water-sports` |
| `/en/wine-production` | `/experiences/wine-production` |
| `/en/wine-tasting` | `/experiences/wine-tasting` |
| `/en/biological-vegetable-garden` | `/experiences/organic-farm` |
| `/en/chef-in-villa` | `/experiences/private-chef` |
| `/en/dream-weadding-on-the-beach` | `/experiences/wedding-on-the-beach` |

### Rethymno

| old | new |
| --- | --- |
| `/en/article/1349` | `/rethymno#venetian-harbour` |
| `/en/article/1350` | `/rethymno#fortezza` |
| `/en/article/1351` | `/rethymno#arkadi-monastery` |
| `/en/article/1352` | `/rethymno#ancient-eleftherna` |
| `/en/article/1353` | `/rethymno#historical-folklore-museum` |
| `/en/articles/384` | `/rethymno` |

### The story

| old | new |
| --- | --- |
| `/en/article/1347` | `/story` |
| `/en/articles/382` | `/story` |

### Careers

| old | new |
| --- | --- |
| `/en/become-one-of-us` | `/careers` |
| `/en/career-opportunities` | `/careers` |
| `/en/hotel-management` | `/careers` |

### No direct equivalent

| old | new |
| --- | --- |
| `/en/article/2184` | `/faq` |
| `/en/articles/665` | `/` |

## Decisions worth knowing

**The old site prefixed English; this one does not.** Every source begins
`/en/` and every destination does not, so no row is a mechanical rewrite.

**`/en/dream-weadding-on-the-beach` is spelled that way on purpose.** The
misspelling is in the indexed URL. Correcting it here would simply fail to
match and the ranking would be lost.

**The five Rethymno landmarks each had their own numbered page** and are now
entries on one. Each redirect carries the anchor of its own entry, so someone
who searched for Arkadi Monastery lands on Arkadi rather than at the top of a
long page. The ids exist on `/rethymno` for exactly this reason, and CI
asserts they are still there.

**Two pages have no counterpart, and none was invented.** The Covid measures
page described measures no longer in force — republishing them would be
stating something untrue — so it goes to the FAQ, where a guest with a
practical question is actually served. "Ink Special Announcements" was a
noticeboard with nothing standing on it, so it goes to the homepage.

## What CI checks

`scripts/redirect-check.mjs`, on every push:

- the table parses and every rule is well-formed and permanent
- no duplicate source, where the second rule could never fire
- no loop, direct or through a chain
- no chain at all: a 301 to a 301 leaks ranking and costs a round trip
- every destination returns 200 on the running site
- every anchored destination has an element with that id
- every harvested URL has a rule, and every rule matches a harvested URL
