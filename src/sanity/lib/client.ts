// src/sanity/lib/client.ts
//
// WHY: We centralise ALL Sanity client creation here. No other file should
// call `createClient` directly — this makes it trivial to swap options
// (e.g. enable stega for visual editing) in a single place.

import { createClient } from "next-sanity";

// ─── Environment variables ────────────────────────────────────────────────────
// These are validated at module load time so misconfiguration fails fast
// during `next build` rather than silently at runtime.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
	throw new Error(
		"Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.\n" +
			"Copy .env.local.example to .env.local and fill in your project ID.",
	);
}

// ─── Read-only public client (used in Server Components / ISR pages) ──────────
// WHY useCdn: true — Sanity's CDN is globally distributed and dramatically
// reduces query latency. It is safe for ISR because the page itself controls
// freshness via `export const revalidate`; we don't need the API edge for that.
// The CDN has a ~60 s propagation lag which is acceptable given our revalidate
// interval is also 60 s.
export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	// WHY perspective: "published" — As of API version 2025-02-19 this is the
	// default, but we set it explicitly so the intent is clear: this client
	// never returns draft documents to public visitors.
	perspective: "published",
});

// ─── Server-side write/preview client (used for revalidation & webhooks) ─────
// WHY a separate client: the read token must NEVER be sent to the browser.
// Keeping it in a separate export makes it obvious which client is safe to
// pass to Client Components and which is not.
//
// This client is used by:
//   - On-demand revalidation route handlers (Phase 9)
//   - Any future draft-mode preview page
export function getServerClient() {
	const token = process.env.SANITY_API_READ_TOKEN;

	// WHY: we only throw at call time (not module load) so that the public
	// client above can still be used in environments without the token (e.g.
	// during `next dev` before .env.local is set up).
	if (!token) {
		throw new Error(
			"Missing SANITY_API_READ_TOKEN environment variable.\n" +
				"This is required for on-demand revalidation and draft previews.",
		);
	}

	return createClient({
		projectId,
		dataset,
		apiVersion,
		// WHY useCdn: false — token-authenticated requests must bypass the CDN
		// because the CDN cannot forward auth headers. Draft content also lives
		// outside the CDN layer.
		useCdn: false,
		token,
		perspective: "published",
	});
}
