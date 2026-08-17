import { defineField, defineType } from "sanity";

/**
 * Shared building blocks.
 *
 * Every image on this site carries alt text, and it is required — a hotel
 * photograph without a description is invisible to a screen reader and to
 * Google Images. The field sits directly under the picker so it cannot be
 * skipped by accident.
 */

export const inkImage = defineType({
  name: "inkImage",
  title: "Photograph",
  type: "image",
  options: {
    hotspot: true,
    /* The hotspot decides what survives a crop. Every layout on the site crops
       differently — full-bleed hero, 3:2 card, square thumbnail — so this is
       the single most useful control an editor has. */
  },
  fields: [
    defineField({
      name: "alt",
      title: "Describe this photograph",
      type: "string",
      description:
        "One plain sentence, for visitors using a screen reader and for search engines. Example: “A sea-view room with the shutters open onto the water.”",
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .warning("A longer description helps more people."),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "localeString",
      description: "Shown under the photograph in some layouts. Usually leave empty.",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt" },
  },
});

/** A bed line on a room: “1 double bed”. */
export const bed = defineType({
  name: "bed",
  title: "Bed",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Type of bed",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "count",
      title: "How many",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: { label: "label.en", count: "count" },
    prepare: ({ label, count }) => ({ title: `${count ?? 1} × ${label ?? "bed"}` }),
  },
});

/** A term/definition pair — used for spec strips and fact lists. */
export const factPair = defineType({
  name: "factPair",
  title: "Fact",
  type: "object",
  fields: [
    defineField({ name: "term", title: "Label", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "def", title: "Value", type: "localeString", validation: (r) => r.required() }),
  ],
  preview: {
    select: { term: "term.en", def: "def.en" },
    prepare: ({ term, def }) => ({ title: term ?? "", subtitle: def ?? "" }),
  },
});

/** A step in the arrival journey. */
export const step = defineType({
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Heading", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Text", type: "localeText", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "body.en" },
  },
});

/**
 * Search-engine settings, attached to any page.
 * Every field is optional — sensible defaults are generated from the page's own
 * content, and an editor only fills these in when they want to override them.
 */
export const seo = defineType({
  name: "seo",
  title: "Search engines & sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Title in Google results",
      type: "localeString",
      description:
        "Around 60 characters. Leave empty to use the page's own heading.",
    }),
    defineField({
      name: "description",
      title: "Description in Google results",
      type: "localeText",
      description:
        "Around 155 characters. This is the grey text under the blue link. Leave empty to use the page's opening paragraph.",
      validation: (rule) =>
        rule.custom((value?: Record<string, string>) => {
          const en = value?.en;
          if (en && en.length > 200) {
            return "Google will cut this off. Aim for about 155 characters.";
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Image when shared on social media",
      type: "inkImage",
      description:
        "Shown when someone posts a link to this page on Facebook, WhatsApp or LinkedIn. Landscape works best. Leave empty to use the page's main photograph.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide this page from Google",
      type: "boolean",
      initialValue: false,
      description: "Only tick this for pages you do not want found in search.",
    }),
  ],
});
