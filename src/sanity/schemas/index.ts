// WHY: A single barrel export means sanity.config.ts never imports individual
// schema files directly. Adding a new schema requires exactly two changes:
// create the file + add it to this array. No other file needs updating.
import type { SchemaTypeDefinition } from "sanity";

// ── Shared primitive objects ──────────────────────────────────────────────────
// WHY: Primitives must be registered before sections that reference them.
// Sanity resolves type names at registration time — order matters.
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { cta } from "./objects/cta";
import { statItem } from "./objects/statItem";
import { checklistItem } from "./objects/checklistItem";
import { step } from "./objects/step";
import { testimonialItem } from "./objects/testimonialItem";

// ── Section objects ───────────────────────────────────────────────────────────
import { heroSection } from "./objects/heroSection";
import { logoBarSection } from "./objects/logoBarSection";
import { statsSection } from "./objects/statsSection";
import { menuShowcaseSection } from "./objects/menuShowcaseSection";
import { featureSection } from "./objects/featureSection";
import { checklistSection } from "./objects/checklistSection";
import { ctaSection } from "./objects/ctaSection";
import { stepsSection } from "./objects/stepsSection";
import { testimonialsSection } from "./objects/testimonialsSection";
import { contactSection } from "./objects/contactSection";
import { contactFormSection } from "./objects/contactFormSection";
import { faqSection } from "./objects/faqSection";
import { pricingCalculatorSection } from "./objects/pricingCalculatorSection";

// ── Document types ────────────────────────────────────────────────────────────
import { homePage } from "./documents/homePage";
import { siteSettings } from "./documents/siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
	// Primitives first
	localizedString,
	localizedText,
	cta,
	statItem,
	checklistItem,
	step,
	testimonialItem,
	// Sections
	heroSection,
	logoBarSection,
	statsSection,
	menuShowcaseSection,
	featureSection,
	checklistSection,
	ctaSection,
	stepsSection,
	testimonialsSection,
	contactSection,
	contactFormSection,
	faqSection,
	pricingCalculatorSection,
	// Singleton documents
	homePage,
	siteSettings,
];
