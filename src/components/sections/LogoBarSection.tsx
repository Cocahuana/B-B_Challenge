// LogoBarSection — Server Component
// WHY Server Component: static logos with no interactivity.
// This section exists purely to build social proof ("Loved by X00 customers").
// Rendering it on the server means the logos appear in the initial HTML
// before any JavaScript executes — important for perceived performance.
import Image from "next/image";
import * as UI from "@/components/ui";
import { urlFor } from "@/sanity/lib/image";
import type { LogoBarSection as LogoBarSectionType } from "@/sanity/lib/types";

interface Props {
	section: LogoBarSectionType;
}

export default function LogoBarSection({ section }: Props) {
	const { eyebrow, logos } = section;

	return (
		<UI.Box
			as='section'
			aria-label='Trusted by'
			className='bg-white py-12 lg:py-16'
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{eyebrow && (
					<UI.Text className='text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8'>
						{eyebrow}
					</UI.Text>
				)}

				{logos.length > 0 && (
					// WHY flex + wrap: logos vary in width; flex-wrap ensures they
					// reflow gracefully across all breakpoints without a fixed column count.
					<UI.Flex
						justify='center'
						align='center'
						wrap='wrap'
						gap='2rem'
						className='opacity-60'
					>
						{logos.map(({ _key, image, alt }) => {
							const logoUrl = urlFor(image)
								.height(48)
								.auto("format")
								.url();
							return (
								<div
									key={_key}
									className='relative h-8 w-24 flex-shrink-0'
								>
									<Image
										src={logoUrl}
										alt={alt}
										fill
										className='object-contain'
										sizes='96px'
									/>
								</div>
							);
						})}
					</UI.Flex>
				)}
			</div>
		</UI.Box>
	);
}
