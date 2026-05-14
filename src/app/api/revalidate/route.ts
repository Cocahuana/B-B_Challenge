// On-demand ISR revalidation endpoint
//
// WHY this exists:
//   The homepage uses ISR with `revalidate = 60`, meaning cached HTML is
//   at most 60 seconds stale. That's acceptable for most content changes,
//   but editors expect to see their Sanity publish reflected immediately.
//   This webhook lets Sanity call POST /api/revalidate to bust the cache
//   the moment a document is published — combining ISR's performance with
//   the freshness of SSR.
//
// HOW to wire it up in Sanity:
//   1. In your Sanity project dashboard → API → Webhooks → "Create webhook"
//   2. URL: https://your-domain.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
//   3. Dataset: production
//   4. Trigger on: "Create", "Update", "Delete"
//   5. Filter: _type == "homePage" || _type == "siteSettings"
//      (restrict to documents that affect the homepage to avoid needless
//       revalidations for every Studio action)
//
// HOW the secret works:
//   The SANITY_REVALIDATE_SECRET env var must be set in both Vercel and
//   the Sanity webhook URL query string. It acts as a shared secret that
//   prevents unauthorized actors from invalidating the cache at will.
//   Never commit this value — use Vercel's environment variables UI.
//
// WHY revalidatePath (not revalidateTag):
//   revalidateTag requires a consistent tag on all fetches and is more
//   ergonomic when you have many tagged fetch calls. For a single-page
//   site, revalidatePath("/[lang]", "page") for each locale is simpler
//   and has identical effect.

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Next.js route segment config — this route is always dynamic (no caching).
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	// WHY search params (not request body) for the secret:
	// Sanity webhooks support query-string secrets natively in their UI.
	// A header-based secret would work too but requires extra Sanity config.
	const secret = req.nextUrl.searchParams.get("secret");

	// Constant-time comparison would be ideal here; in practice the secret
	// length makes timing attacks impractical over HTTPS, but we keep it
	// simple — this is not a security boundary where sub-ms timing matters.
	if (
		!process.env.SANITY_REVALIDATE_SECRET ||
		secret !== process.env.SANITY_REVALIDATE_SECRET
	) {
		return NextResponse.json(
			{ message: "Invalid or missing revalidation secret." },
			{ status: 401 },
		);
	}

	try {
		// Revalidate all supported locales.
		// WHY "page" layout type: we only want to revalidate the page cache,
		// not the layout cache (layout rarely changes and has its own ISR).
		const locales = ["de", "en"] as const;
		for (const locale of locales) {
			revalidatePath(`/${locale}`, "page");
		}

		return NextResponse.json({
			revalidated: true,
			locales,
			timestamp: new Date().toISOString(),
		});
	} catch (err) {
		// Surface the error in Vercel logs without leaking internals to the caller.
		console.error("[revalidate] Failed to revalidate:", err);
		return NextResponse.json(
			{ message: "Revalidation failed. Check server logs." },
			{ status: 500 },
		);
	}
}

// WHY block GET: revalidation is a state-mutating operation.
// Accepting GET would let a crawled or cached URL accidentally trigger it.
export async function GET() {
	return NextResponse.json(
		{ message: "Method not allowed. Use POST." },
		{ status: 405 },
	);
}
