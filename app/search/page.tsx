import Link from "next/link";
import { SearchResults } from "@/components/content/SearchResults";
import { HeroBlock } from "@/components/layout/Heroes";
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
      <HeroBlock
        title="Search"
        dek="Services, workflow blueprints, industries and insights."
        crumbs={[{ name: "Search", path: "/search" }]}
      />
      <Section>
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
