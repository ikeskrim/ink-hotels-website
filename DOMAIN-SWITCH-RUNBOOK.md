# Domain switch — the runbook

Moving `inkhotels.gr` from the old site to this one. Read it through before
starting; the order matters more than the speed.

**The one thing that makes this safe:** the redirect map is already written,
tested and shipped. Every URL the old site publishes is pointed at where that
page now lives, and CI fails if any destination 404s. Nothing below has to be
invented under pressure.

**The one thing that makes it risky:** DNS is the only irreversible-feeling
step, and it is the *least* reversible in practice because of caching. Do it
when you can watch for an hour, not last thing at night.

---

## Before the day

| | check | how |
| --- | --- | --- |
| ☐ | CI is green on `main` | the badge in [README.md](README.md) |
| ☐ | The preview deployment is the site you want | open the Vercel preview URL and read it |
| ☐ | The screenshot artifact looks right | latest green run → **review-screenshots** |
| ☐ | The redirect map covers today's live URLs | `npm run redirects` against the running build; re-harvest with `node scripts/harvest-live-urls.mjs` if the old site has changed |
| ☐ | You can edit DNS for `inkhotels.gr` | log in to the registrar *before* the day, not during |
| ☐ | You know the current TTL on the A/CNAME records | if it is 24 hours, lower it to 300 seconds **at least a day ahead** — this is the single most useful preparatory step |

---

## The switch, in order

### 1. Lower the TTL (a day before)

At the registrar, set the TTL on the records you are about to change to **300
seconds**. Do this the day before. A record cached for 24 hours takes 24 hours
to un-cache, and that is the difference between a five-minute rollback and a
day-long one.

### 2. Attach the domain in Vercel — before touching DNS

Vercel → the project → **Settings → Domains → Add** → `inkhotels.gr`, and add
`www.inkhotels.gr` too. Vercel will show the exact record it wants.

Adding the domain here does nothing to visitors: the site is not served on that
hostname until DNS points at it. This step exists so the certificate is ready
the moment DNS moves.

### 3. Point DNS at Vercel

At the registrar, set the records exactly as Vercel showed them. Then wait and
watch — do not change anything else while it propagates.

```bash
# Until this returns Vercel's address rather than the old host's:
dig +short inkhotels.gr
dig +short www.inkhotels.gr
```

### 4. Confirm HTTPS on the real hostname

Vercel issues the certificate automatically once DNS resolves. Do not move on
until all of these are true:

```bash
curl -sI https://inkhotels.gr/ | head -1            # expect 200
curl -sI https://www.inkhotels.gr/ | head -1        # expect 200 or a redirect to the apex
curl -sI http://inkhotels.gr/ | head -1             # expect a redirect to https
```

### 5. Confirm the site is indexable — there is no flag to flip

A common expectation, and wrong here: **there is no `noindex` switch in this
codebase to turn off.** `src/app/robots.ts` allows crawling and the layout
metadata already says `index: true`. The preview is not indexed because Vercel
adds `X-Robots-Tag: noindex` to preview deployments by itself, and it does not
add it to a production domain. So this step is a verification, not a change:

```bash
curl -sI https://inkhotels.gr/ | grep -i x-robots-tag     # expect nothing
curl -s  https://inkhotels.gr/ | grep -i 'name="robots"'  # must NOT say noindex
curl -s  https://inkhotels.gr/robots.txt                  # allows /, points at the sitemap
```

`smoke` knows about both worlds and asserts the right one:

```bash
EXPECT=production BASE=https://inkhotels.gr npm run smoke
```

It will fail if a production page sends `noindex` — and, run against the
preview with `EXPECT=preview`, it fails if one does not. `/terms` and `/privacy`
are excluded from the rule on purpose; they are meant to stay out of the index.

### 6. Prove the redirects are live

This is the money step. Every one of these was an indexed URL on the old site.

```bash
BASE=https://inkhotels.gr npm run redirects
```

Then spot-check by hand, because a 301 that lands somewhere unhelpful still
passes an automated check:

```bash
curl -sI https://inkhotels.gr/en/rooms        | head -2
curl -sI https://inkhotels.gr/en/dream-weadding | head -2   # yes, the typo
curl -sI https://inkhotels.gr/de/en/rooms     | head -2
```

### 7. Add HSTS — now, and not before

`Strict-Transport-Security` was deliberately left out until this point. It
cannot be recalled: a browser that has seen it refuses plain HTTP for the whole
`max-age`, whatever happens to the certificate afterwards.

In [`next.config.ts`](next.config.ts), beside the other headers:

```ts
{ key: "Strict-Transport-Security", value: "max-age=300; includeSubDomains" }
```

Start at **300 seconds**. Leave it a week. If nothing has broken, raise it to
`max-age=63072000; includeSubDomains; preload`.

### 8. Search Console

1. Add `inkhotels.gr` as a **Domain property** (DNS verification — it covers
   every subdomain and both protocols at once).
2. Submit the sitemap: `https://inkhotels.gr/sitemap.xml`.
3. **Use the Change of Address tool only if the hostname changed.** It did not
   — this is the same domain with a new site — so skip it. Running it for a
   same-domain rebuild is a common and unhelpful mistake.
4. Request indexing for `/`, `/rooms` and `/story` to prompt a first crawl.

### 9. Watch the 404s

For the first two weeks, this is the whole job.

- Search Console → **Pages → Not found (404)**, weekly.
- Any URL appearing there that the old site published is a missing row in
  [`redirects.mjs`](redirects.mjs). Add it, push; CI proves the destination
  resolves.
- Do not add redirects for URLs the old site never had. A 404 for something
  that never existed is the correct answer.

---

## Rolling back

Up to and including step 6, rollback is: point DNS back at the old host. With
TTL at 300 that is visible in about five minutes.

**After step 7 (HSTS), rollback over plain HTTP is no longer possible for
anyone who has visited.** That is why HSTS is step 7 and starts at 300 seconds.

---

## Afterwards

- Raise the DNS TTL back to something sensible (3600+).
- Raise `max-age` on HSTS once the week is quiet.
- Delete this line when both are done.
