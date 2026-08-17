/**
 * Root layout.
 *
 * Deliberately a pass-through for markup. `<html>` and `<body>` are supplied
 * by `app/[locale]/layout.tsx`, because they carry the `lang` attribute and
 * that cannot be known until the locale segment is resolved.
 *
 * This file exists so that `app/not-found.tsx` — which catches URLs that match
 * no route at all, and therefore never reaches the locale segment — has a root
 * to render into.
 *
 * IT MUST IMPORT THE STYLESHEET. Next attributes CSS to the layout chain, not
 * to the page that imports it: with this line missing, `app/not-found.tsx`
 * imported `globals.css` and still shipped a stylesheet containing only the
 * font faces — no reset, no tokens, no utilities. Every URL that matched
 * nothing was served as unstyled markup: blue underlined links, Times New
 * Roman, an illustration at its intrinsic size. It looked like a crashed
 * server rather than a hotel saying "that page does not exist".
 *
 * The locale layout imports the same file. Next emits one chunk for both.
 */
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
