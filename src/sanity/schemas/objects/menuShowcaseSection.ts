// WHY: Menu showcase is a conversion section — it shows rotating food cards to
// demonstrate variety. Keeping it CMS-driven lets the marketing team update
// featured dishes every week without a code deploy.
import { defineArrayMember, defineField, defineType } from "sanity";

export const menuShowcaseSection = defineType({
	name: "menuShowcaseSection",
	title: "Menu showcase",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `Menu — ${title ?? "untitled"}` }),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "cards",
			title: "Featured dishes",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "menuCard",
					preview: {
						select: { title: "name.de", subtitle: "tag.de" },
					},
					fields: [
						defineField({
							name: "tag",
						title: 'Category tag (e.g. "Saisonale Highlights")',
							type: "localizedString",
						}),
						defineField({
							name: "image",
							title: "Dish photo",
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
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "name",
							title: "Dish name",
							type: "localizedString",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "approvalPct",
							title: "Approval % (e.g. 94)",
							type: "number",
							validation: (Rule) => Rule.min(0).max(100),
						}),
						defineField({
							name: "reviewCount",
							title: "Number of reviews",
							type: "number",
						}),
					],
				}),
			],
			validation: (Rule) => Rule.min(1).max(6),
		}),
		defineField({
			name: "cta",
			title: "CTA button",
			type: "cta",
		}),
	],
});
