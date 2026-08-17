/**
 * A contact sheet of the three finalists for the car photograph, so the choice
 * can be looked at rather than read about.
 *
 *   OUT=<dir> node scripts/car-finalists.mjs
 *
 * Dev tooling. Writes one sheet to OUT; nothing enters the project except the
 * frame that is actually chosen.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = process.env.OUT ?? "candidates";
mkdirSync(OUT, { recursive: true });

const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
};

const W = 1000;
const H = 640;

const FINALISTS = [
  {
    label: "IN USE — mint Jolly · pastel · no people · plate blurred",
    verdict: "meets every stated criterion",
    file: "public/media/placeholder-fiat-500-cabrio.webp",
  },
  {
    label: "white 500C · the only cream open-top in any of the four pools",
    verdict: "BLOCKED: driver's face, and cropping it out removes the roof",
    url: "https://images.pexels.com/photos/37870913/pexels-photo-37870913.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    label: "red classic cabrio · no people · no plate · Roman archway",
    verdict: "BLOCKED: red is off-palette",
    url: "https://images.pexels.com/photos/34311097/pexels-photo-34311097.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const caption = (label, verdict) =>
  Buffer.from(
    `<svg width="${W}" height="72" xmlns="http://www.w3.org/2000/svg">
       <rect width="${W}" height="72" fill="#1a1512"/>
       <text x="20" y="30" font-family="Georgia, serif" font-size="19" fill="#faf5ea">${esc(label)}</text>
       <text x="20" y="56" font-family="Georgia, serif" font-size="16" fill="#f5c97b">${esc(verdict)}</text>
     </svg>`,
  );

const rows = [];
for (const f of FINALISTS) {
  let input;
  if (f.file) {
    input = f.file;
  } else {
    const res = await fetch(f.url, { headers: UA });
    if (!res.ok) throw new Error(`${f.label}: ${res.status}`);
    input = Buffer.from(await res.arrayBuffer());
  }
  const plate = await sharp(input)
    .resize(W, H, { fit: "cover", position: "centre" })
    .toBuffer();
  rows.push(
    await sharp({
      create: { width: W, height: H + 72, channels: 3, background: "#1a1512" },
    })
      .composite([
        { input: plate, top: 0, left: 0 },
        { input: caption(f.label, f.verdict), top: H, left: 0 },
      ])
      .png()
      .toBuffer(),
  );
}

const sheet = join(OUT, "fiat-finalists.png");
await sharp({
  create: {
    width: W,
    height: (H + 72) * rows.length,
    channels: 3,
    background: "#1a1512",
  },
})
  .composite(rows.map((input, i) => ({ input, top: (H + 72) * i, left: 0 })))
  .png()
  .toFile(sheet);

console.log(`contact sheet → ${sheet}`);
