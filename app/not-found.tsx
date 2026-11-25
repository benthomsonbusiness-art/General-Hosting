import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Section surface="paper" className="min-h-[60vh]">
      <Container>
        <h1 className="h1">We can&apos;t find that page</h1>
        <p className="lead mt-5 max-w-[36rem] text-muted">
          The address may have changed when the site was rebuilt. These are good places to start again.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-9 gap-y-2">
          <li>
            <Link href="/" className="arrow-link min-h-11 items-center">
              Home
            </Link>
          </li>
          <li>
            <Link href="/workflows" className="arrow-link min-h-11 items-center">
              Workflows
            </Link>
          </li>
          <li>
            <Link href="/contact" className="arrow-link min-h-11 items-center">
              Contact
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
