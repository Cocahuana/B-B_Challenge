// WHY: A full-width CTA banner is a high-conversion placement (end of page,
// after social proof). Making it a first-class section type lets editors
// position it anywhere in the page array — not hard-coded at the bottom.
import { defineArrayMember, defineField, defineType } from "sanity";

export const ctaSection = defineType({
	name: "ctaSection",
	title: "CTA banner section",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `CTA — ${title ?? "untitled"}` }),
	},
	fields: [
		defineField({
			name: "colorScheme",
			title: "Colour scheme",
			type: "string",
			// WHY: The design uses a salmon/pink CTA banner ("Holt euer Team…")
			// and dark-green contact sections. One type, two visual modes,
			// zero content duplication.
			options: {
				list: [
					{ title: "Pink / salmon", value: "pink" },
					{ title: "Dark green", value: "green" },
				],
				layout: "radio",
			},
			initialValue: "pink",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Supporting text",
			type: "localizedText",
		}),
		defineField({
			name: "ctas",
			title: "CTA buttons",
			type: "array",
			of: [defineArrayMember({ type: "cta" })],
			validation: (Rule) => Rule.min(1).max(3),
		}),
		defineField({
			name: "backgroundImage",
			title: "Background image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "localizedString",
				}),
			],
		}),
	],
});
