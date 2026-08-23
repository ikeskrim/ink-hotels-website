import assert from "node:assert/strict";
import { test } from "node:test";

/* Plain JS module, read here as data. */
import { MAP, LOCALES, buildRedirects } from "../../redirects.mjs";

/**
 * Golden tests for the launch redirect table.
 *
 * `redirect-check.mjs` already asserts the *live* behaviour — that every
 * destination returns 200 and every anchor exists. It needs a running server,
 * so it runs late, and it says nothing about the table's shape.
 *
 * These are the properties that can be wrong before anything is served, and
 * that a live check would report as a confusing 404 rather than as the thing
 * that is actually wrong. They run in milliseconds, in `npm test`, before the
 * build.
 *
 * The stakes: the moment DNS moves, every URL Google holds is requested against
 * this table. A row that is silently dropped is a ranking thrown away, and for
 * a hotel in the weeks before a season that is bookings.
 */

const rows: [string, string][] = MAP;
const built: { source: string; destination: string; permanent: boolean }[] =
  buildRedirects();

test("every source is an absolute path, exact, with no trailing slash", () => {
  for (const [from] of rows) {
    assert.ok(from.startsWith("/"), `source is not absolute: ${from}`);
    assert.ok(
      from === "/" || !from.endsWith("/"),
      `source has a trailing slash, which will not match the normalised form: ${from}`,
    );
    assert.ok(!from.includes("?"), `source carries a query string: ${from}`);
    assert.ok(
      !/\s/.test(from),
      `source contains whitespace, which cannot come from a real URL: ${from}`,
    );
  }
});

test("no source is listed twice", () => {
  const seen = new Map<string, number>();
  for (const [from] of rows) seen.set(from, (seen.get(from) ?? 0) + 1);
  const dupes = [...seen].filter(([, n]) => n > 1);
  assert.deepEqual(
    dupes,
    [],
    `duplicated sources — the second row is dead: ${dupes.map(([s]) => s).join(", ")}`,
  );
});

test("nothing redirects to itself, and no pair redirects to each other", () => {
  const by = new Map(rows);
  for (const [from, to] of rows) {
    assert.notEqual(from, to, `${from} redirects to itself`);
    const back = by.get(to);
    assert.ok(
      back !== from,
      `${from} and ${to} redirect to each other — an infinite loop at launch`,
    );
  }
});

test("no destination is itself a source — that is a chain, and chains lose ranking", () => {
  const sources = new Set(rows.map(([from]) => from));
  for (const [from, to] of rows) {
    assert.ok(
      !sources.has(to),
      `${from} → ${to}, but ${to} is itself redirected: two hops where one is needed`,
    );
  }
});

test("the old site's English prefix is dropped, never carried through", () => {
  for (const [from, to] of rows) {
    assert.ok(
      from.startsWith("/en"),
      `every harvested URL came from the old site's /en tree: ${from}`,
    );
    assert.ok(
      !to.startsWith("/en/") && to !== "/en",
      `${from} → ${to} keeps the /en prefix; this site serves English unprefixed`,
    );
  }
});

test("every row is expanded into all four localised prefixes", () => {
  /* A guest who bookmarked the old site in German still arrives on a /de URL.
     If the expansion ever silently stops, those readers 404 and only they do. */
  for (const locale of LOCALES) {
    const localised = built.filter((r) => r.source.startsWith(`/${locale}/`));
    assert.ok(
      localised.length >= rows.length,
      `${locale}: ${localised.length} redirects for ${rows.length} rows — the expansion dropped some`,
    );
  }
  assert.ok(
    built.length >= rows.length * (LOCALES.length + 1),
    `built ${built.length} redirects from ${rows.length} rows; expected at least ${
      rows.length * (LOCALES.length + 1)
    }`,
  );
});

test("every redirect is permanent — a 302 passes no ranking on", () => {
  const temporary = built.filter((r) => !r.permanent);
  assert.deepEqual(
    temporary.map((r) => r.source),
    [],
    "these are temporary redirects and would throw away the ranking they carry",
  );
});

test("the misspelled source is preserved exactly as the old site published it", () => {
  /* The old site had `dream-weadding` in a live URL. It is indexed with the
     typo, so the typo is the only string that will ever be requested. Any
     tidy-up here is a 404 for everyone holding that link. */
  const sources = rows.map(([from]) => from);
  assert.ok(
    sources.some((s) => s.includes("dream-weadding")),
    "the misspelled wedding URL is gone from the table — it is indexed with the typo and must be matched with it",
  );
});
