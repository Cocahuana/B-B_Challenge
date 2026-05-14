// [lang]/layout.tsx
//
// WHY: This layout wraps every page under /[lang]/ and is responsible for:
//  1. Setting <html lang="..."> via LangSetter — required for screen readers
//     and SEO. The root layout owns <html>/<body> in Next.js 16; we update
//     the lang attribute client-side after hydration via a client component.
//  2. Validating the locale param — a typo in the URL gets a 404, not a
//     broken page with missing translations.
//  3. Providing the Dictionary via context so every child component can access
//     UI strings without prop-drilling or a separate fetch per component.
//
// WHY no <html>/<body> here: Next.js 16.2.6 requires the root app/layout.tsx
//   to own these tags. Having them in a child layout creates nested <html>
//   elements (invalid HTML). The root layout now provides them; this layout
//   wraps children in DictionaryProvider only.
//
// WHY no fonts here: Inter + Barlow Condensed are now loaded in app/layout.tsx
//   so the CSS variables are available on <html> for all routes, including
//   /studio, without needing to declare them in each child layout.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { DictionaryProvider } from "@/lib/i18n/DictionaryContext";
import { LangSetter } from "@/components/LangSetter";

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
	// WHY string (not Locale): Next.js 16 LayoutProps<"/[lang]"> widens params to
	// { lang: string } — using the literal union here causes a type error in the
	// build validator. Runtime validation in the layout body narrows to Locale.
	params: Promise<{ lang: string }>;
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
	// WHY string (not Locale): see generateMetadata comment above.
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	// WHY: We validate here (layout level) rather than in every page.
	// Any invalid locale (e.g. /fr, /xyz) triggers a 404 immediately before
	// any data fetching happens — no wasted GROQ calls or React renders.
	if (!locales.includes(lang as Locale)) {
		notFound();
	}
	// Safe cast: notFound() above guarantees lang is a valid Locale beyond this line.
	const locale = lang as Locale;

	const dictionary = await getDictionary(locale);

	return (
		<>
			{/* WHY LangSetter: sets document.documentElement.lang = locale after
			    hydration. The root layout can't read the [lang] route param, so
			    we update the html tag's lang attribute client-side. This satisfies
			    WCAG 3.1.1 and Google's secondary lang attribute signal.
			    See src/components/LangSetter.tsx for full rationale. */}
			<LangSetter lang={locale} />
			{/* WHY DictionaryProvider: makes the dictionary available to any
			    Client Component in the subtree via useDictionary() hook —
			    without prop-drilling through every intermediate component. */}
			<DictionaryProvider dictionary={dictionary}>
				{children}
			</DictionaryProvider>
		</>
	);
}
