// WHY: The pricing calculator is a configurable section — the numeric ranges,
// defaults, and all label strings come from Sanity so marketing/sales can
// adjust them without a code deploy. The interactive slider logic lives in
// the React component (Phase 7); this schema only captures the data layer.
import { defineField, defineType } from "sanity";

export const pricingCalculatorSection = defineType({
	name: "pricingCalculatorSection",
	title: "Pricing calculator",
	type: "object",
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "localizedString",
			validation: (Rule) => Rule.required(),
		}),

		// ── Days-per-week selector ───────────────────────────────────────────
		defineField({
			name: "daysOptions",
			title: "Days-per-week options",
			type: "array",
			of: [{ type: "number" }],
			// WHY: Array of numbers lets marketing decide whether to show 1-5 days,
			// or only 3-5 days, without touching code.
			initialValue: [1, 2, 3, 4, 5],
			description:
				"Which day-count buttons to show. Default: [1, 2, 3, 4, 5]",
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "defaultDays",
			title: "Pre-selected days per week",
			type: "number",
			initialValue: 3,
			validation: (Rule) => Rule.required().integer().min(1),
		}),

		// ── Employee slider ──────────────────────────────────────────────────
		defineField({
			name: "employeeMin",
			title: "Employee slider — minimum",
			type: "number",
			initialValue: 5,
			validation: (Rule) => Rule.required().integer().min(1),
		}),
		defineField({
			name: "employeeMax",
			title: "Employee slider — maximum",
			type: "number",
			initialValue: 200,
			validation: (Rule) => Rule.required().integer().min(1),
		}),
		defineField({
			name: "employeeDefault",
			title: "Employee slider — default value",
			type: "number",
			initialValue: 30,
			validation: (Rule) => Rule.required().integer().min(1),
		}),

		// ── Subsidy slider ───────────────────────────────────────────────────
		defineField({
			name: "subsidyMin",
			title: "Subsidy slider — minimum (€)",
			type: "number",
			initialValue: 2,
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: "subsidyMax",
			title: "Subsidy slider — maximum (€)",
			type: "number",
			initialValue: 10,
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: "subsidyDefault",
			title: "Subsidy slider — default value (€)",
			description: "Pre-filled position of the subsidy slider",
			type: "number",
			initialValue: 4.4,
			validation: (Rule) => Rule.required().min(0),
		}),

		// ── Meal price (used in calculation) ────────────────────────────────
		defineField({
			name: "baseMealPrice",
			title: "Base meal price (€)",
			// WHY: The React component derives the employee price as
			// baseMealPrice − subsidy. Storing this here lets pricing change
			// without a code deploy (e.g. if meal costs increase).
			description:
				"Nominal full price of one meal — used to calculate employee share. Typical: 7.50–9.90 €",
			type: "number",
			initialValue: 9.9,
			validation: (Rule) => Rule.required().min(0),
		}),

		// ── Labels (all localised) ───────────────────────────────────────────
		defineField({
			name: "employeePriceLabel",
			title: '"What your employees pay" label',
			type: "localizedString",
			initialValue: {
				de: "Was Ihre Mitarbeiter pro Mahlzeit zahlen",
				en: "What your employees pay per meal",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "companyPriceLabel",
			title: '"What your company pays" label',
			type: "localizedString",
			initialValue: {
				de: "Was Ihr Unternehmen pro Monat zahlt",
				en: "What your company pays per month",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "emailLabel",
			title: "Email input label/placeholder",
			type: "localizedString",
			initialValue: {
				de: "E-Mail für eine individuelle Aufstellung eingeben",
				en: "Enter your email for a custom breakdown",
			},
		}),
		defineField({
			name: "ctaLabel",
			title: "CTA button label",
			type: "localizedString",
			initialValue: {
				de: "Kostenloses Angebot anfordern",
				en: "Get Custom Quote",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "footnote",
			title: "Footnote below email input (optional)",
			// WHY: Legal/pricing asterisk text ("expert advice fee applies" etc.)
			// changes more often than the main copy — CMS-driven keeps lawyers happy.
			type: "localizedText",
		}),
	],
});
