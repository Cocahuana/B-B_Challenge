// WHY: The root layout owns <html> and <body> — Next.js 16 requires it.
//
// Next.js 16.2.6 validates that the root app/layout.tsx renders <html> and
// <body> tags. The previous "pass-through fragment" pattern (returning just
// <>{children}</>) is no longer accepted; the runtime injects an error page
// if these tags are absent from the rendered stream.
//
// WHY suppressHydrationWarning on <html>:
//   The `lang` attribute is set per-locale by a LangSetter client component
//   in app/[lang]/layout.tsx after hydration. The root layout doesn't have
//   access to the [lang] route param, so it can't render the correct `lang`
//   server-side. suppressHydrationWarning suppresses the harmless React
//   warning about the lang attribute mismatch between server and client.
//
//   Note: the hreflang <link> tags in <head> (set by [lang]/layout.tsx's
//   generateMetadata) are Google's primary signal for international routing —
//   they take precedence over the HTML lang attribute for SEO purposes.
//   The lang attribute matters most for screen readers (WCAG 3.1.1), which
//   IS satisfied by LangSetter correcting it after hydration.
//
// WHY fonts in root layout (not [lang]/layout.tsx):
//   Moving fonts here means both /[lang]/* and /studio/* routes share the same
//   CSS variable declarations — no duplicated font loading. CSS variables are
//   scoped to the element they're declared on; setting them on <html> makes
//   them available everywhere, including the Sanity Studio.
//
// WHY metadataBase here: Next.js requires metadataBase in the highest-level
//   layout so all child layouts/pages can use relative URLs in metadata fields
//   (canonical, og:image, alternates) without repeating the full domain.
import type { Metadata } from "next";
import { Figtree, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
	subsets: ["latin"],
	variable: "--font-figtree",
	display: "swap",
});

const barlowCondensed = Barlow_Condensed({
	subsets: ["latin"],
	weight: ["700", "900"],
	variable: "--font-barlow",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellabona.com",
	),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// WHY suppressHydrationWarning: the lang attribute is updated client-side
		// by LangSetter in [lang]/layout.tsx — see comment at top of file.
		// WHY font className on <html>: CSS variables (--font-figtree, --font-barlow)
		// must be declared on an ancestor element that contains all consumers.
		// Putting them on <html> makes them available to every descendant.
		<html
			suppressHydrationWarning
			className={`${figtree.variable} ${barlowCondensed.variable}`}
		>
			<body suppressHydrationWarning>{children}</body>
		</html>
	);
}
