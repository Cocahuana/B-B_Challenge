// WHY: FAQs are both an SEO asset (long-tail keyword coverage) and a
// conversion tool (objection removal). Structuring them as discrete Q&A pairs
// rather than free rich-text enables automatic JSON-LD FAQPage schema in
// Phase 6 — the CMS schema IS the structured data, no parsing needed.
import { defineArrayMember, defineField, defineType } from "sanity";

export const faqSection = defineType({
	name: "faqSection",
	title: "FAQ section",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `FAQ — ${title ?? "untitled"}` }),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
		}),
		defineField({
			name: "items",
			title: "FAQ items",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "faqItem",
					preview: { select: { title: "question.de" } },
					fields: [
						defineField({
							name: "question",
							title: "Question",
							type: "localizedString",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "answer",
							title: "Answer",
							type: "localizedText",
							validation: (Rule) => Rule.required(),
						}),
					],
				}),
			],
			validation: (Rule) => Rule.min(1),
		}),
	],
});
