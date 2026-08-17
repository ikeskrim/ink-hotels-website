import { defineField, defineType } from "sanity";

/**
 * The homepage.
 *
 * A single document, grouped into the same movements a visitor scrolls through,
 * so an editor looking for "the bit about the pool" finds a tab called
 * Harmony rather than a field called `section6Body`.
 *
 * Section order is fixed in code. That is deliberate: the sequence is an
 * argument — what this place is, where you sleep, how you arrive, then the
 * dates — and letting it be shuffled in a CMS is how a considered homepage
 * becomes a pile of blocks. Text, photographs and which rooms are featured are
 * all editable; the running order is not.
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Opening", default: true },
    { name: "story", title: "The name & the press" },
    { name: "mark", title: "The mark" },
    { name: "light", title: "Phos" },
    { name: "town", title: "The old town" },
    { name: "rooms", title: "Where you sleep" },
    { name: "water", title: "Harmony" },
    { name: "agapi", title: "Agapi" },
    { name: "staying", title: "The art of staying" },
    { name: "family", title: "Crete Holiday Home" },
    { name: "closing", title: "Facts & booking" },
    { name: "seo", title: "Search engines" },
  ],
  fields: [
    /* ── Opening ─────────────────────────────────────────────────────── */
    defineField({
      name: "heroImages",
      title: "Photographs in the opening slideshow",
      type: "array",
      of: [{ type: "inkImage" }],
      group: "hero",
      options: { layout: "grid" },
      description:
        "Two to five landscape photographs, at least 2000 pixels wide. They fade slowly from one to the next. The first is the one a visitor sees immediately — make it the strongest. Drag to reorder.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(6)
          .warning("More than about four and most visitors never see the rest."),
    }),
    defineField({ name: "heroEyebrow", title: "Small label above the heading", type: "localeString", group: "hero" }),
    defineField({
      name: "heroTitleLine1",
      title: "Heading, first line",
      type: "localeString",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitleLine2",
      title: "Heading, second line",
      type: "localeString",
      group: "hero",
      description: "Split across two lines deliberately. Keep each line short.",
    }),
    defineField({
      name: "heroLede",
      title: "Opening paragraph",
      type: "localeText",
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    /* ── The press ───────────────────────────────────────────────────── */
    defineField({ name: "pressEyebrow", title: "Small label", type: "localeString", group: "story" }),
    defineField({ name: "pressTitle", title: "Heading", type: "localeString", group: "story" }),
    defineField({ name: "pressLede", title: "The line in italics", type: "localeString", group: "story" }),
    defineField({
      name: "pressImprint",
      title: "Line under the big word",
      type: "localeString",
      group: "story",
      description: "The small printer's line beneath INK.",
    }),
    defineField({ name: "pressBody1", title: "Left column", type: "localeText", group: "story" }),
    defineField({ name: "pressBody2", title: "Right column", type: "localeText", group: "story" }),
    defineField({ name: "pressPull", title: "The large closing line", type: "localeText", group: "story" }),

    /* ── The mark ────────────────────────────────────────────────────── */
    defineField({ name: "markEyebrow", title: "Small label", type: "localeString", group: "mark" }),
    defineField({ name: "markTitle", title: "Heading", type: "localeString", group: "mark" }),
    defineField({ name: "markBody1", title: "First paragraph", type: "localeText", group: "mark" }),
    defineField({ name: "markBody2", title: "Second paragraph", type: "localeText", group: "mark" }),

    /* ── Phos ────────────────────────────────────────────────────────── */
    defineField({ name: "lightEyebrow", title: "Small label", type: "localeString", group: "light" }),
    defineField({ name: "lightImage", title: "Photograph", type: "inkImage", group: "light" }),
    defineField({ name: "lightBody1", title: "First paragraph", type: "localeText", group: "light" }),
    defineField({ name: "lightBody2", title: "Second paragraph", type: "localeText", group: "light" }),
    defineField({ name: "lightSpec", title: "Small fact line", type: "localeString", group: "light" }),

    /* ── The old town ────────────────────────────────────────────────── */
    defineField({ name: "settingEyebrow", title: "Small label", type: "localeString", group: "town" }),
    defineField({ name: "settingTitle", title: "Heading", type: "localeString", group: "town" }),
    defineField({ name: "settingBody1", title: "First paragraph", type: "localeText", group: "town" }),
    defineField({ name: "settingBody2", title: "Second paragraph", type: "localeText", group: "town" }),
    defineField({ name: "settingImageTall", title: "Tall photograph (left)", type: "inkImage", group: "town" }),
    defineField({ name: "settingImageWide", title: "Second photograph (right)", type: "inkImage", group: "town" }),

    /* ── Rooms ───────────────────────────────────────────────────────── */
    defineField({ name: "roomsEyebrow", title: "Small label", type: "localeString", group: "rooms" }),
    defineField({ name: "roomsTitle", title: "Heading", type: "localeString", group: "rooms" }),
    defineField({ name: "roomsLede", title: "Opening paragraph", type: "localeText", group: "rooms" }),
    defineField({
      name: "featuredRooms",
      title: "Rooms to feature",
      type: "array",
      of: [{ type: "reference", to: [{ type: "room" }] }],
      group: "rooms",
      description:
        "Leave empty to show the four houses instead, which is the usual arrangement. Add rooms here only if you want to promote specific ones.",
      validation: (rule) => rule.max(6),
    }),

    /* ── Harmony ─────────────────────────────────────────────────────── */
    defineField({ name: "waterEyebrow", title: "Small label", type: "localeString", group: "water" }),
    defineField({
      name: "waterTitle",
      title: "Heading",
      type: "localeText",
      group: "water",
      description: "This one runs long on purpose — it is the sentence about there being one pool.",
    }),
    defineField({ name: "waterBody", title: "Paragraph", type: "localeText", group: "water" }),
    defineField({ name: "waterSpec", title: "Small fact line", type: "localeString", group: "water" }),
    defineField({ name: "waterImage", title: "Photograph", type: "inkImage", group: "water" }),

    /* ── Agapi ───────────────────────────────────────────────────────── */
    defineField({ name: "agapiTitle", title: "Heading", type: "localeString", group: "agapi" }),
    defineField({ name: "agapiBody1", title: "First paragraph", type: "localeText", group: "agapi" }),
    defineField({ name: "agapiBody2", title: "Second paragraph", type: "localeText", group: "agapi" }),
    defineField({ name: "agapiImage", title: "Photograph", type: "inkImage", group: "agapi" }),

    /* ── Staying ─────────────────────────────────────────────────────── */
    defineField({ name: "stayingEyebrow", title: "Small label", type: "localeString", group: "staying" }),
    defineField({ name: "stayingTitle", title: "Heading", type: "localeString", group: "staying" }),
    defineField({ name: "stayingLede", title: "Opening paragraph", type: "localeText", group: "staying" }),

    /* ── Crete Holiday Home ──────────────────────────────────────────── */
    defineField({ name: "familyTitle", title: "Heading", type: "localeString", group: "family" }),
    defineField({ name: "familyBody1", title: "First paragraph", type: "localeText", group: "family" }),
    defineField({ name: "familyBody2", title: "Second paragraph", type: "localeText", group: "family" }),
    defineField({ name: "familyImage", title: "Photograph", type: "inkImage", group: "family" }),

    /* ── Closing ─────────────────────────────────────────────────────── */
    defineField({ name: "factsTitle", title: "Facts section heading", type: "localeString", group: "closing" }),
    defineField({
      name: "facts",
      title: "The plain facts",
      type: "array",
      of: [{ type: "factPair" }],
      group: "closing",
      description: "Breakfast, noise, parking, pets, languages. Drag to reorder.",
    }),
    defineField({ name: "datesTitle", title: "Booking section heading", type: "localeString", group: "closing" }),

    defineField({ name: "seo", title: "Search engines", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
