// MenuShowcaseSection — Server Component
// WHY Server Component: static content from Sanity — food cards, approval
// percentages, and the CTA link are pure render. No client state needed.
import Image from "next/image";
import Link from "next/link";
import * as UI from "@/components/ui";
import { urlFor } from "@/sanity/lib/image";
import type { MenuShowcaseSection as MenuShowcaseSectionType } from "@/sanity/lib/types";

interface Props {
	section: MenuShowcaseSectionType;
}

export default function MenuShowcaseSection({ section }: Props) {
	const { headline, cards, cta } = section;

	return (
		// WHY bg-bb-lime-soft: the light lime background is the brand's signature
		// colour for the menu section — it signals freshness and differentiates
		// this block from the neutral white sections around it.
		<UI.Box
			as='section'
			aria-label='Menu showcase'
			className='bg-bb-lime-soft py-20 lg:py-28'
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<UI.Title
					as='h2'
					className='text-center font-black text-bb-green text-3xl lg:text-5xl leading-tight mb-12'
				>
					{headline}
				</UI.Title>

				{/* WHY 3-column grid on lg+: matches the 3×2 card layout in the design.
				    On mobile, 1 column; on md, 2 columns — all without any JS. */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
					{cards.map(
						({
							_key,
							image,
							tag,
							name,
							approvalPct,
							reviewCount,
						}) => {
							const cardImageUrl = urlFor(image)
								.width(400)
								.height(280)
								.auto("format")
								.fit("crop")
								.url();

							return (
								<article
									key={_key}
									className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'
									aria-label={name}
								>
									{/* Food image */}
									<div className='relative h-44 overflow-hidden'>
										<Image
											src={cardImageUrl}
											alt={image.alt ?? name}
											fill
											className='object-cover'
											// WHY lazy (default): food cards below the hero are not LCP
											// candidates. Default lazy loading defers these until near-viewport.
											sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
										/>
									</div>

									<div className='p-4'>
										{/* Tag pill */}
										{tag && (
											<span className='inline-block bg-bb-lime-soft text-bb-green text-xs font-semibold px-2 py-0.5 rounded-full mb-2'>
												{tag}
											</span>
										)}

										<UI.Title
											as='h3'
											className='font-bold text-gray-900 text-sm mb-2 line-clamp-2'
										>
											{name}
										</UI.Title>

										{/* Stats row */}
										<UI.Flex align='center' gap='0.75rem'>
											{approvalPct !== undefined && (
												<UI.Text
													as='span'
													className='text-xs text-gray-500 flex items-center gap-1'
												>
													<span aria-hidden='true'>
														👍
													</span>
													{approvalPct}%
												</UI.Text>
											)}
											{reviewCount !== undefined && (
												<UI.Text
													as='span'
													className='text-xs text-gray-500 flex items-center gap-1'
												>
													<span aria-hidden='true'>
														⭐
													</span>
													{reviewCount}
												</UI.Text>
											)}
										</UI.Flex>
									</div>
								</article>
							);
						},
					)}
				</div>

				{/* CTA */}
				<div className='flex justify-center'>
					<Link
						href={cta.href}
						className='inline-flex items-center px-8 py-3 rounded-full bg-bb-green text-white font-semibold text-sm hover:bg-bb-green-dark transition-colors'
					>
						{cta.label}
					</Link>
				</div>
			</div>
		</UI.Box>
	);
}
