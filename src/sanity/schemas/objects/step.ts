// WHY: step is used once (stepsSection) but extracted as a named type because
// the array editor in Sanity Studio shows named types with their own preview,
// which makes reordering steps much less error-prone for editors.
import { defineField, defineType } from "sanity";

export const step = defineType({
	name: "step",
	title: "Step",
	type: "object",
	preview: {
		select: { title: "title.de", subtitle: "badge.de" },
		prepare: ({ title, subtitle }) => ({
			title: title ?? "Untitled step",
			subtitle,
		}),
	},
	fields: [
		defineField({
			name: "badge",
			title: "Step badge (e.g. “Schritt 01”)",
			type: "localizedString",
			// WHY: localizedString because "Schritt" in DE → "Step" in EN.
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "localizedText",
		}),
		defineField({
			name: "image",
			title: "Illustration / screenshot",
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
