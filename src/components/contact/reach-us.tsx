import { InkAnchor } from "@/components/ui/ink-link";
import { contact } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * The two ways to reach the desk, printed together.
 *
 * A guest who dials the reception number without its extension reaches a
 * switchboard and hangs up, and a guest abroad pays for a Greek mobile call
 * where WhatsApp costs them nothing. The owner's instruction is that the
 * number never appears alone again: extension and WhatsApp travel with it.
 *
 * The concierge panel lays the same routes out in full, with notes. This is
 * the compact form for everywhere else — a footer, a legal page, the end of a
 * sentence — so that no page has to remember to add the other half.
 *
 * `scripts/phone-check.mjs` asserts the rule against the running site: any
 * page that prints a number prints the extension and links to wa.me.
 */
export function ReachUs({
  locale = defaultLocale,
  className,
  linkClassName,
  dimClassName = "text-[color:var(--fg-3)]",
}: {
  locale?: Locale;
  className?: string;
  /** Applied to both anchors, so a dark ground can lift them together. */
  linkClassName?: string;
  /** Applied to the extension, which is quieter than the number it follows. */
  dimClassName?: string;
}) {
  const m = getMessages(locale);
  const phone = contact.phones[0];

  return (
    <span className={className}>
      <InkAnchor href={phone.href} className={linkClassName}>
        {phone.value}
      </InkAnchor>
      {phone.ext ? (
        <span className={dimClassName}>
          {" "}
          ({m.common.ext} {phone.ext})
        </span>
      ) : null}
      <span className={dimClassName}> · </span>
      <InkAnchor
        href={contact.whatsapp.url(m.concierge.whatsappGreeting)}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {m.concierge.whatsapp}
      </InkAnchor>
    </span>
  );
}
