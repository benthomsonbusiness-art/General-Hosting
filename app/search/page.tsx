import Link from "next/link";
import { SearchResults } from "@/components/content/SearchResults";
import { Container, Section } from "@/components/layout/Section";
import { SEARCH_PAGE } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search",
  description: SEARCH_PAGE.metaDescription,
  path: "/search",
});

export default function SearchPage() {
  return (
    <>
      <section data-surface="light" className="bg-paper pt-12 pb-6 md:pt-16 md:pb-8">
        <Container className="max-w-[60rem]">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 font-mono text-[12px] text-slate">
            <Link href="/" className="hover:text-forest">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">Search</span>
          </nav>
          <h1 className="font-display text-[clamp(2.8rem,1.9rem+3.4vw,4.5rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ink">
            Search
          </h1>
        </Container>
      </section>
      <Section flush className="pt-2 pb-20 md:pb-28">
        <Container className="max-w-[60rem]">
          <SearchResults />
          <noscript>
            <p className="mt-6">
              Results need JavaScript. You can also browse{" "}
              <Link href="/services" className="text-link">
                services
              </Link>
              ,{" "}
              <Link href="/workflows" className="text-link">
                workflows
              </Link>{" "}
              and{" "}
              <Link href="/insights" className="text-link">
                insights
              </Link>
              .
            </p>
          </noscript>
        </Container>
      </Section>
    </>
  );
}
