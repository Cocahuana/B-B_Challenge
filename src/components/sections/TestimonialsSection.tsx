// TestimonialsSection — Server Component
// WHY Server Component: the testimonial quote, author, and photo are fetched
// from Sanity and rendered as static HTML. The design shows a single prominent
// quote card — no carousel autoplay means no client JS is needed.
// If a future iteration requires a rotating carousel, that can be isolated
// to a narrow "use client" wrapper without refactoring this file.
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { TestimonialsSection as TestimonialsSectionType } from "@/sanity/lib/types";

interface Props {
	section: TestimonialsSectionType;
}

export default function TestimonialsSection({ section }: Props) {
	const { eyebrow, testimonials } = section;
	// WHY first testimonial only in Phase 7: we render the first item as a
	// "hero" quote. Full carousel is a Phase 8+ enhancement — shipping a working
	// single-quote view is better than delaying the whole UI for a slider.
	const featured = testimonials[0];

	if (!featured) return null;



	return (
		<UI.Box
			as='section'
			aria-label='Customer testimonials'
			className='bg-bb-surface py-20 lg:py-28'
		>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
				{eyebrow && (
					<UI.Title
						as='h2'
						className='text-center font-black text-bb-green text-3xl lg:text-4xl xl:text-5xl leading-tight mb-12'
					>
						{eyebrow}
					</UI.Title>
				)}

				{/* Quote card */}
				{/* WHY dark green card: the testimonial quote stands out from the
				    neutral section background and reinforces the brand palette. */}
				<blockquote className='bg-bb-green rounded-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center'>
					<div>
						{/* WHY large open-quote glyph: the typographic " " is a cheap
						    visual anchor that frames the quote without a custom icon. */}
						<span
							className='text-bb-lime font-black text-6xl leading-none select-none'
							aria-hidden='true'
						>
							"
						</span>
						<p className='text-white text-lg lg:text-xl leading-relaxed font-medium mt-2'>
							{featured.quote}
						</p>
						<footer className='mt-6'>
							<cite className='not-italic'>
								<UI.Text
									as='span'
									className='block font-bold text-white text-sm'
								>
									{featured.authorName}
								</UI.Text>
								{featured.authorRole && (
									<UI.Text
										as='span'
										className='block text-white/60 text-xs mt-0.5'
									>
										{featured.authorRole}
									</UI.Text>
								)}
							</cite>
						</footer>
					</div>

					{/* Author photo */}
					{featured.authorPhoto && (
						<div className='hidden lg:block relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-bb-lime/20'>
							<SanityImage
								sanityRef={featured.authorPhoto}
								alt={featured.authorName}
								fill
								width={160}
								height={160}
								sizes='128px'
								className='object-cover'
							/>
						</div>
					)}
				</blockquote>
			</div>
		</UI.Box>
	);
}
