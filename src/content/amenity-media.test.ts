import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { AMENITY_MEDIA, amenityFrame } from "./amenity-media";
import { rooms } from "./rooms";
import { localiseAmenityItems } from "@/i18n/content";
import { locales } from "@/i18n/config";

/**
 * The media map's own comment promised that "a test holds the two together" —
 * the map and rooms.ts — so a renamed amenity would break loudly. For the
 * first two suites nobody wrote it. This is it, written before the map grew
 * from two suites to seven.
 */
const bySlug = new Map(rooms.map((r) => [r.slug, r]));

test("amenity photography maps only suites that exist", () => {
  for (const slug of Object.keys(AMENITY_MEDIA)) {
    assert.ok(bySlug.has(slug), `no suite is called "${slug}"`);
  }
});

test("every mapped amenity is named exactly as the room record names it", () => {
  for (const [slug, frames] of Object.entries(AMENITY_MEDIA)) {
    const listed = new Set(bySlug.get(slug)?.amenities ?? []);
    for (const amenity of Object.keys(frames)) {
      assert.ok(
        listed.has(amenity),
        `${slug}: "${amenity}" is mapped to a frame but is not in its amenities`,
      );
    }
  }
});

test("every frame points at a file that is actually on disk", () => {
  for (const [slug, frames] of Object.entries(AMENITY_MEDIA)) {
    for (const [amenity, frame] of Object.entries(frames)) {
      assert.ok(frame.src.startsWith("/media/"), `${slug}/${amenity}: ${frame.src}`);
      assert.ok(
        existsSync(join(process.cwd(), "public", frame.src)),
        `${slug}/${amenity}: ${frame.src} is not in public/`,
      );
    }
  }
});

test("each frame is described in its own words, not by repeating the label", () => {
  for (const [slug, frames] of Object.entries(AMENITY_MEDIA)) {
    for (const [amenity, frame] of Object.entries(frames)) {
      assert.ok(frame.alt.trim().length > 20, `${slug}/${amenity}: alt too short`);
      assert.notEqual(
        frame.alt.trim().toLowerCase(),
        amenity.toLowerCase(),
        `${slug}/${amenity}: alt is just the label`,
      );
    }
  }
});

test("one photograph never stands for two amenities in the same suite", () => {
  for (const [slug, frames] of Object.entries(AMENITY_MEDIA)) {
    const srcs = Object.values(frames).map((f) => f.src);
    assert.equal(new Set(srcs).size, srcs.length, `${slug}: a frame is reused`);
  }
});

test("no courtyard hot-tub frame is invented for Pathos", () => {
  /* The owner's correction gave Pathos a hot tub; no photograph of it exists
     yet (incoming/README.md, "Wanted"). Until one is taken and opened, the
     tile is type. */
  assert.equal(amenityFrame("pathos", "Private hot tub"), undefined);
});

test("every frame is described in all five languages, and the grid finds it in each", () => {
  for (const locale of locales) {
    for (const [slug, frames] of Object.entries(AMENITY_MEDIA)) {
      const items = localiseAmenityItems(locale, slug);
      const withFrame = items.filter((i) => i.frame);
      assert.equal(
        withFrame.length,
        Object.keys(frames).length,
        `${locale}/${slug}: ${withFrame.length} frames resolved, ${Object.keys(frames).length} mapped`,
      );
      for (const item of withFrame) {
        const en = frames[item.key]?.alt;
        assert.ok(item.frame && item.frame.alt.trim().length > 20, `${locale}/${slug}/${item.key}: no description`);
        if (locale !== "en") {
          assert.notEqual(item.frame?.alt, en, `${locale}/${slug}/${item.key}: description is still English`);
        }
      }
    }
  }
});
