// WHY: getDictionary() is the single entry point for UI strings that are NOT
// stored in Sanity (labels, placeholders, aria-labels, error messages).
//
// WHY JSON files instead of a Sanity "translations" document?
// - UI strings like "Skip to content" or "Please fill in all required fields"
//   are developer concerns, not marketing concerns. Putting them in the CMS
//   would expose non-content editors to implementation details and create
//   unnecessary coupling between code deploys and CMS publishes.
// - JSON files are version-controlled alongside the code that uses them —
//   a string change and the component change are always in the same PR.
//
// WHY dynamic import instead of static import?
// - Static imports would bundle ALL locale files into EVERY page bundle.
// - Dynamic import (below) means Next.js code-splits by locale: the DE page
//   only downloads de.json, the EN page only downloads en.json.
//   For two locales the savings are small, but the pattern scales correctly.

import type { Locale } from "./routing";

// WHY: The return type is inferred from the DE dictionary (the source of truth).
// If a key exists in DE but is missing from EN, TypeScript will NOT catch it
// at this level — that's an acceptable trade-off. A dedicated i18n linting
// tool (e.g. i18n-ally VS Code extension) can enforce key parity instead.
//
// WHY no `satisfies Record<Locale, () => Promise<unknown>>`:
// Adding that annotation widens the value type to `Promise<unknown>`, which
// makes `Dictionary = unknown` — the exact opposite of what we want. The
// assignment is type-safe without the annotation because every locale key is
// checked against `Locale` via the explicit `Record<Locale, ...>` cast below.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	de: () =>
		import("./dictionaries/de.json").then((m) => m.default as Dictionary),
	en: () =>
		import("./dictionaries/en.json").then((m) => m.default as Dictionary),
};

// WHY: Dictionary is the shape of de.json (the canonical source-of-truth
// locale). We derive the type from a direct typeof so any key added to
// de.json is automatically reflected here without manual maintenance.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = typeof import("./dictionaries/de.json") extends {
	default: infer T;
}
	? T
	: any;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
	return dictionaries[locale]() as Promise<Dictionary>;
}
