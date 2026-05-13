"use client";
// WHY "use client": This component owns interactive state — day selection,
// employee slider, and subsidy slider all update derived price calculations
// on every change. useState + event handlers require a Client Component.
//
// WHY CMS-driven config (PricingCalculatorSection type):
//   Slider ranges (employeeMin/Max, subsidyMin/Max), the base meal price, and
//   all labels are stored in Sanity. This means the pricing team can adjust
//   defaults and ranges without a code deploy — critical for a product where
//   pricing changes regularly.

import { useState } from "react";
import * as UI from "@/components/ui";
import type { PricingCalculatorSection as PricingCalculatorSectionType } from "@/sanity/lib/types";

interface Props {
	section: PricingCalculatorSectionType;
}

// WHY 4.33: average weeks per month (365 / 12 / 7 ≈ 4.33). Using this
// constant instead of 4 gives a more accurate monthly cost estimate.
const WEEKS_PER_MONTH = 4.33;

export default function PricingCalculatorSection({ section }: Props) {
	const {
		headline,
		daysOptions,
		defaultDays,
		employeeMin,
		employeeMax,
		employeeDefault,
		subsidyMin,
		subsidyMax,
		subsidyDefault,
		baseMealPrice,
		employeePriceLabel,
		companyPriceLabel,
		emailLabel,
		ctaLabel,
		footnote,
	} = section;

	const [days, setDays] = useState(defaultDays);
	const [employees, setEmployees] = useState(employeeDefault);
	const [subsidy, setSubsidy] = useState(subsidyDefault);
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	// ── Derived calculations ───────────────────────────────────────────────
	// WHY Math.max(0, ...): subsidy can theoretically exceed baseMealPrice if a
	// content editor sets extreme values; clamp to 0 to avoid displaying a
	// negative employee price.
	const employeePayPerDish = Math.max(0, baseMealPrice - subsidy);
	const companyPayPerMonth = Math.round(
		employees * days * WEEKS_PER_MONTH * subsidy,
	);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email) return;
		// WHY: stub submit — wire to /api/quote or a CRM integration in production.
		// The form collects the configured calculator values so the sales team
		// has context when they follow up.
		console.info("[PricingCalculator] Quote requested:", {
			email,
			days,
			employees,
			subsidy,
			employeePayPerDish,
			companyPayPerMonth,
		});
		setSubmitted(true);
	}

	return (
		<UI.Box
			as='section'
			aria-label='Pricing calculator'
			className='bg-bb-green py-20 lg:py-28'
		>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				<UI.Title
					as='h2'
					className='text-center font-black text-white text-3xl lg:text-4xl xl:text-5xl leading-tight mb-12'
				>
					{headline}
				</UI.Title>

				<div className='bg-white rounded-2xl p-8 lg:p-12 flex flex-col gap-10'>
					{/* ── Days selector ─────────────────────────────────────── */}
					<fieldset>
						<legend className='text-sm font-semibold text-gray-700 mb-4'>
							How many days per week do you want to offer lunch?
						</legend>
						<UI.Flex gap='0.5rem' wrap='wrap'>
							{daysOptions.map((d) => (
								<button
									key={d}
									type='button'
									onClick={() => setDays(d)}
									// WHY aria-pressed: day buttons act as toggles, not navigation.
									// aria-pressed communicates the selected state to screen readers.
									aria-pressed={days === d}
									className={[
										"w-12 h-12 rounded-full font-bold text-sm transition-colors border-2",
										days === d
											? "bg-bb-green border-bb-green text-white"
											: "bg-white border-gray-200 text-gray-700 hover:border-bb-green",
									].join(" ")}
								>
									{d}
								</button>
							))}
						</UI.Flex>
					</fieldset>

					{/* ── Employees slider ──────────────────────────────────── */}
					<div className='flex flex-col gap-3'>
						<label
							htmlFor='employees-slider'
							className='text-sm font-semibold text-gray-700'
						>
							How many employees will roughly join?{" "}
							<span className='font-black text-bb-green'>
								{employees}
							</span>
						</label>
						<input
							id='employees-slider'
							type='range'
							min={employeeMin}
							max={employeeMax}
							value={employees}
							onChange={(e) =>
								setEmployees(Number(e.target.value))
							}
							className='w-full accent-bb-green h-2 rounded-full'
							aria-valuemin={employeeMin}
							aria-valuemax={employeeMax}
							aria-valuenow={employees}
							aria-valuetext={`${employees} employees`}
						/>
						<UI.Flex justify='space-between'>
							<UI.Text
								as='span'
								className='text-xs text-gray-400'
							>
								{employeeMin}
							</UI.Text>
							<UI.Text
								as='span'
								className='text-xs text-gray-400'
							>
								{employeeMax}
							</UI.Text>
						</UI.Flex>
					</div>

					{/* ── Subsidy slider ───────────────────────────────────── */}
					<div className='flex flex-col gap-3'>
						<label
							htmlFor='subsidy-slider'
							className='text-sm font-semibold text-gray-700'
						>
							How much of each meal will your company cover?{" "}
							<span className='font-black text-bb-green'>
								{subsidy.toFixed(2)} €
							</span>
						</label>
						<input
							id='subsidy-slider'
							type='range'
							min={subsidyMin}
							max={subsidyMax}
							step={0.5}
							value={subsidy}
							onChange={(e) => setSubsidy(Number(e.target.value))}
							className='w-full accent-bb-green h-2 rounded-full'
							aria-valuemin={subsidyMin}
							aria-valuemax={subsidyMax}
							aria-valuenow={subsidy}
							aria-valuetext={`${subsidy} euro subsidy`}
						/>
						<UI.Flex justify='space-between'>
							<UI.Text
								as='span'
								className='text-xs text-gray-400'
							>
								{subsidyMin} €
							</UI.Text>
							<UI.Text
								as='span'
								className='text-xs text-gray-400'
							>
								{subsidyMax} €
							</UI.Text>
						</UI.Flex>
					</div>

					{/* ── Results ───────────────────────────────────────────── */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						{/* Employee price */}
						<div className='bg-bb-surface rounded-xl p-5'>
							<UI.Text className='text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1'>
								{employeePriceLabel}
							</UI.Text>
							<UI.Text
								as='span'
								className='text-2xl font-black text-bb-green'
							>
								{employeePayPerDish.toFixed(2)} €
							</UI.Text>
							<UI.Text
								as='span'
								className='text-sm text-gray-400 ml-1'
							>
								/ dish
							</UI.Text>
						</div>

						{/* Company price */}
						<div className='bg-bb-green rounded-xl p-5'>
							<UI.Text className='text-xs text-white/60 font-semibold uppercase tracking-wide mb-1'>
								{companyPriceLabel}
							</UI.Text>
							<UI.Text
								as='span'
								className='text-2xl font-black text-bb-lime'
							>
								{companyPayPerMonth.toLocaleString("de-DE")} €
							</UI.Text>
							<UI.Text
								as='span'
								className='text-sm text-white/60 ml-1'
							>
								/ mo
							</UI.Text>
						</div>
					</div>

					{/* ── Email + CTA ───────────────────────────────────────── */}
					{submitted ? (
						<p className='text-center text-bb-green font-semibold py-4'>
							Thank you! We'll be in touch with a personalised
							quote.
						</p>
					) : (
						<form
							onSubmit={handleSubmit}
							className='flex flex-col sm:flex-row gap-3'
							noValidate
						>
							<label htmlFor='quote-email' className='sr-only'>
								{emailLabel ?? "Your work email"}
							</label>
							<input
								id='quote-email'
								type='email'
								placeholder={emailLabel ?? "Your work email"}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								// WHY autocomplete="email": browsers surface saved addresses,
								// reducing friction and improving form completion rate.
								autoComplete='email'
								className='flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green'
							/>
							<button
								type='submit'
								className='px-6 py-3 rounded-full bg-bb-green text-white font-semibold text-sm hover:bg-bb-green-dark transition-colors whitespace-nowrap'
							>
								{ctaLabel}
							</button>
						</form>
					)}

					{footnote && (
						<UI.Text className='text-center text-xs text-gray-400 leading-relaxed'>
							{footnote}
						</UI.Text>
					)}
				</div>
			</div>
		</UI.Box>
	);
}
