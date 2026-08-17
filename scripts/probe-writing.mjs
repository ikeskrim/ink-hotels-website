/** Watch the Story page's written mark settle. Dev tooling. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await (
  await browser.newContext({ viewport: { width: 1440, height: 900 } })
).newPage();

await page.goto(`${BASE}/story`, { waitUntil: "networkidle" });

const read = async (wait) => {
  await page.waitForTimeout(wait);
  return page.evaluate(() => {
    const el = [...document.querySelectorAll("p")].find((e) =>
      e.textContent.includes("Set, inked"),
    );
    const rect = el?.getBoundingClientRect();
    const sig = document.querySelector('svg[aria-label="Ink"]');
    const clip = sig?.querySelector("rect");
    return {
      imprintStyle: el?.getAttribute("style"),
      imprintTop: rect ? Math.round(rect.top) : null,
      signature: Boolean(sig),
      clipWidth: clip?.getAttribute("width") ?? clip?.style.width ?? null,
    };
  });
};

console.log("t≈0.5s", await read(500));
console.log("t≈2.0s", await read(1500));
console.log("t≈5.0s", await read(3000));
console.log("t≈8.0s", await read(3000));

await browser.close();
