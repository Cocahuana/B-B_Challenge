// WHY: testimonialItem is extracted so the studio array editor shows each
// testimonial with author name as the preview title — no hunting through
// collapsed objects to find the right one.
import { defineField, defineType } from "sanity";

export const testimonialItem = defineType({
	name: "testimonialItem",
	title: "Testimonial",
	type: "object",
	preview: {
		select: { title: "authorName", subtitle: "authorRole" },
	},
	fields: [
		defineField({
			name: "quote",
			title: "Quote",
			type: "localizedText",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "authorName",
			title: "Author name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "authorRole",
			title: "Author role / company",
			type: "string",
		}),
		defineField({
			name: "authorPhoto",
			title: "Author photo",
			type: "image",
			options: { hotspot: true },
		}),
	],
});
