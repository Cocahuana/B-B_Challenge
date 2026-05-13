// sanity.config.ts
//
// WHY: The Sanity Studio is embedded inside the Next.js app at /studio.
// This keeps the CMS and the front-end in one repo, one deploy, and one
// set of environment variables — reducing operational overhead.
//
// Editors access it at: https://www.bellabona.com/studio
// (protected by Sanity's own authentication — no custom auth needed)

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// WHY: All schema types are imported from a central barrel.
// Adding a new schema only requires creating the file + updating the index.
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
	// ── Project identity ────────────────────────────────────────────────────────
	name: "bella-bona",
	title: "Bella&Bona CMS",

	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

	// ── Schema ──────────────────────────────────────────────────────────────────
	// WHY: All schema types live in /src/sanity/schemas. The studio config just
	// points to them — no schema logic lives here.
	schema: {
		types: schemaTypes,
	},

	// ── Plugins ─────────────────────────────────────────────────────────────────
	plugins: [
		// WHY: structureTool is configured with a custom structure so that the
		// two singleton document types (homePage, siteSettings) are accessible
		// via fixed document IDs in the sidebar — not via a "New document" menu.
		// This is the Sanity v3/v4/v5 replacement for __experimental_actions.
		structureTool({
			structure: (S) =>
				S.list()
					.title("Content")
					.items([
						S.listItem().title("Home page").id("homePage").child(
							S.document()
								.schemaType("homePage")
								// WHY: Fixed document ID "homePage" means there is always
								// exactly one homepage document — no random Sanity ID.
								.documentId("homePage"),
						),
						S.listItem()
							.title("Site settings")
							.id("siteSettings")
							.child(
								S.document()
									.schemaType("siteSettings")
									.documentId("siteSettings"),
							),
						S.divider(),
					]),
		}),
		// WHY: @sanity/vision (GROQ query runner in the studio) is an optional
		// peer dependency. Install it with `npm install @sanity/vision` to enable.
		// It is excluded from the default install to keep the bundle lean.
	],
});
