// app/robots.ts — Dynamic robots.txt
//
// WHY app/robots.ts (not public/robots.txt):
//   A static public/robots.txt would hard-code the Sitemap URL. Using the
//   Next.js robots route lets us pull the domain from NEXT_PUBLIC_SITE_URL
//   so staging/preview environments get their own correct sitemap reference
//   rather than pointing crawlers at the production sitemap.
//
// WHY disallow /studio/:
//   The Sanity Studio is editor-only tooling. We explicitly tell crawlers to
//   skip it so it doesn't consume crawl budget or appear in search results.
//   Sanity's own authentication keeps it secure; the robots rule is just a
//   crawl-budget hint (robots.txt is advisory, not a security boundary).
//
// WHY disallow /api/:
//   API routes are server-side endpoints, not indexable content. Blocking them
//   prevents noisy 4xx entries in Google Search Console from bots that follow
//   API URLs that might appear in HTML source.
//
// Next.js serves this file at /robots.txt automatically.

import type { MetadataRoute } from "next";

const baseUrl = (
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bellabona.com"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/studio/", // Sanity Studio — editor tooling, not indexable content
					"/api/", // Server-side API routes — no indexable content
				],
			},
		],
		// WHY absolute URL for sitemap: the robots.txt spec requires an absolute
		// URL here. Next.js will include this line as:
		//   Sitemap: https://www.bellabona.com/sitemap.xml
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
