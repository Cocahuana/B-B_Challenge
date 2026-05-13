// [lang]/layout.tsx
//
// WHY: This layout wraps every page under /[lang]/ and is responsible for:
//  1. Setting <html lang="..."> — required for screen readers and SEO.
//  2. Validating the locale param — a typo in the URL gets a 404, not a
//     broken page with missing translations.
//  3. Providing the Dictionary via context so every child component can access
//     UI strings without prop-drilling or a separate fetch per component.
//
// generateMetadata (hreflang, OG, canonical) is added in Phase 6.

import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { DictionaryProvider } from "@/lib/i18n/DictionaryContext";
// WHY: globals.css is imported here (not in root layout) because this layout
// IS the root layout for all /[lang]/* routes — it renders <html> and <body>.
import "@/app/globals.css";

export function generateStaticParams() {
	// WHY: Tells Next.js which [lang] slugs to pre-render at build time.
	// Without this, every /de and /en request would fall back to on-demand SSR,
	// defeating the ISR strategy defined in the page files.
	return locales.map((lang) => ({ lang }));
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
		<html lang={lang}>
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
