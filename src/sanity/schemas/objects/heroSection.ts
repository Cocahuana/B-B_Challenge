// WHY: The hero is the LCP element — it drives the most important Core Web
// Vitals metric on the page. Defining it as a discrete named object (not inline
// fields on homePage) lets the SectionRenderer key off `_type === "heroSection"`
// cleanly, and allows future reuse on other pages.
import { defineArrayMember, defineField, defineType } from "sanity";

export const heroSection = defineType({
	name: "heroSection",
	title: "Hero section",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `Hero — ${title ?? "untitled"}` }),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "subheadline",
			title: "Subheadline",
			type: "localizedString",
		}),
		defineField({
			name: "image",
			title: "Hero image",
			type: "image",
			options: {
				// WHY: hotspot stores the focal point so next/image can crop correctly
				// across all breakpoints (mobile portrait vs desktop landscape)
				// without needing a separate image per breakpoint.
				hotspot: true,
			},
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "localizedString",
					// WHY: Alt text is a WCAG 2.1 AA requirement and a Google ranking
					// signal. Enforcing it in the schema prevents blind publishing.
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
		defineField({
			name: "ctas",
			title: "CTA buttons",
			type: "array",
			// WHY: Array (not a single CTA) lets editors compose a primary +
			// secondary button pair without a schema change.
			of: [defineArrayMember({ type: "cta" })],
			validation: (Rule) => Rule.max(3),
		}),
	],
});
