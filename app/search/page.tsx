import Link from "next/link";
import { SearchResults } from "@/components/content/SearchResults";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { SEARCH_PAGE } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search",
  description: SEARCH_PAGE.metaDescription,
  path: "/search",
});

export default function SearchPage() {
  return (
    <Section labelledBy="search-title">
      <Container className="max-w-[60rem]">
        <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
        <h1 id="search-title" className="h1 mt-6">
          Search
        </h1>
        <div className="mt-8">
          <SearchResults />
        </div>
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
  );
}
