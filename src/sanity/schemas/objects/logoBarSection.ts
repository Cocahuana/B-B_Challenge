// WHY: A dedicated logo bar section (vs hardcoding logos in the hero) lets
// editors swap out customer logos without touching the hero content.
// It also allows the bar to be repositioned on the page via the sections array.
import { defineArrayMember, defineField, defineType } from "sanity";

export const logoBarSection = defineType({
	name: "logoBarSection",
	title: "Logo bar",
	type: "object",
	preview: {
		select: { title: "eyebrow.de" },
		prepare: ({ title }) => ({ title: `Logo bar — ${title ?? ""}` }),
	},
	fields: [
		defineField({
			name: "eyebrow",
			title: 'Eyebrow text (e.g. "Loved by +X00 customers")',
			type: "localizedString",
		}),
		defineField({
			name: "logos",
			title: "Customer logos",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "logoItem",
					preview: { select: { title: "alt" } },
					fields: [
						defineField({
							name: "image",
							title: "Logo image",
							type: "image",
							options: { hotspot: false },
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "alt",
							title: "Company name (used as alt text)",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
					],
				}),
			],
		}),
	],
});
