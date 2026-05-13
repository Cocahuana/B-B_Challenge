// [lang]/layout.tsx
//
// WHY: This layout wraps every page under /[lang]/ and is responsible for:
//  1. Setting <html lang="..."> — required for screen readers and SEO.
//  2. Validating the locale param — a typo in the URL gets a 404, not a
//     broken page with missing translations.
//  3. Providing the Dictionary via context so every child component can access
//     UI strings without prop-drilling or a separate fetch per component.
//  4. Loading web fonts and exposing them as CSS variables used by Tailwind
//     via @theme in globals.css.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { DictionaryProvider } from "@/lib/i18n/DictionaryContext";
// WHY: globals.css is imported here (not in root layout) because this layout
// IS the root layout for all /[lang]/* routes — it renders <html> and <body>.
import "@/app/globals.css";

// ── Web fonts ─────────────────────────────────────────────────────────────────
// WHY next/font/google instead of a <link> tag:
//   next/font downloads fonts at build time, self-hosts them, and inlines a
//   `font-display: swap` hint. This eliminates the third-party round-trip to
//   fonts.googleapis.com (GDPR-friendlier too) and avoids layout shift.
//
// WHY Inter + Barlow Condensed:
//   Inter is the best-in-class neutral sans-serif for body/UI text — excellent
//   letter-spacing and legibility at small sizes.
//   Barlow Condensed ExtraBold is used for the large display heading in the
//   footer wordmark and hero-scale text — matches Bella&Bona's compressed,
//   high-impact display style.
import { Inter, Barlow_Condensed } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	// WHY variable: exposes the font as --font-inter so globals.css @theme can
	// reference it — avoids duplicating the font-family string.
	variable: "--font-inter",
	display: "swap",
});

const barlowCondensed = Barlow_Condensed({
	subsets: ["latin"],
	weight: ["700", "900"],
	variable: "--font-barlow",
	display: "swap",
});

export function generateStaticParams() {
	// WHY: Tells Next.js which [lang] slugs to pre-render at build time.
	// Without this, every /de and /en request would fall back to on-demand SSR,
	// defeating the ISR strategy defined in the page files.
	return locales.map((lang) => ({ lang }));
}

// WHY: Hreflang alternates live in the layout (not the page) because they
// must apply to EVERY page under /[lang]/ — not just the homepage. The layout
// runs once per locale segment and injects the correct <link rel="alternate">
// tags automatically for all child pages.
//
// WHY x-default points to /de: German is Bella&Bona's primary market.
// x-default tells Google which URL to serve to users whose browser language
// doesn't match any available locale — DE is the safest fallback.
//
// WHY no canonical here: canonical is page-specific (e.g. /de, /de/about).
// Each page sets its own canonical in its own generateMetadata; the layout
// only injects the cross-locale signals that are stable for all pages.
export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	void params; // params not needed — alternates are the same for all locales
	return {
		alternates: {
			languages: {
				de: "/de",
				en: "/en",
				"x-default": "/de",
			},
		},
	};
}

export default async function LangLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	// WHY: params is a Promise in Next.js 16 — must be awaited before use.
	// See: node_modules/next/dist/docs/dynamic-routes.md
	params: Promise<{ lang: Locale }>;
}) {
	const { lang } = await params;

	// WHY: We validate here (layout level) rather than in every page.
	// Any invalid locale (e.g. /fr, /xyz) triggers a 404 immediately before
	// any data fetching happens — no wasted GROQ calls or React renders.
	if (!locales.includes(lang)) {
		notFound();
	}

	const dictionary = await getDictionary(lang);

	return (
		// WHY: lang on <html> satisfies WCAG 3.1.1 (Language of Page) and is
		// used by Google to confirm the page's language independent of URL.
		// WHY className on <html>: next/font injects CSS variables (--font-inter,
		// --font-barlow) only inside the element that carries the variable class.
		// Putting them on <html> makes both fonts available to every descendant
		// including the <body>, which is what globals.css @theme references.
		<html
			lang={lang}
			className={`${inter.variable} ${barlowCondensed.variable}`}
		>
			<body>
				{/* WHY: DictionaryProvider makes the dictionary available to any
				    Client Component in the subtree via useDictionary() hook —
				    without prop-drilling through every intermediate component. */}
				<DictionaryProvider dictionary={dictionary}>
					{children}
				</DictionaryProvider>
			</body>
		</html>
	);
}
