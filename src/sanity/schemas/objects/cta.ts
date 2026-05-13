// WHY: CTA (call-to-action) is a reusable object used in heroSection,
// ctaSection, and anywhere else a button is needed. Centralising the shape
// means the front-end has one predictable type — no per-section button logic.
import { defineField, defineType } from "sanity";

export const cta = defineType({
	name: "cta",
	title: "CTA button",
	type: "object",
	preview: {
		select: { title: "label.de", subtitle: "href" },
	},
	fields: [
		defineField({
			name: "label",
			title: "Label",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "href",
			title: "URL / path",
			type: "string",
			// WHY: `string` instead of Sanity's built-in `url` type because internal
			// paths like /kontakt are valid targets and the url validator rejects them.
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "variant",
			title: "Visual variant",
			type: "string",
			// WHY: Variant lives in the CMS so designers can change button hierarchy
			// (e.g. swap primary↔secondary) without a code deploy.
			options: {
				list: [
					{ title: "Primary (filled)", value: "primary" },
					{ title: "Secondary (outlined)", value: "secondary" },
					{ title: "Ghost (text-only)", value: "ghost" },
				],
				layout: "radio",
			},
			initialValue: "primary",
		}),
	],
});
