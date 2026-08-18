"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ReserveLink } from "@/components/booking/reserve-link";
import { contact, nav } from "@/content/site";
import { houses, roomsInHouse } from "@/content/rooms";
import { experienceGroups } from "@/content/experiences";
import { Wordmark } from "@/components/layout/wordmark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/i18n/provider";
import { label } from "@/i18n/labels";
import { localePath, stripLocale } from "@/i18n/config";
import { EASE } from "@/components/motion/reveal";

/**
 * The header is transparent while it sits over a hero, and inks in once the
 * hero has passed. It also retreats when the reader scrolls down and returns
 * the moment they scroll up — so the booking action is never more than a
 * flick away, without the bar squatting over the photography.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { locale, m } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<"rooms" | "experiences" | null>(null);
  const lastY = useRef(0);
  const reduced = useReducedMotion();

  /* Compared against the canonical path so the locale prefix does not change
     which pages are treated as having a full-bleed hero. */
  const path = stripLocale(pathname).path;

  /* Pages that open with a full-bleed hero want a transparent bar to begin
     with — and ONLY those. Over photography the lockup goes white; over the
     paper ground it must not. The detail pages under /rooms/ and
     /experiences/ were on this list and open on paper, so the mark was drawn
     in cream on cream and all but vanished. If a page is added here it must
     genuinely start with a photograph behind the bar. */
  const overHero =
    path === "/" ||
    path === "/gallery" ||
    path === "/location" ||
    path === "/rethymno" ||
    path === "/arrival" ||
    path === "/experiences" ||
    path === "/rooms";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 560 && y > lastY.current && !menuOpen && !openPanel);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, openPanel]);

  /* Close everything on navigation. */
  useEffect(() => {
    setMenuOpen(false);
    setOpenPanel(null);
  }, [pathname]);

  /* Lock the page behind the mobile menu, and close on Escape. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setOpenPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const inked = scrolled || !overHero || openPanel !== null;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100]",
          "transition-[background-color,border-color,color] duration-700 ease-settle",
          inked
            ? "border-b border-ink/10 bg-paper/92 text-ink backdrop-blur-xl"
            : "border-b border-transparent bg-transparent text-paper",
        )}
        onMouseLeave={() => setOpenPanel(null)}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1680px] items-center justify-between gap-6 px-6 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href={localePath(locale, "/")}
            aria-label={`Ink Hotels — ${m.nav.home}`}
            className="group relative z-10 shrink-0 py-2"
          >
            <Wordmark
              compact
              /* Over photography the whole lockup goes white, as the physical
                 sign does; on the inked bar the mark returns to brand teal. */
              markColor={inked ? "brand" : "inherit"}
              className={cn(
                "h-6 w-auto transition-[filter,opacity] duration-700 ease-settle lg:h-7",
                /* Over photography the mark needs its own shadow to hold an
                   edge; on the inked bar it must not have one. */
                inked
                  ? "drop-shadow-none"
                  : "[filter:drop-shadow(0_1px_10px_rgb(26_21_18/0.55))]",
                "group-hover:opacity-80",
              )}
            />
          </Link>

          {/* ── Desktop navigation ─────────────────────────────────────── */}
          <nav
            aria-label={m.common.navPrimary}
            className="hidden items-center gap-8 lg:flex xl:gap-10"
          >
            {nav.map((item) => {
              const hasPanel =
                item.href === "/rooms" || item.href === "/experiences";
              const key = item.href === "/rooms" ? "rooms" : "experiences";
              const active =
                stripLocale(pathname).path === item.href ||
                stripLocale(pathname).path.startsWith(`${item.href}/`);

              return (
                <div
                  key={item.href}
                  onMouseEnter={() =>
                    setOpenPanel(hasPanel ? (key as "rooms" | "experiences") : null)
                  }
                >
                  <Link
                    href={localePath(locale, item.href)}
                    aria-expanded={hasPanel ? openPanel === key : undefined}
                    className={cn(
                      "label relative py-2 transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    {m.nav[item.key]}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current",
                        "transition-transform duration-500 ease-settle",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:gap-4">
            <LanguageSwitcher className="hidden sm:block" />
            {/* The booking action. Always filled, never an outline — an
                outlined CTA on photography reads as secondary, and this is the
                most important control on the site. The brass fill carries the
                brand warmth and separates it from every other link. */}
            <ReserveLink
              className={cn(
                "label group/cta relative hidden h-12 items-center gap-2.5 overflow-hidden px-7 sm:inline-flex",
                "bg-sea text-paper shadow-[0_2px_18px_-6px_rgb(26_21_18/0.5)]",
                "transition-[transform,box-shadow] duration-500 ease-settle",
                "hover:-translate-y-px hover:shadow-[0_6px_26px_-8px_rgb(26_21_18/0.55)]",
              )}
            >
              {/* A warm sweep crosses the button on hover — one transform. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper-lit/70 to-transparent transition-transform duration-[900ms] ease-settle group-hover/cta:translate-x-full"
              />
              <span className="relative">{m.actions.bookNow}</span>
              <ArrowUpRight
                className="relative h-3.5 w-3.5 transition-transform duration-500 ease-settle group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </ReserveLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={m.common.openMenu}
              aria-expanded={menuOpen}
              className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Desktop drop panel ───────────────────────────────────────── */}
        <AnimatePresence>
          {openPanel && (
            <motion.div
              key={openPanel}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
              className="hidden overflow-hidden border-t border-ink/10 bg-paper text-ink lg:block"
            >
              <div className="mx-auto w-full max-w-[1680px] px-12 py-10">
                {openPanel === "rooms" ? (
                  <div className="grid grid-cols-4 gap-10">
                    {houses
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((house) => (
                        <div key={house.id}>
                          <Link
                            href={`/rooms#${house.id}`}
                            className="label mb-4 block text-accent"
                          >
                            {house.name}
                          </Link>
                          <ul className="space-y-2">
                            {roomsInHouse(house.id).map((room) => (
                              <li key={room.slug}>
                                <Link
                                  href={`/rooms/${room.slug}`}
                                  className="font-display text-lg leading-snug opacity-75 transition-opacity duration-300 hover:opacity-100"
                                >
                                  {room.displayName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-10">
                    {experienceGroups.map((g) => (
                      <Link
                        key={g.id}
                        href={`/experiences#${g.id}`}
                        className="group block"
                      >
                        <span className="label mb-3 block text-accent">
                          {g.greek}
                        </span>
                        <span className="font-display text-2xl leading-none">
                          {g.title}
                        </span>
                        <span className="mt-3 block max-w-[22ch] text-sm leading-relaxed text-stone">
                          {g.blurb}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const reduced = useReducedMotion();
  const { locale, m } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Move focus into the panel so the keyboard follows the eye. */
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={m.common.menu}
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
      data-ground="ink"
      className="fixed inset-0 z-[150] flex flex-col lg:hidden"
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
        <Wordmark markColor="inherit" className="h-6 w-auto" />
        <button
          type="button"
          onClick={onClose}
          aria-label={m.common.closeMenu}
          className="-mr-2 flex h-11 w-11 items-center justify-center"
        >
          <X className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
        </button>
      </div>

      <nav
        aria-label={m.common.navPrimary}
        className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-4"
      >
        <ul>
          {nav.map((item, i) => {
            const active =
              stripLocale(pathname).path === item.href ||
                stripLocale(pathname).path.startsWith(`${item.href}/`);
            return (
              <motion.li
                key={item.href}
                initial={reduced ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: reduced ? 0 : 0.12 + i * 0.055,
                  ease: EASE,
                }}
                className="border-b border-paper/12"
              >
                <Link
                  href={localePath(locale, item.href)}
                  onClick={onClose}
                  className="flex items-baseline gap-4 py-5"
                >
                  <span className="label w-6 shrink-0 text-phos">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-4xl leading-none",
                      !active && "opacity-85",
                    )}
                  >
                    {m.nav[item.key]}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.5 }}
          className="mt-10 space-y-5"
        >
          {/* Was a hardcoded English "Book now" while the desktop control
              two hundred lines up used the catalogue — so the one booking
              button a phone reader sees was in the wrong language on four of
              the five locales. */}
          <ReserveLink className="label flex h-14 w-full items-center justify-center bg-paper text-ink">
            {m.actions.bookNow}
          </ReserveLink>
          <div className="space-y-1.5 pt-2">
            {contact.phones.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="block text-sm text-paper/70"
              >
                <span className="label mr-3 text-phos">{label(p.label, m)}</span>
                {p.value}
              </a>
            ))}
            <a
              href={`mailto:${contact.emails.general}`}
              className="block pt-1 text-sm text-paper/70"
            >
              {contact.emails.general}
            </a>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  );
}
