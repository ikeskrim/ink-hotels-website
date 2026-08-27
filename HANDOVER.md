# Handover — the owner's manual

Everything you are likely to want to do, and how to do it. Written for somebody
who did not build this and should not have to read the code to change a
sentence.

The rule the whole site is built on, worth knowing before you change anything:
**nothing on it is invented.** Every fact, photograph and claim came from the
property or its reservation system. If you are about to add something you
cannot point at a source for, that is the moment to stop.

---

## The five things you will actually do

### 1. Change a sentence

Almost all the words live in five files, one per language:

```
src/i18n/messages/en.ts     ← English is the source of truth
src/i18n/messages/el.ts     Greek
src/i18n/messages/de.ts     German
src/i18n/messages/fr.ts     French
src/i18n/messages/nl.ts     Dutch
```

Find the sentence in `en.ts`, change it, then change the same key in the other
four. **If you add a key to `en.ts` and not the others, the build fails** — on
purpose. A missing translation is a blank space on a live page; a failed build
is a Tuesday afternoon.

Facts about rooms, places and experiences live in `src/content/` instead, and
their translations in `src/i18n/content/`.

> **Greek, German and French text:** edit these files in VS Code or any editor
> set to UTF-8. Do **not** edit them with PowerShell's `Set-Content`, which
> silently re-encodes and destroys every accented character. `npm run build`
> runs an encoding check that catches this, but it is easier not to do it.

> **Facts that appear in several places at once.** Check-in and check-out are
> stated in four: the plain-facts list on the homepage, the FAQ, the arrival
> page, and the structured data Google reads. They are typed **once**, in
> `stay` in `src/content/site.ts` — today **check-in from 16:00, check-out by
> 11:00**. Change them there and run `npm test`: `src/content/stay.test.ts`
> holds the prose in all five languages to that constant and names every
> sentence that no longer agrees. The same goes for reception hours
> (`reception.openUntil`) and the phone numbers (`contact.phones`).

### 2. Add or change a photograph

**A folder and a command.** Put the files — any names, any sizes, straight off
the camera or the phone — into `incoming/`, then run:

```bash
npm run photos
```

That does the whole intake in one pass:

| it does | so that |
| --- | --- |
| converts each file to `.webp`, long edge capped at 2400px, quality 82 | a 6000px frame off a camera does not cost every visitor a 4 MB download |
| names the file after itself, not after a hash | `courtyard-well.webp` is findable a year later; `7a8843db0f09….webp` is not |
| moves the original into `incoming/_processed` | you can see what has already been through, and nothing is deleted |
| records it in `src/content/generated/intake.ts` with an empty alt slot per language | the description it owes is written down rather than remembered |
| rebuilds the blur placeholders | a hero arrives the right colour instead of as a dark rectangle |
| rebuilds the Open Graph dimensions | a shared link lays out correctly before the photograph loads |
| runs the media check | a missing file or an undeclared image quality fails here, not in production |
| rewrites `MEDIA-MANIFEST.md` | the repository stays free of megabytes nothing references |

Then it prints **what is still owed** — the frames with no alt text, and the
frames nothing references yet. On the day photographs arrive both lists are
long, and neither is an error.

**One thing is an error:** a photograph that is live on the site with no alt
text. That fails the command, because a published photograph says something,
and a reader using a screen reader is entitled to hear it.

So the rest of the job, after the command:

1. **Reference the frame** from the relevant file in `src/content/`.
2. **Write its alt text** in `src/content/generated/intake.ts` — English
   first, then the other four. `npm run photos:check` reprints the outstanding
   list at any time, and `npm run alt` checks the whole site in a browser.

> The originals in `incoming/` are not committed — only the `.webp` the command
> writes into `public/media`. That is deliberate: the version that ships is the
> version in the repository.

**Photographs are never padded.** A suite shows its own frames and no others.
The gallery on a room page shows what exists, whether that is 42 or 4.

### 3. Flip the two flags

Both are one boolean, in a diff, with no build step or environment variable.

| flag | file | state | what it does |
| --- | --- | --- | --- |
| **Suite template** | `src/content/suite-template.ts` | **ON** — all 20 slugs listed | The rebuilt room pages. Remove a slug to put that one suite back on the old template in the next build. This list is the rollback. |
| **Homepage trailer** | `src/content/homepage-trailer.ts` | **ON** — owner-approved 23 Aug | Seven beats on the homepage; the other eight sections live on `/rooms`, `/story` and `/rethymno`. Set it to `false` to put all fifteen back. `npm run parity` proves nothing is lost or duplicated either way, and runs in CI. |

After flipping either: `npm run build`, then the checks below, then look at the
screenshots.

### 4. Run the checks

```bash
npm run build
npm start                 # in one terminal; leave it running

# in another:
npm test                  # counts, specs, redirects, booking links — no server needed
npm run smoke             # every sitemap URL answers 200
npm run booking           # every Book button lands on the right room
npm run alt               # every image speaks, in the reader's language
npm run keyboard          # every control answers the key it claims to
npm run schema            # structured data parses; hreflang complete
npm run redirects         # the launch redirect map resolves
npm run cross             # WebKit and Firefox
npm run parity            # the trailer relocation: nothing lost, nothing doubled
npm run shots             # screenshots into qa/shots/ (git-ignored)
```

If you only run two, run `npm test` and `npm run booking`. The first protects
the facts; the second protects the bookings.

### 5. Read CI

Every push runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Green
means every number in the README is still true.

- **`verify`** — the gate. If it is red, something is actually wrong.
- **`cross-browser`** — WebKit and Firefox. A **real gate** since 23 Aug, after
  two clean passes. It found four images returning 400 in production and a CSP
  Safari was silently discarding, which is why it exists.
- **review-screenshots** — an artifact on every run: eight routes × all five
  languages, 40 full-page frames, kept for seven days. This is the fastest way
  to see what a change did, and the four non-English sets are where layout
  breaks actually hide.

A red check that you believe is wrong is worth reading twice before it is
weakened. Three separate times on this project a check went red and the check
was the thing at fault — and each time the fix was to make it observe less, not
to relax what it asserts.

---

## What is deliberately not built

**No service worker.** `/offline` exists, is translated and is styled — but
nothing registers a worker to serve it. A service worker is the least
reversible thing you can add to a website: it installs into the browser and
keeps serving from its cache until explicitly unregistered, so a caching bug
keeps looking wrong for people who already visited, after the fix ships. On a
site whose rates and availability change, that wants a deliberate decision.
Registering it is a small change; living with a bad one is not.

**The CSP is Report-Only, on purpose.** It collects violations at
`/api/csp-report` — read them in the Vercel runtime logs, filtered on `[csp]`.
Give it a fortnight of real traffic. If the only reports are things you expect,
rename the header in `next.config.ts` from
`Content-Security-Policy-Report-Only` to `Content-Security-Policy` and add
`upgrade-insecure-requests` in the same change. A CSP that is wrong does not
degrade a page, it breaks it — a blocked script is a booking form that does
nothing — so this order is the whole point.

**No rate or availability claims anywhere.** Both live in the reservation
engine and change without telling this site. Every Book control hands off to
the engine carrying the room, the dates and the party size.

**No reviews.** `src/content/reviews.ts` is empty, so the homepage strip and
the per-suite quote render nothing. Six to ten real ones — first name, country,
platform, year, verbatim — turn it on. Nothing will be invented to fill it.

---

## The shape of the thing

```
src/app/[locale]/        the pages, one tree serving five languages
src/components/          everything they are built from
src/content/             the facts: rooms, places, experiences, redirects
src/i18n/                the words, and the machinery that picks a language
scripts/                 every check, each one explaining itself at the top
public/media/            the photographs
```

English is served unprefixed (`/rooms`) by a middleware **rewrite**; the other
four are prefixed (`/el/rooms`). That rewrite is the source of the subtlest bug
this project has had — a client component sees `/en/rooms/harmony` where the
address bar shows `/rooms/harmony` — so if something works in four languages
and not the fifth, start there.

---

## Going live

[DOMAIN-SWITCH-RUNBOOK.md](DOMAIN-SWITCH-RUNBOOK.md). Read it before the day,
not on it.

## Still waiting on you

The current list is at the foot of [README.md](README.md), kept there because it
is the file people open first. The two that block other work:

1. **Reservation ids for Evexia, Eros and Zoi** — their Book buttons open the
   engine's front page rather than the room, and the site says so in words
   rather than pretending otherwise.
2. **Six to ten real guest quotes** — `WhatGuestsSaid` is marked dormant in the
   relocation table and renders nothing until they arrive. Delete the `dormant`
   line the day they do.
