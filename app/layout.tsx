import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Cormorant_Garamond, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { InputModality } from "@/components/util/InputModality";
import { JsonLd } from "@/components/util/JsonLd";
import { HOME } from "@/content/pages";
import { NAV } from "@/content/site-nav";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { INQUIRY_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex",
  display: "swap",
});

// Used exclusively for BrandWordmark so the wordmark remains live text in Cormorant.
const cormorantWordmark = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-cormorant",
  display: "swap",
});

// Wordmark ampersand subset from Cormorant Garamond Italic 500 (SIL Open Font License).
const ampersand = localFont({
  src: "./fonts/cormorant-italic-ampersand.woff2",
  weight: "500",
  style: "italic",
  variable: "--font-ampersand",
  display: "swap",
});

// Used for payloads and coordinate labels, not preloaded on every route.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const title = `${SITE_NAME} — AI Workflow Automation`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${SITE_NAME}` },
  description: HOME.metaDescription,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title,
    description: HOME.metaDescription,
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: HOME.metaDescription,
    images: [DEFAULT_SHARE_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FCFBF7",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#firm`,
  name: SITE_NAME,
  url: SITE_URL,
  description: HOME.metaDescription,
  email: INQUIRY_EMAIL,
  image: `${SITE_URL}${DEFAULT_SHARE_IMAGE.url}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bloomington",
    addressRegion: "IN",
    addressCountry: "US",
  },
  knowsAbout: [
    "AI workflow automation",
    "Business process automation",
    "Meta advertising",
    "Operational strategy",
  ],
};

const skip =
  "skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-4 focus-visible:z-[60] focus-visible:bg-forest focus-visible:px-4 focus-visible:py-3 focus-visible:font-semibold focus-visible:text-ivory";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${plex.variable} ${cormorantWordmark.variable} ${ampersand.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body data-surface="light" className="flex min-h-full flex-col">
        <InputModality />
        <JsonLd data={organization} />
        <a href="#main" className={skip}>
          Skip to content
        </a>
        <a href="#site-footer" className={skip}>
          Skip to footer
        </a>
        <SiteHeader items={NAV} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
