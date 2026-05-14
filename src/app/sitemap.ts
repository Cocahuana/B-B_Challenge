// app/sitemap.ts — Dynamic XML sitemap
//
// WHY app/sitemap.ts (not public/sitemap.xml):
//   A static file in /public is fixed at deploy time. Using Next.js's built-in
//   sitemap route means we can:
//   1. Pull `_updatedAt` from Sanity so <lastmod> reflects actual content changes.
//   2. Derive the base URL from an env var — no hardcoded domain in source code.
//   3. Automatically include hreflang alternates per URL entry so search engines
//      understand the DE/EN relationship without a separate XSL stylesheet.
//
// Next.js serves this at /sitemap.xml automatically.
//
// WHY revalidate = 3600 (1 hour):
//   The sitemap changes only when pages are added/removed or content is updated.
//   An hourly regeneration is fresh enough for Google's crawl scheduler while
//   avoiding a Sanity API call on every single request. The on-demand revalidation
//   webhook at /api/revalidate does NOT bust the sitemap cache — that's intentional
//   because sitemap changes are structural (new pages), not content edits.

import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/lib/client";
import { locales } from "@/lib/i18n/routing";

export const revalidate = 3600; // regenerate at most every hour

// WHY env var for baseUrl:
//   Hard-coding the production domain would break previews and staging environments.
//   NEXT_PUBLIC_SITE_URL is set in Vercel's environment variables per deployment
//   environment. The fallback ensures a reasonable value locally.
const baseUrl = (
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bellabona.com"
).replace(/\/$/, ""); // strip trailing slash to avoid double-slashes in URLs

// WHY a separate lightweight query (not homePageQuery):
//   We only need _updatedAt for <lastmod>. Fetching the entire homepage payload
//   (sections, images, SEO fields) just to read a timestamp is wasteful.
//   This query is <50 bytes and returns a single string.
const homePageTimestampQuery = /* groq */ `
  *[_type == "homePage" && _id == "homePage"][0]._updatedAt
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// WHY catch + fallback: the sitemap must always be serveable. If Sanity is
	// temporarily unavailable, we fall back to `new Date()` rather than throwing
	// a 500 — a slightly stale <lastmod> is better than no sitemap at all.
	const lastModified = await sanityClient
		.fetch<string | null>(homePageTimestampQuery)
		.then((ts) => (ts ? new Date(ts) : new Date()))
		.catch(() => new Date());

	// WHY alternates.languages on every entry:
	//   Google's sitemap hreflang spec requires that if you declare hreflang in
	//   the sitemap, ALL locale variants of a URL must appear in the same sitemap
	//   and each must reference all the others (including x-default). Omitting
	//   this causes Google Search Console warnings.
	const hreflangAlternates = {
		languages: {
			...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
			// WHY x-default → /de: German is the primary market (x-default is
			// shown to users whose browser language doesn't match any locale).
			"x-default": `${baseUrl}/de`,
		},
	};

	// One sitemap entry per locale.
	// WHY priority 1.0 for DE, 0.9 for EN:
	//   Priority is a relative hint within the same sitemap. DE is the primary
	//   market and the canonical source of content; EN is a translation. Giving
	//   DE the highest priority nudges crawlers to allocate more crawl budget to
	//   the German pages, which is correct for Bella&Bona's SEO strategy.
	//
	// HOW TO ADD A NEW PAGE:
	//   1. Add a new entry to this array for each locale variant of the new page.
	//   2. If the page has a dynamic slug, fetch all slugs from Sanity above and
	//      use .flatMap(locale => slugs.map(slug => ({ url: `${baseUrl}/${locale}/${slug}`, ... })))
	return locales.map((locale, index) => ({
		url: `${baseUrl}/${locale}`,
		lastModified,
		changeFrequency: "weekly" as const,
		priority: index === 0 ? 1.0 : 0.9,
		alternates: hreflangAlternates,
	}));
}
