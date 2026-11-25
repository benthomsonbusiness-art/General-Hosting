import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, IBM_Plex_Mono, Mona_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { InputModality } from "@/components/util/InputModality";
import { JsonLd } from "@/components/util/JsonLd";
import { HOME } from "@/content/pages";
import { NAV } from "@/content/site-nav";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

// Used exclusively for BrandWordmark so the wordmark remains live text in Cormorant.
const cormorantWordmark = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-cormorant",
  display: "swap",
});

// Used for payloads and coordinate labels, not preloaded on every route.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const title = `${SITE_NAME} | AI Workflow Automation`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE_NAME}` },
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
  themeColor: "#0B1F16",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#firm`,
  name: SITE_NAME,
  url: SITE_URL,
  description: HOME.metaDescription,
  image: `${SITE_URL}${DEFAULT_SHARE_IMAGE.url}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Morristown",
    addressRegion: "NJ",
    addressCountry: "US",
  },
  founder: { "@type": "Person", name: "Ben Thomson", jobTitle: "Founder" },
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
      data-motion="on"
      data-scroll-behavior="smooth"
      className={`${mona.variable} ${cormorantWordmark.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body data-surface="dark" className="flex min-h-full flex-col">
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
