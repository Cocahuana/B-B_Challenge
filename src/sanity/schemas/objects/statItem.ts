// WHY: statItem is reused in two visually different sections (light and dark).
// Extracting it as a named object means one change here propagates to both.
import { defineField, defineType } from "sanity";

export const statItem = defineType({
	name: "statItem",
	title: "Stat item",
	type: "object",
	preview: {
		select: { title: "value.de", subtitle: "label.de" },
	},
	fields: [
		defineField({
			name: "value",
			title: "Value",
			type: "localizedString",
			// WHY: localizedString because abbreviations differ per locale
			// (e.g. "1.2 MM" in DE vs "1.2M" in EN).
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "label",
			title: "Label / metric",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Supporting description",
			type: "localizedText",
			// WHY: optional — light stats (9/10) omit it, dark benefit stats include it.
		}),
	],
});
