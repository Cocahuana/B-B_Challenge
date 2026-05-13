// WHY: The /studio route needs its own root layout (html/body) because
// app/layout.tsx is a pass-through — each leaf subtree provides its own.
// Without this, Next.js has no layout supplying the required html/body tags
// for the studio routes, which would cause a build error.

export default function StudioLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// WHY: No lang attribute here — the Studio is an internal authoring
		// tool, not a public-facing page. Leaving it unset is acceptable.
		<html>
			<body>{children}</body>
		</html>
	);
}
