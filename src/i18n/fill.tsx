import { Fragment, type ReactNode } from "react";

/**
 * Fill `{placeholders}` in a translated string with React nodes.
 *
 * Translations put a phone number or a link wherever the sentence needs it,
 * which is not where English puts it. Concatenating JSX around a fragment of
 * translated text bakes English word order into the markup; this keeps the
 * whole sentence in the catalogue and lets the translator decide the order.
 *
 *   fill(m.booking.orCall, { phone: <a href={…}>…</a>, languages: "…" })
 *
 * An unknown placeholder is left visible rather than silently dropped — a
 * literal `{phone}` on the page is a bug that gets reported; a missing phone
 * number is one that does not.
 */
export function fill(
  template: string,
  values: Record<string, ReactNode>,
): ReactNode {
  return template.split(/(\{[a-zA-Z0-9_]+\})/g).map((part, i) => {
    const token = /^\{([a-zA-Z0-9_]+)\}$/.exec(part);
    const value = token ? values[token[1]!] : undefined;
    return (
      <Fragment key={i}>{token ? (value ?? part) : part}</Fragment>
    );
  });
}
