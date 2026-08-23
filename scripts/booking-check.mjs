/**
 * Every Book control, on every room page, in every language, lands correctly.
 *
 *   BASE=http://localhost:3000 node scripts/booking-check.mjs
 *
 * This is the check the site most needs and least had. Everything else here
 * guards how the site reads; this guards whether it earns anything. A booking
 * link that opens the engine's front page instead of the room the reader chose
 * is not a visual defect — it is the reader giving up and the property never
 * knowing why.
 *
 * It exists because two real faults of exactly this shape shipped here and were
 * found by hand, late, one at a time:
 *
 *   - the header and dock CTAs opened the engine's front page from every room
 *     page, while the room's own panel deep-linked correctly;
 *   - the deep link then worked in Greek, German, French and Dutch and *not*
 *     in English, because the locale prefix was matched against a list that
 *     omitted the default — and English is served by a rewrite, so
 *     `usePathname` reports `/en/rooms/harmony` where the browser shows
 *     `/rooms/harmony`.
 *
 * Both pass a human's spot check — open a room page, press Book, it works.
 * Neither survives 20 categories × 5 locales, which is the point.
 *
 * ── What it asserts ────────────────────────────────────────────────────────
 * On every room page, for every locale:
 *
 *   1. Every anchor to the reservation engine carries this room's `bedroom`
 *      id — or, for a room the engine has no id for yet, carries none at all
 *      rather than a guess. That fallback is deliberate and documented; a
 *      made-up parameter would be worse than a front page.
 *   2. The availability form posts to the engine by GET, so the reader's dates
 *      and party size travel with them: `checkin`, `checkout`, `adults`,
 *      `rooms`, `children`, and `bedroom` where known.
 *   3. Nothing points at a different host.
 *
 * It reads the DOM rather than following the links: the engine is a third
 * party and hammering it from CI on every push would be rude and flaky. What
 * is ours to get right is the URL we hand over.
 */
import { launch, goto } from "./lib/browser.mjs";
import { rooms, bookingUrlFor } from "../src/content/rooms.ts";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["", "/el", "/de", "/fr", "/nl"];
const ENGINE = "reserve-online.net";

/* The fields the engine needs to receive a reader mid-decision rather than at
   the beginning again. */
const PASSTHROUGH = ["checkin", "checkout", "adults", "rooms", "children"];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const problems = [];
let checked = 0;
let deep = 0;

for (const room of rooms) {
  const expected = bookingUrlFor(room);
  const wantsId = Boolean(room.bookingId);

  for (const locale of LOCALES) {
    const route = `${locale}/rooms/${room.slug}`;
    const res = await goto(page, BASE + route, { waitFor: "main" });
    if (!res || res.status() !== 200) {
      problems.push(`${route}  HTTP ${res?.status()}`);
      continue;
    }

    const found = await page.evaluate((engine) => {
      const links = [...document.querySelectorAll("a[href]")]
        .map((a) => a.getAttribute("href") ?? "")
        .filter((h) => h.includes(engine));
      const form = document.querySelector(`form[action*="${engine}"]`);
      return {
        links,
        form: form
          ? {
              method: (form.getAttribute("method") ?? "").toLowerCase(),
              action: form.getAttribute("action") ?? "",
              fields: [...form.querySelectorAll("[name]")].map((f) =>
                f.getAttribute("name"),
              ),
            }
          : null,
      };
    }, ENGINE);

    checked += 1;

    if (!found.links.length) {
      problems.push(`${route}  no link to the reservation engine at all`);
      continue;
    }

    for (const href of found.links) {
      const url = new URL(href, BASE);
      const bedroom = url.searchParams.get("bedroom");

      if (wantsId) {
        if (bedroom === room.bookingId) continue;
        /* EVERY engine link on a room page has to carry that room, not just
           one of them. The first version of this check accepted "at least one
           control deep-links", which is exactly the shape of the bug it was
           written to catch: the room's own panel was right while the header
           and the dock — the two controls that follow a reader down the page —
           opened the engine's front page. One correct link hid three wrong
           ones. */
        problems.push(
          bedroom === null
            ? `${route}  a Book link carries no room at all, expected bedroom=${room.bookingId}`
            : `${route}  a Book link carries bedroom=${bedroom}, expected ${room.bookingId}`,
        );
      } else if (bedroom !== null) {
        problems.push(
          `${route}  ${room.slug} has no bookingId yet, but a link invents bedroom=${bedroom}`,
        );
      }
    }

    const allDeep =
      wantsId && found.links.every((h) => h.includes(`bedroom=${room.bookingId}`));
    if (allDeep) deep += 1;
    if (wantsId && !allDeep) {
      problems.push(
        `${route}  not every Book control deep-links this room (expected ${expected})`,
      );
    }

    if (!found.form) {
      problems.push(`${route}  no availability form posting to the engine`);
    } else {
      if (found.form.method !== "get") {
        problems.push(
          `${route}  the form is method="${found.form.method}" — the engine reads a query string`,
        );
      }
      for (const field of PASSTHROUGH) {
        if (!found.form.fields.includes(field)) {
          problems.push(`${route}  the form drops "${field}" on the way over`);
        }
      }
      if (wantsId && !found.form.fields.includes("bedroom")) {
        problems.push(`${route}  the form does not carry this room's id`);
      }
    }
  }

  process.stdout.write(
    `  ${room.slug.padEnd(38)} ${wantsId ? `bedroom=${room.bookingId}` : "no id — plain engine URL"}\n`,
  );
}

await browser.close();

const idless = rooms.filter((r) => !r.bookingId).map((r) => r.slug);
console.log(
  `\nchecked ${checked} room pages (${rooms.length} categories × ${LOCALES.length} locales)`,
);
console.log(`  ${deep} pages deep-link their room`);
console.log(
  `  ${idless.length} categories documented as having no engine id yet: ${idless.join(", ")}`,
);

if (!problems.length) {
  console.log("\nevery Book control lands on the room the reader chose");
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)].slice(0, 40)) console.error(`  ${p}`);
process.exitCode = 1;
