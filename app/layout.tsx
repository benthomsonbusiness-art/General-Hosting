import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { InputModality } from "@/components/InputModality";
import { MotionRoot } from "@/components/MotionRoot";
import { INQUIRY_EMAIL, SITE_URL } from "@/lib/site";
import "./globals.css";

const description =
  "Valentini & Co. audits high-friction operations and engineers AI-assisted workflows around the tools a company already runs. Deterministic code, human approval gates, and systems the team owns.";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Valentini & Co. — AI Workflow Consulting",
    template: "%s — Valentini & Co.",
  },
  description,
  applicationName: "Valentini & Co.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Valentini & Co.",
    title: "Valentini & Co. — AI Workflow Consulting",
    description,
    images: [
      {
        url: "/images/hero-architecture.jpg",
        width: 1280,
        height: 720,
        alt: "Green marble, walnut slats, and a city at twilight.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentini & Co. — AI Workflow Consulting",
    description,
    images: ["/images/hero-architecture.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F16",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Valentini & Co.",
  url: SITE_URL,
  description,
  email: INQUIRY_EMAIL,
  knowsAbout: [
    "AI workflow consulting",
    "Business process automation",
    "Meta advertising",
    "Operational strategy",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <InputModality />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
