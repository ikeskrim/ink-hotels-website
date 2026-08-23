# Proposals awaiting the owner's sign-off

Nothing in this file has been applied. The rooms are frozen — categories, names
and counts are exactly as signed off. Each entry states the problem, what it
costs to leave alone, and the smallest change that would fix it, so a decision
is a yes or a no rather than a project.

---

## 1. Two Phos categories are called the same thing

**Status: proposed, not applied. Needs the owner's word.**

Phos has six bookable categories. Two of them are, to a guest scanning a list,
the same name:

| booking id | shown as | engine name | size | sleeps |
| --- | --- | --- | ---: | ---: |
| `4418` | Superior Room with Balcony | `Superior Room with Balcony - Phos` | 20 m² | 4 |
| `4076` | Superior with Balcony | `Superior Room With Balcony - Phos` | 18 m² | 3 |

The two engine names are not merely similar. They differ by one capital letter —
*with* against *With* — and by nothing else. Anyone reconciling a booking by
name, in an email or over the phone, is distinguishing two rooms by the case of
a single character.

**What it costs to leave.** A guest who wanted the 20 m² room that sleeps four
can book the 18 m² room that sleeps three and not discover it until check-in,
at which point the hotel is choosing between moving them and refunding them.
This is the one naming problem on the site that can produce a wrong room on
arrival rather than merely a confused reader.

**Proposed.** Rename the 20 m² category to **Family Room with Balcony**, which
is what distinguishes it: it is the larger one and the one that takes four
people. That leaves "Superior with Balcony" unambiguous without touching it.

Alternatives, if "Family" is wrong for how the property sells it: *Superior
Room with Balcony (20 m²)*, or *Large Superior with Balcony*. Any of the three
solves it; the first reads best in a list.

**What changing it costs.** One line — `displayName` on booking id `4418` in
`src/content/rooms.ts` — plus the four translations of it. The URL, the
reservation-engine deep link and the engine's own name are untouched, so
nothing already booked or already indexed breaks. The site's `ENGINE_NAMES` map
already exists to keep a display name and an engine name apart for exactly this
kind of case.

**Not done without sign-off**, because a room name is what the owner's staff say
on the telephone, and a website is not the place that decision gets made.

---

## The chaptered trailer homepage (Stage 5.2)

**Status: built, measured, and switched off. One boolean away from live.**

The homepage runs fifteen sections. Stage 5.2 calls for slimming it to a
trailer and relocating the depth into `/rooms`, `/story` and `/rethymno`.
Which sections a hotel's front page keeps is a marketing decision, so this is
prepared rather than applied: `TRAILER` in
[`src/content/homepage-trailer.ts`](src/content/homepage-trailer.ts) is `false`
and the live site is exactly as it was.

### What the front page would keep — seven beats

| | section | why it stays |
| --- | --- | --- |
| 1 | Hero | the first screen |
| 2 | The name | one story beat: what the hotel is named after |
| 3 | The old town | the town-beach and old-town beat |
| 4 | The water | four suites with their own water — the strongest thing the property owns |
| 5 | The open door | Agapi, and step-free access |
| 6 | Plain facts | the questions a guest would otherwise open a review site to answer |
| 7 | Now the dates | booking |

### Where the other eight go — moved, never deleted

| section | to | why that page |
| --- | --- | --- |
| Where you sleep | `/rooms` | the three houses, which is what /rooms is for |
| The impression | `/story` | the press and the mark it leaves |
| The light | `/story` | beside the chapter that explains the name |
| The family | `/story` | who runs it belongs with how it came to be |
| What guests said | `/story` | with the family beat — renders nothing until `reviews.ts` has real quotes |
| The arrival | `/rethymno` | arriving in the quarter; the full steps already live on `/arrival` |
| What we arrange | `/rethymno` | what there is to do in the town |
| The feed | `/rethymno` | the town as it looks this week |

**No new copy was written and nothing was deleted.** That is the point of a
relocation table rather than a shorter homepage: a shorter homepage is the easy
version and would quietly cost the site eight translated sections in five
languages.

### How to flip it

Set `TRAILER` to `true`, rebuild, run the checks. To go back, set it to
`false`. There is no build step and no environment variable — the state of this
proposal is one boolean in a diff.

### Measured, both ways, on the built site

| | `/` | `/rooms` | `/story` | `/rethymno` |
| --- | ---: | ---: | ---: | ---: |
| flag off (live today) | 14 sections | 7 | 5 | 9 |
| flag on | **7** | 8 | 8 | 12 |

With the flag on, `/` carries exactly the seven retained headings and neither
`id="rooms"` nor `id="experiences"` — both anchors are on their destination
pages instead. With it off, all fourteen sections and both anchors are back
where they are today, verified after flipping it back.

**What this does not decide.** Whether the front page *should* be seven beats.
That is yours. What it does is make the answer cheap either way.
