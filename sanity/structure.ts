import type { StructureResolver } from "sanity/structure";
import {
  HomeIcon,
  ImagesIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  StarIcon,
  PinIcon,
  HelpCircleIcon,
  BookIcon,
} from "@sanity/icons";

/**
 * What a member of hotel staff sees when they open the CMS.
 *
 * Sanity's default is a flat alphabetical list of every document type, which
 * for this site would be thirteen entries including things like "Gallery
 * category" and "Rethymno chapter" — accurate, and useless to a receptionist
 * looking for "the phone number".
 *
 * So the menu is written by hand, in the order someone actually works: the
 * pages of the website first, then the things that fill them, then settings.
 * Documents there can only ever be one of — the homepage, the gallery, the
 * contact details — open straight into the editor with no list in between.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ink Hotels")
    .items([
      /* ── The website, page by page ───────────────────────────────── */
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage")
            .title("Homepage"),
        ),

      S.listItem()
        .title("Rooms")
        .icon(StarIcon)
        .child(
          S.list()
            .title("Rooms")
            .items([
              S.listItem()
                .title("All rooms")
                .icon(StarIcon)
                .child(
                  S.documentTypeList("room")
                    .title("All rooms")
                    .defaultOrdering([{ field: "house.order", direction: "asc" }]),
                ),
              S.listItem()
                .title("The houses")
                .icon(BookIcon)
                .child(
                  S.documentTypeList("house")
                    .title("The houses")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.listItem()
        .title("Gallery")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Gallery")
            .items([
              S.listItem()
                .title("Photographs")
                .icon(ImagesIcon)
                .child(
                  S.document()
                    .schemaType("gallery")
                    .documentId("gallery")
                    .title("Gallery"),
                ),
              S.listItem()
                .title("Categories")
                .icon(CogIcon)
                .child(
                  S.documentTypeList("galleryCategory")
                    .title("Gallery categories")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.listItem()
        .title("Experiences")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Experiences")
            .items([
              S.listItem()
                .title("All experiences")
                .child(
                  S.documentTypeList("experience")
                    .title("All experiences")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Groups")
                .child(
                  S.documentTypeList("experienceGroup")
                    .title("Experience groups")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.listItem()
        .title("Rethymno")
        .icon(PinIcon)
        .child(
          S.list()
            .title("Rethymno")
            .items([
              S.listItem()
                .title("The story, chapter by chapter")
                .child(
                  S.documentTypeList("chapter")
                    .title("Chapters")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Places worth the walk")
                .child(
                  S.documentTypeList("place")
                    .title("Places")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.listItem()
        .title("Arrival")
        .icon(PinIcon)
        .child(
          S.document()
            .schemaType("arrivalPage")
            .documentId("arrivalPage")
            .title("Arrival"),
        ),

      S.listItem()
        .title("Frequently asked questions")
        .icon(HelpCircleIcon)
        .child(
          S.documentTypeList("faq")
            .title("Questions")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Other pages")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("simplePage").title("Other pages")),

      S.divider(),

      /* ── Settings ────────────────────────────────────────────────── */
      S.listItem()
        .title("Contact & settings")
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Contact & settings"),
        ),
    ]);

/**
 * Singletons must not be creatable or deletable — there is exactly one
 * homepage, and a second one is a support call waiting to happen.
 */
export const SINGLETONS = new Set([
  "homepage",
  "gallery",
  "siteSettings",
  "arrivalPage",
]);
