// WHY: The "In 3 Schritten vom Test-Lunch zu Happy Teams" section is a
// high-intent conversion block — it removes objections by showing how simple
// onboarding is. Steps are ordered, so they live in an array that editors
// can reorder in the studio drag-handle UI.
import { defineArrayMember, defineField, defineType } from "sanity";

export const stepsSection = defineType({
	name: "stepsSection",
	title: "Steps section",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `Steps — ${title ?? "untitled"}` }),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "steps",
			title: "Steps",
			type: "array",
			of: [defineArrayMember({ type: "step" })],
			validation: (Rule) => Rule.min(1).max(6),
		}),
		defineField({
			name: "cta",
			title: "CTA button (shown after last step)",
			type: "cta",
		}),
	],
});
