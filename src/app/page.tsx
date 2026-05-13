import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/routing";

// WHY: The bare "/" route has no content — all pages live under /[lang]/.
// We redirect to the default locale so crawlers follow the canonical
// locale URL and never index a duplicate, empty root page.
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}