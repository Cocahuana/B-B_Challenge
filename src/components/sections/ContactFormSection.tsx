"use client";
// WHY "use client": form state (field values, validation errors, submit
// status) must live in the browser. Using a Client Component for the form
// isolates the client JS to this subtree — the ContactSection beside it
// remains a Server Component and ships zero JS.

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import * as UI from "@/components/ui";
import type { ContactFormSection as ContactFormSectionType } from "@/sanity/lib/types";

interface Props {
	section: ContactFormSectionType;
}

// WHY: Company size options are presentation-level constants — they belong
// here, not in the Sanity schema. Adding a new option requires a code change
// (and a re-deploy) regardless, so there's no content-team benefit to CMS-
// driving this list.
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export default function ContactFormSection({ section }: Props) {
	const { headline, submitLabel } = section;
	const dict = useDictionary();
	const f = dict.form;

	const [values, setValues] = useState({
		name: "",
		company: "",
		email: "",
		phone: "",
		companySize: "",
		comments: "",
		consent: false,
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	function update<K extends keyof typeof values>(
		key: K,
		value: (typeof values)[K],
	) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (
			!values.name ||
			!values.email ||
			!values.phone ||
			!values.companySize ||
			!values.consent
		) {
			setError(f.submitError);
			return;
		}
		setError(null);
		// WHY stub submit: wire to /api/contact or a CRM webhook (HubSpot, etc.)
		// in production. Logging here makes the behaviour visible during review.
		console.info("[ContactForm] Submission:", values);
		setSuccess(true);
	}

	if (success) {
		return (
			<div className='bg-white rounded-2xl p-8 flex items-center justify-center h-full'>
				<p className='text-center text-bb-green font-semibold text-lg'>
					{f.submitSuccess}
				</p>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-2xl p-8 lg:p-10 h-full' id='contact'>
			{headline && (
				<UI.Title
					as='h2'
					className='font-black text-bb-green text-xl lg:text-2xl mb-6'
				>
					{headline}
				</UI.Title>
			)}

			<form
				onSubmit={handleSubmit}
				noValidate
				className='flex flex-col gap-4'
			>
				{/* Name */}
				<div>
					<label
						htmlFor='cf-name'
						className='block text-xs font-semibold text-gray-600 mb-1'
					>
						{f.nameLabel}{" "}
						<span className='text-bb-rose'>{f.requiredSuffix}</span>
					</label>
					<input
						id='cf-name'
						type='text'
						autoComplete='name'
						placeholder={f.namePlaceholder}
						value={values.name}
						onChange={(e) => update("name", e.target.value)}
						required
						className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green'
					/>
				</div>

				{/* Company */}
				<div>
					<label
						htmlFor='cf-company'
						className='block text-xs font-semibold text-gray-600 mb-1'
					>
						{f.companyLabel}
					</label>
					<input
						id='cf-company'
						type='text'
						autoComplete='organization'
						placeholder={f.companyPlaceholder}
						value={values.company}
						onChange={(e) => update("company", e.target.value)}
						className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green'
					/>
				</div>

				{/* Email + Phone side by side */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='cf-email'
							className='block text-xs font-semibold text-gray-600 mb-1'
						>
							{f.emailLabel}{" "}
							<span className='text-bb-rose'>
								{f.requiredSuffix}
							</span>
						</label>
						<input
							id='cf-email'
							type='email'
							autoComplete='email'
							placeholder={f.emailPlaceholder}
							value={values.email}
							onChange={(e) => update("email", e.target.value)}
							required
							className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green'
						/>
					</div>
					<div>
						<label
							htmlFor='cf-phone'
							className='block text-xs font-semibold text-gray-600 mb-1'
						>
							{f.phoneLabel}{" "}
							<span className='text-bb-rose'>
								{f.requiredSuffix}
							</span>
						</label>
						<input
							id='cf-phone'
							type='tel'
							autoComplete='tel'
							placeholder={f.phonePlaceholder}
							value={values.phone}
							onChange={(e) => update("phone", e.target.value)}
							required
							className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green'
						/>
					</div>
				</div>

				{/* Company size */}
				<div>
					<label
						htmlFor='cf-size'
						className='block text-xs font-semibold text-gray-600 mb-1'
					>
						{f.companySizeLabel}{" "}
						<span className='text-bb-rose'>{f.requiredSuffix}</span>
					</label>
					{/* WHY <select> not a custom dropdown: native select has built-in
					    accessibility (keyboard navigation, screen reader support) and
					    requires zero JS. A custom dropdown that replicates this correctly
					    is significantly more complex to build and test. */}
					<select
						id='cf-size'
						value={values.companySize}
						onChange={(e) => update("companySize", e.target.value)}
						required
						className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green bg-white'
					>
						<option value=''>{f.companySizePlaceholder}</option>
						{COMPANY_SIZES.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				{/* Comments */}
				<div>
					<label
						htmlFor='cf-comments'
						className='block text-xs font-semibold text-gray-600 mb-1'
					>
						{f.commentsLabel}
					</label>
					<textarea
						id='cf-comments'
						rows={3}
						placeholder={f.commentsPlaceholder}
						value={values.comments}
						onChange={(e) => update("comments", e.target.value)}
						className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bb-green resize-none'
					/>
				</div>

				{/* Consent checkbox */}
				<div className='flex gap-3 items-start'>
					<input
						id='cf-consent'
						type='checkbox'
						checked={values.consent}
						onChange={(e) => update("consent", e.target.checked)}
						required
						className='mt-0.5 accent-bb-green'
					/>
					<label
						htmlFor='cf-consent'
						className='text-xs text-gray-500 leading-relaxed cursor-pointer'
					>
						{f.consentText}
					</label>
				</div>

				{error && (
					<p
						role='alert'
						className='text-bb-rose text-xs font-semibold'
					>
						{error}
					</p>
				)}

				<button
					type='submit'
					className='w-full sm:w-auto sm:self-start px-6 py-3 rounded-full bg-bb-green text-white font-semibold text-sm hover:bg-bb-green-dark transition-colors mt-2'
				>
					{submitLabel}
				</button>
			</form>
		</div>
	);
}
