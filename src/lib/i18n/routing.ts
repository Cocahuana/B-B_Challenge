// WHY: Central locale registry — every part of the app that needs to know
// which locales exist imports from here. Changing the list in one place
// is all that's needed to add/remove a locale across the entire project.

export const locales = ["de", "en"] as const;

// WHY: German is primary — Bella&Bona's main market is DACH.
// The root "/" redirects here and hreflang x-default points to /de.
export const defaultLocale = "de" as const;

export type Locale = (typeof locales)[number];

/** Type-guard: returns true if s is a supported locale. */
export function isValidLocale(s: string): s is Locale {
	return (locales as readonly string[]).includes(s);
}
