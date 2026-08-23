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

### 2. Add or change a photograph

1. Put the file in `public/media/`.
2. Reference it from the relevant file in `src/content/`.
3. If it leads a page (a hero, a room's first frame), run:
   ```bash
   npm run blur      # the blur-up placeholder
   npm run og:dims   # its true size, for social previews
   ```
4. Give it a description. Every image needs alt text in all five languages —
   see `photoAlt` in the message files. `npm run alt` will tell you if one is
   missing or still in English.

**Photographs are never padded.** A suite shows its own frames and no others.
The gallery on a room page shows what exists, whether that is 42 or 4.

### 3. Flip the two flags

Both are one boolean, in a diff, with no build step or environment variable.

| flag | file | state | what it does |
| --- | --- | --- | --- |
| **Suite template** | `src/content/suite-template.ts` | **ON** — all 20 slugs listed | The rebuilt room pages. Remove a slug to put that one suite back on the old template in the next build. This list is the rollback. |
| **Homepage trailer** | `src/content/homepage-trailer.ts` | **OFF** | Slims the homepage to seven beats and moves the other eight sections to `/rooms`, `/story` and `/rethymno`. Nothing is deleted either way. See [PROPOSALS.md](PROPOSALS.md). |

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
npm run shots             # screenshots into qa/shots/ (git-ignored)
```

If you only run two, run `npm test` and `npm run booking`. The first protects
the facts; the second protects the bookings.

### 5. Read CI

Every push runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Green
means every number in the README is still true.

- **`verify`** — the gate. If it is red, something is actually wrong.
- **`cross-browser`** — WebKit and Firefox. Currently **non-blocking**
  (`continue-on-error`). Once it has passed twice on `main`, delete that line
  to make it a real gate.
- **review-screenshots** — an artifact on every run, eight routes × two
  languages, kept for seven days. This is the fastest way to see what a change
  did.

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

1. **What the homepage must retain** — the trailer is built and off, waiting on
   this one decision.
2. **Reservation ids for Evexia, Eros and Zoi** — their Book buttons open the
   engine's front page rather than the room, and the site says so in words
   rather than pretending otherwise.
