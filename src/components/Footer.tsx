// Footer — Server Component
// WHY Server Component: the Footer has no interactivity. It reads from the
// dictionary (passed as prop) and renders static links. No useState or
// event handlers — keeping it as a Server Component avoids sending any
// client JS for a purely visual element.

import Link from "next/link";
import type { Locale } from "@/lib/i18n/routing";
import type { SiteSettings } from "@/sanity/lib/types";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface FooterProps {
	lang: Locale;
	settings: SiteSettings | null;
	dictionary: Dictionary;
}

export default function Footer({
	lang,
	settings,
	dictionary: dict,
}: FooterProps) {
	const f = dict.footer;

	// WHY: Social links from siteSettings fall back to "#" rather than being
	// omitted — broken # anchors are better than rendering an empty href which
	// would be invalid HTML.
	const social = settings?.socialLinks ?? {};

	return (
		<footer className='bg-bb-green text-white' aria-label='Site footer'>
			{/* ── Main footer grid ─────────────────────────────────────────── */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16'>
					{/* ── Col 1: Follow us + social ────────────────────────── */}
					<div>
						<p className='text-xs font-semibold uppercase tracking-widest text-white/60 mb-4'>
							{f.followUs}
						</p>
						<div className='flex gap-3 mb-6'>
							{social.linkedin && (
								<a
									href={social.linkedin}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='LinkedIn'
									className='w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-bb-lime transition-colors'
								>
									{/* WHY inline SVG: avoids an icon library dep for 3 icons */}
									<svg
										width='16'
										height='16'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'
									>
										<path d='M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z' />
									</svg>
								</a>
							)}
							{social.instagram && (
								<a
									href={social.instagram}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='Instagram'
									className='w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-bb-lime transition-colors'
								>
									<svg
										width='16'
										height='16'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'
									>
										<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' />
									</svg>
								</a>
							)}
						</div>
						{/* Email */}
						<p className='text-xs text-white/60 uppercase tracking-widest mb-1'>
							{f.emailLabel}
						</p>
						<a
							href='mailto:hello@bellabona.com'
							className='text-sm hover:text-bb-lime transition-colors'
						>
							hello@bellabona.com
						</a>
					</div>

					{/* ── Col 2: Schnellzugriffe ─────────────────────────── */}
					<div>
						<p className='text-xs font-semibold uppercase tracking-widest text-white/60 mb-4'>
							{f.quickLinks}
						</p>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.forEmployers}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.forEmployees}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.joinTeam}
								</Link>
							</li>
						</ul>
					</div>

					{/* ── Col 3: Entdecken ─────────────────────────────── */}
					<div>
						<p className='text-xs font-semibold uppercase tracking-widest text-white/60 mb-4'>
							{f.explore}
						</p>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.ourMenu}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.businessCatering}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.dailyLunch}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.aboutUs}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.caseStudies}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.blog}
								</Link>
							</li>
						</ul>
					</div>

					{/* ── Col 4: Unsere Richtlinien ─────────────────────── */}
					<div>
						<p className='text-xs font-semibold uppercase tracking-widest text-white/60 mb-4'>
							{f.policies}
						</p>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.terms}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.privacy}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-bb-lime transition-colors'
								>
									{f.cookies}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* ── Wordmark ─────────────────────────────────────────────── */}
				{/* WHY font-display + very large size: the footer wordmark uses
				    Barlow Condensed (display font) at an extreme size to create
				    the signature brand stamp seen in Bella&Bona's design. It
				    adds character to the footer without any images, which means
				    zero extra network requests and perfect text sharpness at any
				    resolution. aria-hidden prevents screen readers from announcing
				    the brand name twice (it's already in the header logo). */}
				<div
					className='font-display font-black text-bb-lime select-none overflow-hidden'
					style={{
						fontSize: "clamp(4rem, 14vw, 12rem)",
						lineHeight: 1,
						letterSpacing: "-0.02em",
					}}
					aria-hidden='true'
				>
					{(settings?.orgName ?? "BELLABONA").toUpperCase()}
				</div>

				{/* ── Copyright ────────────────────────────────────────────── */}
				<p className='mt-6 text-xs text-white/40'>{f.copyright}</p>
			</div>
		</footer>
	);
}
