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
			name: "body",
			title: "Body text",
			type: "localizedText",
			// WHY: localizedText (multi-line) not localizedString — the design
			// shows "30+ daily options, all diets, delivered to the office…"
			// which is a proper paragraph, not a single-line heading.
		}),
		defineField({
			name: "appStoreLinks",
			title: "App store links",
			type: "object",
			// WHY: Both links are optional — studio can launch before the app
			// is published on one of the stores.
			options: { collapsible: true, collapsed: false },
			fields: [
				defineField({
					name: "playStore",
					title: "Google Play URL",
					type: "url",
				}),
				defineField({
					name: "appStore",
					title: "Apple App Store URL",
					type: "url",
				}),
			],
		}),
		defineField({
			name: "socialProofRating",
			title: "Google rating (e.g. 4.7)",
			type: "number",
			validation: (Rule) => Rule.min(0).max(5),
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
