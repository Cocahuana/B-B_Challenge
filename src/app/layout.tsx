// WHY: This root layout is intentionally a pass-through (no <html>/<body>).
//
// Per Next.js docs: "The root layout can also be nested in the new folder
// (e.g. app/[lang]/layout.js)." This is the recommended pattern for i18n
// when you need <html lang={locale}> to be set per-locale at SSR time.
//
// Each leaf root layout is responsible for html/body:
//   • app/[lang]/layout.tsx  → localized routes (/de/*, /en/*)
//   • app/studio/layout.tsx  → Sanity Studio (/studio/*)
//
// WHY metadataBase here (root layout): Next.js requires metadataBase in the
// highest-level layout so that all child layouts/pages can use relative URLs
// in metadata fields (canonical, og:image, twitter:image, alternates) without
// repeating the full domain every time. Falls back to bellabona.com if the
// env var is unset (e.g. CI, local dev without .env.local).
import type { Metadata } from "next";
import "./globals.css";

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
	// WHY: Fragment wrapper — no html/body here; child layouts supply them.
	return <>{children}</>;
}
