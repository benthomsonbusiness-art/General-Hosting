import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <Container>
        <h1 className="h1">That page is not on this site.</h1>
        <ul className="mt-8 flex flex-wrap gap-x-8">
          <li>
            <Link href="/" className="text-link inline-flex min-h-11 items-center">
              Home
            </Link>
          </li>
          <li>
            <Link href="/workflows" className="text-link inline-flex min-h-11 items-center">
              Workflows
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
