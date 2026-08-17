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
