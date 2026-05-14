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

		// WHY formats — prefer AVIF, fall back to WebP, then source format.
		// AVIF offers ~50% smaller files than WebP at equivalent visual quality
		// (tested on food photography). next/image generates both variants and
		// serves them via <picture> srcset negotiation. All modern browsers
		// support WebP; AVIF is supported in Chrome 85+, Firefox 93+, Safari 16+.
		// The Sanity CDN remotePattern above is required for next/image to
		// re-encode external images — without it, Next.js refuses to proxy them.
		formats: ["image/avif", "image/webp"],

		// WHY 30-day minimumCacheTTL: Sanity asset URLs are content-addressed
		// (the asset _ref hash changes when the image changes). A 30-day TTL
		// means next/image caches optimized variants for 30 days — after a
		// content change, the new ref produces a different URL, so users always
		// get the fresh version. Without this, the default TTL is 60 s which
		// causes unnecessary re-optimization on every cold cache hit.
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days in seconds

		// WHY explicit deviceSizes: these breakpoints align with our Tailwind
		// config (640 sm, 768 md, 1024 lg, 1280 xl, 1536 2xl). next/image uses
		// these to generate the <img srcset> entries — matching them to actual
		// layout breakpoints avoids serving a 1920px image on a 768px viewport.
		// We keep 828 (iPhone 14 @2x logical 414px) and 1080 (HD) for real-world
		// device coverage between the Tailwind steps.
		deviceSizes: [640, 750, 828, 1080, 1280, 1536, 1920],

		// WHY explicit imageSizes: used for images that are NOT full viewport
		// width — i.e., images with a `sizes` attribute narrower than 100vw.
		// These cover our food card thumbnails (33vw on lg), avatar photos,
		// and logo bar images which are all small fixed-size assets.
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

		// WHY dangerouslyAllowSVG + contentSecurityPolicy: Sanity editors may
		// upload SVG logos for the logo bar section. Without this flag, next/image
		// rejects SVGs with a 400 error. The CSP header mitigates XSS risk from
		// malicious SVGs by restricting their execution context.
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy:
			"default-src 'self'; script-src 'none'; sandbox;",
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
			// ── Root domain entry points ──────────────────────────────────────────
			// WHY direct to /de (not /): the root "/" already does a server-side
			// redirect to /de in app/page.tsx. Pointing legacy URLs directly to /de
			// avoids a redirect chain (/home → / → /de) which wastes crawl budget
			// and dilutes link equity. Two hops become one.
			{
				source: "/home",
				destination: "/de",
				permanent: true,
			},
			{
				source: "/index",
				destination: "/de",
				permanent: true,
			},
			// ── German locale legacy paths ────────────────────────────────────────
			{
				source: "/de/startseite",
				destination: "/de",
				permanent: true,
			},
			// ── English locale legacy paths ───────────────────────────────────────
			{
				source: "/en/homepage",
				destination: "/en",
				permanent: true,
			},
			// Add new redirects above this line ↑
			// FORMAT: { source: "/old-path", destination: "/new-path", permanent: true }
			// Use permanent: true for 308 (SEO value passes through).
			// Use permanent: false for 307 (temporary, no SEO value transfer).
		];
	},

	// ─── i18n ────────────────────────────────────────────────────────────────────
	// WHY: We handle i18n via the [lang] dynamic route segment rather than
	// Next.js's built-in i18n config. This gives us full control over hreflang
	// tags and locale-specific Sanity queries without the Pages Router i18n
	// constraints that don't apply to the App Router.
};

module.exports = nextConfig;
