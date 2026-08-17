import { defineField, defineType } from "sanity";

/**
 * Contact details and site-wide settings.
 *
 * The four building addresses are a list rather than one field, because this
 * hotel genuinely occupies four buildings and collapsing them into one address
 * is the mistake the previous website made. Exactly one of them is the
 * reception, and that is enforced.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact & settings",
  type: "document",
  groups: [
    { name: "contact", title: "Phone & email", default: true },
    { name: "addresses", title: "Addresses" },
    { name: "social", title: "Social & booking" },
    { name: "legal", title: "Legal" },
    { name: "seo", title: "Search engines" },
  ],
  fields: [
    /* ── Phone & email ───────────────────────────────────────────────── */
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      group: "contact",
      of: [
        defineField({
          name: "phone",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "localeString", validation: (r) => r.required() }),
            defineField({
              name: "value",
              title: "Number as written",
              type: "string",
              description: "Spaced for reading, e.g. +30 211 444 5757",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Number for dialling",
              type: "string",
              description: "No spaces, with country code, e.g. +302114445757",
              validation: (rule) =>
                rule.required().custom((v?: string) =>
                  v && /^\+\d{6,15}$/.test(v)
                    ? true
                    : "Use the international form with no spaces, e.g. +302114445757",
                ),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label.en" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "internationalOffices",
      title: "Offices outside Greece",
      type: "array",
      group: "contact",
      of: [
        defineField({
          name: "office",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Country", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Number as written", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Number for dialling", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "emailGeneral",
      title: "Main email address",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "emailReservations",
      title: "Reservations email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "emailCareers",
      title: "Careers email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),

    /* ── Addresses ───────────────────────────────────────────────────── */
    defineField({
      name: "buildings",
      title: "The buildings",
      type: "array",
      group: "addresses",
      description:
        "Every building the hotel occupies. Tick “This is the reception” on exactly one — that is the address guests are given for arrival.",
      of: [
        defineField({
          name: "building",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "street", title: "Street address", type: "string", validation: (r) => r.required() }),
            defineField({ name: "isReception", title: "This is the reception", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { title: "street", label: "label.en", reception: "isReception" },
            prepare: ({ title, label, reception }) => ({
              title,
              subtitle: [label, reception ? "· Reception" : null].filter(Boolean).join(" "),
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule.required().custom((buildings?: { isReception?: boolean }[]) => {
          const n = (buildings ?? []).filter((b) => b?.isReception).length;
          if (n === 0) return "Tick “This is the reception” on one building.";
          if (n > 1) return "Only one building can be the reception.";
          return true;
        }),
    }),
    defineField({ name: "locality", title: "Town", type: "string", group: "addresses", initialValue: "Rethymno" }),
    defineField({ name: "postalCode", title: "Postcode", type: "string", group: "addresses" }),
    defineField({
      name: "coordinates",
      title: "Map position",
      type: "geopoint",
      group: "addresses",
      description: "Drag the pin to where guests should arrive.",
    }),

    /* ── Social & booking ────────────────────────────────────────────── */
    defineField({
      name: "bookingUrl",
      title: "Reservation system address",
      type: "url",
      group: "social",
      description: "⚠️ Every “Book now” button on the site sends guests here.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "instagram", title: "Instagram", type: "url", group: "social" }),
    defineField({ name: "facebook", title: "Facebook", type: "url", group: "social" }),
    defineField({
      name: "groupName",
      title: "Parent company name",
      type: "string",
      group: "social",
      initialValue: "Crete Holiday Home",
    }),
    defineField({ name: "groupUrl", title: "Parent company website", type: "url", group: "social" }),

    /* ── Legal ───────────────────────────────────────────────────────── */
    defineField({
      name: "gntoLicence",
      title: "Tourism licence number",
      type: "string",
      group: "legal",
      description: "Greek National Tourism Organisation. Shown in the footer, required by law.",
    }),
    defineField({ name: "vat", title: "VAT number", type: "string", group: "legal" }),

    /* ── SEO ─────────────────────────────────────────────────────────── */
    defineField({
      name: "defaultSeo",
      title: "Default search-engine settings",
      type: "seo",
      group: "seo",
      description: "Used for any page that has not set its own.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact & settings" }) },
});

/** The arrival page. */
export const arrivalPage = defineType({
  name: "arrivalPage",
  title: "Arrival",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Heading", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "lede", title: "Opening paragraph", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "heroImage", title: "Photograph at the top", type: "inkImage" }),
    defineField({ name: "receptionLabel", title: "Label above the address", type: "localeString" }),
    defineField({
      name: "receptionHeading",
      title: "The reception address",
      type: "string",
      description: "Shown large. This is a street address, so it is not translated.",
    }),
    defineField({ name: "receptionBody", title: "Paragraphs about the reception", type: "localeBlocks" }),
    defineField({ name: "receptionImage", title: "Photograph beside it", type: "inkImage" }),
    defineField({
      name: "steps",
      title: "The journey, step by step",
      type: "array",
      of: [{ type: "step" }],
      description: "Drag to reorder.",
    }),
    defineField({
      name: "facts",
      title: "Worth knowing",
      type: "array",
      of: [{ type: "factPair" }],
    }),
    defineField({ name: "closingHeading", title: "Closing heading", type: "localeString" }),
    defineField({ name: "closingBody", title: "Closing paragraph", type: "localeText" }),
    defineField({ name: "seo", title: "Search engines", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Arrival" }) },
});

/** Simple pages that are mostly a heading, a lede and a photograph. */
export const simplePage = defineType({
  name: "simplePage",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Which page",
      type: "string",
      readOnly: true,
      description: "Do not change.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Small label", type: "localeString" }),
    defineField({ name: "title", title: "Heading", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "lede", title: "Opening paragraph", type: "localeText" }),
    defineField({ name: "heroImage", title: "Photograph at the top", type: "inkImage" }),
    defineField({ name: "seo", title: "Search engines", type: "seo" }),
  ],
  preview: { select: { title: "title.en", subtitle: "key", media: "heroImage" } },
});
