"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { EASE } from "@/components/motion/reveal";
import { localeTags, type Locale } from "@/i18n/config";

/**
 * A date field that speaks the site's language.
 *
 * `<input type="date">` renders its placeholder, its month names and its
 * picker in the *browser's* locale, not the page's — so a Greek page opened in
 * a US Chrome showed MM/DD/YYYY and "January". There is no attribute that
 * changes this. The only way to honour the language the guest chose is to draw
 * the calendar ourselves.
 *
 * Everything localised here comes from `Intl`, not from a table of month names
 * we would have to maintain in five languages: month and weekday names, the
 * first day of the week, and the field's own display format are all derived
 * from the locale at runtime. Adding a sixth language needs no work here.
 *
 * Accessibility: a real button opens a real dialog; the grid is a `grid` with
 * `gridcell`s; arrow keys move by day, PageUp/PageDown by month, Home/End to
 * the ends of the week; Escape closes and returns focus. The selected date is
 * announced. A visually hidden native date input carries the value for form
 * submission and for anyone who prefers to type.
 */

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function iso(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function fromIso(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/**
 * The placeholder pattern a guest expects, derived from the locale rather than
 * hard-coded: el → ΗΗ/ΜΜ/ΕΕΕΕ, de → TT.MM.JJJJ, fr → JJ/MM/AAAA, nl → DD-MM-JJJJ.
 */
const PATTERN: Record<Locale, string> = {
  en: "DD/MM/YYYY",
  el: "ΗΗ/ΜΜ/ΕΕΕΕ",
  de: "TT.MM.JJJJ",
  fr: "JJ/MM/AAAA",
  nl: "DD-MM-JJJJ",
};

/** Which weekday a calendar starts on. Sunday only in a few locales. */
function firstDayOfWeek(locale: Locale): number {
  try {
    /* The full BCP-47 tag, not the bare language: `en` resolves to the US
       convention and starts the week on Sunday, while this site is en-GB and
       starts it on Monday. */
    const l = new Intl.Locale(localeTags[locale]) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = l.getWeekInfo?.() ?? l.weekInfo;
    /* Intl reports 1=Monday…7=Sunday; JS getDay() is 0=Sunday. */
    if (info?.firstDay) return info.firstDay % 7;
  } catch {
    /* older engines */
  }
  return 1;
}

export function DateField({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  tone = "dark",
  required,
}: {
  id?: string;
  name?: string;
  label: string;
  /** ISO yyyy-mm-dd. */
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  max?: string;
  tone?: "light" | "dark";
  required?: boolean;
}) {
  const { locale, m } = useI18n();
  const reduced = useReducedMotion();
  const auto = useId();
  const fieldId = id ?? auto;

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<Date>(() => fromIso(value) ?? new Date());
  const [focused, setFocused] = useState<Date>(() => fromIso(value) ?? startOfDay(new Date()));

  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const light = tone === "light";
  const selected = useMemo(() => fromIso(value), [value]);
  const minDate = useMemo(() => fromIso(min ?? ""), [min]);
  const maxDate = useMemo(() => fromIso(max ?? ""), [max]);

  const longDate = useMemo(
    () =>
      new Intl.DateTimeFormat(localeTags[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );
  const shortDate = useMemo(
    () =>
      new Intl.DateTimeFormat(localeTags[locale], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [locale],
  );
  const monthYear = useMemo(
    () => new Intl.DateTimeFormat(localeTags[locale], { month: "long", year: "numeric" }),
    [locale],
  );

  /* Weekday initials in the right order for this locale. */
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(localeTags[locale], { weekday: "short" });
    const long = new Intl.DateTimeFormat(localeTags[locale], { weekday: "long" });
    const start = firstDayOfWeek(locale);
    /* 2024-01-07 was a Sunday. */
    const sunday = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday.getTime() + ((start + i) % 7) * 86400000);
      return { short: fmt.format(d), long: long.format(d) };
    });
  }, [locale]);

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = firstDayOfWeek(locale);
    const lead = (first.getDay() - start + 7) % 7;
    const gridStart = new Date(year, month, 1 - lead);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart.getTime() + i * 86400000);
      return {
        date: d,
        outside: d.getMonth() !== month,
        disabled:
          (minDate ? d < minDate : false) || (maxDate ? d > maxDate : false),
      };
    });
  }, [cursor, locale, minDate, maxDate]);

  const close = useCallback(
    (restore = true) => {
      setOpen(false);
      if (restore) requestAnimationFrame(() => trigger.current?.focus());
    },
    [],
  );

  const pick = useCallback(
    (d: Date) => {
      onChange(iso(d));
      close();
    },
    [onChange, close],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      const step = (days: number) => {
        e.preventDefault();
        setFocused((f) => {
          const next = new Date(f.getTime() + days * 86400000);
          if (next.getMonth() !== cursor.getMonth()) setCursor(next);
          return next;
        });
      };
      const months = (n: number) => {
        e.preventDefault();
        setFocused((f) => {
          const next = new Date(f.getFullYear(), f.getMonth() + n, f.getDate());
          setCursor(next);
          return next;
        });
      };
      switch (e.key) {
        case "ArrowRight": step(1); break;
        case "ArrowLeft": step(-1); break;
        case "ArrowDown": step(7); break;
        case "ArrowUp": step(-7); break;
        case "PageDown": months(1); break;
        case "PageUp": months(-1); break;
        case "Home": step(-((focused.getDay() - firstDayOfWeek(locale) + 7) % 7)); break;
        case "End": step(6 - ((focused.getDay() - firstDayOfWeek(locale) + 7) % 7)); break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!(minDate && focused < minDate) && !(maxDate && focused > maxDate)) {
            pick(focused);
          }
          break;
        default:
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !panel.current?.contains(e.target as Node) &&
        !trigger.current?.contains(e.target as Node)
      ) {
        close(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, cursor, focused, locale, minDate, maxDate, pick, close]);

  const today = startOfDay(new Date());

  return (
    <div className="relative">
      <label htmlFor={fieldId} className={cn("label mb-0.5 block", light ? "text-paper/60" : "text-stone")}>
        {label}
      </label>

      {/* The value the reservation engine reads. Hidden, not absent — the form
          still submits without JavaScript, and a screen reader still gets a
          real labelled input. */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        readOnly
      />

      <button
        ref={trigger}
        id={fieldId}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          const d = fromIso(value) ?? today;
          setCursor(d);
          setFocused(d);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 border-0 border-b-[1.5px] bg-transparent pb-1 pt-1.5 text-left text-[0.9375rem]",
          "transition-[border-color,color] duration-300 ease-settle focus-visible:outline-none",
          light
            ? "border-paper/30 text-paper hover:border-paper/60"
            : "border-ink/20 text-ink hover:border-ink/45",
          open && (light ? "border-sea-light" : "border-sea"),
          !value && (light ? "text-paper/55" : "text-stone"),
        )}
      >
        <span className={cn(!value && "spec tracking-[0.06em]")}>
          {selected ? longDate.format(selected) : PATTERN[locale]}
        </span>
        <span aria-hidden="true" className={cn("text-[0.75em]", light ? "text-paper/50" : "text-stone")}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="false"
            aria-label={label}
            data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
            className={cn(
              "absolute left-0 top-full z-50 mt-3 w-[19.5rem] max-w-[calc(100vw-3rem)] p-4",
              "border shadow-[0_18px_50px_-16px_rgb(26_21_18/0.45)]",
              light
                ? "border-paper/20 bg-ink text-paper"
                : "border-[color:var(--border)] bg-[color:var(--bg-lift)] text-[color:var(--fg)]",
            )}
          >
            {/* ── Month ─────────────────────────────────────────────── */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
                }
                aria-label={m.booking.previousMonth}
                className="flex h-8 w-8 items-center justify-center opacity-65 transition-opacity hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <p
                aria-live="polite"
                className="font-display text-lg capitalize leading-none"
              >
                {monthYear.format(cursor)}
              </p>

              <button
                type="button"
                onClick={() =>
                  setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
                }
                aria-label={m.booking.nextMonth}
                className="flex h-8 w-8 items-center justify-center opacity-65 transition-opacity hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Grid ──────────────────────────────────────────────── */}
            <div role="grid" className="grid grid-cols-7 gap-y-0.5">
              {weekdays.map((w) => (
                <abbr
                  key={w.long}
                  title={w.long}
                  role="columnheader"
                  className="label pb-2 text-center text-[0.5625rem] no-underline opacity-50"
                >
                  {w.short.slice(0, 2)}
                </abbr>
              ))}

              {days.map(({ date, outside, disabled }) => {
                const isSelected = selected != null && iso(date) === iso(selected);
                const isToday = iso(date) === iso(today);
                const isFocused = iso(date) === iso(focused);
                return (
                  <button
                    key={date.getTime()}
                    type="button"
                    role="gridcell"
                    tabIndex={isFocused ? 0 : -1}
                    disabled={disabled}
                    aria-selected={isSelected}
                    aria-label={longDate.format(date)}
                    onClick={() => pick(date)}
                    onFocus={() => setFocused(date)}
                    className={cn(
                      "relative flex h-9 items-center justify-center text-[0.8125rem] tabular-nums",
                      "transition-colors duration-200",
                      disabled && "cursor-not-allowed opacity-25",
                      !disabled && outside && "opacity-35",
                      !disabled && !isSelected && "hover:bg-current/10",
                      isSelected &&
                        (light
                          ? "bg-sea-light font-medium text-ink"
                          : "bg-sea font-medium text-paper"),
                    )}
                  >
                    {date.getDate()}
                    {isToday && !isSelected && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1.5 h-[3px] w-[3px] rounded-full",
                          light ? "bg-sea-light" : "bg-sea",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <p className={cn("spec mt-3 border-t pt-3 text-center opacity-55", light ? "border-paper/15" : "border-[color:var(--hairline)]")}>
              {shortDate.format(focused)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
