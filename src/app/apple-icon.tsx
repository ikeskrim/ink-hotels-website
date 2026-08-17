import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The home-screen icon.
 *
 * The layout previously pointed at `/apple-icon.png`, which was never in
 * `public/` — every iOS device asking for it got a 404 and fell back to a
 * screenshot of the page. Drawing it here means it is always the current mark
 * and can never drift out of sync with the header lockup.
 *
 * Six rings rather than the header's eight: iOS renders this at 60pt on a home
 * screen, where eight rings close to 1px apart merge into a disc.
 */
export default function AppleIcon() {
  const rings = [
    { r: 7.5, dx: 0.4, dy: 0.3 },
    { r: 17.5, dx: 1.5, dy: 0.9 },
    { r: 27.8, dx: 2.9, dy: 1.8 },
    { r: 38.4, dx: 4.6, dy: 2.8 },
    { r: 49.2, dx: 6.6, dy: 4.0 },
    { r: 60.2, dx: 8.9, dy: 5.4 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1512",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {rings.map((ring, i) => (
            <circle
              key={i}
              cx={92 - ring.dx}
              cy={91 - ring.dy}
              r={ring.r}
              /* The core carries the brand teal, the spread carries paper —
                 the same relationship the header lockup has. */
              stroke={i === 0 ? "#5fbecf" : "#faf5ea"}
              strokeWidth="7"
            />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
