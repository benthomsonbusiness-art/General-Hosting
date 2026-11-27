import Link from "next/link";
import { NameMarquee } from "@/components/graphics/Graphics";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { TESTIMONIALS_PAGE } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { appsByCategory, showMark, usedAppSlugs } from "@/lib/used-apps";

export const metadata = pageMetadata({
  title: "Client testimonials",
  description: TESTIMONIALS_PAGE.metaDescription,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  const tools = appsByCategory(usedAppSlugs(WORKFLOWS)).flatMap((group) => group.apps);

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
      {TESTIMONIALS.length >= 4 ? (
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
      ) : (
        <section data-surface="dark" aria-labelledby="tools-strip" className="border-t border-line bg-forest">
          <div className="wrap py-14 lg:py-20">
            <h2 id="tools-strip" className="h3">
              Works with the software your office runs today
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {tools.map((app) => (
                <li
                  key={app.slug}
                  className="flex min-h-11 items-center gap-2.5 rounded-[8px] border border-line bg-well px-3.5 text-[15px]"
                >
                  {showMark(app.slug) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- official SVG artwork
                    <img src={`/logos/${app.slug}.svg`} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                  ) : null}
                  <span>{app.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <ClosingCta />
    </>
  );
}
