// WHY: next.config.js (CommonJS) instead of next.config.ts so that the
// redirects array below can be edited by SEO consultants without needing
// a TypeScript build step or IDE setup.

/** @type {import('next').NextConfig} */
const nextConfig = {
	// ─── Images ─────────────────────────────────────────────────────────────────
	images: {
		// WHY: Sanity CDN is the only external image origin. Being explicit
		// here keeps the attack surface small (no open remotePatterns).
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				pathname: "/images/**",
			},
		],
	},

	// ─── 301 Redirects ──────────────────────────────────────────────────────────
	// HOW TO ADD A REDIRECT (for SEO consultants):
	//   1. Copy one of the existing objects below.
	//   2. Set `source` to the old URL path (e.g. "/old-page").
	//   3. Set `destination` to the new URL path (e.g. "/new-page").
	//   4. Keep `permanent: true` for 301 (SEO value passes) or set
	//      `permanent: false` for 302 (temporary, no SEO value transfer).
	//   5. Save the file — Vercel will pick it up on the next deploy.
	async redirects() {
		return [
			// ── Example: legacy marketing URL → new homepage path ──
			{
				source: "/home",
				destination: "/",
				permanent: true,
			},
			// ── Example: old German landing page ──
			{
				source: "/de/startseite",
				destination: "/de",
				permanent: true,
			},
			// ── Example: old English landing page ──
			{
				source: "/en/homepage",
				destination: "/en",
				permanent: true,
			},
			// Add new redirects above this line ↑
		];
	},

	// ─── i18n ────────────────────────────────────────────────────────────────────
	// WHY: We handle i18n via the [lang] dynamic route segment rather than
	// Next.js's built-in i18n config. This gives us full control over hreflang
	// tags and locale-specific Sanity queries without the Pages Router i18n
	// constraints that don't apply to the App Router.
};

module.exports = nextConfig;
