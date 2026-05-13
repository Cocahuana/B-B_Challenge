"use client";
// WHY "use client": the accordion open/close state must live in the browser.
// Each FAQ item toggles its answer independently — this requires useState.
// Only this narrow subtree becomes client JS; the rest of the page stays
// as server-rendered HTML.

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import * as UI from "@/components/ui";
import type { FaqSection as FaqSectionType } from "@/sanity/lib/types";

interface Props {
	section: FaqSectionType;
}

export default function FaqSection({ section }: Props) {
	const { headline, items } = section;
	const dict = useDictionary();
	const { expandLabel, collapseLabel } = dict.faq;

	// WHY Set<string>: multiple items can be open simultaneously, which is
	// a more accessible pattern than "only one open at a time" — users don't
	// lose context of a previously opened answer when opening another.
	const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

	function toggle(key: string) {
		setOpenKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	}

	return (
		<UI.Box
			as='section'
			aria-label='Frequently asked questions'
			className='bg-white py-20 lg:py-28'
		>
			<div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
				{headline && (
					<UI.Title
						as='h2'
						className='text-center font-black text-bb-green text-3xl lg:text-4xl mb-12'
					>
						{headline}
					</UI.Title>
				)}

				{/* WHY <dl>: definition lists semantically pair questions (dt) with
				    answers (dd), which is the correct markup for FAQ content. */}
				<dl className='space-y-2'>
					{items.map(({ _key, question, answer }) => {
						const isOpen = openKeys.has(_key);
						const answerId = `faq-answer-${_key}`;

						return (
							<div
								key={_key}
								className='border border-gray-100 rounded-xl overflow-hidden'
							>
								<dt>
									<button
										type='button'
										onClick={() => toggle(_key)}
										// WHY aria-expanded + aria-controls: standard ARIA pattern for
										// accordion buttons — announces current state to screen readers
										// and programmatically associates the button with its answer.
										aria-expanded={isOpen}
										aria-controls={answerId}
										className='w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 text-sm hover:bg-gray-50 transition-colors'
									>
										<span>{question}</span>
										<span
											className={[
												"flex-shrink-0 ml-4 text-bb-green transition-transform duration-200",
												isOpen
													? "rotate-180"
													: "rotate-0",
											].join(" ")}
											aria-label={
												isOpen
													? collapseLabel
													: expandLabel
											}
											aria-hidden='false'
										>
											{/* WHY inline SVG chevron: avoids an icon library
											    dependency for a single icon used once. */}
											<svg
												width='16'
												height='16'
												viewBox='0 0 16 16'
												fill='none'
												aria-hidden='true'
											>
												<path
													d='M4 6L8 10L12 6'
													stroke='currentColor'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</span>
									</button>
								</dt>
								<dd
									id={answerId}
									// WHY hidden attribute instead of conditional render:
									// the element stays in the DOM (better for SEO — Google
									// indexes hidden FAQ text) but is invisible until toggled.
									// Conditional render would remove it from the DOM entirely.
									hidden={!isOpen}
									className='px-6 pb-5 text-sm text-gray-600 leading-relaxed'
								>
									{answer}
								</dd>
							</div>
						);
					})}
				</dl>
			</div>
		</UI.Box>
	);
}
