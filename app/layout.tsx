import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { InputModality } from "@/components/util/InputModality";
import { JsonLd } from "@/components/util/JsonLd";
import { HOME } from "@/content/pages";
import { NAV } from "@/content/site-nav";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { INQUIRY_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

// Emphasis and pull quotes only, so it does not compete with the hero image for bandwidth.
const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: "italic",
  variable: "--font-cormorant-italic",
  display: "swap",
  preload: false,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Used only for the payload viewer, so it is not preloaded on other pages.
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
  themeColor: "#F7F4EC",
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
      className={`${cormorant.variable} ${cormorantItalic.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
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
        <SiteHeader panels={NAV} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
