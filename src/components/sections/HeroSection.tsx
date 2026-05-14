// HeroSection — Server Component
// WHY Server Component: no interactivity. The entire section is rendered on
// the server and sent as HTML, which means the LCP candidate (hero image) is
// in the initial HTML payload — better for Core Web Vitals. The interactive
// elements (app-store links) are plain anchor tags, not stateful.
import Link from "next/link";
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { HeroSection as HeroSectionType } from "@/sanity/lib/types";

interface Props {
	section: HeroSectionType;
}

export default function HeroSection({ section }: Props) {
	const { headline, body, image, ctas, appStoreLinks, socialProofRating } =
		section;

	return (
		// WHY: The hero should constrain its height to the content but ensure
		// it gives enough vertical space for the image to look good. We removed
		// min-h-[90vh] so it doesn't artificially stretch the whole screen,
		// allowing Stats below to float up.
		<UI.Box
			as='section'
			aria-label='Hero'
			className='pt-6 pb-12'
		>
			<div className='max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-4 lg:px-8 min-h-[500px] xl:min-h-[600px]'>
				{/* ── Left panel: copy ──────────────────────────────────────── */}
				<div className='flex flex-col justify-center px-8 py-16 lg:py-24 lg:px-16 gap-8 bg-bb-green rounded-3xl'>
					{/* WHY text-bb-lime for headline: lime on dark green is the brand's
					    primary contrast pair and has a WCAG AA contrast ratio. */}
					<UI.Title
						as='h1'
						className='font-black text-bb-lime text-4xl lg:text-5xl xl:text-6xl leading-[1.1]'
					>
						{headline}
					</UI.Title>

					{body && (
						<UI.Text className='text-white/90 text-base md:text-lg max-w-md leading-relaxed'>
							{body}
						</UI.Text>
					)}

					{/* CTA buttons */}
					{ctas && ctas.length > 0 && (
						<UI.Flex gap='0.75rem' wrap='wrap'>
							{(ctas ?? []).map((cta) => (
								<Link
									key={cta.href}
									href={cta.href}
									className={[
										"inline-flex items-center px-6 py-3.5 rounded-full font-semibold text-sm transition-colors",
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
				</div>

				{/* ── Right panel: hero image ───────────────────────────────── */}
				{image && (
					// WHY relative + overflow-hidden: next/image fill needs a
					// positioned ancestor of known dimensions.
					<div className='relative hidden lg:block overflow-hidden rounded-3xl min-h-[400px]'>
						{/* WHY priority + width/height hints: priority adds fetchpriority="high"
						    and a <link rel="preload"> — critical for LCP score.
						    width=900/height=700 tells the Sanity CDN the maximum source size
						    needed, avoiding a full-resolution origin fetch. */}
						<SanityImage
							sanityRef={image}
							alt={image.alt ?? headline}
							fill
							priority
							width={900}
							height={700}
							sizes='(min-width: 1024px) 50vw, 100vw'
							className='object-cover object-center'
						/>
						
						{/* App store badges + rating - overlay on image */}
						{(appStoreLinks?.playStore ||
							appStoreLinks?.appStore ||
							socialProofRating) && (
							<div className='absolute bottom-6 left-6 right-6 flex items-center gap-3 flex-wrap z-10'>
								{appStoreLinks?.playStore && (
									<a
										href={appStoreLinks.playStore}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-900 transition-colors border border-gray-800'
									>
										{/* Simple pure CSS icon for Google Play if no SVG is available */}
										<div className="w-4 h-4 overflow-hidden flex items-center justify-center">
											<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4,2L20,12L4,22V2Z" fill="#4ade80" /></svg>
										</div>
										<div className="flex flex-col items-start leading-none">
											<span className="text-[9px] text-gray-300">GET IT ON</span>
											<span className="font-semibold text-sm">Google Play</span>
										</div>
									</a>
								)}
								{appStoreLinks?.appStore && (
									<a
										href={appStoreLinks.appStore}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-900 transition-colors border border-gray-800'
									>
										<div className="w-4 h-4 overflow-hidden flex items-center justify-center text-white">
											<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C13.1 2 14 2 15 3C15 4.1 14 5 13 5C12 5 11 4.1 11 3C11 2 12 2 12 2M12 22C8.7 22 6 19.3 6 16C6 14.3 6.7 12.8 7.8 11.6L9.2 13C8.4 13.8 8 14.8 8 16C8 18.2 9.8 20 12 20C14.2 20 16 18.2 16 16C16 14.8 15.6 13.8 14.8 13L16.2 11.6C17.3 12.8 18 14.3 18 16C18 19.3 15.3 22 12 22Z" /></svg>
										</div>
										<div className="flex flex-col items-start leading-none">
											<span className="text-[9px] text-gray-300">Download on the</span>
											<span className="font-semibold text-sm">App Store</span>
										</div>
									</a>
								)}
								{socialProofRating && (
									<div className='inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-medium border border-gray-200'>
										<div className="font-bold text-lg flex items-center mr-1">
										  <span className="text-blue-500">G</span>
										</div>
										<div className="flex flex-col items-start">
											<span
												className='text-yellow-400 text-xs tracking-widest'
												aria-label={`Google rating: ${socialProofRating} out of 5`}
											>
												{"★".repeat(Math.round(socialProofRating))}
											</span>
											<span className='text-gray-900 text-xs font-bold leading-none'>
												{socialProofRating.toFixed(1)} <span className="font-normal text-[10px] text-gray-500">/ 5</span>
											</span>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</UI.Box>
	);
}
