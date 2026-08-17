import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Publish-to-live.
 *
 * Sanity calls this when a document is published, and the page that uses that
 * document is rebuilt. Without it an edit would sit invisible until the next
 * deploy, which is exactly the frustration a CMS is supposed to remove.
 *
 * Only the affected type is invalidated, not the whole site — editing one FAQ
 * should not throw away 268 prerendered pages.
 *
 * Setup (once, in sanity.io/manage → API → Webhooks):
 *   URL     https://inkhotels.gr/api/revalidate
 *   Trigger on   Create, Update, Delete
 *   Filter       _type in ["homepage","room","house","experience","experienceGroup",
 *                          "gallery","galleryCategory","place","chapter","faq",
 *                          "arrivalPage","simplePage","siteSettings"]
 *   Secret       the same value as SANITY_REVALIDATE_SECRET in the environment
 *
 * The signature is verified — an unsigned request is refused, so this cannot be
 * used by anyone else to hammer the site into rebuilding.
 */

export const runtime = "nodejs";

/* Documents that change the whole site's chrome rather than one page. */
const GLOBAL_TYPES = new Set(["siteSettings"]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Revalidation is not configured." },
      { status: 501 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
    }

    const type = body?._type;
    if (!type) {
      return NextResponse.json({ message: "No document type." }, { status: 400 });
    }

    revalidateTag(type);
    /* Settings appear in the header and footer of every page. */
    if (GLOBAL_TYPES.has(type)) {
      for (const t of ["homepage", "room", "experience", "gallery"]) {
        revalidateTag(t);
      }
    }

    return NextResponse.json({ revalidated: true, type });
  } catch (error) {
    console.error("[revalidate]", error);
    return NextResponse.json({ message: "Could not revalidate." }, { status: 500 });
  }
}
