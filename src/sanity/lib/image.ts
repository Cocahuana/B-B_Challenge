// src/sanity/lib/image.ts
//
// WHY: A tiny wrapper that pre-binds the Sanity project/dataset to the
// @sanity/image-url builder. Every component imports `urlFor` from here
// instead of constructing a builder themselves — one place to change if
// we ever switch CDN domains or add image transformations globally.

// WHY named export: the default export of @sanity/image-url is deprecated
// as of v2. The named `createImageUrlBuilder` is the current stable API.
import { createImageUrlBuilder } from "@sanity/image-url";
// WHY: SanityImageSource covers all valid inputs to the image builder:
// plain image objects, asset references, and inline image documents.
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

// WHY: We instantiate the builder once at module level (not per-render)
// because it is a pure, stateless helper — no benefit to recreating it.
const builder = createImageUrlBuilder(sanityClient);

/**
 * Returns an @sanity/image-url builder pre-bound to this project.
 *
 * Usage:
 *   urlFor(image).width(800).auto("format").url()
 *
 * Always call `.url()` at the end to get a string suitable for next/image src.
 */
export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
