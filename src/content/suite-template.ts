/**
 * The Stage 6.1 suite template, behind a flag, migrated one suite at a time.
 *
 * An empty list means every room page renders exactly what it renders today —
 * not "mostly today's page", not "today's page with a small change": the route
 * returns before the new template is even constructed. That is the point of
 * building it this way. A rebuild of the twenty pages that carry every booking
 * on the site is not something to swap in wholesale and hope, and it is
 * certainly not something to leave half-swapped if a session ends early.
 *
 * To migrate a suite: measure it first — axe clean, Lighthouse at or above the
 * route's floor on a fresh build — then add its slug here. To roll one back:
 * delete the slug. There is no build step and no environment variable, so the
 * state of the rollout is legible in a diff and revertible in one line.
 *
 * Inventory is frozen: this list may only ever contain slugs that already
 * exist in `rooms.ts`. It never adds a room, renames one, or changes a count.
 */
export const SUITE_TEMPLATE_SLUGS: readonly string[] = [
  "evexia",
  "harmony",
  "agapi",
  "pathos",
  "elpida",
  "eros",
  "zoi",
  "sea-view-balcony-house-of-europe",
  "sea-view-house-of-europe",
  "side-sea-view-balcony-house-of-europe",
  "balcony-house-of-europe",
  "standard-house-of-europe",
  "two-bedroom-apartment-house-of-europe",
  "room-with-terrace-phos",
  "superior-room-with-balcony-phos",
  "superior-balcony-phos",
  "standard-phos",
  "triple-phos",
  "quadruple-phos",
  "residence-of-the-old-port",
];

export function usesSuiteTemplate(slug: string): boolean {
  return SUITE_TEMPLATE_SLUGS.includes(slug);
}
