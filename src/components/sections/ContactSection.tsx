// ContactSection — Server Component
// WHY Server Component: static contact info (name, email, phone, photo) from
// Sanity. The interactive form lives in ContactFormSection which is a separate
// Client Component — this section is purely presentational.
import * as UI from "@/components/ui";
import SanityImage from "@/components/SanityImage";
import type { ContactSection as ContactSectionType } from "@/sanity/lib/types";

interface Props {
	section: ContactSectionType;
}

export default function ContactSection({ section }: Props) {
	const {
		headline,
		body,
		personName,
		personRole,
		personEmail,
		personPhone,
		personPhoto,
	} = section;



	return (
		// WHY bg-bb-green + full height: the contact panel is visually paired with
		// the ContactFormSection beside it (they share a row in SectionRenderer).
		// The dark green background creates a clear visual boundary and ensures
		// the form feels like a distinct "act now" zone.
		<div className='bg-bb-green rounded-2xl p-8 lg:p-10 flex flex-col justify-between gap-8 h-full'>
			<div className='flex flex-col gap-4'>
				<UI.Title
					as='h2'
					className='font-black text-white text-2xl lg:text-3xl leading-tight'
				>
					{headline}
				</UI.Title>

				{body && (
					<UI.Text className='text-white/70 text-sm leading-relaxed'>
						{body}
					</UI.Text>
				)}
			</div>

			{/* ── Contact person card ─────────────────────────────────── */}
			<UI.Flex align='center' gap='1rem'>
				{personPhoto && (
					<div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-bb-lime/30 flex-shrink-0'>
						<SanityImage
							sanityRef={personPhoto}
							alt={personName}
							fill
							width={128}
							height={128}
							sizes='64px'
							className='object-cover'
						/>
					</div>
				)}
				<div className='flex flex-col gap-1'>
					<UI.Text as='span' className='font-bold text-white text-sm'>
						{personName}
					</UI.Text>
					{personRole && (
						<UI.Text as='span' className='text-white/60 text-xs'>
							{personRole}
						</UI.Text>
					)}
					<a
						href={`mailto:${personEmail}`}
						className='text-bb-lime text-xs hover:underline'
					>
						{personEmail}
					</a>
					{personPhone && (
						<a
							href={`tel:${personPhone.replace(/\s/g, "")}`}
							className='text-white/70 text-xs hover:text-white transition-colors'
						>
							{personPhone}
						</a>
					)}
				</div>
			</UI.Flex>
		</div>
	);
}
