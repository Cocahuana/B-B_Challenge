// WHY: A single barrel export means sanity.config.ts never imports individual
// schema files directly. Adding a new schema requires exactly two changes:
// create the file + add it to this array. No other file needs updating.
import type { SchemaTypeDefinition } from "sanity";

// ── Object types ──────────────────────────────────────────────────────────────
// WHY: Object types must be registered before document types that reference
// them. Sanity resolves type names at registration time.
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { cta } from "./objects/cta";
import { heroSection } from "./objects/heroSection";
import { featureSection } from "./objects/featureSection";
import { ctaSection } from "./objects/ctaSection";
import { faqSection } from "./objects/faqSection";

// ── Document types ────────────────────────────────────────────────────────────
import { homePage } from "./documents/homePage";
import { siteSettings } from "./documents/siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
	// Primitives / shared objects first
	localizedString,
	localizedText,
	cta,
	// Section objects
	heroSection,
	featureSection,
	ctaSection,
	faqSection,
	// Singleton documents
	homePage,
	siteSettings,
];
