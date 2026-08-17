"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import {
  localeNames,
  localePath,
  locales,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Language.
 *
 * A two-letter mark rather than a flag: flags are countries, not languages, and
 * a Union Jack for English is wrong for most of the people who read it. Each
 * language is written in its own script, because a German speaker is looking
 * for "Deutsch", not "German".
 *
 * Every option is a real <a> to the same page in the other language, so it is
 * crawlable, works without JavaScript, and keeps the reader where they were
 * instead of dumping them on a translated homepage.
 */
export function LanguageSwitcher({
  tone = "auto",
  className,
}: {
  tone?: "auto" | "light";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale, m } = useI18n();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { path } = stripLocale(pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  /* Remember the choice so a returning visitor is not sent back to English. */
  const remember = (next: Locale) => {
    try {
      document.cookie = `ink_locale=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* private mode — the URL still carries the locale */
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={m.common.chooseLanguage}
        className={cn(
          "label flex h-9 items-center gap-1.5 px-2 transition-opacity duration-300",
          tone === "light" ? "text-paper" : "",
          open ? "opacity-100" : "opacity-70 hover:opacity-100",
        )}
      >
        <span>{localeNames[locale].short}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
          className="block text-[0.8em] leading-none"
        >
          ⌄
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={m.common.language}
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] border border-[color:var(--border)] bg-[color:var(--bg-lift)] py-1 shadow-[0_12px_40px_-12px_rgb(26_21_18/0.35)]"
          >
            {locales.map((code) => {
              const active = code === locale;
              return (
                <li key={code} role="option" aria-selected={active}>
                  <Link
                    href={localePath(code, path)}
                    hrefLang={code}
                    onClick={() => remember(code)}
                    className={cn(
                      "flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors duration-200",
                      active
                        ? "text-[color:var(--fg)]"
                        : "text-[color:var(--fg-2)] hover:bg-[color:var(--bg)] hover:text-[color:var(--fg)]",
                    )}
                  >
                    <span lang={code}>{localeNames[code].native}</span>
                    <span className="flex items-center gap-2">
                      <span className="label text-[color:var(--fg-3)]">
                        {localeNames[code].short}
                      </span>
                      {active && (
                        <Check
                          className="h-3.5 w-3.5 text-[color:var(--link)]"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
