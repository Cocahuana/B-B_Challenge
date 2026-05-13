// SectionRenderer — Server Component
// WHY Server Component: this is a pure router/switch with no state.
// Keeping it as a Server Component ensures the section components it
// delegates to can also remain Server Components by default — only the
// sections that declare "use client" themselves (PricingCalculator,
// ContactForm, Faq) create a client boundary.
//
// WHY switch over if-else chain: TypeScript's discriminated union narrowing
// works perfectly with switch on _type — each case branch has the fully
// narrowed type, so no manual casting is needed anywhere.
//
// WHY contactSection + contactFormSection are paired here:
//   In the design, the contact person info panel and the booking form appear
//   side-by-side in a two-column layout even though they are two separate
//   Sanity section types. Handling the pairing here in the renderer (rather
//   than in the page) keeps the page component clean and lets any future page
//   that has both sections benefit automatically.
import type { PageSection } from "@/sanity/lib/types";

import HeroSection from "./HeroSection";
import LogoBarSection from "./LogoBarSection";
import StatsSection from "./StatsSection";
import MenuShowcaseSection from "./MenuShowcaseSection";
import ChecklistSection from "./ChecklistSection";
import CtaSection from "./CtaSection";
import StepsSection from "./StepsSection";
import TestimonialsSection from "./TestimonialsSection";
import PricingCalculatorSection from "./PricingCalculatorSection";
import ContactSection from "./ContactSection";
import ContactFormSection from "./ContactFormSection";
import FaqSection from "./FaqSection";

interface Props {
	sections: PageSection[];
}

export default function SectionRenderer({ sections }: Props) {
	const elements: React.ReactNode[] = [];
	let i = 0;

	while (i < sections.length) {
		const section = sections[i];

		// ── Contact section pairing ───────────────────────────────────────
		// Detect consecutive contactSection + contactFormSection and render
		// them in a shared two-column grid so they appear side-by-side on
		// desktop (matching the design) while stacking on mobile.
		if (
			section._type === "contactSection" &&
			i + 1 < sections.length &&
			sections[i + 1]._type === "contactFormSection"
		) {
			const contactSection = section;
			const formSection = sections[i + 1];
			elements.push(
				<section
					key={`${contactSection._key}-pair`}
					aria-label='Contact'
					className='bg-bb-surface py-20 lg:py-28'
				>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						{/* WHY items-stretch: both panels should reach the same height
						    so the green contact card fills the column regardless of
						    how many form fields the form has. */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch'>
							<ContactSection section={contactSection} />
							{formSection._type === "contactFormSection" && (
								<ContactFormSection section={formSection} />
							)}
						</div>
					</div>
				</section>,
			);
			i += 2;
			continue;
		}

		// ── Standard section switch ───────────────────────────────────────
		switch (section._type) {
			case "heroSection":
				elements.push(
					<HeroSection key={section._key} section={section} />,
				);
				break;
			case "logoBarSection":
				elements.push(
					<LogoBarSection key={section._key} section={section} />,
				);
				break;
			case "statsSection":
				elements.push(
					<StatsSection key={section._key} section={section} />,
				);
				break;
			case "menuShowcaseSection":
				elements.push(
					<MenuShowcaseSection
						key={section._key}
						section={section}
					/>,
				);
				break;
			case "checklistSection":
				elements.push(
					<ChecklistSection key={section._key} section={section} />,
				);
				break;
			case "ctaSection":
				elements.push(
					<CtaSection key={section._key} section={section} />,
				);
				break;
			case "stepsSection":
				elements.push(
					<StepsSection key={section._key} section={section} />,
				);
				break;
			case "testimonialsSection":
				elements.push(
					<TestimonialsSection
						key={section._key}
						section={section}
					/>,
				);
				break;
			case "pricingCalculatorSection":
				elements.push(
					<PricingCalculatorSection
						key={section._key}
						section={section}
					/>,
				);
				break;
			case "contactSection":
				// WHY standalone rendering when not followed by contactFormSection:
				// Render the contact panel full-width so the page doesn't break if
				// a Sanity editor adds a contactSection without a following form.
				elements.push(
					<section
						key={section._key}
						className='bg-bb-surface py-20 lg:py-28'
					>
						<div className='max-w-xl mx-auto px-4 sm:px-6 lg:px-8'>
							<ContactSection section={section} />
						</div>
					</section>,
				);
				break;
			case "contactFormSection":
				// WHY standalone rendering: same safety valve as above.
				elements.push(
					<section
						key={section._key}
						className='bg-bb-surface py-20 lg:py-28'
					>
						<div className='max-w-xl mx-auto px-4 sm:px-6 lg:px-8'>
							<ContactFormSection section={section} />
						</div>
					</section>,
				);
				break;
			case "faqSection":
				elements.push(
					<FaqSection key={section._key} section={section} />,
				);
				break;
			default:
				// WHY exhaustive check: TypeScript's never type ensures we see a
				// compile error if a new section type is added to PageSection without
				// adding a corresponding case here. The cast makes the intent explicit.
				// eslint-disable-next-line no-case-declarations
				const _exhaustive: never = section;
				console.warn(
					"[SectionRenderer] Unknown section type:",
					(_exhaustive as PageSection)._type,
				);
		}

		i++;
	}

	return <>{elements}</>;
}
