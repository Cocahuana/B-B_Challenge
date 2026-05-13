// WHY: The contact form section is kept minimal in the CMS — only the
// headline and submit button label are editable. The field labels themselves
// are static UI strings handled via the i18n dictionary in Phase 5, because
// they map 1-to-1 with form validation logic that lives in code anyway.
// The form submission target (e.g. HubSpot, Netlify Forms) is configured
// via environment variables, not the CMS.
import { defineField, defineType } from "sanity";

export const contactFormSection = defineType({
	name: "contactFormSection",
	title: "Contact form",
	type: "object",
	preview: {
		select: { title: "headline.de" },
		prepare: ({ title }) => ({ title: `Form — ${title ?? ""}` }),
	},
	fields: [
		defineField({
			name: "headline",
			title: "Headline above form (optional)",
			type: "localizedString",
		}),
		defineField({
			name: "submitLabel",
			title: "Submit button label",
			type: "localizedString",
			initialValue: {
				de: "Kostenloses Angebot anfordern",
				en: "Request free offer",
			},
			validation: (Rule) => Rule.required(),
		}),
	],
});
