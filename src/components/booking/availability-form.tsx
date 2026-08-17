"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { contact } from "@/content/site";
import { useI18n } from "@/i18n/provider";
import { DateField } from "./date-field";

/**
 * Availability search.
 *
 * The property's reservation engine (WebHotelier) accepts a plain GET with
 * `checkin` / `checkout` as DD-MM-YYYY plus `rooms`, `adults` and `children`.
 * We collect dates with native date inputs — which give real keyboard support
 * and the correct picker on every mobile OS — and convert on submit.
 *
 * It is a real <form> with a real action, so it still works with JavaScript off.
 */

function toEngineDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
}

function isoToday(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

interface Props {
  className?: string;
  /** `light` sits on photography, `dark` on the paper ground. */
  tone?: "light" | "dark";
  layout?: "row" | "stack";
  roomId?: string;
}

export function AvailabilityForm({
  className,
  tone = "dark",
  layout = "row",
  roomId,
}: Props) {
  const { m } = useI18n();
  const uid = useId();
  const minCheckIn = useMemo(() => isoToday(), []);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  /* Check-out can never precede check-in; the browser enforces it via `min`. */
  const minCheckOut = useMemo(() => {
    if (!checkin) return isoToday(1);
    const d = new Date(checkin);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkin]);

  const light = tone === "light";

  /**
   * The fields.
   *
   * A rule under each field rather than a boxed input: boxes make a booking
   * form look like a tax return, and on photography a row of filled boxes is
   * the least elegant thing on the page. The rule thickens and takes the brand
   * colour on focus, so the active field is unmistakable without a ring.
   *
   * `[color-scheme]` is set explicitly so the native date picker's own chrome —
   * the calendar popup, the little indicator glyph — matches the ground it sits
   * on instead of arriving in default browser grey.
   */
  const fieldBase = cn(
    "peer h-12 w-full cursor-pointer bg-transparent px-0 pb-1 pt-1.5 text-[0.9375rem] outline-none",
    "border-0 border-b-[1.5px] transition-[border-color,color] duration-300 ease-settle",
    light
      ? [
          "border-paper/30 text-paper [color-scheme:dark]",
          "hover:border-paper/60 focus:border-sea-light",
          "[&::-webkit-calendar-picker-indicator]:opacity-55",
          "[&::-webkit-calendar-picker-indicator]:invert",
          "hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
        ]
      : [
          "border-ink/20 text-ink [color-scheme:light]",
          "hover:border-ink/45 focus:border-sea",
          "[&::-webkit-calendar-picker-indicator]:opacity-45",
          "hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
        ],
  );

  const labelBase = cn(
    "label mb-0.5 block transition-colors duration-300",
    light ? "text-paper/60" : "text-stone",
  );

  return (
    <form
      action={contact.bookingUrl}
      method="get"
      target="_blank"
      rel="noopener noreferrer"
      onSubmit={(e) => {
        /* Rewrite the two date fields into the engine's format just before the
           browser serialises the form. */
        const form = e.currentTarget;
        (form.elements.namedItem("checkin") as HTMLInputElement).value =
          toEngineDate(checkin);
        (form.elements.namedItem("checkout") as HTMLInputElement).value =
          toEngineDate(checkout);
      }}
      className={cn(
        "grid gap-x-6 gap-y-5",
        /* `stack` is used inside narrow containers — a sidebar rail, the mobile
           dock — where viewport-width media queries would lie about the space
           available, so it stays one column at every width. */
        layout === "row"
          ? "grid-cols-2 md:grid-cols-[1.1fr_1.1fr_0.8fr_0.8fr_auto] md:items-end md:gap-x-8"
          : "grid-cols-1",
        className,
      )}
    >
      {/* Values the engine reads — kept in sync on submit. */}
      <input type="hidden" name="checkin" />
      <input type="hidden" name="checkout" />
      {roomId && <input type="hidden" name="bedroom" value={roomId} />}

      {/* Drawn rather than native: `<input type="date">` shows its months and
          its placeholder in the browser's language, not the site's, and there
          is no attribute that changes that. */}
      <DateField
        id={`${uid}-in`}
        label={m.booking.arriving}
        value={checkin}
        min={minCheckIn}
        tone={tone}
        required
        onChange={(v) => {
          setCheckin(v);
          if (checkout && v >= checkout) setCheckout("");
        }}
      />

      <DateField
        id={`${uid}-out`}
        label={m.booking.leaving}
        value={checkout}
        min={minCheckOut}
        tone={tone}
        required
        onChange={setCheckout}
      />

      <div>
        <label htmlFor="bk-adults" className={labelBase}>
          {m.booking.guests}
        </label>
        <select
          id="bk-adults"
          name="adults"
          defaultValue="2"
          className={cn(fieldBase, "cursor-pointer")}
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n} className="bg-paper text-ink">
              {n} {n === 1 ? m.booking.guest_one.replace("{count} ", "") : m.booking.guest_other.replace("{count} ", "")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bk-rooms" className={labelBase}>
          {m.booking.rooms}
        </label>
        <select
          id="bk-rooms"
          name="rooms"
          defaultValue="1"
          className={cn(fieldBase, "cursor-pointer")}
        >
          {[1, 2, 3].map((n) => (
            <option key={n} value={n} className="bg-paper text-ink">
              {n}
            </option>
          ))}
        </select>
      </div>

      <input type="hidden" name="children" value="0" />

      <button
        type="submit"
        className={cn(
          "label group flex h-12 items-center justify-center gap-3 px-7",
          layout === "row" ? "col-span-2 md:col-span-1" : "col-span-1 mt-1",
          /* Brass on every ground. Booking is the one action that should look
             the same wherever a guest meets it, so it is never restyled to
             suit the section it happens to be sitting in. */
          "bg-sea text-paper transition-transform duration-500 ease-settle hover:-translate-y-px",
          "shadow-[0_2px_18px_-6px_rgb(26_21_18/0.45)]",
        )}
      >
        {m.actions.bookNow}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-500 ease-settle group-hover:translate-x-1"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <p
        className={cn(
          "text-xs",
          layout === "row" ? "col-span-2 md:col-span-5" : "col-span-1",
          light ? "text-paper/55" : "text-stone",
        )}
      >
        {m.booking.opensInNewTab.split("{phone}")[0]}
        <a href={contact.phones[1].href} className="underline underline-offset-4">
          {contact.phones[1].value}
        </a>
        {m.booking.opensInNewTab.split("{phone}")[1]}
      </p>
    </form>
  );
}
