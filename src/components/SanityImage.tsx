// SanityImage — Layer 2 composite component
//
// WHY a dedicated wrapper instead of calling urlFor() directly in each section?
//
//  1. Single place to apply .auto("format") — automatic WebP/AVIF negotiation
//     on the Sanity CDN side. A format policy change touches one file, not eight.
//
//  2. Single place to set the next/image quality default (85). The Next.js
//     default is 75, which looks visibly soft on high-DPI displays for food
//     photography. 85 is the sweet spot: ~50% smaller than quality=100 while
//     remaining indistinguishable at typical viewport sizes.
//
//  3. Null-safe by design: returns null when sanityRef is undefined/null so
//     sections don't need their own null-check + conditional-render patterns.
//
//  4. Lays the groundwork for placeholder="blur" + LQIP blurDataURL in a
//     future phase (add `metadata { lqip }` to GROQ projection + pass it here)
//     without touching any section component.
//
//  5. Named clearly in React DevTools / profiler — "SanityImage" is more
//     descriptive than an anonymous Image wrapper when debugging LCP issues.
//
// WHY TWO RENDER PATHS (fill vs fixed)?
//   fill=true: next/image stretches to fill a positioned parent (used for all
//     responsive image containers — hero, food cards, checklist photo, etc.).
//     Width/height props here are HINTS to the Sanity CDN about the largest
//     needed source image; they don't affect the rendered layout.
//
//   fill=false (fixed): next/image renders at an exact pixel size. We apply
//     .fit("crop") on the CDN side so the source dimensions match exactly.
//     Used for avatars and any future fixed-size image.

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageRef } from "@/sanity/lib/types";

// WHY 85: see point 2 above. Exported so callers can reference or override it.
export const DEFAULT_IMAGE_QUALITY = 85;

interface SanityImageFillProps {
	/** Sanity image reference from a GROQ projection. Null/undefined = renders nothing. */
	sanityRef: SanityImageRef | null | undefined;
	alt: string;
	fill: true;
	/** Required with fill to let browsers pick the right srcset entry. */
	sizes: string;
	/**
	 * Hint to Sanity CDN: caps the width of the source image it returns.
	 * Prevents fetching a 4K original when a 900px crop suffices.
	 * Does NOT affect the rendered layout — CSS + next/image handle that.
	 */
	width?: number;
	/**
	 * Hint to Sanity CDN: caps the height of the source image it returns.
	 */
	height?: number;
	quality?: number;
	className?: string;
	/** Set true for LCP-candidate images (e.g. hero). Adds fetchpriority="high"
	 *  and a <link rel="preload"> in the document head. */
	priority?: boolean;
}

interface SanityImageFixedProps {
	sanityRef: SanityImageRef | null | undefined;
	alt: string;
	fill?: false;
	/** Rendered pixel width AND Sanity CDN source width. */
	width: number;
	/** Rendered pixel height AND Sanity CDN source height. */
	height: number;
	sizes?: string;
	quality?: number;
	className?: string;
	priority?: boolean;
}

type Props = SanityImageFillProps | SanityImageFixedProps;

export default function SanityImage(props: Props) {
	const {
		sanityRef,
		alt,
		quality = DEFAULT_IMAGE_QUALITY,
		className,
		priority = false,
	} = props;

	// WHY early return (not throw): a missing Sanity image ref is a content
	// gap, not a code error. Throwing would break the whole page; returning
	// null gracefully hides the missing asset while the page remains usable.
	if (!sanityRef) return null;

	// LQIP (Low Quality Image Placeholder) strategy:
	// Sanity stores a ~40-byte base64 blur hash in asset.metadata.lqip.
	// We project it in the GROQ query (`"lqip": asset->metadata.lqip`) and
	// pass it here as `blurDataURL` for next/image's `placeholder="blur"`.
	//
	// WHY skip blur for priority images: priority images (e.g. hero LCP) are
	// preloaded via <link rel="preload"> and arrive before the browser paints.
	// Adding a blur placeholder to an already-prioritised image would flash
	// the placeholder for just a few milliseconds — visually jarring rather
	// than helpful. Non-priority (lazy) images benefit the most: the blur fills
	// the container while the full-resolution image loads on scroll.
	const blurDataURL = sanityRef.lqip;
	const placeholder =
		!priority && blurDataURL ? ("blur" as const) : undefined;

	// Build the Sanity CDN URL.
	// WHY .auto("format"): Sanity CDN performs server-side WebP/AVIF negotiation
	// independently of next/image. Both layers negotiate format — Sanity CDN
	// picks the best format for its direct edge cache (Cloudflare), and Next.js
	// image optimizer re-encodes for its own CDN cache. The double-optimization
	// is harmless and ensures fast delivery even when next/image's cache is cold.
	let builder = urlFor(sanityRef).auto("format");

	if (props.fill) {
		// Apply CDN dimension hints when provided.
		if (props.width) builder = builder.width(props.width);
		if (props.height) builder = builder.height(props.height);

		return (
			<Image
				src={builder.url()}
				alt={alt}
				fill
				sizes={props.sizes}
				quality={quality}
				className={className}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL}
			/>
		);
	}

	// Fixed layout: apply fit("crop") so the CDN returns exactly the
	// requested aspect ratio. Without this, Sanity defaults to "clip" mode
	// (letterbox/pillarbox) which can produce unexpected aspect ratios that
	// cause next/image to display black bars.
	builder = builder.width(props.width).height(props.height).fit("crop");

	return (
		<Image
			src={builder.url()}
			alt={alt}
			width={props.width}
			height={props.height}
			sizes={props.sizes}
			quality={quality}
			className={className}
			priority={priority}
			placeholder={placeholder}
			blurDataURL={blurDataURL}
		/>
	);
}
