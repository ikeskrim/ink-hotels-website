/**
 * Replace each route's `export const metadata = pageMetadata({...})` with a
 * locale-aware `generateMetadata`, reading from `m.pageMeta[key]`.
 *
 * A static `metadata` export cannot see the route's `[locale]` param — that is
 * the whole reason fourteen routes shipped English titles to five languages.
 * `generateMetadata` can, so the conversion is the fix rather than a style
 * preference.
 *
 * Run: node scripts/wire-page-meta.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

/** route file → [pageMeta key, path, extra fill expression or null] */
const ROUTES = {
  "rooms": ["rooms", "/rooms", null],
  "experiences": ["experiences", "/experiences", null],
  "gallery": ["gallery", "/gallery", '.replace("{count}", String(galleryItems.length))'],
  "story": ["story", "/story", null],
  "rethymno": ["rethymno", "/rethymno", null],
  "arrival": ["arrival", "/arrival", null],
  "location": ["location", "/location", null],
  "contact": [
    "contact",
    "/contact",
    '\n      .replace("{phone}", contact.phones[0].value)\n      .replace("{ext}", contact.phones[0].ext ?? "")\n      .replace("{time}", reception.openUntil)',
  ],
  "faq": ["faq", "/faq", null],
  "accessibility": ["accessibility", "/accessibility", null],
  "careers": ["careers", "/careers", null],
  "privacy": ["privacy", "/privacy", null],
  "terms": ["terms", "/terms", null],
};

for (const [dir, [key, path, fill]] of Object.entries(ROUTES)) {
  const file = `src/app/[locale]/${dir}/page.tsx`;
  let src = readFileSync(file, "utf8");

  if (src.includes("export async function generateMetadata")) {
    console.log(`${dir}: already dynamic — skipped`);
    continue;
  }

  const start = src.indexOf("export const metadata");
  if (start === -1) throw new Error(`${dir}: no static metadata export`);
  const end = src.indexOf("});", start);
  if (end === -1) throw new Error(`${dir}: unterminated pageMetadata call`);

  const desc = fill ? `m.pageMeta.${key}.d${fill}` : `m.pageMeta.${key}.d`;

  const block =
    `export async function generateMetadata({\n` +
    `  params,\n` +
    `}: {\n` +
    `  params: Promise<{ locale: string }>;\n` +
    `}): Promise<Metadata> {\n` +
    `  const { locale: raw } = await params;\n` +
    `  const locale = isLocale(raw) ? raw : defaultLocale;\n` +
    `  const m = getMessages(locale);\n\n` +
    `  return pageMetadata({\n` +
    `    title: m.pageMeta.${key}.t,\n` +
    `    description: ${desc},\n` +
    `    path: ${JSON.stringify(path)},\n` +
    `    locale,\n` +
    `  });\n` +
    `}`;

  src = src.slice(0, start) + block + src.slice(end + 3);

  /* Imports the new block needs. Each is added only if absent, because several
     routes already import some of them for the page body. */
  const needed = [
    ['import { getMessages } from "@/i18n";', /from "@\/i18n";/],
    [
      'import { defaultLocale, isLocale } from "@/i18n/config";',
      /defaultLocale[^\n]*from "@\/i18n\/config"|from "@\/i18n\/config"/,
    ],
  ];
  for (const [line, present] of needed) {
    if (!present.test(src)) {
      src = src.replace(
        /^(import [^\n]*from "@\/lib\/seo";)/m,
        `$1\n${line}`,
      );
    }
  }
  /* `isLocale`/`defaultLocale` may be imported partially on some routes. */
  src = src.replace(
    /import \{ ([^}]*) \} from "@\/i18n\/config";/,
    (whole, names) => {
      const set = new Set(names.split(",").map((s) => s.trim()).filter(Boolean));
      set.add("defaultLocale");
      set.add("isLocale");
      return `import { ${[...set].sort().join(", ")} } from "@/i18n/config";`;
    },
  );

  writeFileSync(file, src);
  console.log(`${dir}: → generateMetadata (pageMeta.${key})`);
}
