import assert from "node:assert/strict";
import { test } from "node:test";

import { bedPhrase, roomSpecs } from "./specs";
import { rooms } from "@/content/rooms";
import { getMessages } from "@/i18n";
import type { Room } from "@/content/rooms";

/**
 * The spec line is the most-repeated piece of text on the site — every room
 * card on every page in five languages — which is exactly why it went wrong
 * quietly. Eros, Zoi and the Residence rendered "2 bedrooms" twice, because
 * the reservation system records a bedroom count in `bedrooms` and again as a
 * `beds` entry labelled "Bedroom".
 *
 *   npm test
 */

const m = getMessages("en");

/** A minimal room, overridden per case. */
function room(over: Partial<Room>): Room {
  return {
    id: "test",
    bookingId: null,
    slug: "test",
    name: "Test",
    displayName: "Test",
    house: "house-of-europe",
    kind: "suite",
    guests: 2,
    sizeSqm: 30,
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ label: "King bed", count: 1 }],
    outlook: null,
    outdoor: null,
    level: null,
    description: "",
    notes: [],
    amenities: [],
    images: [],
    renovated: null,
    ...over,
  } as Room;
}

test("a bedroom count is stated once, not once per source field", () => {
  const specs = roomSpecs(
    room({ bedrooms: 2, beds: [{ label: "Bedroom", count: 2 }], guests: 4 }),
    m,
    "en",
  );
  const bedrooms = specs.filter((s) => /bedroom/i.test(s));
  assert.equal(
    bedrooms.length,
    1,
    `expected one bedroom part, got ${JSON.stringify(specs)}`,
  );
});

test("no part of a spec line repeats any other part", () => {
  for (const r of rooms) {
    const specs = roomSpecs(r, m, "en");
    const seen = new Set(specs.map((s) => s.trim().toLowerCase()));
    assert.equal(
      seen.size,
      specs.length,
      `${r.slug} repeats a part: ${JSON.stringify(specs)}`,
    );
  }
});

test("every real room produces a non-empty, comma-clean spec line", () => {
  for (const r of rooms) {
    const specs = roomSpecs(r, m, "en");
    assert.ok(specs.length > 0, `${r.slug} produced no spec at all`);
    for (const part of specs) {
      assert.ok(part.trim().length > 0, `${r.slug} produced an empty part`);
      assert.ok(!/,\s*$/.test(part), `${r.slug} has a trailing comma: "${part}"`);
      assert.ok(!/\s,/.test(part), `${r.slug} has a floating comma: "${part}"`);
    }
  }
});

test("distinct beds are all kept — dedupe must not eat real information", () => {
  const specs = roomSpecs(
    room({
      bedrooms: 1,
      beds: [
        { label: "King bed", count: 1 },
        { label: "Sofa bed", count: 2 },
      ],
    }),
    m,
    "en",
  );
  const line = specs.join(" · ");
  assert.match(line, /king bed/i);
  assert.match(line, /sofa beds/i);
});

test("bedPhrase pluralises from the catalogue, not by adding an s", () => {
  assert.equal(bedPhrase("King bed", 1, m, "en"), "1 king bed");
  assert.equal(bedPhrase("King bed", 2, m, "en"), "2 king beds");
  /* An unmapped label survives rather than vanishing: a visible English word
     is a bug report, a missing bed is a complaint at check-in. */
  assert.match(bedPhrase("Hammock", 1, m, "en"), /hammock/i);
});

test("the line is localised, not English with translated nouns bolted on", () => {
  const el = roomSpecs(room({ guests: 2 }), getMessages("el"), "el");
  assert.ok(
    el.some((s) => /[Ͱ-Ͽ]/.test(s)),
    `expected Greek in ${JSON.stringify(el)}`,
  );
});
