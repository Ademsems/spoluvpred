import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BRAND } from "@/lib/brand";
import { SITE } from "@/lib/site";
import sk from "@/messages/sk.json";

/**
 * Web stand-in for the brand typeface Avenir Next: a humanist geometric sans.
 * `latin-ext` is required for Slovak diacritics (ľ š č ž ť ď ň ĺ ŕ ô ä).
 */
const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  // next/font has no fallback-metrics entry for Nunito Sans; the Tailwind
  // `font-sans` stack supplies the fallbacks instead.
  adjustFontFallback: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: sk.meta.title,
  description: sk.meta.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: sk.meta.title,
    description: sk.meta.description,
    locale: "sk_SK",
    alternateLocale: ["en_US"],
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.navy,
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE.legalName,
  alternateName: SITE.name,
  email: SITE.email,
  description: sk.meta.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressCountry: "SK",
  },
  sameAs: [SITE.instagram.url],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk" className={nunitoSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
