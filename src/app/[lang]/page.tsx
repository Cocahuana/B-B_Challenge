// [lang]/page.tsx — Homepage (ISR)
//
// WHY ISR over SSG/SSR:
//   - SSG (revalidate = Infinity): fast but stale after a Sanity publish.
//     An editor change would not appear until the next full build — bad UX.
//   - SSR (revalidate = 0): always fresh, but adds ~200–400 ms TTFB on every
//     request and eliminates CDN edge caching entirely — hurts Core Web Vitals.
//   - ISR (revalidate = 60): the page is pre-built at deploy time (fast, CDN-
//     cached), and silently regenerated in the background at most every 60 s
//     after the first stale request. For a homepage that changes a few times
//     per week at most, 60 s staleness is an acceptable trade-off.
//
// WHY NOT cacheComponents + `use cache`:
//   Next.js 16 introduces a new opt-in `cacheComponents` flag that replaces
//   `revalidate` with per-function `use cache` directives. We deliberately
//   skip it here — it is still experimental and requires `cacheComponents: true`
//   in next.config.js which changes default cache semantics project-wide.
//   The traditional `export const revalidate` path is the stable, documented
//   API for projects that do NOT enable that flag.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { fetchHomePage, fetchSiteSettings } from "@/sanity/lib/fetch";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/sections/SectionRenderer";

// ─── ISR: regenerate at most every 60 seconds ────────────────────────────────
export const revalidate = 60;

type Props = {
	// WHY: params is a Promise in Next.js 16 — see dynamic-routes.md
	// WHY string (not Locale): Next.js 16 PageProps<"/[lang]"> widens params to
	// { lang: string }. Runtime notFound() check narrows to Locale before use.
	params: Promise<{ lang: string }>;
};

// ─── SEO metadata ─────────────────────────────────────────────────────────────
// WHY generateMetadata (not static `export const metadata`):
//   The title, description, and OG image come from Sanity — they can be
//   edited by the content team without a code deploy. A static export would
//   bake the values at build time and ignore CMS changes until the next build.
//
// WHY fetchHomePage + fetchSiteSettings here AND in the component below:
//   Both calls are wrapped in React's cache() in fetch.ts, so within a single
//   render pass they fire only once — the second call returns the cached value.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lang } = await params;

	// WHY guard here (not just in the layout): generateMetadata runs before the
	// layout's notFound() can fire. Without this, an invalid [lang] value — e.g.
	// "sw.js" from a browser extension requesting /sw.js — gets passed to Sanity
	// as $lang, which rejects it because "." is not valid in GROQ attribute names.
	if (!locales.includes(lang as Locale)) return {};
	// Safe cast: guard above guarantees lang is a valid Locale beyond this line.
	const locale = lang as Locale;

	const [page, settings] = await Promise.all([
		fetchHomePage(locale),
		fetchSiteSettings(locale),
	]);

	const title =
		page?.seo?.metaTitle ??
		settings?.seoDefaults?.metaTitle ??
		"Bella&Bona – Business Catering & Lunch für Teams";

	const description =
		page?.seo?.metaDescription ??
		settings?.seoDefaults?.metaDescription ??
		undefined;

	// WHY: Prefer page-specific OG image; fall back to global siteSettings OG.
	const ogImageRef = page?.seo?.ogImage ?? settings?.seoDefaults?.ogImage;
	const ogImageUrl = ogImageRef
		? urlFor(ogImageRef).width(1200).height(630).url()
		: undefined;

	// WHY og:locale uses BCP 47 country suffix (de_DE / en_US) rather than just
	// the ISO 639-1 code — Facebook / Open Graph spec requires the full code.
	const ogLocale = locale === "de" ? "de_DE" : "en_US";

	return {
		title,
		description,
		alternates: {
			// WHY: Page-level canonical narrows down to this specific URL, while
			// the layout-level hreflang declares the cross-locale relationship.
			canonical: `/${locale}`,
		},
		openGraph: {
			title,
			description: description ?? undefined,
			url: `/${locale}`,
			siteName: settings?.orgName ?? "Bella&Bona",
			locale: ogLocale,
			type: "website",
			images: ogImageUrl
				? [{ url: ogImageUrl, width: 1200, height: 630 }]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: description ?? undefined,
			images: ogImageUrl ? [ogImageUrl] : [],
		},
	};
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function HomePage({ params }: Props) {
	const { lang } = await params;

	// WHY guard here (not relying solely on the layout): in Next.js App Router
	// streaming SSR, the page component and layout component can start executing
	// concurrently — the layout's notFound() does not block this function from
	// starting. Without this guard, an invalid lang (e.g. "sw.js" from a browser
	// extension requesting /sw.js) reaches fetchSiteSettings with an invalid
	// $lang GROQ parameter and triggers a Sanity 400 error.
	if (!locales.includes(lang as Locale)) notFound();
	const locale = lang as Locale;

	// WHY Both fetches are cache()-memoised — no duplicate network calls even
	// though generateMetadata above already called them in the same render pass.
	const [data, settings] = await Promise.all([
		fetchHomePage(locale),
		fetchSiteSettings(locale),
	]);

	if (!data) {
		// WHY: notFound() is appropriate here — the homePage document hasn't been
		// created in Sanity yet. It renders the nearest not-found.tsx boundary
		// rather than crashing with an unhandled null reference.
		// WHY static import (not dynamic): dynamic import loses the `never`
		// return type of notFound(), so TypeScript can't narrow data as non-null.
		notFound();
	}

	// WHY: getDictionary is needed here (not just in layout) because Footer
	// consumes dictionary strings directly. The call is cheap — getDictionary
	// uses dynamic import (code-split per locale) and is cached by Node module
	// resolution after the first call in the same request.
	const dictionary = await getDictionary(locale);

	// ─── JSON-LD: Organization ─────────────────────────────────────────────
	// WHY Organization (not WebPage): the homepage is primarily an entry point
	// to understand who Bella&Bona is. Organization schema gives Google rich
	// signals (logo, social profiles, URL) that appear in Knowledge Panels.
	//
	// WHY .replace(/</g, "\\u003c"): JSON.stringify() does NOT escape "<" by
	// default. An unescaped "<" inside a <script> tag can prematurely close
	// the script if a CMS string contains "</script>". Unicode escaping is the
	// standard mitigation recommended by the Next.js JSON-LD guide.
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellabona.com";

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: settings?.orgName ?? "Bella&Bona",
		url: siteUrl,
		logo: settings?.logo
			? urlFor(settings.logo).width(200).height(60).url()
			: undefined,
		sameAs: [
			settings?.socialLinks?.linkedin,
			settings?.socialLinks?.instagram,
			settings?.socialLinks?.twitter,
		].filter(Boolean),
	};

	// WHY: Skip-to-content link before Navbar satisfies WCAG 2.4.1 (Bypass
	// Blocks). Keyboard and screen-reader users can jump past the repeated nav
	// on every page without tabbing through every link.
	return (
		<>
			<a
				href='#main-content'
				className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bb-green focus:text-white focus:rounded-full focus:text-sm'
			>
				{dictionary.a11y.skipToContent}
			</a>

			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>

			<Navbar lang={locale} settings={settings} />

			<main id='main-content'>
				<SectionRenderer sections={data.sections} />
			</main>

			<Footer lang={locale} settings={settings} dictionary={dictionary} />
		</>
	);
}
