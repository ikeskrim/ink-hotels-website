import { defineField, defineType } from "sanity";

/**
 * The gallery.
 *
 * One document holding an ordered list, rather than one document per
 * photograph. That is the difference between "drag these two pictures to swap
 * them" and "open two documents and edit a number in each" — and reordering is
 * the thing a hotel does most often with a gallery.
 *
 * Categories live in their own document so a new one can be added without a
 * developer, and each photograph points at one.
 */

export const galleryCategory = defineType({
  name: "galleryCategory",
  title: "Gallery category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "localeString",
      description: "Shown as a filter button above the gallery.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Internal id",
      type: "slug",
      options: { source: "title.en", maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Position",
      type: "number",
      description: "Order of the filter buttons. Lower numbers first.",
      initialValue: 100,
    }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en" } },
});

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page heading",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "lede", title: "Opening line", type: "localeText" }),
    defineField({
      name: "coverImage",
      title: "Photograph at the top of the page",
      type: "inkImage",
    }),
    defineField({
      name: "items",
      title: "Photographs",
      type: "array",
      /* Grid layout so a hundred photographs are browsable, and drag-to-reorder
         is the obvious gesture rather than a hidden one. */
      options: { layout: "grid" },
      of: [
        defineField({
          name: "item",
          title: "Photograph",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Photograph",
              type: "inkImage",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "reference",
              to: [{ type: "galleryCategory" }],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { media: "image", title: "image.alt", subtitle: "category.title.en" },
          },
        }),
      ],
      description:
        "Drag to reorder. The order here is the order on the website. To remove a photograph, use the ⋮ menu on it.",
    }),
    defineField({ name: "seo", title: "Search engines", type: "seo" }),
  ],
  preview: {
    select: { title: "title.en", items: "items", media: "coverImage" },
    prepare: ({ title, items, media }) => ({
      title: title ?? "Gallery",
      subtitle: `${Array.isArray(items) ? items.length : 0} photographs`,
      media,
    }),
  },
});
