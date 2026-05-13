// WHY: Rather than duplicating every text field as `field_de` / `field_en` at
// the top level, we nest both locales inside a single object field.
// GROQ can project the active locale in one clean expression:
//   "headline": headline[$lang]
// No extra joins, no document-per-locale explosion, no plugin dependency.
import { defineField, defineType } from "sanity";

export const localizedString = defineType({
	name: "localizedString",
	title: "Localized string",
	type: "object",
	// WHY: collapsible:false surfaces the locale fields directly in the form
	// instead of hiding them one level deeper — reduces clicks for editors.
	options: { collapsible: false },
	fields: [
		defineField({
			name: "de",
			title: "Deutsch (DE)",
			type: "string",
			// WHY: German is the primary locale (x-default → de). Requiring it
			// prevents editors from publishing untranslated content.
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "en",
			title: "English (EN)",
			type: "string",
		}),
	],
});
