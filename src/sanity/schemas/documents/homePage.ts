// WHY: homePage is a singleton — there is exactly one homepage.
// Singleton enforcement is handled in sanity.config.ts via the structure tool:
// the document type is hidden from the "New document" menu and the studio
// navigates directly to the fixed document ID "homePage".
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
	name: "homePage",
	title: "Home page",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Internal title",
			type: "string",
			// WHY: Studio-only label — not rendered on the front-end.
			// Useful for distinguishing draft vs published in list views.
			description: "Studio-only label — not rendered on the website",
			initialValue: "Home page",
			validation: (Rule) => Rule.required(),
		}),

		// ── SEO ─────────────────────────────────────────────────────────────────
		defineField({
			name: "seo",
			title: "SEO",
			type: "object",
			// WHY: Collapsible group keeps the form clean — content editing is the
			// primary job; SEO is secondary. Collapsed: false means editors still
			// see it without an extra click on first open.
			options: { collapsible: true, collapsed: false },
			fields: [
				defineField({
					name: "metaTitle",
					title: "Meta title",
					type: "localizedString",
					description: "Recommended: 50–60 characters",
				}),
				defineField({
					name: "metaDescription",
					title: "Meta description",
					type: "localizedText",
					description: "Recommended: 150–160 characters",
				}),
				defineField({
					name: "ogImage",
					title: "OG image (1200 × 630 px)",
					type: "image",
					options: { hotspot: true },
				}),
			],
		}),

		// ── Page sections ────────────────────────────────────────────────────────
		defineField({
			name: "sections",
			title: "Page sections",
			type: "array",
			// WHY: The composable sections array is the core of the page model.
			// Editors add, reorder, and remove sections without a code deploy.
			// The front-end SectionRenderer maps each _type to its React component.
			// Section order matches the design: hero → logos → stats → menu →
			// checklist → cta → steps → testimonials → contact → form → faq.
			of: [
				defineArrayMember({ type: "heroSection" }),
				defineArrayMember({ type: "logoBarSection" }),
				defineArrayMember({ type: "statsSection" }),
				defineArrayMember({ type: "menuShowcaseSection" }),
				defineArrayMember({ type: "checklistSection" }),
				defineArrayMember({ type: "ctaSection" }),
				defineArrayMember({ type: "stepsSection" }),
				defineArrayMember({ type: "testimonialsSection" }),
				defineArrayMember({ type: "pricingCalculatorSection" }),
				defineArrayMember({ type: "contactSection" }),
				defineArrayMember({ type: "contactFormSection" }),
				defineArrayMember({ type: "faqSection" }),
				// WHY: featureSection stays available for future pages (e.g. /about)
				// even though it isn't used in the homepage design.
				defineArrayMember({ type: "featureSection" }),
			],
		}),
	],
});
