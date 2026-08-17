import { defineField, defineType } from "sanity";

/**
 * A room.
 *
 * Two fields here are wired to the outside world and must not be edited
 * casually: `bookingId` connects this room to the reservation system, and
 * `officialName` is the name the guest will see there. Both carry warnings in
 * the interface, and both sit in their own group away from everyday editing.
 */

export const house = defineType({
  name: "house",
  title: "House",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Internal id",
      type: "string",
      description: "Do not change. Links this house to the website's layout.",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "greek",
      title: "Greek form of the name",
      type: "string",
      description: "Only where there is one — Phos is written Φως. Leave empty otherwise.",
    }),
    defineField({ name: "subtitle", title: "One-line label", type: "localeString" }),
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({
      name: "coverImage",
      title: "Main photograph",
      type: "inkImage",
      description: "Used on the homepage and at the top of the rooms page.",
    }),
    defineField({
      name: "promise",
      title: "Homepage summary",
      type: "localeText",
      description: "The two lines shown under this house on the homepage.",
    }),
    defineField({
      name: "order",
      title: "Position",
      type: "number",
      description: "Lower numbers appear first.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    { title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name.en", subtitle: "subtitle.en", media: "coverImage" },
  },
});

export const room = defineType({
  name: "room",
  title: "Room",
  type: "document",
  groups: [
    { name: "content", title: "Room", default: true },
    { name: "photos", title: "Photographs" },
    { name: "specs", title: "Size & beds" },
    { name: "booking", title: "Booking system" },
    { name: "seo", title: "Search engines" },
  ],
  fields: [
    defineField({
      name: "displayName",
      title: "Name shown on the website",
      type: "localeString",
      group: "content",
      description: "Short and readable. Example: “Sea View with Balcony”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "content",
      options: { source: "displayName.en", maxLength: 60 },
      description:
        "The end of this room's link, e.g. /rooms/harmony. Changing it breaks any existing link to this room — only change it for a brand new room.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "house",
      title: "Which house",
      type: "reference",
      to: [{ type: "house" }],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Things a guest should know",
      type: "localeBlocks",
      group: "content",
      description:
        "Short honest notes shown under the description. Example: “Sea-facing rooms sit closest to the cafés and can be lively.”",
    }),
    defineField({
      name: "amenities",
      title: "What is in the room",
      type: "array",
      of: [{ type: "localeString" }],
      group: "content",
      description: "One per line. Air conditioning, free Wi-Fi, safe, and so on.",
    }),
    defineField({
      name: "featured",
      title: "Show on the homepage",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),

    defineField({
      name: "images",
      title: "Photographs",
      type: "array",
      of: [{ type: "inkImage" }],
      group: "photos",
      description:
        "The first photograph is the one used on cards and in search results. Drag to reorder.",
      validation: (rule) => rule.required().min(1),
      options: { layout: "grid" },
    }),

    defineField({
      name: "sizeSqm",
      title: "Size in square metres",
      type: "number",
      group: "specs",
      description: "Leave empty if the property does not publish a figure.",
    }),
    defineField({ name: "guests", title: "Sleeps comfortably", type: "number", group: "specs" }),
    defineField({
      name: "maxGuests",
      title: "Maximum guests",
      type: "number",
      group: "specs",
      description: "Only if higher than the number above.",
    }),
    defineField({
      name: "beds",
      title: "Beds",
      type: "array",
      of: [{ type: "bed" }],
      group: "specs",
    }),
    defineField({ name: "outlook", title: "What it looks onto", type: "localeString", group: "specs" }),
    defineField({ name: "outdoor", title: "Outdoor space", type: "localeString", group: "specs" }),
    defineField({ name: "level", title: "Floor", type: "localeString", group: "specs" }),
    defineField({
      name: "renovated",
      title: "Last renovated",
      type: "string",
      group: "specs",
      description: "Example: “May 2020”.",
    }),

    defineField({
      name: "bookingId",
      title: "Reservation system id",
      type: "string",
      group: "booking",
      description:
        "⚠️ Do not change unless the reservation system has been reconfigured. This number is how a guest ends up on the right room when they click Book now.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "officialName",
      title: "Name in the reservation system",
      type: "string",
      group: "booking",
      description:
        "⚠️ Must match the reservation system exactly, including any odd spacing. It is shown at checkout so a guest can see they are booking the room they chose.",
      validation: (rule) => rule.required(),
    }),

    defineField({ name: "seo", title: "Search engines", type: "seo", group: "seo" }),
  ],
  preview: {
    select: {
      title: "displayName.en",
      house: "house.name.en",
      size: "sizeSqm",
      media: "images.0",
    },
    prepare: ({ title, house, size, media }) => ({
      title: title ?? "Untitled room",
      subtitle: [house, size ? `${size} m²` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
