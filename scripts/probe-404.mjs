/** What does the global 404 actually serve? Dev tooling. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();

const res = await page.goto(`${BASE}/404-nope`, { waitUntil: "networkidle" });
console.log("status:", res?.status());

const html = await page.content();
console.log("length:", html.length);
console.log("stylesheet links:", (html.match(/rel="stylesheet"/g) ?? []).length);
console.log("inline styles  :", (html.match(/<style/g) ?? []).length);
console.log("head:", html.slice(0, 900).replace(/\s+/g, " "));

await browser.close();
