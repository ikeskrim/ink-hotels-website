/**
 * One place to launch Chromium, and one place to navigate.
 *
 * Two faults were costing red builds on green code:
 *
 * /dev/shm. A CI container gives Chromium a 64 MB shared-memory segment. Chrome
 * puts its renderer surfaces there, and a page with a lot of image decode work
 * — /rooms/harmony carries a full room gallery plus the cross-sell strip —
 * exhausts it and the renderer stops making progress. It does not crash; it
 * hangs, so `domcontentloaded` simply never fires and the wait runs out. That
 * is why the failure looked like slowness and survived raising the timeout
 * from 30 s to 60 s: twice sixty seconds of a wedged renderer is still wedged.
 * `--disable-dev-shm-usage` moves those surfaces to /tmp, which is disk-backed
 * and not capped.
 *
 * Waiting for the wrong thing. These checks read prerendered markup — headings,
 * links, `lang`. All of it is in the first byte of the response. Waiting for
 * `domcontentloaded` waits for every deferred script on the page as well, which
 * is work the check does not care about and the runner is worst at. `commit`
 * plus a selector says what is actually wanted: the response has started and
 * the thing being measured is in the DOM.
 */
import { chromium } from "playwright";

const TIMEOUT = Number(process.env.NAV_TIMEOUT ?? 60_000);

/** A browser configured for a constrained runner. */
export function launch() {
  return chromium.launch({
    args: [
      /* The fix above. Without it a busy page wedges the renderer. */
      "--disable-dev-shm-usage",
      /* CI containers run as root; Chrome's sandbox needs privileges it does
         not have there. Harmless locally, required on the runner. */
      "--no-sandbox",
      /* Nothing here is measuring paint smoothness, and software GL on a
         headless runner is a common source of multi-second stalls. */
      "--disable-gpu",
    ],
  });
}

/**
 * Navigate and wait for the markup the caller actually reads.
 *
 * @param {import("playwright").Page} page
 * @param {string} url
 * @param {{ waitFor?: string, waitUntil?: "commit" | "domcontentloaded" | "load" }} [opts]
 */
export async function goto(page, url, opts = {}) {
  const waitUntil = opts.waitUntil ?? "commit";
  const waitFor = opts.waitFor ?? "main, h1, body";

  const once = async () => {
    const res = await page.goto(url, { waitUntil, timeout: TIMEOUT });
    await page.waitForSelector(waitFor, { timeout: TIMEOUT, state: "attached" });
    return res;
  };

  try {
    return await once();
  } catch (first) {
    console.warn(`  retrying ${url} (${first.name ?? "error"})`);
    try {
      return await once();
    } catch {
      throw first;
    }
  }
}
