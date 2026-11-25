import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { PRINCIPLES } from "@/content/approach";
import { ABOUT } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the firm",
  description: ABOUT.metaDescription,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section labelledBy="about-title">
        <Container>
          <Breadcrumbs items={[{ name: "About the firm", path: "/about" }]} />
          <h1 id="about-title" className="h1 mt-6">
            About the firm
          </h1>
          <p className="lead measure mt-5 text-muted">{ABOUT.dek}</p>
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="founder">
        <Container>
          <h2 id="founder" className="h2">
            Ben Thomson
          </h2>
          <p className="mt-2 text-slate">Founder</p>
          <div className="measure mt-5 space-y-4 text-ink">
            <p>
              Ben Thomson is the founder. The firm writes routine work as code, uses a model only for judgment inside a
              schema, and waits for a person before anything leaves the company.
            </p>
            <p>Clients own the code, the accounts, the logs, and the runbook.</p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="principles">
        <Container>
          <h2 id="principles" className="h2">
            How the work is built
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="grid gap-2 py-6 md:grid-cols-12 md:items-baseline">
                <h3 className="h3 md:col-span-7">{item.title}</h3>
                <p className="text-muted md:col-span-5">{item.short}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-muted">{ABOUT.where}</p>
          <Link href="/approach" className="text-link mt-2 inline-flex min-h-11 items-center">
            Read how a project runs
          </Link>
        </Container>
      </Section>
    </>
  );
}
