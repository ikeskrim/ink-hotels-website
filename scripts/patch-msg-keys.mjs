/**
 * Add message keys in all five catalogues at once.
 *
 * Each entry is inserted immediately after an anchor key that already exists in
 * every catalogue, so the shape stays parallel and a missing anchor is a loud
 * failure rather than a silent English fallback three pages later.
 *
 * Run: node scripts/patch-msg-keys.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

/** group → anchor key → { key: {en, el, de, fr, nl} } */
const ADDITIONS = {
  rooms: {
    anchor: "renovated:",
    keys: {
      roomTypesCount: {
        en: "{count} room types",
        el: "{count} τύποι δωματίων",
        de: "{count} Zimmertypen",
        fr: "{count} types de chambres",
        nl: "{count} kamertypes",
      },
      oneResidence: {
        en: "One residence",
        el: "Μία κατοικία",
        de: "Eine Residenz",
        fr: "Une résidence",
        nl: "Één residentie",
      },
    },
  },
};

const q = (s) => JSON.stringify(s);

for (const locale of ["en", "el", "de", "fr", "nl"]) {
  const file = `src/i18n/messages/${locale}.ts`;
  let src = readFileSync(file, "utf8");
  const before = src;
  const added = [];

  for (const [group, { anchor, keys }] of Object.entries(ADDITIONS)) {
    const groupAt = src.indexOf(`  ${group}: {`);
    if (groupAt === -1) throw new Error(`${locale}: no ${group} group`);
    const groupEnd = src.indexOf("\n  },", groupAt);

    for (const [key, values] of Object.entries(keys)) {
      if (src.slice(groupAt, groupEnd).includes(`${key}:`)) continue;
      const anchorAt = src.indexOf(anchor, groupAt);
      if (anchorAt === -1 || anchorAt > groupEnd) {
        throw new Error(`${locale}: anchor ${anchor} missing from ${group}`);
      }
      const eol = src.indexOf("\n", anchorAt);
      src = src.slice(0, eol) + `\n    ${key}: ${q(values[locale])},` + src.slice(eol);
      added.push(`${group}.${key}`);
    }
  }

  if (src === before) {
    console.log(`${locale}: no change`);
  } else {
    writeFileSync(file, src);
    console.log(`${locale}: +${added.length} (${added.join(", ")})`);
  }
}
