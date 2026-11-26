import Link from "next/link";
import { NameMarquee } from "@/components/graphics/Graphics";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { TESTIMONIALS_PAGE } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { getWorkflow } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Client testimonials",
  description: TESTIMONIALS_PAGE.metaDescription,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <Section labelledBy="testimonials-title">
        <Container>
          <Breadcrumbs items={[{ name: "Testimonials", path: "/testimonials" }]} />
          <h1 id="testimonials-title" className="h1 mt-6 max-w-[16ch]">
            Client testimonials
          </h1>

          {TESTIMONIALS.length ? (
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {TESTIMONIALS.map((item) => {
                const workflow = item.workflowId ? getWorkflow(item.workflowId) : undefined;
                return (
                  <li key={item.company} className="rounded-lg border border-line bg-well p-8">
                    <figure>
                      <blockquote className="text-xl leading-relaxed text-heading">“{item.quote}”</blockquote>
                      <figcaption className="mt-6 border-t border-line pt-4">
                        <span className="block font-semibold text-heading">{item.company}</span>
                        <span className="block text-muted">
                          {item.name === item.role ? item.role : `${item.name}, ${item.role}`}
                          {item.location ? ` · ${item.location}` : ""}
                        </span>
                        {item.project ? <span className="mt-3 block text-[15px] text-body">{item.project}</span> : null}
                        {workflow ? (
                          <Link
                            href={`/workflows/${workflow.id}`}
                            className="text-link mt-2 inline-flex min-h-11 items-center"
                          >
                            {workflow.title}
                          </Link>
                        ) : null}
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-12 max-w-[44rem] rounded-lg border border-line bg-well p-8">
              <p className="text-body">{TESTIMONIALS_PAGE.empty}</p>
              <HelpCta className="mt-6" />
            </div>
          )}
        </Container>
      </Section>
      {TESTIMONIALS.length ? (
        <section data-surface="dark" aria-labelledby="helped" className="border-t border-line bg-obsidian">
          <div className="wrap py-14 lg:py-20">
            <h2 id="helped" className="h2 text-center">
              Companies we&apos;ve helped
            </h2>
          </div>
          <div className="pb-14 lg:pb-20">
            <NameMarquee
              label="Companies we've helped"
              names={TESTIMONIALS.map((item) => ({ name: item.company, place: item.location }))}
            />
          </div>
        </section>
      ) : null}
      <ClosingCta />
    </>
  );
}
