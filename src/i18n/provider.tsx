"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultLocale, type Locale } from "./config";
import { en } from "./messages/en";
import { fill, plural, type Messages } from "./index";

/**
 * Locale context for client components.
 *
 * Server components read messages directly from `getMessages(locale)` — no
 * context, no provider cost. This exists only for the handful of components
 * that are genuinely interactive: the header, the booking form, the concierge,
 * the gallery lightbox.
 */

interface I18nValue {
  locale: Locale;
  m: Messages;
  /** Fill placeholders in an already-resolved string. */
  t: (template: string, values?: Record<string, string | number>) => string;
  /** Plural-aware lookup within a message group. */
  p: (
    group: Record<string, string>,
    base: string,
    count: number,
  ) => string;
}

const I18nContext = createContext<I18nValue>({
  locale: defaultLocale,
  m: en,
  t: fill,
  p: (group, base, count) => plural(group, base, count, defaultLocale),
});

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value: I18nValue = {
    locale,
    m: messages,
    t: fill,
    p: (group, base, count) => plural(group, base, count, locale),
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
