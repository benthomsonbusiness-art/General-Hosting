import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const siteUrl = "https://valentiniandco.com";

const description =
  "Valentini & Co. pairs precision Meta advertising with instant AI lead-to-booking systems for boutique fitness studios—turning local demand into filled classes without discounting the brand.";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Valentini & Co. — Paid Acquisition & AI Automation Advisory",
    template: "%s — Valentini & Co.",
  },
  description,
  applicationName: "Valentini & Co.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Valentini & Co.",
    title: "Valentini & Co. — Paid Acquisition & AI Automation Advisory",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentini & Co. — Paid Acquisition & AI Automation Advisory",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Valentini & Co.",
  url: siteUrl,
  description,
  email: "inquiries@valentiniandco.com",
  areaServed: "United States",
  address: {
    "@type": "PostalAddress",
    addressRegion: "NJ",
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
