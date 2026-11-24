import type { Metadata } from "next";
import { Diagnosis } from "@/components/Diagnosis";
import { Diagnostic } from "@/components/Diagnostic";
import { Engagement } from "@/components/Engagement";
import { Estimator } from "@/components/Estimator";
import { Footer } from "@/components/Footer";
import { HashScroll } from "@/components/HashScroll";
import { Hero } from "@/components/Hero";
import { Interlude } from "@/components/Interlude";
import { Navbar } from "@/components/Navbar";
import { WorkflowExplorer } from "@/components/WorkflowExplorer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <HashScroll />
      <Navbar overlay />
      <main id="top" className="flex-1">
        <Hero />
        <Diagnosis />
        <Interlude />
        <WorkflowExplorer />
        <Engagement />
        <Estimator />
        <Diagnostic />
      </main>
      <Footer />
    </>
  );
}
