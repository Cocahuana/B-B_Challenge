// StatsSection — Server Component
// WHY Server Component: static numbers from Sanity. No interactivity needed.
// This component handles two colour schemes via the `colorScheme` prop so
// the same schema type can appear multiple times on the page with different
// visual treatments (as the design shows: one light, one dark).
import * as UI from "@/components/ui";
import type { StatsSection as StatsSectionType } from "@/sanity/lib/types";

interface Props {
	section: StatsSectionType;
}

export default function StatsSection({ section }: Props) {
	const { colorScheme, headline, items } = section;

	// WHY two explicit className maps rather than template literals:
	// Tailwind v4 (like v3) requires full class names to be present in source
	// for JIT to include them in the output. Dynamic class construction with
	// string interpolation can cause classes to be tree-shaken away if the
	// partial strings aren't elsewhere in the source.
	const sectionClass =
		colorScheme === "dark"
			? "bg-bb-green py-20 lg:py-28"
			: "bg-white py-12 lg:py-20";

	const headlineClass =
		colorScheme === "dark"
			? "text-white text-center text-3xl lg:text-4xl font-black mb-12"
			: "text-gray-900 text-center text-3xl lg:text-4xl font-bold mb-12";

	const cardClass =
		colorScheme === "dark"
			? "bg-bb-green-dark border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 h-full justify-center"
			: "bg-[#f9f9f9] rounded-2xl p-8 lg:p-12 flex flex-col items-start gap-6 h-full justify-center";

	const valueClass =
		colorScheme === "dark"
			? "text-bb-lime font-medium text-5xl lg:text-6xl"
			: "text-[#222222] font-medium text-5xl lg:text-6xl tracking-tight leading-none min-h-[4rem] flex items-end";

	const labelClass =
		colorScheme === "dark"
			? "text-white/90 font-normal text-sm lg:text-base mt-auto"
			: "text-gray-700 font-normal text-sm lg:text-base mt-auto leading-relaxed";

	const descClass =
		colorScheme === "dark"
			? "text-white/60 text-xs mt-1"
			: "text-gray-500 text-xs mt-1";

	return (
		<UI.Box as='section' aria-label='Statistics' className={sectionClass}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{headline && (
					<UI.Title as='h2' className={headlineClass}>
						{headline}
					</UI.Title>
				)}

				{/* WHY grid instead of flex: grid gives equal-width columns
				    automatically — stat cards always align regardless of value length. */}
				<div
					className='grid gap-6'
					style={{
						gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, minmax(0, 1fr))`,
					}}
				>
					{(items ?? []).map(
						({ _key, value, label, description }) => (
							<div key={_key} className={cardClass}>
								{/* WHY aria-label on the value+label pair: combining them in one
							    label prevents screen readers from reading them as two separate
							    disjointed pieces of text. */}
								<UI.Text
									as='span'
									className={valueClass}
									aria-label={`${value} — ${label}`}
								>
									{value}
								</UI.Text>
								<UI.Text
									as='span'
									className={labelClass}
									aria-hidden='true'
								>
									{label}
								</UI.Text>
								{description && (
									<UI.Text as='span' className={descClass}>
										{description}
									</UI.Text>
								)}
							</div>
						),
					)}
				</div>
			</div>
		</UI.Box>
	);
}
