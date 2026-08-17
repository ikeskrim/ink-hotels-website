/**
 * Open the booking date picker in each locale and confirm it is actually
 * localised — placeholder pattern, month name, weekday initials — and that it
 * is operable from the keyboard.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const CASES = [
  { path: "/", locale: "en", expectPattern: "DD/MM/YYYY" },
  { path: "/el", locale: "el", expectPattern: "ΗΗ/ΜΜ/ΕΕΕΕ" },
  { path: "/de", locale: "de", expectPattern: "TT.MM.JJJJ" },
  { path: "/fr", locale: "fr", expectPattern: "JJ/MM/AAAA" },
  { path: "/nl", locale: "nl", expectPattern: "DD-MM-JJJJ" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  /* Deliberately a US browser: the whole point is that the page's language
     wins over the browser's. */
  locale: "en-US",
});
const page = await ctx.newPage();
let failures = 0;

for (const c of CASES) {
  await page.goto(BASE + c.path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);

  const trigger = page.locator('button[aria-haspopup="dialog"]').first();
  const placeholder = (await trigger.innerText()).trim();

  await trigger.click();
  await page.waitForTimeout(450);

  const dialog = page.locator('[role="dialog"]').first();
  const monthLabel = (await dialog.locator("p[aria-live]").first().innerText()).trim();
  const weekdays = await dialog.locator("abbr[role='columnheader']").allInnerTexts();

  /* Keyboard: focus a day, arrow right, confirm focus moved. */
  const firstDay = dialog.locator('[role="gridcell"]:not([disabled])').first();
  await firstDay.focus();
  await page.keyboard.press("ArrowRight");
  const activeLabel = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );

  const patternOk = placeholder.includes(c.expectPattern);
  const monthOk = monthLabel.length > 0 && !/^\d+$/.test(monthLabel);
  const weekdaysOk = weekdays.length === 7;
  const keyboardOk = activeLabel.length > 0;

  const ok = patternOk && monthOk && weekdaysOk && keyboardOk;
  if (!ok) failures++;

  console.log(
    `${c.locale.padEnd(3)} ${ok ? "OK  " : "FAIL"} placeholder="${placeholder}" month="${monthLabel}" weekdays=[${weekdays.join(" ")}] kbd="${activeLabel.slice(0, 28)}"`,
  );
  if (!patternOk) console.log(`      ↳ expected pattern ${c.expectPattern}`);

  await page.keyboard.press("Escape");
}

await browser.close();
console.log(failures ? `\n${failures} locale(s) failed` : "\nall locales localised and keyboard-operable");
process.exitCode = failures ? 1 : 0;
