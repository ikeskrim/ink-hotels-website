/**
 * Fetch every URL the sitemap advertises and fail on anything that is not 200.
 *
 * This exists because /rethymno once served a 500 from `next start` while
 * building and prerendering perfectly — the kind of fault that is invisible to
 * `npm run build` and to any check that samples a few routes by hand. A site
 * that tells search engines about a page owes that page a 200.
 *
 * Also asserts the indexing rules, since they are cheap to check here and
 * expensive to discover wrong:
 *   - a preview deployment must send `noindex` on every page
 *   - production must NOT, and robots.txt must point at the sitemap
 *
 *   BASE=http://localhost:3000 node scripts/smoke.mjs
 *   BASE=https://…vercel.app EXPECT=preview node scripts/smoke.mjs
 *
 * Exits 1 on the first class of failure found, after reporting all of them.
 */
const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const EXPECT = process.env.EXPECT ?? "production";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 8);

const fail = [];
const note = (...a) => console.log(...a);

/* ── the sitemap is the contract ───────────────────────────────────────── */
const sitemapUrl = `${BASE}/sitemap.xml`;
const smRes = await fetch(sitemapUrl);
if (!smRes.ok) {
  console.error(`sitemap.xml → ${smRes.status}. Nothing else can be checked.`);
  process.exit(1);
}
const xml = await smRes.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) {
  console.error("sitemap.xml parsed to zero URLs.");
  process.exit(1);
}

/* The sitemap carries absolute production URLs; test them against BASE. */
const paths = [...new Set(urls.map((u) => new URL(u).pathname))];
note(`sitemap advertises ${urls.length} URLs (${paths.length} distinct paths)`);
note(`checking against ${BASE} as ${EXPECT}\n`);

/* ── every path must be 200, and must not be a soft 404 ────────────────── */
let done = 0;
const queue = [...paths];
const NOINDEX = /<meta name="robots"[^>]*content="[^"]*noindex/i;

async function worker() {
  for (;;) {
    const path = queue.shift();
    if (!path) return;
    const url = BASE + path;
    let res, body = "";
    try {
      res = await fetch(url, { redirect: "follow" });
      body = await res.text();
    } catch (err) {
      fail.push({ path, what: `fetch failed: ${err.message}` });
      continue;
    }

    if (res.status !== 200) {
      fail.push({ path, what: `HTTP ${res.status}` });
    } else if (/This page could not be found|__NEXT_ERROR/i.test(body)) {
      /* A 200 that renders the not-found body is worse than a 404: it is
         indexable. */
      fail.push({ path, what: "200 but renders not-found" });
    }

    const hasNoindex = NOINDEX.test(body);
    if (EXPECT === "preview" && !hasNoindex && res.status === 200) {
      fail.push({ path, what: "preview page is indexable — expected noindex" });
    }
    if (EXPECT === "production" && hasNoindex && !/\/(privacy|terms)/.test(path)) {
      fail.push({ path, what: "production page sends noindex" });
    }

    done += 1;
    if (done % 25 === 0) note(`  … ${done}/${paths.length}`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

/* ── robots.txt ────────────────────────────────────────────────────────── */
const robotsRes = await fetch(`${BASE}/robots.txt`);
if (!robotsRes.ok) {
  fail.push({ path: "/robots.txt", what: `HTTP ${robotsRes.status}` });
} else {
  const robots = await robotsRes.text();
  if (!/sitemap:/i.test(robots)) {
    fail.push({ path: "/robots.txt", what: "does not point at the sitemap" });
  }
  if (EXPECT === "production" && /^\s*Disallow:\s*\/\s*$/im.test(robots)) {
    fail.push({ path: "/robots.txt", what: "production robots.txt disallows everything" });
  }
}

/* ── report ────────────────────────────────────────────────────────────── */
note(`\nchecked ${done}/${paths.length} paths + robots.txt`);
if (!fail.length) {
  note("all 200, indexing rules correct");
  process.exit(0);
}
console.error(`\n${fail.length} FAILURE(S):`);
for (const f of fail) console.error(`  ${f.path}  →  ${f.what}`);
process.exit(1);
