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
// The app/page.tsx redirect never renders HTML (it returns a 3xx response),
// so it does not need a layout providing html/body.
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// WHY: Fragment wrapper — no html/body here; child layouts supply them.
	return <>{children}</>;
}
