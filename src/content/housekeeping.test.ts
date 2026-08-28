import assert from "node:assert/strict";
import { test } from "node:test";

import { rooms } from "@/content/rooms";
import { getMessages } from "@/i18n";
import { localiseRooms } from "@/i18n/content";
import { locales } from "@/i18n/config";

/**
 * Housekeeping is one sentence, said in three places.
 *
 * The owner softened it in August 2026: it had promised a clean every two
 * days flat, and what actually happens is that it is arranged with the stay.
 * The facts list and the FAQ were corrected first; twelve room pages went on
 * making the old flat promise for another day, in all five languages, because
 * room notes live in `rooms.ts` and its overlays rather than in the message
 * catalogue. Sixty strings, and nothing connected them to the sentence they
 * were supposed to agree with.
 *
 * This is that connection. The facts line is the canonical wording — change
 * it there and every room note that no longer matches fails here.
 */

/** The rooms whose notes state the housekeeping arrangement. */
const EXPECTED_ROOMS = 12;

test("every locale's room notes say exactly what its facts line says", () => {
  for (const locale of locales) {
    const canonical = getMessages(locale).common.factHousekeeping;
    const carrying = localiseRooms(locale).filter((r) =>
      (r.notes ?? []).includes(canonical),
    );
    assert.equal(
      carrying.length,
      EXPECTED_ROOMS,
      `${locale}: ${carrying.length} room(s) carry the facts-line sentence, expected ${EXPECTED_ROOMS} — a note and the facts list have drifted apart`,
    );
  }
});

/**
 * The counts have to agree across languages too. A locale that loses the note
 * entirely would still pass a per-locale count if the number were changed to
 * suit it, and a locale whose overlay note is subtly different from its own
 * catalogue would silently show the English fallback instead.
 */
test("the same rooms carry the note in every language", () => {
  const english = new Set(
    rooms
      .filter((r) => (r.notes ?? []).includes(getMessages("en").common.factHousekeeping))
      .map((r) => r.slug),
  );
  assert.equal(english.size, EXPECTED_ROOMS);

  for (const locale of locales) {
    const canonical = getMessages(locale).common.factHousekeeping;
    const here = new Set(
      localiseRooms(locale)
        .filter((r) => (r.notes ?? []).includes(canonical))
        .map((r) => r.slug),
    );
    assert.deepEqual(
      [...here].sort(),
      [...english].sort(),
      `${locale}: a different set of rooms carries the housekeeping note`,
    );
  }
});
