import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { rooms, roomsBySlug } from "@/content/rooms";
import { contact } from "@/content/site";

/**
 * The Reserve affordance's locale matrix, as a unit test.
 *
 * `booking-check.mjs` asserts the same property against a running server and
 * is the stronger check — it reads what the browser actually receives. This
 * exists because it fails in 4 milliseconds instead of 15 seconds, needs no
 * build, and pins the one case that shipped broken:
 *
 *   English is served by a middleware *rewrite*. The browser shows
 *   /rooms/harmony; `usePathname` inside a client component reports
 *   /en/rooms/harmony. The first version matched the prefix against
 *   el|de|fr|nl and therefore worked in every language except the default —
 *   which is the one most readers are on, and the one a developer testing
 *   locally is always on.
 *
 * The regex below is the component's, copied deliberately: a test that imported
 * the component would need a React renderer and a router, and what is worth
 * pinning here is the rule. A copy can drift from its source, so the last test
 * in this file reads the component and asserts the two are still the same
 * string — the copy cannot rot silently.
 */

/** The route matcher from components/booking/reserve-link.tsx. */
const ROOM_ROUTE = /^\/(?:[a-z]{2}\/)?rooms\/([^/?#]+)/;

/** What the component builds for a given pathname. */
function reserveHref(pathname: string): string {
  const match = ROOM_ROUTE.exec(pathname);
  const slug = match?.[1];
  const room = slug ? roomsBySlug.get(slug) : undefined;
  return room?.bookingId
    ? `${contact.bookingUrl}?bedroom=${encodeURIComponent(room.bookingId)}`
    : contact.bookingUrl;
}

const WITH_ID = rooms.find((r) => r.bookingId)!;
const WITHOUT_ID = rooms.find((r) => !r.bookingId)!;

test("the rewritten default locale is matched — the case that shipped broken", () => {
  /* /en is what usePathname reports for the unprefixed English route. A prefix
     list of el|de|fr|nl silently excluded it. */
  assert.equal(
    reserveHref(`/en/rooms/${WITH_ID.slug}`),
    `${contact.bookingUrl}?bedroom=${WITH_ID.bookingId}`,
    "the /en rewrite form must deep-link; this is the exact bug that shipped",
  );
});

test("every locale prefix reaches the same room", () => {
  const expected = `${contact.bookingUrl}?bedroom=${WITH_ID.bookingId}`;
  for (const prefix of ["", "/en", "/el", "/de", "/fr", "/nl"]) {
    assert.equal(
      reserveHref(`${prefix}/rooms/${WITH_ID.slug}`),
      expected,
      `${prefix || "(unprefixed)"} does not deep-link ${WITH_ID.slug}`,
    );
  }
});

test("a room the engine has no id for falls back to the plain URL, never a guess", () => {
  for (const prefix of ["", "/en", "/el", "/de", "/fr", "/nl"]) {
    const href = reserveHref(`${prefix}/rooms/${WITHOUT_ID.slug}`);
    assert.equal(href, contact.bookingUrl, `${prefix}: expected the plain engine URL`);
    assert.ok(
      !href.includes("bedroom="),
      `${prefix}: invented a bedroom id for ${WITHOUT_ID.slug}, which has none`,
    );
  }
});

test("pages that are not a room carry no room", () => {
  for (const path of [
    "/",
    "/en",
    "/rooms",
    "/el/rooms",
    "/story",
    "/el/experiences",
    "/gallery",
    "/rooms/",
  ]) {
    assert.ok(
      !reserveHref(path).includes("bedroom="),
      `${path} is not a room page but carries a room`,
    );
  }
});

test("an unknown slug does not deep-link to something else", () => {
  /* A stale link or a typo must not silently reserve a different suite. */
  assert.equal(reserveHref("/rooms/not-a-room"), contact.bookingUrl);
  assert.equal(reserveHref("/el/rooms/harmony-old"), contact.bookingUrl);
});

test("query strings and fragments do not become part of the slug", () => {
  const expected = `${contact.bookingUrl}?bedroom=${WITH_ID.bookingId}`;
  assert.equal(reserveHref(`/rooms/${WITH_ID.slug}?from=email`), expected);
  assert.equal(reserveHref(`/rooms/${WITH_ID.slug}#gallery`), expected);
});

test("every room with an id resolves, and every room without one falls back", () => {
  let deep = 0;
  let plain = 0;
  for (const room of rooms) {
    const href = reserveHref(`/rooms/${room.slug}`);
    if (room.bookingId) {
      assert.equal(
        href,
        `${contact.bookingUrl}?bedroom=${room.bookingId}`,
        `${room.slug} did not deep-link`,
      );
      deep += 1;
    } else {
      assert.equal(href, contact.bookingUrl, `${room.slug} should fall back plainly`);
      plain += 1;
    }
  }
  assert.equal(deep + plain, rooms.length);
  assert.ok(deep > 0 && plain > 0, "expected both a deep-linked and a fallback case");
});

test("the matcher under test is still the one the component ships", () => {
  /* A copied regex is only as good as the guarantee that it is still a copy.
     This reads the component and compares the literal, so a change to the
     route matching either updates both or fails here. */
  const src = readFileSync(
    new URL("./reserve-link.tsx", import.meta.url),
    "utf8",
  );
  const found = /const match = (\/\^.*?\/)\.exec/.exec(src);
  assert.ok(found, "could not find the route matcher in reserve-link.tsx");
  assert.equal(
    found![1],
    ROOM_ROUTE.toString(),
    "the component's route matcher has changed; update ROOM_ROUTE in this test to match",
  );
});
