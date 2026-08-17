"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";
import { structure, SINGLETONS } from "./sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { locales, localeNames } from "./src/i18n/config";

/**
 * Sanity Studio, embedded in the site at /studio.
 *
 * Embedded rather than deployed separately so staff reach it at
 * inkhotels.gr/studio with the same login, and so a schema change ships with
 * the deploy that needs it instead of drifting behind.
 */
export default defineConfig({
  name: "ink-hotels",
  title: "Ink Hotels",
  basePath: studioBasePath,
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    /* Vision is the raw query console — useful for us, meaningless to staff,
       so it is only present outside production. */
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],

  schema: {
    types: schemaTypes,
    /* Hide singletons from the global "create new" button. There is one
       homepage; the menu is the only way in. */
    templates: (prev) => prev.filter((t) => !SINGLETONS.has(t.schemaType)),
  },

  document: {
    /* Remove delete/duplicate from documents there can only be one of. */
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action && !["delete", "duplicate", "unpublish"].includes(action),
          )
        : prev,
  },

  /* A note in the Studio itself about what the language tabs mean, so nobody
     has to be told twice. */
  form: {
    components: {},
  },

  tools: (prev) => prev,

  /* Shown in the Studio's own header. */
  studio: {
    components: {},
  },

  /** Exposed for documentation; the front end reads locales from src/i18n. */
  __internal_languages: locales.map((l) => ({
    id: l,
    title: localeNames[l].english,
  })),
} as Parameters<typeof defineConfig>[0]);
