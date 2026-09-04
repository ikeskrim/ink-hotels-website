/**
 * The five motion features, under a keyboard and under reduced motion.
 *
 *   BASE=http://localhost:3000 node scripts/features-check.mjs
 *
 * Five things shipped in one session that move, reveal, or cover the page:
 * the character-struck Name heading, the ground-aware header, the amenity
 * bento grid, the drag-up booking sheet, and the gallery ripple. Each was
 * verified by hand when it landed. This is the version that runs every time,
 * because each one has a way of going wrong that no other check would see:
 *
 *   heading   a split heading whose accessible name is "A h o t e l"
 *   header    a white lockup on a light bar, or ink type on ink
 *   grid      a hover-only reveal that a keyboard cannot reach
 *   sheet     a dialog that Tab walks straight out of
 *   ripple    a photograph that keeps rippling with reduced motion on
 *
 * Reduced motion is tested EMPIRICALLY, with a context that asks for it, not
 * by reading the components. Four of the five use framer-motion's
 * useReducedMotion, and in this exact harness that hook once failed to report
 * the preference at all — the ripple kept running until its guard moved into
 * CSS. Code that says "reduced ? 0 : 0.4" proves nothing about what the reader
 * with the setting on actually gets.
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await launch();

let failures = 0;
let checked = 0;
const report = (ok, label, detail = "") => {
  checked++;
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`);
};

/**
 * Contrast is computed IN THE PAGE, by painting.
 *
 * The first version parsed computed colours on the host with a regex and
 * read the first three numbers as 0-255 RGB. Chromium reports the header's
 * background as `oklab(0.97 0.001 0.015 / 0.92)`, so it read a near-white bar
 * as near-black and called ink-on-paper 1.1:1 — while axe's own contrast rule
 * passed the same header on every route. A check that disagrees with axe
 * about arithmetic is the one that is wrong. Painting the colour onto a
 * canvas and reading the pixel back handles every syntax the browser can
 * emit, and painting the bar OVER the ground composites the 92% alpha the
 * way the compositor does.
 */
const CONTRAST_IN_PAGE = `(fg, bg, under) => {
  const c = document.createElement("canvas"); c.width = c.height = 1;
  const x = c.getContext("2d");
  const px = (...layers) => { x.clearRect(0,0,1,1); for (const l of layers) { x.fillStyle = l; x.fillRect(0,0,1,1); } return [...x.getImageData(0,0,1,1).data].slice(0,3); };
  const lum = ([r,g,b]) => { const f = (v) => { const s = v/255; return s <= 0.03928 ? s/12.92 : ((s+0.055)/1.055) ** 2.4; }; return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
  const back = px(under, bg);
  const text = px(under, bg, fg);
  const [hi, lo] = [lum(text), lum(back)].sort((a,b) => b-a);
  return (hi + 0.05) / (lo + 0.05);
}`;

for (const reduced of [false, true]) {
  const mode = reduced ? "reduced-motion" : "motion       ";
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.route("**/*", (route) =>
    ["media", "font"].includes(route.request().resourceType()) ? route.abort() : route.continue(),
  );

  /* ── 1. The Name heading ─────────────────────────────────────────────── */
  await goto(page, BASE + "/", { waitFor: "main" });
  await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2")].find((el) => /named after/i.test(el.textContent || ""));
    h?.scrollIntoView();
  });
  /* The strike is 0.028s of stagger per character plus a 0.26s hit, and it
     starts only once the heading is in view after the smooth-scroll glide. A
     fixed wait was a guess at that sum; on a cold CI runner it guessed wrong
     by seven characters. So: wait until every character is opaque, with a
     ceiling of three times the animation's own length plus two seconds. A
     character that never lands still fails; a slow machine does not. */
  const charCount = await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2")].find((el) => /named after/i.test(el.textContent || ""));
    return h?.querySelectorAll('[aria-hidden="true"] span span').length ?? 0;
  });
  const ceiling = Math.ceil((charCount * 0.028 + 0.26) * 3 * 1000) + 2000;
  const t0 = Date.now();
  const landed = reduced
    ? (await page.waitForTimeout(300), true)
    : await page
        .waitForFunction(
          () => {
            const h = [...document.querySelectorAll("h2")].find((el) => /named after/i.test(el.textContent || ""));
            const chars = [...(h?.querySelectorAll('[aria-hidden="true"] span span') ?? [])];
            return chars.length > 0 && chars.every((c) => parseFloat(getComputedStyle(c).opacity) >= 0.99);
          },
          undefined,
          { timeout: ceiling, polling: 100 },
        )
        .then(() => true)
        .catch(() => false);
  const landedIn = ((Date.now() - t0) / 1000).toFixed(1);

  const heading = await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2")].find((el) => /named after/i.test(el.textContent || ""));
    if (!h) return null;
    const sr = h.querySelector(".sr-only");
    const split = h.querySelectorAll('[aria-hidden="true"] span span');
    const chars = [...h.querySelectorAll('[aria-hidden="true"] span span')];
    const invisible = chars.filter((c) => parseFloat(getComputedStyle(c).opacity) < 0.99).length;
    return {
      sentence: (sr ?? h).textContent.trim(),
      hasSrCopy: Boolean(sr),
      splitSpans: split.length,
      stuckInvisible: invisible,
      hiddenSplitIsAriaHidden: Boolean(h.querySelector('[aria-hidden="true"]')),
    };
  });
  const SENTENCE = "A hotel named after what the building used to make";
  if (!heading) {
    report(false, `${mode} heading: found`, "no h2 mentions the name");
  } else {
    /* Playwright computes the accessible name the way a screen reader does. */
    const byRole = await page.getByRole("heading", { name: SENTENCE, exact: true }).count();
    report(byRole === 1, `${mode} heading: accessible name is the whole sentence`, byRole === 1 ? "" : `getByRole found ${byRole}`);
    if (reduced) {
      report(heading.splitSpans === 0, `${mode} heading: renders as plain text, no split`, `${heading.splitSpans} split spans`);
    } else {
      report(heading.splitSpans > 20 && heading.hiddenSplitIsAriaHidden, `${mode} heading: split is aria-hidden`, `${heading.splitSpans} spans`);
      report(landed && heading.stuckInvisible === 0, `${mode} heading: every character has landed`, landed ? `in ${landedIn}s of a ${(ceiling / 1000).toFixed(1)}s ceiling` : `${heading.stuckInvisible} still invisible after ${landedIn}s`);
    }
  }

  /* ── 2. The header, on every ground it crosses ───────────────────────── */
  for (const route of ["/", "/story"]) {
    await goto(page, BASE + route, { waitFor: "header, main" });
    const bands = await page.evaluate(() => {
      const y = window.scrollY;
      return [...document.querySelectorAll("[data-ground]")]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top + y), height: Math.round(r.height) };
        })
        .filter((b) => b.height > 400 && b.height < document.body.scrollHeight * 0.6);
    });
    const seenGrounds = new Set();
    for (const band of bands) {
      await page.evaluate((y) => window.scrollTo(0, y), band.top + 200);
      await page.waitForTimeout(reduced ? 300 : 1100);
      const m = await page.evaluate(({ H, contrastSrc }) => {
        const contrastInPage = eval(contrastSrc);
        const header = document.querySelector("header");
        const link = header?.querySelector("a");
        const crossing = [...document.querySelectorAll("[data-ground]")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.top <= H && r.bottom > H;
        });
        const deepest = crossing.find((el) => !crossing.some((o) => o !== el && el.contains(o)));
        if (!header || !link || !deepest) return null;
        const solid = header.getAttribute("data-bar") === "solid";
        /* Over a photograph the ground is an image; the section's declared
           background is the token the lockup was designed against. */
        const under = getComputedStyle(deepest).backgroundColor;
        const bar = solid ? getComputedStyle(header).backgroundColor : "rgba(0,0,0,0)";
        return {
          ground: deepest.getAttribute("data-ground"),
          solid,
          ratio: contrastInPage(getComputedStyle(link).color, bar, under),
        };
      }, { H: 72, contrastSrc: CONTRAST_IN_PAGE });
      if (!m || seenGrounds.has(m.ground)) continue;
      seenGrounds.add(m.ground);
      const ratio = m.ratio;
      report(ratio >= 4.5, `${mode} header on ${String(m.ground).padEnd(6)} (${m.solid ? "solid" : "transparent"}): contrast ${ratio.toFixed(1)}:1`);
    }
  }

  /* ── 3. The amenity grid ─────────────────────────────────────────────── */
  await goto(page, BASE + "/rooms/harmony", { waitFor: "main" });
  const trigger = page.locator("h3 button[aria-expanded], h2 button[aria-expanded]").filter({ hasText: /What is in it|amenit/i }).first();
  if (await trigger.count()) await trigger.click().catch(() => {});
  await page.waitForTimeout(500);
  const cells = page.locator("ul li button[aria-pressed]");
  const n = await cells.count();
  report(n >= 10, `${mode} grid: ${n} cells are real buttons`);
  if (n) {
    await page.mouse.move(0, 0);
    await cells.first().focus();
    const order = [];
    for (let i = 0; i < Math.min(n, 5); i++) {
      order.push(await page.evaluate(() => document.activeElement?.textContent?.trim().split("\n")[0] ?? null));
      await page.keyboard.press("Tab");
    }
    const dom = await cells.evaluateAll((els) => els.slice(0, 5).map((e) => e.textContent.trim().split("\n")[0]));
    report(JSON.stringify(order) === JSON.stringify(dom), `${mode} grid: Tab order is DOM order`, JSON.stringify(order) === JSON.stringify(dom) ? "" : `${order.join(" › ")}`);
    const pool = cells.filter({ hasText: /plunge pool/i }).first();
    await pool.focus();
    await page.waitForTimeout(reduced ? 150 : 600);
    const revealed = await page.evaluate(() => {
      const b = document.querySelector('button[aria-pressed="true"]');
      const img = b?.querySelector("img");
      return { pressed: Boolean(b), name: b?.getAttribute("aria-label") || b?.textContent?.trim().split("\n")[0], alt: img?.getAttribute("alt") ?? null };
    });
    report(revealed.pressed && Boolean(revealed.alt), `${mode} grid: focus alone reveals the photograph, with alt`, revealed.alt ?? "no image");
    report(/plunge pool/i.test(revealed.name ?? ""), `${mode} grid: the cell's name is the amenity`, revealed.name ?? "");
  }

  /* ── 5. The gallery ripple ───────────────────────────────────────────── */
  await goto(page, BASE + "/gallery", { waitFor: "main" });
  await page.waitForTimeout(700);
  const tile = page.locator("ul li button").first();
  const img = tile.locator("img").first();
  await tile.hover();
  await page.waitForTimeout(400);
  const onHover = await img.evaluate((el) => getComputedStyle(el).filter);
  report(reduced ? onHover === "none" : onHover.startsWith("url("), `${mode} ripple on hover: ${onHover}`);
  await page.mouse.move(0, 0);
  await tile.focus();
  await page.waitForTimeout(600);
  const captionOnFocus = await tile.evaluate((el) => {
    const cap = el.querySelector("[aria-hidden] , .pointer-events-none");
    return cap ? parseFloat(getComputedStyle(cap).opacity) : -1;
  });
  report(captionOnFocus > 0.9, `${mode} ripple: the caption is not hover-only (opacity on focus ${captionOnFocus})`);

  await ctx.close();

  /* ── 4. The booking sheet, on a phone, keyboard only ─────────────────── */
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const mp = await mob.newPage();
  await mp.route("**/*", (route) =>
    ["image", "media", "font"].includes(route.request().resourceType()) ? route.abort() : route.continue(),
  );
  await goto(mp, BASE + "/rooms/harmony", { waitFor: "main" });
  await mp.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await mp.waitForTimeout(1200);
  const opener = mp.locator("button[aria-expanded]").filter({ hasText: /availability|Verfüg|διαθεσ|disponib|beschikbaar/i }).first();
  report((await opener.count()) === 1, `${mode} sheet: the bar's opener is a button`);
  await opener.focus();
  await mp.keyboard.press("Enter");
  await mp.waitForTimeout(reduced ? 300 : 900);
  const opened = await mp.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-modal="true"]');
    return { open: Boolean(dlg), focusInside: dlg ? dlg.contains(document.activeElement) : false, label: dlg?.getAttribute("aria-label") ?? null };
  });
  report(opened.open && opened.focusInside, `${mode} sheet: opens from the keyboard with focus inside`, opened.label ?? "");
  /* The trap: after many Tabs, focus is still in the dialog or on its backdrop. */
  let escaped = 0;
  for (let i = 0; i < 25; i++) {
    await mp.keyboard.press("Tab");
    const inside = await mp.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"][aria-modal="true"]');
      return Boolean(dlg && dlg.contains(document.activeElement));
    });
    if (!inside) escaped++;
  }
  report(escaped === 0, `${mode} sheet: Tab never leaves the dialog`, escaped ? `left it ${escaped} of 25 times` : "");
  const closeControl = await mp.locator('[role="dialog"] button[aria-label]').count();
  report(closeControl >= 1, `${mode} sheet: a labelled close control exists INSIDE the dialog, no gesture needed`);
  await mp.keyboard.press("Escape");
  await mp.waitForTimeout(reduced ? 300 : 700);
  const closed = await mp.evaluate(() => ({
    gone: !document.querySelector('[role="dialog"][aria-modal="true"]'),
    focusOnOpener: document.activeElement?.getAttribute("aria-expanded") === "false",
  }));
  report(closed.gone && closed.focusOnOpener, `${mode} sheet: Escape closes it and returns focus to the opener`);
  await mob.close();
}

await browser.close();

console.log(`\n${checked} assertions across the five features; ${failures} failed.`);
if (checked < 20) {
  console.log("too few assertions ran — the page structure changed and this check stopped looking");
  process.exitCode = 1;
} else {
  process.exitCode = failures ? 1 : 0;
}
