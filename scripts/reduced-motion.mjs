/**
 * With prefers-reduced-motion on, no content may be left invisible.
 * Reveal-on-scroll patterns commonly strand elements at opacity 0 when the
 * animation that was supposed to bring them in never runs.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const ROUTES = [
  "/",
  "/rooms",
  "/rooms/harmony",
  "/experiences",
  "/experiences/private-boat-trip",
  "/gallery",
  "/story",
  "/rethymno",
  "/location",
  "/contact",
  "/faq",
  "/accessibility",
  "/careers",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

let problems = 0;

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  const hidden = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("main *, footer *")) {
      if (!(el instanceof HTMLElement)) continue;
      const text = (el.textContent ?? "").trim();
      if (!text || text.length < 4) continue;
      if (el.children.length > 0) continue; // leaf nodes only
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const op = Number(s.opacity);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      // Stranded: invisible, or pushed far outside its own box by a transform.
      const m = new DOMMatrixReadOnly(s.transform);
      if (op < 0.15 || Math.abs(m.f) > 40) {
        out.push({
          text: text.slice(0, 50),
          opacity: op,
          translateY: Math.round(m.f),
          cls: el.className?.toString().slice(0, 60),
        });
      }
    }
    return out;
  });

  if (hidden.length) {
    problems += hidden.length;
    console.log(`\n${route} — ${hidden.length} stranded element(s):`);
    for (const h of hidden.slice(0, 5)) {
      console.log(
        `   opacity ${h.opacity} translateY ${h.translateY}  "${h.text}"  ${h.cls}`,
      );
    }
  } else {
    console.log(`${route} — ok`);
  }
}

await browser.close();
console.log(
  problems === 0
    ? "\nreduced-motion: all content visible"
    : `\nreduced-motion: ${problems} stranded elements`,
);
if (problems) process.exitCode = 1;
