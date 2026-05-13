// WHY: The contact person block ("Noch Fragen? Wir helfen dir gern.") is
// a trust/conversion element — a real human face beats a generic form.
// Keeping the contact person's details in the CMS means HR can update the
// responsible person without a code change.
import { defineField, defineType } from "sanity";

export const contactSection = defineType({
	name: "contactSection",
	title: "Contact section",
	type: "object",
	preview: {
		select: { title: "headline.de", subtitle: "personName" },
		prepare: ({ title, subtitle }) => ({
			title: `Contact — ${title ?? ""}`,
			subtitle,
		}),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body text",
			type: "localizedText",
		}),
		defineField({
			name: "personName",
			title: "Contact person name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "personRole",
			title: "Contact person role",
			type: "string",
		}),
		defineField({
			name: "personEmail",
			title: "Contact person email",
			type: "string",
			// WHY: `string` instead of `email` type — the email validator in
			// Sanity is strict; we want flexibility for display-only addresses.
			validation: (Rule) =>
				Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
					name: "email",
					invert: false,
				}),
		}),
		defineField({
			name: "personPhone",
			title: "Contact person phone",
			type: "string",
		}),
		defineField({
			name: "personPhoto",
			title: "Contact person photo",
			type: "image",
			options: { hotspot: true },
		}),
	],
});
