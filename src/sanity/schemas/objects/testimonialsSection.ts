// WHY: Testimonials are a trust signal — structuring them as discrete typed
// objects (vs a block of free text) enables automatic structured-data markup
// (schema.org/Review) in Phase 6 without any parsing.
import { defineArrayMember, defineField, defineType } from "sanity";

export const testimonialsSection = defineType({
	name: "testimonialsSection",
	title: "Testimonials section",
	type: "object",
	preview: {
		select: { title: "eyebrow.de" },
		prepare: ({ title }) => ({
			title: `Testimonials — ${title ?? "untitled"}`,
		}),
	},
	fields: [
		defineField({
			name: "eyebrow",
			title: 'Eyebrow / headline (e.g. "200+ Firmen…")',
			type: "localizedString",
		}),
		defineField({
			name: "testimonials",
			title: "Testimonials",
			type: "array",
			of: [defineArrayMember({ type: "testimonialItem" })],
			validation: (Rule) => Rule.min(1),
		}),
	],
});
