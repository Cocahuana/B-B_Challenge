// [lang]/page.tsx — Homepage (ISR)
//
// WHY ISR over SSG/SSR:
//   - SSG (revalidate = Infinity): fast but stale after a Sanity publish.
//     An editor change would not appear until the next full build — bad UX.
//   - SSR (revalidate = 0): always fresh, but adds ~200–400 ms TTFB on every
//     request and eliminates CDN edge caching entirely — hurts Core Web Vitals.
//   - ISR (revalidate = 60): the page is pre-built at deploy time (fast, CDN-
//     cached), and silently regenerated in the background at most every 60 s
//     after the first stale request. For a homepage that changes a few times
//     per week at most, 60 s staleness is an acceptable trade-off.
//
// WHY NOT cacheComponents + `use cache`:
//   Next.js 16 introduces a new opt-in `cacheComponents` flag that replaces
//   `revalidate` with per-function `use cache` directives. We deliberately
//   skip it here — it is still experimental and requires `cacheComponents: true`
//   in next.config.js which changes default cache semantics project-wide.
//   The traditional `export const revalidate` path is the stable, documented
//   API for projects that do NOT enable that flag.

import type { Locale } from "@/lib/i18n/routing";

// ─── ISR: regenerate at most every 60 seconds ────────────────────────────────
export const revalidate = 60;

type Props = {
	// WHY: params is a Promise in Next.js 16 — see dynamic-routes.md
	params: Promise<{ lang: Locale }>;
};

export default async function HomePage({ params }: Props) {
	const { lang } = await params;

	// TODO Phase 4: fetch homepage data from Sanity with GROQ
	// TODO Phase 7: replace with <SectionRenderer sections={data.sections} />

	return (
		<main>
			<p>Homepage — locale: {lang}</p>
		</main>
	);
}
