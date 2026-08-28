# Photo audit — is every frame Rethymno, or ours?

> **Ruled on, 27 August 2026: all nine go.** The Rethymno-only rule stands.
> The nine frames below were deleted from `public/media`, their keys removed
> from the generated map, and their slugs listed in `WITHDRAWN_FRAMES` in
> `content/experiences.ts` so a regeneration of that map cannot bring them
> back. Those nine arrangements are now described in words alone. Git history
> still holds the files. Replacements arrive through `npm run photos` with the
> owner's own sets.
>
> Items 10–16 were **not** part of that ruling and are unchanged. They stand
> as open questions.

This was the list the owner ruled on. Each entry names the frame, where it
appeared, what was wrong with it, and how confident the judgement was.

Run: August 2026, against the 448 files in `public/media` (439 after).

---

## How the library was checked

The photo library was mirrored wholesale from the property's own CDN, and
every mirrored file is named with a 32-character hash. Two files in `public/`
are **not** named that way, which means two files entered the library from
somewhere other than the property:

| file | what it is | verdict |
| --- | --- | --- |
| `og-hero.jpg` | The Venetian harbour lighthouse seen through a stone arch | **Rethymno, unmistakably.** Correct. |
| `placeholder-fiat-500-cabrio.webp` | A mint Fiat 500 Jolly | The known, owner-approved placeholder. Already flagged in `content/experiences.ts` and in README. Unchanged. |

Provenance alone does not settle the question, though: the property's own CDN
also holds stock photography bought or downloaded years ago for the old site.
So the 29 frames that carry the highest risk of not being Rethymno — the
**22 arrangement photographs** and the **6 landmark photographs**, the ones
that illustrate a *place or activity* rather than a room — were opened and
looked at, one by one.

The room photography was not re-examined frame by frame. It is the property
photographing its own rooms, 400-odd frames of it, and nothing in it is in
question. If you want that swept too, say so.

---

## The nine — removed

In each case something in the frame was inconsistent with Crete, not merely
unidentifiable. All nine are gone from the site and from the library.

**What was deliberately not done:** no withdrawn card was given a different
photograph. A genuine frame of the organic farm on a card headed "Massage" is
the same lie the stock was, in better clothes. The arrangements keep their own
picture or none.

**What was done instead**, where the loss was load-bearing: the cross-sell
strips on room pages are three cards wide, and evexia and harmony had all
three of theirs withdrawn — a row of three empty frames. Which three
arrangements each room offers has been rebalanced so every strip carries at
least two photographs. Nothing was said about any arrangement that was not
already true; only the order of the shop window changed. See
`RELATED_BY_SLUG` in `content/rooms.ts`, one line each to put back.

### 1. Quad safari — birch and poplar

`/media/7f77fd00651b089929904d4f782e049c.webp`
**Routes:** `/experiences`, `/experiences/quad-safari` (×5 locales)

An old quad on sandy soil, in front of **birch and poplar** — pale-trunked
northern deciduous trees. Birch does not grow on Crete. Eastern European stock.

### 2. Bike tours — a composited Carpathian mountainside

`/media/bdf2854f739ed767a61fc2a8ea34510a.webp`
**Routes:** `/experiences`, `/experiences/bike-tours` (×5)

Lush green rolling mountains under conifer forest, with a dramatic sky that
has visibly been composited in. Not a Cretan landscape and not a real photograph
of anywhere.

### 3. Wine production — a studio composite

`/media/8b1717d3f4d185de4b5533b5aa9f77f7.webp`
**Routes:** `/experiences`, `/experiences/wine-production` (×5)

A barrel, two bottles, two glasses and grapes shot in a studio, with a flat
trellised vineyard and a sunset comped in behind. The most obviously
manufactured frame on the site. It is not a place at all.

### 4. Wine tasting — a northern vineyard

`/media/7759db733627c673c0434d430da9ccd9.webp`
**Routes:** `/experiences`, `/experiences/wine-tasting` (×5), and the *related*
strip on **4 room pages**: evexia, harmony, pathos, elpida

Five glasses on a rail against a steep, wire-trained, very green vineyard —
the Austrian/Alsace training style, not the low, dry bush vines of Crete.

### 5. Massage — a frangipani flower

`/media/1dfed03ebd3039917a735a1a7c3daeab.webp`
**Routes:** `/experiences`, `/experiences/massage` (×5), and the *related*
strip on **18 room pages** — every room except agapi and zoi

Oil poured over hands beside a **frangipani blossom**, the signature of a
Balinese or Thai spa. Frangipani does not grow on Crete. This is the
widest-reaching of the flagged frames.

### 6. Therapist — English words baked into the picture

`/media/be6ba97f67ca986c322a52e76e49579c.webp`
**Routes:** `/experiences`, `/experiences/therapist` (×5), and the *related*
strip on the **agapi** room page

Three pebbles in a palm, with **"Spirit / Body / Mind" printed on them**. Two
separate problems: it is wellness clip-art rather than anywhere, and it carries
English text that cannot be translated. A Greek, German, French or Dutch reader
gets an English photograph on an otherwise fully translated page.

### 7. Personal trainer — a branded commercial gym

`/media/6ad613df90454a795065e08e8449b6e0.webp`
**Routes:** `/experiences`, `/experiences/personal-trainer` (×5)

A glass-walled city gym, a model in a shirt reading **"PERSONAL TRAINER"**.
Unambiguously bought stock, and nothing to do with the property.

### 8. Chauffeur — a stock limousine door

`/media/6ec47a7ae9723391bd034a72392f71aa.webp`
**Routes:** `/experiences`, `/experiences/chauffeur` (×5), and the *related*
strip on **18 room pages**

A white-gloved hand on a black limousine handle. Generic, and now doubly
wrong: A3 changed the copy to say this is **our own** chauffeur. The words
claim a real person and a real car; the picture shows neither.

### 9. Running — subtropical, and not summer here

`/media/b7ee257fdf7df15fa18be531370ad2d7.webp`
**Routes:** `/experiences`, `/experiences/running` (×5)

A runner tying a shoe on a stone path through dense, wet, subtropical green.
Widely-syndicated stock. Cretan summer does not look like this.

---

## Worth a decision, but weaker

### 10. Hiking — an alpine meadow

`/media/96d7b4357847e786fa638a14419d4875.webp` — `/experiences/hiking` (×5)

Four backpackers on a lush green ridge with broadleaf shrubs turning autumn
colour. Continental rather than Cretan, but I cannot rule out a high spring
meadow on Psiloritis. Medium confidence.

### 11. Water sports — a stranger's face, full on

`/media/6f4d6e8fdf885cd7d07164190362286a.webp` — `/experiences/water-sports` (×5)

A jet-ski on flat water with a wooded shore. The location proves nothing
either way — but **the rider's face is fully recognisable and she is a
stranger**, which is the rule already set for Agapi's lead frame: a
recognisable stranger does not lead a commercial page. That part is not a
judgement call.

### 12. Cretan cuisine — Nordic fine dining

`/media/7a8843db0f095b81891cc5b04f23c931.webp`
`/experiences`, `/experiences/learn-the-secrets-of-cretan-cuisine` (×5)

A chef tweezering edible flowers onto a white bowl. Immaculate, and the
opposite of Cretan home cooking, which is what the page is selling. Also worth
knowing: this same file was the old `chef-in-villa` image, and its orphaned key
still sits in the generated manifest after A4.

### 13. Jeep safari — plausible, unprovable

`/media/13dcbc1e810a47022f5791951f545b6b.webp` — `/experiences/jeep-safari` (×5),
and the *related* strip on the **zoi** room page

Two jeeps on a dirt track past grazing sheep, pine and limestone. This one is
entirely consistent with the Psiloritis uplands. Heavily HDR-processed in the
way stock of its era was, but I would not call it foreign. Listed only so the
list is complete.

### 14. Scuba diving — open blue water

`/media/84a0328acf4706eb3dd61d0d0404faa2.webp` — `/experiences/scuba-diving` (×5)

A diver over a sandy slope. Could be anywhere in the Mediterranean, including
here. No evidence either way.

### 15. Wedding on the beach — real, but not ours

`/media/e97e3579b1e0a2c11d90b7112d1dcb5b.webp` — `/experiences/wedding-on-the-beach` (×5)

A genuine evening event at a genuine seaside venue with a pool, palms and a
thatched bar. It reads as one of the family's own properties rather than
stock. The question is not whether it is real — it is that Ink is an old-town
hotel with no pool and no beach frontage, and a guest could reasonably read
this as Ink's own venue. Your call.

### 16. Kourtaliotiko gorge — the right island, the wrong subject

`/media/b180118a9d768f785a2a5fe0e1950796.webp` — `/rethymno`, `/experiences/kourtaliotiko-gorge` (×5)

Dry limestone hills under haze: convincingly Cretan. But **there is no gorge in
the frame** — it shows open hillside, and the page is called Kourtaliotiko
Gorge. It is also the lowest-resolution frame in the set and looks like a still
lifted from video. Two reasons to replace it that have nothing to do with
geography.

---

## Checked and correct

| frame | route | what it is |
| --- | --- | --- |
| `05123d38…` | `/rethymno` | Arkadi Monastery |
| `9b38eb74…` | `/rethymno` | The Venetian harbour |
| `c8d8f7b3…` | `/rethymno` | The Fortezza |
| `e01e491e…` | `/rethymno` | The town beach |
| `e19a2757…` | `/rethymno` | The Historical and Folklore Museum |
| `0e2e863a…` | `/rethymno` | Ancient Eleftherna |
| `d5354707…` | `/experiences/exclusive-tour` | **Knossos**, the throne room. Crete, though Heraklion rather than Rethymno — correct for a tour, worth knowing. |
| `06a05af9…` | `/experiences/organic-farm` | A real seaside kitchen garden, white wall and palms behind. Authentic. |
| `81f32d1a…` | `/experiences/breakfast-on-the-beach` | A real breakfast laid on the rocks by the sea. Authentic. |
| `417dcdc2…` | `/experiences/private-helipad` | A real helicopter in a real Greek setting — see the note below. |
| `og-hero.jpg` | every social preview | The harbour lighthouse through an arch. |

**One note on the helipad frame.** It is a genuine snapshot, not stock, and the
setting looks Greek. But the aircraft's registration is legible — **OE-YIP**,
an Austrian registration, with the Austrian flag on the tail. If that machine
is not one the property charters, the site is illustrating its own service with
a photograph of somebody else's aircraft, identifiable by tail number. Not a
Rethymno question, but the same kind of question.

---

## What replaces them

They are out. What replaces them matters more than what left: an arrangement with no photograph shows no card at all
on `/experiences`, which is honest but quiet. The alternatives, in the order I
would prefer them:

1. **A real frame from the partner who runs it.** The diving school, the
   winery, the therapist. They have photographs and are usually glad to be
   credited.
2. **A frame of Rethymno that stands for it.** The wine tasting can be a
   photograph of the hills the wine comes from.
3. **No photograph, and the card carries the words alone.** The site already
   does this well elsewhere and it is the option that never lies.

What I would not do is swap one piece of stock for another. That is the same
problem with a different picture.
