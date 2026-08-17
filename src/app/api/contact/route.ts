import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/contact-schema";
import { contact } from "@/content/site";

/**
 * Enquiry endpoint.
 *
 * Validates server-side with the same schema the browser uses, then hands the
 * message to whatever mail provider is configured.
 *
 * There is deliberately no provider hard-coded here. Set RESEND_API_KEY (or
 * swap the send() body for SendGrid, Postmark, SMTP — the shape is the same)
 * and messages go out. Until then the route returns 503 with an honest
 * message, and the form shows the address and phone number instead of a fake
 * confirmation. A form that silently discards mail is worse than no form.
 */

export const runtime = "nodejs";

const RATE = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now > entry.reset) {
    RATE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

async function send(input: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? contact.emails.general;
  const from = process.env.CONTACT_FROM;

  if (!key || !from) {
    return {
      ok: false,
      message:
        "Our contact form is not connected to email yet, so this message was not sent.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Enquiry from ${input.firstName} ${input.lastName}`,
      text: `${input.firstName} ${input.lastName}\n${input.email}\n\n${input.message}`,
    }),
  });

  if (!res.ok) {
    return { ok: false, message: "We could not send that just now." };
  }
  return { ok: true };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many messages from this connection. Please try later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again." },
      { status: 422 },
    );
  }

  /* Honeypot filled means a bot. Accept silently so it learns nothing. */
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const result = await send(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
