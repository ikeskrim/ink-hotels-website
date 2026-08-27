import type { Locale } from "@/i18n/config";

/**
 * The separator a locale puts between the hours and the minutes.
 *
 * French copy on this site writes 23h00 for the reception hours, so a check-in
 * rendered 16:00 beside it reads like a different hand wrote it. Everything
 * else here uses the colon. The times themselves stay in one place — see
 * `stay` in content/site.ts — and this only decides how they are punctuated.
 */
export function timeSep(locale: Locale): string {
  return locale === "fr" ? "h" : ":";
}
