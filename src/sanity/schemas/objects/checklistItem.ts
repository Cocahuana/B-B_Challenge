// WHY: checklistItem is the building block for the social-proof checklist
// section ("Jede Woche 30+ Gerichte…", "Bestellung per App…", etc.).
// A separate named type (vs inline) keeps the checklistSection schema readable.
import { defineField, defineType } from "sanity";

export const checklistItem = defineType({
	name: "checklistItem",
	title: "Checklist item",
	type: "object",
	preview: {
		select: { title: "title.de" },
	},
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Supporting text",
			type: "localizedText",
		}),
	],
});
