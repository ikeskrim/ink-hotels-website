import type { SchemaTypeDefinition } from "sanity";

import { localeString, localeText, localeBlocks } from "./locale";
import { inkImage, bed, factPair, step, seo } from "./objects";
import { house, room } from "./room";
import {
  experience,
  experienceGroup,
  place,
  chapter,
  faq,
} from "./experience";
import { gallery, galleryCategory } from "./gallery";
import { homepage } from "./homepage";
import { siteSettings, arrivalPage, simplePage } from "./settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  /* Building blocks */
  localeString,
  localeText,
  localeBlocks,
  inkImage,
  bed,
  factPair,
  step,
  seo,

  /* Documents */
  homepage,
  house,
  room,
  experienceGroup,
  experience,
  gallery,
  galleryCategory,
  place,
  chapter,
  faq,
  arrivalPage,
  simplePage,
  siteSettings,
];
