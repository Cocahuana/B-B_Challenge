// WHY: This is the minimal root layout required by Next.js App Router.
// Real per-locale metadata (lang attribute, hreflang, fonts) lives in
// src/app/[lang]/layout.tsx so each locale gets its own <html lang=""> value.
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="" is intentionally omitted here — [lang]/layout.tsx sets it
    // per locale. This avoids serving a mismatched lang attribute on SSR.
    <html>
      <body>{children}</body>
    </html>
  );
}
