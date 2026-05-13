// HeroSection — Server Component
// WHY Server Component: no interactivity. The entire section is rendered on
// the server and sent as HTML, which means the LCP candidate (hero image) is
// in the initial HTML payload — better for Core Web Vitals. The interactive
// elements (app-store links) are plain anchor tags, not stateful.
import Image from "next/image";
import Link from "next/link";
import * as UI from "@/components/ui";
import { urlFor } from "@/sanity/lib/image";
import type { HeroSection as HeroSectionType } from "@/sanity/lib/types";

interface Props {
	section: HeroSectionType;
}

export default function HeroSection({ section }: Props) {
	const { headline, body, image, ctas, appStoreLinks, socialProofRating } =
		section;

	const heroImageUrl = image
		? urlFor(image)
				// WHY .auto("format"): Sanity CDN serves WebP to browsers that support it,
				// falling back to JPEG. This single call handles format negotiation.
				.width(900)
				.height(700)
				.auto("format")
				.fit("crop")
				.url()
		: null;

	return (
		// WHY min-h-[90vh]: the hero should dominate the viewport but not force
		// a scroll — 90vh leaves a hint of the next section visible on landing.
		<UI.Box
			as='section'
			aria-label='Hero'
			className='min-h-[90vh] bg-bb-green flex items-stretch'
		>
			<div className='max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2'>
				{/* ── Left panel: copy ──────────────────────────────────────── */}
				<div className='flex flex-col justify-center px-8 py-16 lg:py-24 lg:px-12 gap-6'>
					{/* WHY text-bb-lime for headline: lime on dark green is the brand's
					    primary contrast pair and has a WCAG AA contrast ratio. */}
					<UI.Title
						as='h1'
						className='font-black text-bb-lime text-4xl lg:text-5xl xl:text-6xl leading-tight'
					>
						{headline}
					</UI.Title>

					{body && (
						<UI.Text className='text-white/80 text-base lg:text-lg max-w-md leading-relaxed'>
							{body}
						</UI.Text>
					)}

					{/* CTA buttons */}
					{ctas && ctas.length > 0 && (
						<UI.Flex gap='0.75rem' wrap='wrap'>
							{ctas.map((cta) => (
								<Link
									key={cta.href}
									href={cta.href}
									className={[
										"inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-colors",
										cta.variant === "primary"
											? "bg-bb-lime text-bb-green hover:bg-white"
											: cta.variant === "secondary"
												? "border-2 border-bb-lime text-bb-lime hover:bg-bb-lime hover:text-bb-green"
												: "text-bb-lime underline hover:no-underline",
									]
										.filter(Boolean)
										.join(" ")}
								>
									{cta.label}
								</Link>
							))}
						</UI.Flex>
					)}

					{/* App store badges + rating */}
					{(appStoreLinks?.playStore ||
						appStoreLinks?.appStore ||
						socialProofRating) && (
						<UI.Flex
							gap='1rem'
							align='center'
							wrap='wrap'
							className='pt-4 border-t border-white/10'
						>
							{appStoreLinks?.playStore && (
								<a
									href={appStoreLinks.playStore}
									target='_blank'
									rel='noopener noreferrer'
									// WHY explicit dimensions on badge container: prevents CLS as
									// badges load — they have a known fixed aspect ratio.
									className='inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-900 transition-colors'
								>
									<span
										aria-hidden='true'
										className='text-base'
									>
										▶
									</span>
									<span>Google Play</span>
								</a>
							)}
							{appStoreLinks?.appStore && (
								<a
									href={appStoreLinks.appStore}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-900 transition-colors'
								>
									<span
										aria-hidden='true'
										className='text-base'
									></span>
									<span>App Store</span>
								</a>
							)}
							{socialProofRating && (
								<UI.Flex
									align='center'
									gap='0.25rem'
									className='w-auto'
								>
									{/* WHY aria-label on the rating: screen readers skip the
									    visual stars and announce the meaningful rating value. */}
									<span
										className='text-bb-lime text-sm'
										aria-label={`Google rating: ${socialProofRating} out of 5`}
									>
										{"★".repeat(
											Math.round(socialProofRating),
										)}
									</span>
									<UI.Text
										as='span'
										className='text-white/70 text-xs ml-1'
									>
										{socialProofRating.toFixed(1)} Google
									</UI.Text>
								</UI.Flex>
							)}
						</UI.Flex>
					)}
				</div>

				{/* ── Right panel: hero image ───────────────────────────────── */}
				{heroImageUrl && (
					// WHY relative + overflow-hidden: next/image with fill layout
					// needs a positioned ancestor of known dimensions.
					<div className='relative hidden lg:block overflow-hidden'>
						<Image
							src={heroImageUrl}
							alt={image?.alt ?? headline}
							fill
							// WHY priority: the hero image is almost certainly the LCP
							// element. priority tells Next.js to preload it — without this
							// flag, LCP scores suffer noticeably (images lazy-load by default).
							priority
							className='object-cover object-center'
							sizes='(min-width: 1024px) 50vw, 100vw'
						/>
					</div>
				)}
			</div>
		</UI.Box>
	);
}
