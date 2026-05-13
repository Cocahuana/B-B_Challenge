// sanity.config.ts
//
// WHY: The Sanity Studio is embedded inside the Next.js app at /studio.
// This keeps the CMS and the front-end in one repo, one deploy, and one
// set of environment variables — reducing operational overhead.
//
// Editors access it at: https://www.bellabona.com/studio
// (protected by Sanity's own authentication — no custom auth needed)

import { defineConfig } from "sanity";
import type { SchemaTypeDefinition } from "sanity";
import { structureTool } from "sanity/structure";

// Schemas are imported in Phase 3 — placeholder array for now so the
// studio config file is valid and can be type-checked immediately.
// Replace with: import { schemaTypes } from "@/sanity/schemas"
const schemaTypes: SchemaTypeDefinition[] = [];

export default defineConfig({
	// ── Project identity ────────────────────────────────────────────────────────
	name: "bella-bona",
	title: "Bella&Bona CMS",

	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

	// ── Schema ──────────────────────────────────────────────────────────────────
	// WHY: All schema types live in /src/sanity/schemas. The studio config just
	// points to them — no schema logic should live here.
	schema: {
		types: schemaTypes,
	},

	// ── Plugins ─────────────────────────────────────────────────────────────────
	plugins: [
		structureTool(),
		// WHY: @sanity/vision (GROQ query runner in the studio) is an optional
		// peer dependency. Install it with `npm install @sanity/vision` to enable.
		// It is excluded from the default install to keep the bundle lean.
	],
});
