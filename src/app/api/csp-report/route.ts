import { NextResponse } from "next/server";

/**
 * Where Content-Security-Policy violation reports land.
 *
 * The policy is delivered Report-Only, and a Report-Only policy without
 * somewhere to report to is decoration. WebKit says so out loud — "the policy
 * will have no effect" — and it is right: Safari collects nothing without a
 * `report-to`, and Safari is most of the mobile traffic a Greek hotel sees.
 * The cross-browser check caught this on the run after the policy shipped.
 *
 * ── What it does, and deliberately does not do ─────────────────────────────
 * It logs one compact line per violation and answers 204. There is no storage,
 * no queue and no alerting: the point of this endpoint is the fortnight
 * between shipping a policy and enforcing it, when somebody reads the runtime
 * logs, finds the two directives that were too strict, and fixes them.
 *
 * It is a public unauthenticated POST, because that is the only thing a
 * browser will send a report to — so it is written to be dull to abuse:
 * the body is capped, anything unparseable is dropped without comment, and
 * nothing is echoed back. `robots.txt` disallows `/api/`, and a report is
 * discarded the moment it stops being a report.
 */

/** A report is a few hundred bytes. Anything larger is not a report. */
const MAX_BYTES = 8_000;

export async function POST(request: Request) {
  try {
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return new NextResponse(null, { status: 204 });

    const text = (await request.text()).slice(0, MAX_BYTES);
    const body = JSON.parse(text) as
      | { "csp-report"?: Record<string, unknown> }
      | Array<{ body?: Record<string, unknown> }>;

    /* Two shapes: `report-uri` sends {"csp-report": {...}}, `report-to` sends
       an array of reports. Both are read so neither browser is silently
       ignored. */
    const reports = Array.isArray(body)
      ? body.map((r) => r.body ?? {})
      : [body["csp-report"] ?? {}];

    for (const r of reports) {
      const directive = r["violated-directive"] ?? r["effectiveDirective"] ?? "?";
      const blocked = r["blocked-uri"] ?? r["blockedURL"] ?? "?";
      const doc = r["document-uri"] ?? r["documentURL"] ?? "?";
      console.warn(`[csp] ${String(directive)} blocked ${String(blocked)} on ${String(doc)}`);
    }
  } catch {
    /* Malformed, truncated, or not JSON. A browser sent it; nothing here
       should care enough to answer. */
  }

  return new NextResponse(null, { status: 204 });
}

/** Anything other than a POST is not a report. */
export async function GET() {
  return new NextResponse(null, { status: 405 });
}
