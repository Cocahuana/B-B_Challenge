"use client";

// WHY: The root layout can't read the [lang] route param, so it can't set
// `<html lang={locale}>` during SSR. This tiny client component bridges that
// gap by updating document.documentElement.lang after React hydration.
//
// WHY this matters:
//   - WCAG 3.1.1 (Language of Page) requires the html element's lang attribute
//     to match the language of the page content. Screen readers use it to
//     select the correct pronunciation engine.
//   - Google uses the lang attribute as a secondary signal (after hreflang)
//     to confirm a page's language.
//
// WHY client component (not server):
//   document is only available in the browser. There is no server-side API
//   to update the <html> tag from a nested Server Component — the root layout
//   owns the <html> element and child layouts can't re-render it.
//
// WHY useEffect (not direct mutation):
//   Direct DOM mutation during render is not safe in React — it can cause
//   hydration mismatches or be overwritten during reconciliation. useEffect
//   runs after the component tree is committed to the DOM, making it the
//   correct place for imperative DOM operations.

import { useEffect } from "react";

export function LangSetter({ lang }: { lang: string }) {
	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return null;
}
