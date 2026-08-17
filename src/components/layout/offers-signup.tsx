"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * "Offers, a few times a year."
 *
 * HIDDEN UNTIL THERE IS SOMEWHERE FOR THE ADDRESS TO GO.
 *
 * It renders nothing unless `NEXT_PUBLIC_OFFERS_SIGNUP` is on, which will only
 * be set once `RESEND_API_KEY` exists and `/api/contact` can actually deliver.
 * A form that silently drops what a guest typed is worse than no form: they
 * believe they subscribed, hear nothing, and conclude the hotel ignores people.
 *
 * The consent line is deliberately specific and sits above the button, not
 * behind a link. Under GDPR consent must be freely given, specific, informed
 * and unambiguous, so the reader is told what they get, roughly how often, and
 * that leaving is one click — before they hand anything over. There is no
 * pre-ticked box, because a pre-ticked box is not consent.
 *
 * The address goes to the same endpoint as the enquiry form rather than to a
 * marketing platform: one processor fewer to name in the privacy policy, and
 * the owner keeps the list rather than renting it.
 */
export function OffersSignup({ className }: { className?: string }) {
  const { m } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (process.env.NEXT_PUBLIC_OFFERS_SIGNUP !== "1") return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    if (typeof email !== "string" || !email.includes("@")) return;

    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "offers", email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("text-sm text-paper/80", className)}>
        {m.common.offersThanks}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("max-w-sm", className)}>
      <label htmlFor="offers-email" className="label mb-3 block text-paper/70">
        {m.common.offersTitle}
      </label>
      <div className="flex gap-2">
        <input
          id="offers-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={m.common.offersPlaceholder}
          className="h-11 min-w-0 flex-1 border border-paper/25 bg-transparent px-3 text-paper placeholder:text-paper/40 focus-visible:border-paper/60 focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="label h-11 shrink-0 bg-paper px-5 text-ink transition-colors duration-500 ease-settle hover:bg-sea hover:text-paper disabled:opacity-60"
        >
          {m.common.offersSubmit}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-paper/55">
        {m.common.offersConsent}
      </p>
      {state === "error" && (
        <p className="mt-2 text-xs text-paper/70">{m.common.offersError}</p>
      )}
    </form>
  );
}
