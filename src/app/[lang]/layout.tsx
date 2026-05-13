// [lang]/layout.tsx
// Phase 6 will add: hreflang tags, generateMetadata, fonts, Open Graph defaults.
// This stub satisfies Next.js's required layout export so the dev server runs.

import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import "@/app/globals.css";

// WHY: generateStaticParams tells Next.js which [lang] values exist at build
// time. Without this, the dynamic segment would fall back to SSR for every
// request, defeating our ISR strategy for the homepage.
export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
	// Replaced in Phase 6 with dynamic metadata from Sanity
	title: "Bella&Bona",
};

export default function LangLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	// WHY: params is a Promise in Next.js 16 — must be awaited before use.
	params: Promise<{ lang: Locale }>;
}) {
	// lang is not used in this stub layout — Phase 6 will await it for the
	// <html lang=""> attribute and hreflang generation.
	void params;

	return <>{children}</>;
}
