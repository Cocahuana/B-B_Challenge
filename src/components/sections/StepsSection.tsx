// StepsSection — Server Component
// WHY Server Component: a static numbered process walkthrough. No state.
// The "Step 01 / 02 / 03" pattern is a well-known UX pattern for onboarding
// flows — it reduces perceived complexity by chunking into three steps.
import Link from "next/link";
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { StepsSection as StepsSectionType } from "@/sanity/lib/types";

interface Props {
	section: StepsSectionType;
}

export default function StepsSection({ section }: Props) {
	const { headline, steps, cta } = section;

	return (
		<UI.Box
			as='section'
			aria-label='How it works'
			className='bg-white py-20 lg:py-28'
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<UI.Title
					as='h2'
					className='text-center font-black text-bb-green text-3xl lg:text-4xl xl:text-5xl leading-tight mb-16'
				>
					{headline}
				</UI.Title>

				{/* WHY equal-column grid: each step gets identical visual weight.
				    Steps communicate a sequence, not a hierarchy. */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
					{(steps ?? []).map(
						({ _key, badge, image, title, description }, index) => {
							// WHY ordinal padding: "01" vs "1" matches the design's typographic
							// convention — left-padded ordinals read as a visual sequence marker.
							const ordinal = String(index + 1).padStart(2, "0");
							return (
								<article
									key={_key}
									className='flex flex-col gap-4'
									aria-label={`Step ${ordinal}: ${title}`}
								>
									{/* Step image */}
									{image && (
										<div className='relative h-48 rounded-xl overflow-hidden bg-bb-surface'>
											<SanityImage
												sanityRef={image}
												alt={image.alt ?? title}
												fill
												width={400}
												height={260}
												sizes='(min-width: 768px) 33vw, 100vw'
												className='object-cover object-center'
											/>
										</div>
									)}

									{/* Badge */}
									<UI.Text
										as='span'
										className='font-bold text-bb-lime text-xs uppercase tracking-widest'
										aria-hidden='true'
									>
										{badge || `Step ${ordinal}`}
									</UI.Text>

									<UI.Title
										as='h3'
										className='font-bold text-gray-900 text-lg leading-snug'
									>
										{title}
									</UI.Title>

									{description && (
										<UI.Text className='text-gray-500 text-sm leading-relaxed'>
											{description}
										</UI.Text>
									)}
								</article>
							);
						},
					)}
				</div>

				{/* CTA */}
				{cta && (
					<div className='flex justify-center'>
						<Link
							href={cta.href}
							className='inline-flex items-center px-8 py-3 rounded-full bg-bb-green text-white font-semibold text-sm hover:bg-bb-green-dark transition-colors'
						>
							{cta.label}
						</Link>
					</div>
				)}
			</div>
		</UI.Box>
	);
}
