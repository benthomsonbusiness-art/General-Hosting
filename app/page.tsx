import type { Metadata } from "next";
import { Approach } from "@/components/Approach";
import { Capabilities } from "@/components/Capabilities";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import InquiryForm from "@/components/InquiryForm";
import { Navbar } from "@/components/Navbar";
import { PartnerCriteria } from "@/components/PartnerCriteria";
import { Thesis } from "@/components/Thesis";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Thesis />
        <Capabilities />
        <Approach />
        <PartnerCriteria />
        <InquiryForm />
      </main>
      <Footer />
    </>
  );
}
