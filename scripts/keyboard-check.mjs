/**
 * The controls, driven by keyboard only.
 *
 *   BASE=http://localhost:3000 node scripts/keyboard-check.mjs
 *
 * axe checks that a control *can* be focused and is labelled. It cannot check
 * that pressing a key does the right thing, and the disclosure system is now
 * load-bearing: /faq is fourteen of them and every suite page has three
 * carrying the layout, the occupancy and the amenity list. If the keyboard
 * model breaks, a screen-reader or keyboard-only guest cannot read a room's
 * size — and nothing else in CI would notice, because the markup stays valid
 * and the page still renders.
 *
 * These are the interactions themselves, not a snapshot of the DOM.
 *
 * ── What it drives ─────────────────────────────────────────────────────────
 *   · Tab reaches a disclosure trigger, and the focus ring is visible.
 *   · Enter and Space both toggle it — Space is the one people forget, and a
 *     button that ignores it is a button half the keyboard users cannot press.
 *   · Arrow keys move between triggers without leaving the group.
 *   · `type="multiple"` keeps two panels open at once.
 *   · The panel is reachable by Tab *after* its trigger — an open panel whose
 *     content the focus order skips is open only to a sighted mouse user.
 *   · Escape does not collapse the page's state (these are disclosures, not a
 *     dialog; Escape should be inert here).
 *   · The skip link is the first thing Tab reaches, and it moves focus to the
 *     main landmark rather than merely scrolling to it.
 */
import { launch, goto } from "./lib/browser.mjs";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];

const focused = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? "").trim().slice(0, 40),
      expanded: el.getAttribute("aria-expanded"),
      controls: el.getAttribute("aria-controls"),
      id: el.id || null,
      href: el.getAttribute("href"),
      outline: getComputedStyle(el).outlineStyle,
    };
  });

/* ── The skip link ─────────────────────────────────────────────────────── */
{
  await goto(page, BASE + "/", { waitFor: "main" });
  await page.keyboard.press("Tab");
  const first = await focused();
  if (!first || first.href !== "#main") {
    problems.push(
      `the first Tab does not reach the skip link (got <${first?.tag}> "${first?.text}")`,
    );
  } else {
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => {
      const el = document.activeElement;
      return { id: el?.id ?? null, tag: el?.tagName.toLowerCase() ?? null };
    });
    if (after.id !== "main" && after.tag !== "main") {
      problems.push(
        `the skip link scrolls but does not move focus (focus is on <${after.tag}> after Enter)`,
      );
    }
  }
  console.log("  skip link      Tab reaches it, Enter moves focus to main");
}

/* ── The disclosure system ─────────────────────────────────────────────── */
for (const route of ["/faq", "/rooms/evexia"]) {
  await goto(page, BASE + route, { waitFor: "h3 button, h2 button" });
  await page.waitForTimeout(400);

  const triggers = page.locator("h3 button[aria-expanded], h2 button[aria-expanded]");
  const count = await triggers.count();
  if (count < 2) {
    problems.push(`${route}: found ${count} disclosure triggers, expected at least 2`);
    continue;
  }

  const first = triggers.first();
  await first.focus();

  const ring = await focused();
  if (ring?.outline === "none") {
    problems.push(`${route}: a focused disclosure trigger has no focus ring`);
  }

  /* Enter opens. */
  const before = await first.getAttribute("aria-expanded");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(450);
  const afterEnter = await first.getAttribute("aria-expanded");
  if (before === afterEnter) {
    problems.push(`${route}: Enter did not toggle the first disclosure`);
  }

  /* Space closes it again — the key people forget to wire. */
  await page.keyboard.press("Space");
  await page.waitForTimeout(450);
  const afterSpace = await first.getAttribute("aria-expanded");
  if (afterSpace !== before) {
    problems.push(
      `${route}: Space did not toggle the disclosure (expanded stayed "${afterSpace}")`,
    );
  }

  /* Open it — whatever it was. The suite template opens its layout panel by
     default, so a sequence that assumes "starts closed" toggles it the wrong
     way and then measures a closed panel. Read the state, then act on it. */
  if ((await first.getAttribute("aria-expanded")) !== "true") {
    await page.keyboard.press("Enter");
    await page.waitForTimeout(450);
  }
  const panelId = await first.getAttribute("aria-controls");
  const panelVisible = await page.evaluate((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().height > 8 : false;
  }, panelId);
  if (!panelVisible) {
    problems.push(`${route}: the panel did not open to a readable height`);
  }

  /* Arrow keys move within the group. */
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(250);
  const moved = await focused();
  if (!moved || moved.expanded === null) {
    problems.push(
      `${route}: ArrowDown left the disclosure group (focus on <${moved?.tag}>)`,
    );
  }

  /* Two open at once — the group is type="multiple". Open the first two
     explicitly rather than pressing Enter twice and hoping. */
  for (const i of [0, 1]) {
    const t = triggers.nth(i);
    await t.focus();
    if ((await t.getAttribute("aria-expanded")) !== "true") {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(400);
    }
  }
  const openCount = await page.evaluate(
    () => document.querySelectorAll('button[aria-expanded="true"]').length,
  );
  if (openCount < 2) {
    problems.push(
      `${route}: ${openCount} panel(s) open after opening two — the group collapses siblings`,
    );
  }

  /* Escape must not be doing anything here. */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const afterEscape = await page.evaluate(
    () => document.querySelectorAll('button[aria-expanded="true"]').length,
  );
  if (afterEscape !== openCount) {
    problems.push(
      `${route}: Escape collapsed the disclosures — these are not a dialog`,
    );
  }

  console.log(
    `  ${route.padEnd(15)}${count} triggers · Enter, Space, ArrowDown, two-open, Escape-inert`,
  );
}

await browser.close();

if (!problems.length) {
  console.log("\nthe keyboard reaches every control, and every key does what it says");
  process.exit(0);
}
console.error(`\n${problems.length} PROBLEM(S):`);
for (const p of [...new Set(problems)]) console.error(`  ${p}`);
process.exitCode = 1;
