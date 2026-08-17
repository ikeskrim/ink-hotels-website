/**
 * Navigate, with the patience CI actually needs.
 *
 * Playwright's default navigation timeout is 30 s, which is generous on a
 * developer's machine and a coin flip on a shared runner: the CI job launches
 * Chromium four times in sequence, and by the fourth the box is under enough
 * memory pressure that a page serving in 28 ms locally can take longer than
 * that to fire `domcontentloaded`.
 *
 * That produced a red build with nothing wrong with the site — the worst kind,
 * because the fix people learn is "re-run it", and after a few of those nobody
 * reads the check at all.
 *
 * So: a longer ceiling, and one retry. If a page genuinely cannot load twice
 * inside a minute each, that is a real failure and the caller still hears
 * about it.
 */
const TIMEOUT = Number(process.env.NAV_TIMEOUT ?? 60_000);

/**
 * @param {import("playwright").Page} page
 * @param {string} url
 * @param {{ waitUntil?: "load" | "domcontentloaded" | "networkidle" }} [opts]
 */
export async function goto(page, url, opts = {}) {
  const waitUntil = opts.waitUntil ?? "domcontentloaded";
  try {
    return await page.goto(url, { waitUntil, timeout: TIMEOUT });
  } catch (first) {
    console.warn(`  retrying ${url} (${first.name ?? "error"})`);
    try {
      return await page.goto(url, { waitUntil, timeout: TIMEOUT });
    } catch {
      throw first;
    }
  }
}
