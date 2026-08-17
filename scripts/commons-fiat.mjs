/**
 * Search Wikimedia Commons for a modern Fiat 500C (the 2007-onward cabrio, not
 * the 1957 Nuova) in a setting that suits the site.
 *
 * Commons is preferred over Pexels for the pre-launch placeholder because every
 * file carries an explicit, machine-readable licence and a named author, so the
 * credit line can be correct rather than "free stock". The owner's own fleet
 * photograph replaces it either way.
 *
 * Prints candidates with licence, author, dimensions and URL. Nothing is
 * downloaded — choosing the picture is a judgement call, not a search result.
 *
 * Run: node scripts/commons-fiat.mjs
 */
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "ink-hotels-dev/1.0 (local placeholder sourcing; contact via site)";

const QUERIES = [
  'filetype:bitmap "Fiat 500C" cabrio',
  'filetype:bitmap "Fiat 500" cabriolet 2020',
  'filetype:bitmap "Fiat 500C" convertible',
  'filetype:bitmap "Fiat 500" Greece',
  'filetype:bitmap "Fiat 500C" Italy',
  /* The brief asks for a Mediterranean setting specifically, so the place is
     searched as hard as the car. */
  'filetype:bitmap "Fiat 500" Crete',
  'filetype:bitmap "Fiat 500" Sicily',
  'filetype:bitmap "Fiat 500" Rome',
  'filetype:bitmap "Fiat 500" Naples',
  'filetype:bitmap "Fiat 500" Spain',
  'filetype:bitmap "Fiat 500" Portugal',
  'filetype:bitmap "Fiat 500" Croatia',
  'filetype:bitmap "Fiat 500C" sea',
  'filetype:bitmap "Fiat 500" cabriolet beach',
];

/** Licences we can actually use, in order of how little they ask of us. */
const OK = /^(cc0|cc-by-sa-[34]|cc-by-[34]|public domain)/i;

const seen = new Map();

for (const search of QUERIES) {
  const url =
    `${API}?action=query&format=json&generator=search` +
    `&gsrsearch=${encodeURIComponent(search)}&gsrnamespace=6&gsrlimit=25` +
    `&prop=imageinfo&iiprop=url|size|extmetadata|mime` +
    `&iiurlwidth=1600&origin=*`;

  let json;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    json = await res.json();
  } catch (err) {
    console.error(`  ! ${search}: ${err.message}`);
    continue;
  }

  const pages = json?.query?.pages ?? {};
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (!info || seen.has(page.title)) continue;
    const meta = info.extmetadata ?? {};
    const strip = (v) => (v?.value ?? "").replace(/<[^>]*>/g, "").trim();

    const licence = strip(meta.LicenseShortName) || strip(meta.License);
    const author = strip(meta.Artist) || "unknown";
    const title = page.title.replace(/^File:/, "");

    /* The 1957 Nuova 500 and the 500L/500X share the name. Filter by the words
       that only appear on the modern cabrio, and drop anything obviously a
       different car or a scale model. */
    const t = title.toLowerCase();
    if (/nuova|1957|196[0-9]|197[0-9]|topolino|500l|500x|500e|abarth|model|toy|die-?cast/.test(t)) {
      continue;
    }

    seen.set(page.title, {
      title,
      licence,
      author: author.slice(0, 60),
      w: info.width,
      h: info.height,
      mime: info.mime,
      usable: OK.test(licence),
      page: info.descriptionurl,
      file: info.url,
    });
  }
}

const rows = [...seen.values()]
  .filter((r) => r.usable && r.w >= 1600 && r.mime === "image/jpeg")
  .sort((a, b) => b.w * b.h - a.w * a.h);

console.log(`${seen.size} files seen · ${rows.length} usable (CC, ≥1600px, JPEG)\n`);
for (const r of rows.slice(0, 15)) {
  console.log(`${r.w}×${r.h}  ${r.licence.padEnd(14)}  ${r.title}`);
  console.log(`    by ${r.author}`);
  console.log(`    ${r.page}`);
}
if (!rows.length) {
  console.log("Nothing matched. Widen the queries or relax the size floor.");
}
