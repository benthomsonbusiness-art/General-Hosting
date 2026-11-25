"use client";

import { useEffect } from "react";
import { Container, Section } from "@/components/layout/Section";
import { INQUIRY_EMAIL } from "@/lib/site";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section surface="paper" className="min-h-[60vh]">
      <Container>
        <h1 className="h1">This page did not load</h1>
        <p className="lead mt-5 max-w-[36rem] text-muted">
          Something went wrong on our side. Try again, or write to{" "}
          <a href={`mailto:${INQUIRY_EMAIL}`} className="text-link">
            {INQUIRY_EMAIL}
          </a>
          .
        </p>
        <button type="button" className="btn btn-primary mt-8" onClick={() => retry()}>
          Try again
        </button>
      </Container>
    </Section>
  );
}
