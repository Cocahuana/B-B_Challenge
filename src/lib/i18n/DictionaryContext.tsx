"use client";
// WHY: DictionaryContext lives in a Client Component module so that
// Client Components throughout the app can call useDictionary() to access
// UI strings without an additional server round-trip or prop drilling.
//
// The dictionary itself is fetched ONCE in the Server Component layout
// (LangLayout) and passed as a prop here. React's context mechanism
// propagates it to all Client Components in the subtree for free.
//
// WHY context instead of passing the dictionary as a prop to every component?
// The section components rendered by SectionRenderer don't know about the
// dictionary — they only receive their Sanity section data. Context lets them
// reach for strings when needed (e.g. aria-labels, form placeholders) without
// the parent having to thread the dictionary through every level.

import { createContext, useContext } from "react";
import type { Dictionary } from "./getDictionary";

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
	dictionary,
	children,
}: {
	dictionary: Dictionary;
	children: React.ReactNode;
}) {
	return (
		<DictionaryContext.Provider value={dictionary}>
			{children}
		</DictionaryContext.Provider>
	);
}

/** Call inside any Client Component to get localised UI strings. */
export function useDictionary(): Dictionary {
	const ctx = useContext(DictionaryContext);
	if (!ctx) {
		// WHY: Throw instead of returning undefined so missing provider bugs
		// surface immediately during development rather than as silent blank text.
		throw new Error("useDictionary must be used inside DictionaryProvider");
	}
	return ctx;
}
