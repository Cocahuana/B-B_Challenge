// WHY: The /studio route gets its own layout to isolate the Sanity Studio
// from the localized routes. No DictionaryProvider or font setup needed —
// the Studio is a self-contained SPA with its own UI.
//
// WHY no <html>/<body> here: Next.js 16.2.6 requires the root app/layout.tsx
//   to own these tags. The root layout now provides them for all routes,
//   including /studio/*.

export default function StudioLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
