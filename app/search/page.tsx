import Link from "next/link";
import { SearchResults } from "@/components/content/SearchResults";
import { HeroPlain } from "@/components/layout/Heroes";
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
      <HeroPlain
        title="Search"
        crumbs={[{ name: "Search", path: "/search" }]}
      />
      <Section flush className="pb-20 md:pb-28">
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
