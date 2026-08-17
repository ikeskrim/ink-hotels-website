/**
 * Refuse to ship mojibake.
 *
 * This guards a mistake that has already happened here once. PowerShell's
 * `Set-Content` re-encodes a file in the system codepage, so a single edit to
 * `src/content/rooms.ts` turned every em-dash into "â€"", every Greek letter
 * into Latin-1 rubbish, and "Φως" into "Ξ¦Ο‰Ο‚". It was caught in the diff, but
 * only because the diff was read. A Greek hotel site cannot rely on that.
 *
 * Three separate faults are checked, because they look different on disk:
 *
 *   U+FFFD — the replacement character. Something already decoded a byte it
 *     could not understand and wrote the damage down permanently.
 *   Mojibake signatures — UTF-8 bytes decoded as Latin-1 or cp1253 and
 *     re-encoded. "â€"" is an em-dash that went through the mill; "Ã©" is é.
 *     The bytes are valid UTF-8, so a decoder will not complain — only the
 *     shape gives it away.
 *   A byte-order mark — harmless to a browser, but it is the fingerprint of a
 *     Windows tool having rewritten the file, so it is worth failing on while
 *     the cause is still fresh.
 *
 *   node scripts/encoding-check.mjs [dir ...]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["src/content", "src/i18n", "src/components", "src/app"];

const EXT = new Set([".ts", ".tsx", ".mjs", ".json", ".md", ".css"]);

/* Sequences that are valid UTF-8 but are almost certainly a mis-decode.
   Each is a common character having made a round trip through Latin-1. */
const MOJIBAKE = [
  ["â€”", "em dash"],
  ["â€“", "en dash"],
  ["â€™", "right single quote"],
  ["â€œ", "left double quote"],
  ["â€", "right double quote"],
  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ã¡", "á"],
  ["Ã¼", "ü"],
  ["Ã¶", "ö"],
  ["Ã¤", "ä"],
  ["ÃŸ", "ß"],
  ["Î¦", "Greek capital Phi"],
  ["Î‘", "Greek capital Alpha"],
  ["Ï‰", "Greek small omega"],
  ["Î²â‚¬", "mangled dash in Greek text"],
  ["Â·", "middle dot"],
  ["â€¦", "ellipsis"],
];

const problems = [];
let scanned = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const p = join(dir, entry);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(p);
      continue;
    }
    if (!EXT.has(extname(entry))) continue;
    scanned += 1;
    check(p);
  }
}

function check(path) {
  const buf = readFileSync(path);

  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    problems.push({ path, line: 1, what: "UTF-8 byte-order mark", sample: "" });
  }

  const text = buf.toString("utf8");
  text.split("\n").forEach((line, i) => {
    if (line.includes("�")) {
      problems.push({
        path,
        line: i + 1,
        what: "U+FFFD replacement character",
        sample: line.trim().slice(0, 72),
      });
      return;
    }
    for (const [seq, means] of MOJIBAKE) {
      if (line.includes(seq)) {
        problems.push({
          path,
          line: i + 1,
          what: `mojibake — "${seq}" is a mangled ${means}`,
          sample: line.trim().slice(0, 72),
        });
        return;
      }
    }
  });
}

for (const root of ROOTS) walk(root);

console.log(`scanned ${scanned} files under ${ROOTS.join(", ")}`);
if (!problems.length) {
  console.log("no mojibake, no replacement characters, no BOMs");
  process.exit(0);
}

console.error(`\n${problems.length} ENCODING FAULT(S):\n`);
for (const p of problems) {
  console.error(`  ${p.path}:${p.line}  ${p.what}`);
  if (p.sample) console.error(`      ${p.sample}`);
}
console.error(
  "\nA file was rewritten by a tool that did not keep UTF-8. Restore it from\n" +
    "git and edit it again with an editor that does — never PowerShell\n" +
    "Set-Content, which re-encodes in the system codepage.",
);
process.exit(1);
