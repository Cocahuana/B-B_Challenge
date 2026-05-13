// WHY: The checklist ("Jede Woche 30+ Gerichte…", "Bestellung per App…")
// acts as a social-proof / USP list adjacent to the product photo.
// Pairing the image with the checklist in one section type keeps them
// co-located in the studio — editors won't accidentally delete one and
// leave the other dangling.
import { defineArrayMember, defineField, defineType } from "sanity";

export const checklistSection = defineType({
	name: "checklistSection",
	title: "Checklist section",
	type: "object",
	preview: {
		select: { title: "items.0.title.de" },
		prepare: ({ title }) => ({ title: `Checklist — ${title ?? ""}` }),
	},
	fields: [
		defineField({
			name: "image",
			title: "Accompanying image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "localizedString",
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
		defineField({
			name: "items",
			title: "Checklist items",
			type: "array",
			of: [defineArrayMember({ type: "checklistItem" })],
			validation: (Rule) => Rule.min(1).max(8),
		}),
	],
});
