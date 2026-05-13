// WHY: All data-fetching is centralised here. The rest of the app (pages,
// components) never calls `sanityClient.fetch()` directly — they import from
// this file. This means:
//  - The query string and its TypeScript type are always in sync (one place to
//    update both when the schema changes).
//  - Swapping the data source (e.g. adding a preview client) requires changing
//    one file, not hunting for `client.fetch` calls across the codebase.

import { cache } from "react";
import { sanityClient } from "./client";
import { homePageQuery, siteSettingsQuery } from "./queries";
import type { HomePage, SiteSettings } from "./types";
import type { Locale } from "@/lib/i18n/routing";

// WHY: React's cache() deduplicates identical calls within the same render pass.
// Without this, generateMetadata() and the page component would each fire a
// separate GROQ request for the same data. cache() collapses them into one.
// This is the recommended pattern for data-fetching in Next.js App Router when
// the data source does not go through native fetch() (which is auto-memoised).

// WHY: The `lang` parameter is passed to the GROQ query as `$lang`, which
// drives the coalesce() projections for all localizedString/localizedText
// fields. A single fetch returns a fully locale-resolved payload — no
// client-side locale switching required.
export const fetchHomePage = cache(
	async (lang: Locale): Promise<HomePage | null> => {
		return sanityClient.fetch<HomePage | null>(homePageQuery, { lang });
	},
);

export const fetchSiteSettings = cache(
	async (lang: Locale): Promise<SiteSettings | null> => {
		return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery, {
			lang,
		});
	},
);
