// WHY: A features/USP grid is the second most important conversion block after
// the hero. Defining it as a discrete type lets the SectionRenderer map it to
// its own optimised component with an icon sprite — no generic renderer needed.
import { defineArrayMember, defineField, defineType } from "sanity";

export const featureSection = defineType({
	name: "featureSection",
	title: "Feature section",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({
			title: `Features — ${title ?? "untitled"}`,
		}),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
		}),
		defineField({
			name: "subheadline",
			title: "Subheadline",
			type: "localizedString",
		}),
		defineField({
			name: "features",
			title: "Feature items",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "featureItem",
					preview: { select: { title: "title.de" } },
					fields: [
						defineField({
							name: "icon",
							title: "Icon key",
							type: "string",
							// WHY: Storing the icon as a string key (e.g. "delivery",
							// "freshness") decouples the CMS from any icon library.
							// The front-end maps the key to an SVG — swapping libraries
							// requires no content migration.
							description:
								"Identifier mapped to an SVG component on the front-end",
						}),
						defineField({
							name: "title",
							title: "Title",
							type: "localizedString",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "body",
							title: "Description",
							type: "localizedText",
						}),
					],
				}),
			],
			validation: (Rule) => Rule.min(1).max(8),
		}),
	],
});
