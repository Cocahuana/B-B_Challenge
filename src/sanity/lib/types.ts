// WHY: Types in this file represent the PROJECTED shape returned by the GROQ
// queries in queries.ts — NOT the raw Sanity document shape. The distinction
// matters because:
//  - All localizedString/localizedText fields have already been resolved to
//    plain `string` by the query's coalesce() projection.
//  - Components only import from this file, never from sanity's own type helpers.
//  - If the query projection changes, update these types and TypeScript will
//    immediately surface every component that needs updating.

// ── Shared primitives ─────────────────────────────────────────────────────────

// WHY: SanityImageRef is the minimum shape needed for urlFor() to build a URL.
// We don't import from @sanity/image-url here because that would couple the
// app-layer types to the CMS package — this interface is intentionally thin.
export interface SanityImageRef {
	asset: { _ref: string; _type: "reference" };
	hotspot?: { x: number; y: number; width: number; height: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	// alt is projected by the query; may be undefined for non-content images
	alt?: string;
}

export interface CTA {
	label: string;
	href: string;
	variant: "primary" | "secondary" | "ghost";
}

// ── Section types (all strings are locale-resolved) ───────────────────────────

export interface HeroSection {
	_type: "heroSection";
	_key: string;
	headline: string;
	body?: string;
	image?: SanityImageRef;
	ctas?: CTA[];
	appStoreLinks?: { playStore?: string; appStore?: string };
	socialProofRating?: number;
}

export interface LogoBarSection {
	_type: "logoBarSection";
	_key: string;
	eyebrow?: string;
	logos: Array<{
		_key: string;
		image: SanityImageRef;
		alt: string;
	}>;
}

export interface StatItem {
	_key: string;
	value: string;
	label: string;
	description?: string;
}

export interface StatsSection {
	_type: "statsSection";
	_key: string;
	colorScheme: "light" | "dark";
	headline?: string;
	items: StatItem[];
}

export interface MenuCard {
	_key: string;
	tag?: string;
	image: SanityImageRef;
	name: string;
	approvalPct?: number;
	reviewCount?: number;
}

export interface MenuShowcaseSection {
	_type: "menuShowcaseSection";
	_key: string;
	headline: string;
	cards: MenuCard[];
	cta: CTA;
}

export interface ChecklistItem {
	_key: string;
	title: string;
	description?: string;
}

export interface ChecklistSection {
	_type: "checklistSection";
	_key: string;
	image?: SanityImageRef;
	items: ChecklistItem[];
}

export interface CtaSection {
	_type: "ctaSection";
	_key: string;
	colorScheme: "pink" | "green";
	headline: string;
	body?: string;
	ctas: CTA[];
	backgroundImage?: SanityImageRef;
}

export interface Step {
	_key: string;
	badge: string;
	title: string;
	description?: string;
	image?: SanityImageRef;
}

export interface StepsSection {
	_type: "stepsSection";
	_key: string;
	headline: string;
	steps: Step[];
	cta?: CTA;
}

export interface TestimonialItem {
	_key: string;
	quote: string;
	authorName: string;
	authorRole?: string;
	authorPhoto?: SanityImageRef;
}

export interface TestimonialsSection {
	_type: "testimonialsSection";
	_key: string;
	eyebrow?: string;
	testimonials: TestimonialItem[];
}

export interface ContactSection {
	_type: "contactSection";
	_key: string;
	headline: string;
	body?: string;
	personName: string;
	personRole?: string;
	personEmail: string;
	personPhone?: string;
	personPhoto?: SanityImageRef;
}

export interface ContactFormSection {
	_type: "contactFormSection";
	_key: string;
	headline?: string;
	submitLabel: string;
}

export interface FaqSection {
	_type: "faqSection";
	_key: string;
	headline?: string;
	items: Array<{ _key: string; question: string; answer: string }>;
}

// WHY: PageSection is a discriminated union keyed on `_type`.
// TypeScript will narrow the type automatically in a switch/if-else on _type,
// which means the SectionRenderer in Phase 7 gets full type safety
// without any manual casting.
export type PageSection =
	| HeroSection
	| LogoBarSection
	| StatsSection
	| MenuShowcaseSection
	| ChecklistSection
	| CtaSection
	| StepsSection
	| TestimonialsSection
	| ContactSection
	| ContactFormSection
	| FaqSection;

// ── Page-level types ──────────────────────────────────────────────────────────

export interface HomePageSeo {
	metaTitle?: string;
	metaDescription?: string;
	ogImage?: SanityImageRef;
}

export interface HomePage {
	seo?: HomePageSeo;
	sections: PageSection[];
}

export interface SiteSettings {
	orgName: string;
	logo?: SanityImageRef;
	seoDefaults?: HomePageSeo;
	socialLinks?: {
		linkedin?: string;
		instagram?: string;
		twitter?: string;
	};
}
