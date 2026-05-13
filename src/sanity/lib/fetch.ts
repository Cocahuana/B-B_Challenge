// WHY: All data-fetching is centralised here. The rest of the app (pages,
// components) never calls `sanityClient.fetch()` directly — they import from
// this file. This means:
//  - The query string and its TypeScript type are always in sync (one place to
//    update both when the schema changes).
//  - Swapping the data source (e.g. adding a preview client) requires changing
//    one file, not hunting for `client.fetch` calls across the codebase.

import { sanityClient } from "./client";
import { homePageQuery, siteSettingsQuery } from "./queries";
import type { HomePage, SiteSettings } from "./types";
import type { Locale } from "@/lib/i18n/routing";

// WHY: The `lang` parameter is passed to the GROQ query as `$lang`, which
// drives the coalesce() projections for all localizedString/localizedText
// fields. A single fetch returns a fully locale-resolved payload — no
// client-side locale switching required.
export async function fetchHomePage(lang: Locale): Promise<HomePage | null> {
	return sanityClient.fetch<HomePage | null>(homePageQuery, { lang });
}

export async function fetchSiteSettings(
	lang: Locale,
): Promise<SiteSettings | null> {
	return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery, { lang });
}
