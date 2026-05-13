// WHY: siteSettings is a singleton for global data shared across all pages:
// org name, logo, social links, and fallback SEO values.
// Keeping it separate from homePage means any future page (e.g. /about) can
// inherit global defaults without coupling to homepage-specific content.
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Site settings",
	type: "document",
	fields: [
		defineField({
			name: "orgName",
			title: "Organisation name",
			type: "string",
			initialValue: "Bella&Bona",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			// WHY: hotspot: false — logos are never cropped; the entire image is
			// always displayed, so focal-point metadata would be meaningless.
			options: { hotspot: false },
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "string",
					initialValue: "Bella&Bona logo",
				}),
			],
		}),

		// ── Default SEO ──────────────────────────────────────────────────────────
		defineField({
			name: "seoDefaults",
			title: "Default SEO",
			type: "object",
			// WHY: Fallbacks prevent blank <title> tags on pages that haven't yet
			// defined their own SEO fields (e.g. a newly created landing page).
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "metaTitle",
					title: "Default meta title",
					type: "localizedString",
				}),
				defineField({
					name: "metaDescription",
					title: "Default meta description",
					type: "localizedText",
				}),
				defineField({
					name: "ogImage",
					title: "Default OG image (1200 × 630 px)",
					type: "image",
					options: { hotspot: true },
				}),
			],
		}),

		// ── Social links ─────────────────────────────────────────────────────────
		defineField({
			name: "socialLinks",
			title: "Social links",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "linkedin",
					title: "LinkedIn URL",
					type: "url",
				}),
				defineField({
					name: "instagram",
					title: "Instagram URL",
					type: "url",
				}),
				defineField({
					name: "twitter",
					title: "X / Twitter URL",
					type: "url",
				}),
			],
		}),
	],
});
