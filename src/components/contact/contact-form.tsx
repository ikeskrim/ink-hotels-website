"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";

import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { contact } from "@/content/site";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { fill } from "@/i18n/fill";
import { spokenLanguages } from "@/i18n/languages";

/**
 * The enquiry form.
 *
 * Validated with the same Zod schema on both sides, so the browser and the
 * route agree on what a valid message is. The schema emits error CODES rather
 * than sentences, and they are looked up here — so the complaint arrives in
 * the language the page is being read in.
 *
 * Errors are announced, tied to their field with aria-describedby, and focus
 * moves to the first invalid input — a form that only shows red borders is not
 * an accessible form.
 *
 * If no mail provider is configured the route says so plainly and the form
 * offers the address and the phone instead of pretending the message was sent.
 */
export function ContactForm() {
  const { m, locale } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [failureNote, setFailureNote] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", email: "", message: "" },
  });

  /* An unknown code falls back to the code itself rather than to an empty
     string: a visible oddity gets reported, a silent one does not. */
  const say = (code?: string) =>
    code ? ((m.contact as Record<string, string>)[code] ?? code) : "";

  const onSubmit = async (values: ContactInput) => {
    setStatus("sending");
    setFailureNote(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        setFailureNote(body?.message ?? null);
        setStatus("failed");
        return;
      }
      reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const onInvalid = () => {
    const first = (
      ["firstName", "lastName", "email", "message"] as const
    ).find((k) => errors[k]);
    if (first) setFocus(first);
  };

  const field = (invalid: boolean) =>
    cn(
      "h-12 w-full border-0 border-b bg-transparent px-0 pt-1 outline-none",
      "transition-colors duration-300",
      invalid
        ? "border-[color:var(--link)]"
        : "border-[color:var(--border)] focus:border-[color:var(--fg)]",
    );

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-[color:var(--border)] p-8 lg:p-10"
      >
        <p className="label mb-4 text-[color:var(--fg-3)]">{m.contact.received}</p>
        <p className="font-display text-[length:var(--text-d4)] leading-tight">
          {m.contact.thanks}
        </p>
        <p className="measure mt-4 text-[color:var(--fg-2)]">
          {m.contact.thanksBody
            .replace("{phone}", contact.phones[0]?.value ?? "")
            .replace("{languages}", spokenLanguages(locale))}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="firstName" className="label mb-1 block text-[color:var(--fg-3)]">
          {m.contact.firstName}
        </label>
        <input
          id="firstName"
          autoComplete="given-name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "firstName-error" : undefined}
          className={field(!!errors.firstName)}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p id="firstName-error" className="spec mt-2 text-[color:var(--link)]">
            {say(errors.firstName.message)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="label mb-1 block text-[color:var(--fg-3)]">
          {m.contact.lastName}
        </label>
        <input
          id="lastName"
          autoComplete="family-name"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? "lastName-error" : undefined}
          className={field(!!errors.lastName)}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p id="lastName-error" className="spec mt-2 text-[color:var(--link)]">
            {say(errors.lastName.message)}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="email" className="label mb-1 block text-[color:var(--fg-3)]">
          {m.contact.email}
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field(!!errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="spec mt-2 text-[color:var(--link)]">
            {say(errors.email.message)}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className="label mb-1 block text-[color:var(--fg-3)]">
          {m.contact.message}
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full resize-y border-0 border-b bg-transparent px-0 pt-3 outline-none transition-colors duration-300",
            errors.message
              ? "border-[color:var(--link)]"
              : "border-[color:var(--border)] focus:border-[color:var(--fg)]",
          )}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="spec mt-2 text-[color:var(--link)]">
            {say(errors.message.message)}
          </p>
        )}
      </div>

      {status === "failed" && (
        <div
          role="alert"
          className="sm:col-span-2 border border-[color:var(--link)] p-5"
        >
          <p className="mb-2">{failureNote ?? m.contact.failed}</p>
          <p className="text-[color:var(--fg-2)]">
            {fill(m.contact.failedBody, {
              email: (
                <a
                  href={`mailto:${contact.emails.general}`}
                  className="underline underline-offset-4"
                >
                  {contact.emails.general}
                </a>
              ),
              phone: (
                <a
                  href={contact.phones[0]?.href ?? "#"}
                  className="underline underline-offset-4"
                >
                  {contact.phones[0]?.value}
                </a>
              ),
            })}
          </p>
        </div>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="label group inline-flex h-13 items-center gap-3 bg-[color:var(--fg)] px-8 py-4 text-[color:var(--bg)] transition-opacity duration-300 disabled:opacity-60"
        >
          {status === "sending" ? m.contact.sending : m.contact.send}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-500 ease-settle group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
        <p className="spec mt-5 text-[color:var(--fg-3)]">
          {m.contact.privacyNote}
        </p>
      </div>
    </form>
  );
}
