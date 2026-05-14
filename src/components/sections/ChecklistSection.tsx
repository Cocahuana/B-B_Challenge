// ChecklistSection — Server Component
// WHY Server Component: static text + image. No interactivity.
// The visual pattern (image on left, checklist on right) is common in
// feature/benefit sections. On mobile it stacks vertically (image first).
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { ChecklistSection as ChecklistSectionType } from "@/sanity/lib/types";

interface Props {
	section: ChecklistSectionType;
}

export default function ChecklistSection({ section }: Props) {
	const { image, items } = section;

	return (
		<UI.Box
			as='section'
			aria-label='Benefits checklist'
			className='bg-white py-20 lg:py-28'
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
					{/* ── Left: image ─────────────────────────────────────────── */}
					{image && (
						<div className='relative h-80 lg:h-[500px] rounded-2xl overflow-hidden'>
							<SanityImage
								sanityRef={image}
								alt={image.alt ?? ""}
								fill
								width={600}
								height={700}
								sizes='(min-width: 1024px) 50vw, 100vw'
								className='object-cover object-center'
							/>
						</div>
					)}

					{/* ── Right: checklist ──────────────────────────────────── */}
					<ul className='space-y-6' aria-label='Feature checklist'>
						{(items ?? []).map(({ _key, title, description }) => (
							<li key={_key} className='flex gap-4 items-start'>
								{/* WHY role="img" + aria-hidden on the check icon:
								    The list item title conveys the meaning; the decorative
								    circle checkmark is purely visual. */}
								<div
									className='flex-shrink-0 w-8 h-8 rounded-full bg-bb-green flex items-center justify-center mt-0.5'
									aria-hidden='true'
								>
									<svg
										width='14'
										height='10'
										viewBox='0 0 14 10'
										fill='none'
										aria-hidden='true'
									>
										<path
											d='M1 5L5 9L13 1'
											stroke='#CCFF00'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</div>
								<div>
									<UI.Title
										as='h3'
										className='font-bold text-gray-900 text-base mb-1'
									>
										{title}
									</UI.Title>
									{description && (
										<UI.Text className='text-gray-500 text-sm leading-relaxed'>
											{description}
										</UI.Text>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</UI.Box>
	);
}
