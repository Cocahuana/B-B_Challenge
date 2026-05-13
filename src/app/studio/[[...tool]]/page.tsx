// src/app/studio/[[...tool]]/page.tsx
//
// WHY: The Sanity Studio is embedded at /studio using a catch-all segment
// so that all studio sub-routes (/studio/desk, /studio/vision, etc.) are
// handled by the same page component without any additional routing config.
//
// WHY "use client": The Studio is an entirely client-side React application.
// It manages its own internal routing and state — it cannot be a Server
// Component.
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// WHY: We force this route to be dynamic so Next.js never tries to
// prerender the Studio at build time. The Studio requires browser APIs
// (localStorage, window) that are not available in Node.js.
export const dynamic = "force-dynamic";

export default function StudioPage() {
	return <NextStudio config={config} />;
}
