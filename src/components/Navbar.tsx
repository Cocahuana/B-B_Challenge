"use client";
// WHY "use client": The Navbar needs useState for the mobile hamburger toggle.
// The language toggle is a simple anchor link (no client logic needed there),
// but the mobile menu open/close state requires a Client Component boundary.
// Everything else (logo, links, lang toggle) is pure render — minimal JS sent.

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/routing";
import { localeLabels, locales } from "@/lib/i18n/routing";
import type { SiteSettings } from "@/sanity/lib/types";

interface NavbarProps {
	lang: Locale;
	settings: SiteSettings | null;
}

// WHY: Nav links are hardcoded here rather than Sanity-driven.
// Navigation structure changes rarely and typically requires a code deploy
// anyway (new pages must be created first). A CMS-driven nav would add schema
// complexity without meaningful content-team autonomy for this use case.
// WHY NavLink type: `as const` narrows the union type too tightly — only one
// member has `hasDropdown`, so destructuring it causes TS2339. Using an
// explicit type with `hasDropdown?: boolean` is the cleanest fix.
type NavLink = { labelKey: string; href: string; hasDropdown?: boolean };
const NAV_LINKS: NavLink[] = [
	{ labelKey: "Daily lunch", href: "#" },
	{ labelKey: "More", href: "#", hasDropdown: true },
];

export default function Navbar({ lang, settings }: NavbarProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	// WHY: Compute the alt-locale link here (Server-safe since it's a constant
	// for this page). For a multi-page app we'd use usePathname() + replace.
	const otherLang = locales.find((l) => l !== lang) ?? ("en" as Locale);
	const orgName = settings?.orgName ?? "Bella&Bona";

	return (
		<header className='sticky top-0 z-50 bg-white border-b border-gray-100'>
			{/* WHY max-w-7xl: sections use the same max-width — nav aligns with content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* ── Logo ─────────────────────────────────────────────────── */}
					<Link
						href={`/${lang}`}
						className='font-black text-xl tracking-tight text-bb-green'
						aria-label={`${orgName} — zurück zur Startseite`}
					>
						{orgName.toUpperCase()}
					</Link>

					{/* ── Desktop nav ──────────────────────────────────────────── */}
					<nav
						className='hidden md:flex items-center gap-6'
						aria-label='Hauptnavigation'
					>
						{NAV_LINKS.map(({ labelKey, href, hasDropdown }) => (
							<Link
								key={labelKey}
								href={href}
								className='text-sm font-medium text-gray-700 hover:text-bb-green transition-colors flex items-center gap-1'
							>
								{labelKey}
								{hasDropdown && (
									<span
										aria-hidden='true'
										className='text-xs'
									>
										▾
									</span>
								)}
							</Link>
						))}
						<Link
							href='#'
							className='text-sm font-medium text-gray-700 hover:text-bb-green underline transition-colors'
						>
							Download menu
						</Link>
					</nav>

					{/* ── Right actions ────────────────────────────────────────── */}
					<div className='flex items-center gap-3'>
						{/* ── Language toggle ──────────────────────────────────── */}
						{/* WHY: Display both locales with a separator. The current locale
						    is visually emphasised; the other is a link. This pattern
						    (each locale in its own language) is the UX convention for
						    global sites — users recognise their own language's label. */}
						<div className='hidden md:flex items-center gap-1 text-sm font-medium'>
							<Link
								href={`/${otherLang}`}
								className='text-gray-400 hover:text-gray-700 transition-colors'
							>
								{localeLabels[otherLang]}
							</Link>
							<span className='text-gray-300 mx-0.5'>|</span>
							<span className='text-bb-green font-bold'>
								{localeLabels[lang]}
							</span>
						</div>

						{/* ── CTA button ───────────────────────────────────────── */}
						<Link
							href='#contact'
							className='hidden md:inline-flex items-center px-4 py-2 rounded-full bg-bb-green text-white text-sm font-semibold hover:bg-bb-green-dark transition-colors'
						>
							Book free testing
						</Link>

						{/* ── Mobile hamburger ─────────────────────────────────── */}
						<button
							className='md:hidden p-2 rounded-md text-gray-700 hover:text-bb-green'
							onClick={() => setMobileOpen((prev) => !prev)}
							aria-expanded={mobileOpen}
							aria-label='Menü öffnen'
						>
							{/* WHY: Three-line icon without an SVG library keeps the bundle lean */}
							<span className='block w-5 h-0.5 bg-current mb-1' />
							<span className='block w-5 h-0.5 bg-current mb-1' />
							<span className='block w-5 h-0.5 bg-current' />
						</button>
					</div>
				</div>
			</div>

			{/* ── Mobile menu ──────────────────────────────────────────────────── */}
			{mobileOpen && (
				<div className='md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4'>
					{NAV_LINKS.map(({ labelKey, href }) => (
						<Link
							key={labelKey}
							href={href}
							className='text-sm font-medium text-gray-700'
							onClick={() => setMobileOpen(false)}
						>
							{labelKey}
						</Link>
					))}
					<Link
						href='#'
						className='text-sm font-medium text-gray-700 underline'
						onClick={() => setMobileOpen(false)}
					>
						Download menu
					</Link>
					<div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
						<Link
							href={`/${otherLang}`}
							className='text-sm text-gray-400'
						>
							{localeLabels[otherLang]}
						</Link>
						<span className='text-gray-300'>|</span>
						<span className='text-sm font-bold text-bb-green'>
							{localeLabels[lang]}
						</span>
					</div>
					<Link
						href='#contact'
						className='inline-flex justify-center items-center px-4 py-2 rounded-full bg-bb-green text-white text-sm font-semibold'
						onClick={() => setMobileOpen(false)}
					>
						Book free testing
					</Link>
				</div>
			)}
		</header>
	);
}
