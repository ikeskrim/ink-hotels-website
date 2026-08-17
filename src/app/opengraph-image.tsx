import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const alt =
  "Ink Hotels — seven suites in the medieval old town of Rethymno, Crete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, drawn over the site's own hero photograph.
 *
 * It used to be type on a flat dark ground — correct, and completely mute in a
 * feed. A share card competes with photographs, so it now carries one: the
 * Egyptian lighthouse at the Venetian harbour, the same frame that opens the
 * homepage, pre-cropped to 1200×630 by hand so nothing has to be resized at
 * request time.
 *
 * The photograph is read from disk and inlined as a data URI. Satori will not
 * fetch a relative URL and has no network in some deploy targets; a card that
 * silently loses its background in production is worse than one that never
 * had it.
 *
 * Rendered at the edge of the build so it always matches the current copy.
 */
export default async function OpengraphImage() {
  const read = async (rel: string) => {
    try {
      return await fs.readFile(path.join(process.cwd(), rel));
    } catch {
      return null;
    }
  };

  const [fontData, photo] = await Promise.all([
    read(
      path.join(
        "node_modules",
        "next",
        "dist",
        "compiled",
        "@vercel",
        "og",
        "noto-sans-v27-latin-regular.ttf",
      ),
    ),
    read(path.join("public", "media", "og-hero.jpg")),
  ]);

  const bg = photo
    ? `url(data:image/jpeg;base64,${photo.toString("base64")})`
    : undefined;

  const rings = [3.6, 7.6, 11.8, 16.1, 20.5, 25, 29.6, 34.3, 39.1, 44].map(
    (r, i) => ({ r, dx: i * 0.85, dy: i * 0.52 }),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1512",
          backgroundImage: bg,
          backgroundSize: "1200px 630px",
          color: "#faf5ea",
          padding: 72,
          position: "relative",
        }}
      >
        {/* The same grade the hero carries: warm floor, weighted left, so the
            type holds over any part of the photograph. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(26,21,18,0.95) 0%, rgba(26,21,18,0.55) 45%, rgba(26,21,18,0.25) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to right, rgba(26,21,18,0.8) 0%, rgba(26,21,18,0.15) 60%, rgba(26,21,18,0) 100%)",
          }}
        />

        <div
          style={{ display: "flex", alignItems: "center", gap: 28, position: "relative" }}
        >
          <svg width="84" height="84" viewBox="0 0 100 100" fill="none">
            {rings.map((ring, i) => (
              <circle
                key={i}
                cx={50 - ring.dx}
                cy={50 - ring.dy}
                r={ring.r}
                stroke="#f5c97b"
                strokeWidth="3.2"
              />
            ))}
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              letterSpacing: 14,
              fontWeight: 400,
            }}
          >
            INK
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05 }}>
            Seven suites in the old town.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#e6dfcf",
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            Three with a private hot tub, one with a plunge pool. Seven rooms at
            Phos. Rethymno, Crete.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 5,
            color: "#cfc6b2",
            borderTop: "1px solid rgba(250,245,234,0.25)",
            paddingTop: 24,
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>RETHYMNO · CRETE</div>
          <div style={{ display: "flex" }}>INKHOTELS.GR</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Noto Sans", data: fontData, style: "normal", weight: 400 }]
        : undefined,
    },
  );
}
