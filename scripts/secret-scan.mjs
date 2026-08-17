/**
 * Refuse-to-ship scan for credentials, run before anything is committed.
 *
 * This repository is public. A token pushed once is compromised even if the
 * next commit removes it, so this checks the actual bytes rather than trusting
 * that .gitignore was written correctly.
 *
 *   node scripts/secret-scan.mjs [dir ...]
 *
 * Exits 1 on any hit. Placeholder-shaped values (an empty assignment, or one
 * whose value is obviously a template) are not hits — .env.example is meant to
 * be committed and is all empty keys.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = process.argv.slice(2).length ? process.argv.slice(2) : ["."];
const SKIP_DIR = new Set(["node_modules", ".next", ".git", "candidates", "out", "build"]);
const TEXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".css",
  ".yml", ".yaml", ".txt", ".env", ".example", ".html", ".mts",
]);

const RULES = [
  [/\bsk-[A-Za-z0-9]{20,}/, "OpenAI-style secret key"],
  [/\bsk_(live|test)_[A-Za-z0-9]{20,}/, "Stripe secret key"],
  [/\bre_[A-Za-z0-9]{20,}/, "Resend API key"],
  [/\bghp_[A-Za-z0-9]{30,}/, "GitHub personal access token"],
  [/\bgithub_pat_[A-Za-z0-9_]{50,}/, "GitHub fine-grained token"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, "Slack token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key id"],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, "Google API key"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key block"],
  [/\bey[JI][A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, "JWT"],
  /* Sanity editor tokens are long opaque strings assigned to this exact key. */
  [/SANITY_API_TOKEN\s*[:=]\s*["']?sk[A-Za-z0-9]{20,}/, "Sanity API token"],
  [/(SECRET|TOKEN|PASSWORD|API_KEY)\s*[:=]\s*["'][^"'\s]{16,}["']/, "assigned credential"],
];

/* An assignment with nothing after it, or an obvious template, is a placeholder
   rather than a leak — .env.example is committed on purpose. */
const PLACEHOLDER = /(=\s*$)|(=\s*["']?(your|xxx|<|\.\.\.|changeme|placeholder))/i;

const hits = [];
let scanned = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const p = join(dir, entry);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) { walk(p); continue; }
    if (st.size > 2_000_000) continue;
    const ext = extname(entry);
    if (ext && !TEXT.has(ext) && !entry.startsWith(".env")) continue;
    scanned += 1;

    let text;
    try { text = readFileSync(p, "utf8"); } catch { continue; }
    text.split("\n").forEach((line, i) => {
      if (PLACEHOLDER.test(line)) return;
      for (const [re, what] of RULES) {
        if (re.test(line)) {
          hits.push({ file: p, line: i + 1, what, sample: line.trim().slice(0, 70) });
          break;
        }
      }
    });
  }
}

for (const r of ROOTS) walk(r);

console.log(`scanned ${scanned} text files`);
if (!hits.length) {
  console.log("no credentials found");
  process.exit(0);
}
console.log(`\n${hits.length} POSSIBLE CREDENTIAL(S) — do not commit:\n`);
for (const h of hits) console.log(`  ${h.file}:${h.line}  ${h.what}\n    ${h.sample}`);
process.exit(1);
