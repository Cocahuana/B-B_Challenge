// CtaSection — Server Component
// WHY Server Component: the CTA is a link — no client state needed.
// The `colorScheme` prop drives both the background colour and the button
// style. Two schemes ("pink" = blush + rose button, "green" = lime tint +
// dark green button) let the same schema type appear with different visual
// personalities at different points in the page narrative.
import Link from "next/link";
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { CtaSection as CtaSectionType } from "@/sanity/lib/types";

interface Props {
	section: CtaSectionType;
}

export default function CtaSection({ section }: Props) {
	const { colorScheme, headline, body, ctas, backgroundImage } = section;

	// WHY explicit class maps (not template literals): Tailwind v4's JIT scanner
	// needs complete class strings present in source files to include them in
	// the output CSS. Interpolated partials ("bg-bb-" + scheme) are not scanned.
	const sectionBg = colorScheme === "pink" ? "bg-bb-pink" : "bg-bb-surface";

	const primaryBtnClass =
		colorScheme === "pink"
			? "bg-bb-rose text-white hover:bg-red-800"
			: "bg-bb-green text-white hover:bg-bb-green-dark";

	const imageBg = colorScheme === "pink" ? "bg-bb-rose" : "bg-bb-green";

	const headlineColor =
		colorScheme === "pink" ? "text-gray-900" : "text-bb-green";

	const bodyColor =
		colorScheme === "pink" ? "text-gray-600" : "text-gray-600";

	return (
		<UI.Box
			as='section'
			aria-label='Call to action'
			className={`${sectionBg} py-20 lg:py-28`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					{/* ── Left: copy + buttons ───────────────────────────── */}
					<div className='flex flex-col gap-6'>
						<UI.Title
							as='h2'
							className={`font-black text-3xl lg:text-4xl xl:text-5xl leading-tight ${headlineColor}`}
						>
							{headline}
						</UI.Title>

						{body && (
							<UI.Text
								className={`text-base lg:text-lg leading-relaxed max-w-lg ${bodyColor}`}
							>
								{body}
							</UI.Text>
						)}

						{ctas && ctas.length > 0 && (
							<UI.Flex gap='0.75rem' wrap='wrap'>
								{(ctas ?? []).map((cta) => (
									<Link
										key={cta.href}
										href={cta.href}
										className={[
											"inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-colors",
											cta.variant === "primary"
												? primaryBtnClass
												: "border-2 border-current text-inherit hover:bg-black/5",
										].join(" ")}
									>
										{cta.label}
									</Link>
								))}
							</UI.Flex>
						)}
					</div>

					{/* ── Right: image ───────────────────────────────────── */}
					{backgroundImage && (
						<div
							className={`relative h-72 lg:h-96 rounded-2xl overflow-hidden ${imageBg}`}
						>
							{/* WHY mix-blend-multiply: blends the food photo against the coloured
							    container background — white areas become transparent, making the
							    image feel like it belongs to the section rather than a boxed crop. */}
							<SanityImage
								sanityRef={backgroundImage}
								alt={backgroundImage.alt ?? headline}
								fill
								width={700}
								height={500}
								sizes='(min-width: 1024px) 50vw, 100vw'
								className='object-cover object-center mix-blend-multiply'
							/>
						</div>
					)}
				</div>
			</div>
		</UI.Box>
	);
}
