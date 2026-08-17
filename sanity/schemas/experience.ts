import { defineField, defineType } from "sanity";

export const experienceGroup = defineType({
  name: "experienceGroup",
  title: "Experience group",
  type: "document",
  description: "The four families experiences are sorted into.",
  fields: [
    defineField({
      name: "key",
      title: "Internal id",
      type: "string",
      readOnly: true,
      description: "Do not change.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "greek",
      title: "Greek word",
      type: "string",
      description: "Shown alongside the name. Example: Τραπέζι.",
    }),
    defineField({ name: "blurb", title: "One-line description", type: "localeText" }),
    defineField({
      name: "order",
      title: "Position",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.en", subtitle: "greek" },
  },
});

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title.en", maxLength: 60 },
      description: "Changing this breaks any existing link to this experience.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "group",
      title: "Which group",
      type: "reference",
      to: [{ type: "experienceGroup" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "One-line summary",
      type: "localeText",
      description: "Shown on the card. Keep it to a single sentence.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "localeBlocks",
      description: "One or more paragraphs, shown on the experience's own page.",
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "inkImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on the homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Position within its group",
      type: "number",
      initialValue: 100,
    }),
    defineField({ name: "seo", title: "Search engines", type: "seo" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.en", subtitle: "group.title.en", media: "image" },
  },
});

/** A landmark or place in and around Rethymno. */
export const place = defineType({
  name: "place",
  title: "Place in Rethymno",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "name.en", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "distance",
      title: "How far",
      type: "localeString",
      description: "Example: “A few minutes on foot”, “23 km east”.",
    }),
    defineField({ name: "body", title: "Description", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Photograph", type: "inkImage", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Position", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "distance.en", media: "image" } },
});

/** A chapter of the Rethymno destination story. */
export const chapter = defineType({
  name: "chapter",
  title: "Rethymno chapter",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Internal id",
      type: "string",
      readOnly: true,
      description: "Do not change.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Small label above the heading", type: "localeString" }),
    defineField({ name: "title", title: "Heading", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Paragraphs", type: "localeBlocks", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Photograph", type: "inkImage", validation: (r) => r.required() }),
    defineField({
      name: "notes",
      title: "Facts strip",
      type: "array",
      of: [{ type: "factPair" }],
      description: "Optional short facts shown under the text.",
    }),
    defineField({ name: "order", title: "Position", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "eyebrow.en", media: "image" } },
});

export const faq = defineType({
  name: "faq",
  title: "Frequently asked question",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Position", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.en", subtitle: "answer.en" } },
});
