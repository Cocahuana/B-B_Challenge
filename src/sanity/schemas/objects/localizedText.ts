// WHY: Same i18n pattern as localizedString but for multi-line plain text
// (FAQ answers, feature descriptions, supporting copy).
// Using `text` instead of Portable Text keeps the studio clean — no toolbar
// overhead for fields that only ever render as <p> tags on the front-end.
import { defineField, defineType } from "sanity";

export const localizedText = defineType({
	name: "localizedText",
	title: "Localized text",
	type: "object",
	options: { collapsible: false },
	fields: [
		defineField({
			name: "de",
			title: "Deutsch (DE)",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "en",
			title: "English (EN)",
			type: "text",
			rows: 3,
		}),
	],
});
