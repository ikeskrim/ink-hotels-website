import { groq } from "next-sanity";

/**
 * GROQ queries.
 *
 * Each projects exactly the fields the front end uses. Sanity will happily
 * return whole documents, but a hero that ships five languages of every field
 * to fetch one is the sort of waste that shows up as a slower page.
 *
 * Localised values come back whole (all five languages) because the resolver
 * needs the English to fall back to. They are small.
 */

const IMAGE = groq`{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  alt,
  caption,
  hotspot,
  crop
}`;

const SEO = groq`{ title, description, "image": image${IMAGE}, noIndex }`;

export const homepageQuery = groq`*[_type == "homepage"][0]{
  "heroImages": heroImages[]${IMAGE},
  heroEyebrow, heroTitleLine1, heroTitleLine2, heroLede,
  pressEyebrow, pressTitle, pressLede, pressImprint, pressBody1, pressBody2, pressPull,
  markEyebrow, markTitle, markBody1, markBody2,
  lightEyebrow, "lightImage": lightImage${IMAGE}, lightBody1, lightBody2, lightSpec,
  settingEyebrow, settingTitle, settingBody1, settingBody2,
  "settingImageTall": settingImageTall${IMAGE},
  "settingImageWide": settingImageWide${IMAGE},
  roomsEyebrow, roomsTitle, roomsLede,
  "featuredRooms": featuredRooms[]->{ "slug": slug.current },
  waterEyebrow, waterTitle, waterBody, waterSpec, "waterImage": waterImage${IMAGE},
  agapiTitle, agapiBody1, agapiBody2, "agapiImage": agapiImage${IMAGE},
  stayingEyebrow, stayingTitle, stayingLede,
  familyTitle, familyBody1, familyBody2, "familyImage": familyImage${IMAGE},
  factsTitle, facts[]{ term, def }, datesTitle,
  "seo": seo${SEO}
}`;

export const housesQuery = groq`*[_type == "house"] | order(order asc){
  "id": key,
  name, greek, subtitle, intro, promise, order,
  "coverImage": coverImage${IMAGE}
}`;

export const roomsQuery = groq`*[_type == "room"] | order(house->order asc, coalesce(sizeSqm, 0) desc){
  "slug": slug.current,
  "id": bookingId,
  "name": officialName,
  displayName, description, notes, amenities,
  "house": house->key,
  sizeSqm, guests, maxGuests,
  beds[]{ label, count },
  outlook, outdoor, level, renovated, featured,
  "images": images[]${IMAGE},
  "seo": seo${SEO}
}`;

export const roomBySlugQuery = groq`*[_type == "room" && slug.current == $slug][0]{
  "slug": slug.current,
  "id": bookingId,
  "name": officialName,
  displayName, description, notes, amenities,
  "house": house->key,
  sizeSqm, guests, maxGuests,
  beds[]{ label, count },
  outlook, outdoor, level, renovated, featured,
  "images": images[]${IMAGE},
  "seo": seo${SEO}
}`;

export const experienceGroupsQuery = groq`*[_type == "experienceGroup"] | order(order asc){
  "id": key, title, greek, blurb, order
}`;

export const experiencesQuery = groq`*[_type == "experience"] | order(order asc){
  "slug": slug.current,
  title, summary, body, featured,
  "category": group->key,
  "image": image${IMAGE},
  "seo": seo${SEO}
}`;

export const galleryQuery = groq`*[_type == "gallery"][0]{
  title, lede,
  "coverImage": coverImage${IMAGE},
  "items": items[]{
    "image": image${IMAGE},
    "category": category->slug.current
  },
  "categories": *[_type == "galleryCategory"] | order(order asc){
    "id": slug.current, title
  },
  "seo": seo${SEO}
}`;

export const placesQuery = groq`*[_type == "place"] | order(order asc){
  "slug": slug.current,
  name, distance, body,
  "image": image${IMAGE}
}`;

export const chaptersQuery = groq`*[_type == "chapter"] | order(order asc){
  "id": key, eyebrow, title, body,
  "image": image${IMAGE},
  notes[]{ term, def }
}`;

export const faqsQuery = groq`*[_type == "faq"] | order(order asc){ question, answer }`;

export const arrivalQuery = groq`*[_type == "arrivalPage"][0]{
  title, lede,
  "heroImage": heroImage${IMAGE},
  receptionLabel, receptionHeading, receptionBody,
  "receptionImage": receptionImage${IMAGE},
  steps[]{ title, body },
  facts[]{ term, def },
  closingHeading, closingBody,
  "seo": seo${SEO}
}`;

export const settingsQuery = groq`*[_type == "siteSettings"][0]{
  phones[]{ label, value, href },
  internationalOffices[]{ label, value, href },
  emailGeneral, emailReservations, emailCareers,
  buildings[]{ label, street, isReception },
  locality, postalCode, coordinates,
  bookingUrl, instagram, facebook, groupName, groupUrl,
  gntoLicence, vat,
  "defaultSeo": defaultSeo${SEO}
}`;

export const simplePageQuery = groq`*[_type == "simplePage" && key == $key][0]{
  key, eyebrow, title, lede,
  "heroImage": heroImage${IMAGE},
  "seo": seo${SEO}
}`;
