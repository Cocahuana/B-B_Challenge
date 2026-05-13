// WHY: The same statItem shape appears twice in the design with different
// visual treatments (light-gray cards vs dark-green cards). Using one
// schema type with a `colorScheme` field avoids duplicating the content
// model — editors manage content, designers manage color via colorScheme.
import { defineArrayMember, defineField, defineType } from "sanity";

export const statsSection = defineType({
	name: "statsSection",
	title: "Stats section",
	type: "object",
	preview: {
		select: { title: "headline.de", subtitle: "colorScheme" },
		prepare: ({ title, subtitle }) => ({
			title: `Stats (${subtitle ?? "light"}) — ${title ?? ""}`,
		}),
	},
	fields: [
		defineField({
			name: "colorScheme",
			title: "Colour scheme",
			type: "string",
			options: {
				list: [
					{ title: "Light (gray background)", value: "light" },
					{ title: "Dark (dark-green background)", value: "dark" },
				],
				layout: "radio",
			},
			initialValue: "light",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "headline",
			title: "Headline (optional)",
			type: "localizedString",
			// WHY: The dark variant in the design has "Endlich ein Benefit…"
			// above the cards; the light variant has no headline.
		}),
		defineField({
			name: "items",
			title: "Stat items",
			type: "array",
			of: [defineArrayMember({ type: "statItem" })],
			validation: (Rule) => Rule.min(1).max(6),
		}),
	],
});
