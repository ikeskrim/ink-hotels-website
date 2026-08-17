import { defineField, defineType } from "sanity";

import { localeNames, locales, defaultLocale } from "../../src/i18n/config";

/**
 * Localised fields.
 *
 * One object per translatable value, with a field per language. Sanity has
 * document-level i18n plugins, but they duplicate the whole document per
 * language — which for this site would mean five copies of every room, five
 * chances for a photograph or a square-metre figure to drift out of sync, and
 * five documents for a receptionist to remember to update.
 *
 * Field-level keeps one room, one set of photographs, one set of numbers, and
 * five boxes of words. The other languages sit behind a second tab, so the
 * everyday editing experience is a single English box.
 *
 * English is required. The others are optional and fall back to it, matching
 * exactly what the front end does — so a half-finished translation degrades to
 * English rather than to a blank page.
 */

const GROUPS = [
  { name: "primary", title: "English", default: true },
  { name: "translations", title: "Other languages" },
];

const groupFor = (code: string) =>
  code === defaultLocale ? "primary" : "translations";

const isPrimary = (code: string) => code === defaultLocale;

export const localeString = defineType({
  name: "localeString",
  title: "Text",
  type: "object",
  groups: GROUPS,
  fields: locales.map((code) =>
    defineField({
      name: code,
      title: localeNames[code].english,
      type: "string",
      group: groupFor(code),
      validation: (rule) => (isPrimary(code) ? rule.required() : rule),
    }),
  ),
  options: { collapsible: true, collapsed: false },
  preview: {
    select: { title: defaultLocale },
    prepare: ({ title }) => ({ title: title || "— empty —" }),
  },
});

export const localeText = defineType({
  name: "localeText",
  title: "Paragraph",
  type: "object",
  groups: GROUPS,
  fields: locales.map((code) =>
    defineField({
      name: code,
      title: localeNames[code].english,
      type: "text",
      rows: 4,
      group: groupFor(code),
      validation: (rule) => (isPrimary(code) ? rule.required() : rule),
    }),
  ),
  options: { collapsible: true, collapsed: false },
  preview: {
    select: { title: defaultLocale },
    prepare: ({ title }) => ({
      title: title ? `${String(title).slice(0, 60)}…` : "— empty —",
    }),
  },
});

/** Several paragraphs, translatable. Each language holds its own list. */
export const localeBlocks = defineType({
  name: "localeBlocks",
  title: "Paragraphs",
  type: "object",
  groups: GROUPS,
  fields: locales.map((code) =>
    defineField({
      name: code,
      title: localeNames[code].english,
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: groupFor(code),
      validation: (rule) => (isPrimary(code) ? rule.required().min(1) : rule),
    }),
  ),
  options: { collapsible: true, collapsed: false },
  preview: {
    select: { blocks: defaultLocale },
    prepare: ({ blocks }) => {
      const list = Array.isArray(blocks) ? (blocks as string[]) : [];
      return {
        title: list.length ? `${String(list[0]).slice(0, 55)}…` : "— empty —",
        subtitle: `${list.length} paragraph${list.length === 1 ? "" : "s"}`,
      };
    },
  },
});
