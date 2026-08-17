"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MessageSquare } from "lucide-react";

/**
 * The chat slot.
 *
 * A third-party assistant belongs *inside* the concierge panel, in the site's
 * own frame, sharing the site's own grounds — not floating in a corner in
 * somebody else's blue bubble. This renders it there.
 *
 * NOTHING LOADS UNTIL IT IS ASKED FOR. The script is only injected once the
 * guest opens the panel and taps "start a conversation", so an unused chatbot
 * costs zero bytes, zero third-party cookies and zero Lighthouse points on
 * every page view where nobody wants to talk.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TO CONNECT A PROVIDER
 *
 * Set both of these in `.env.local` and the slot activates itself:
 *
 *   NEXT_PUBLIC_CHAT_SCRIPT_URL=https://…/widget.js
 *   NEXT_PUBLIC_CHAT_ID=your-workspace-or-tenant-id
 *
 * Optionally, if the provider mounts into a named element rather than
 * auto-attaching to <body>:
 *
 *   NEXT_PUBLIC_CHAT_MOUNT_ID=xenia-root      (default: ink-chat-root)
 *
 * If those are absent the slot renders nothing at all and the concierge panel
 * keeps its phone/email routes, which is the correct fallback for a hotel that
 * answers its own phone.
 * ───────────────────────────────────────────────────────────────────────── */

const SCRIPT_URL = process.env.NEXT_PUBLIC_CHAT_SCRIPT_URL;
const CHAT_ID = process.env.NEXT_PUBLIC_CHAT_ID;
const MOUNT_ID = process.env.NEXT_PUBLIC_CHAT_MOUNT_ID ?? "ink-chat-root";

export const chatConfigured = Boolean(SCRIPT_URL && CHAT_ID);

export function ChatSlot({ label, hint }: { label: string; hint: string }) {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const mount = useRef<HTMLDivElement>(null);

  /* Some widgets look for their mount point at script-eval time. Make sure the
     element exists before the script is allowed to run. */
  useEffect(() => {
    if (!started || !mount.current) return;
    mount.current.id = MOUNT_ID;
  }, [started]);

  if (!chatConfigured) return null;

  return (
    <div className="border-t border-paper/12 px-7 py-6">
      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="group flex w-full items-center gap-4 text-left"
        >
          <MessageSquare
            className="h-4 w-4 shrink-0 text-sea-light"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="label block text-paper/55">{label}</span>
            <span className="block text-sm text-paper/80 transition-colors group-hover:text-paper">
              {hint}
            </span>
          </span>
        </button>
      ) : (
        <>
          <p className="label mb-4 text-paper/55">{label}</p>
          <div
            ref={mount}
            data-chat-id={CHAT_ID}
            className="min-h-[18rem] w-full"
            aria-live="polite"
          >
            {!ready && (
              <p className="text-sm text-paper/50">Connecting…</p>
            )}
          </div>
          <Script
            src={SCRIPT_URL}
            strategy="lazyOnload"
            data-chat-id={CHAT_ID}
            data-mount={MOUNT_ID}
            onReady={() => setReady(true)}
            onError={() => setReady(true)}
          />
        </>
      )}
    </div>
  );
}
