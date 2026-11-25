import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { METHOD, PRINCIPLES } from "@/content/approach";
import { ENGAGEMENTS } from "@/content/engagements";
import { HOW_IT_WORKS } from "@/content/pages";
import { SERVICES, serviceHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How it works",
  description: HOW_IT_WORKS.metaDescription,
  path: "/how-it-works",
});

/** One page that says what we offer and how a project runs, start to finish. */
export default function HowItWorksPage() {
  return (
    <>
      <Section labelledBy="how-title">
        <Container>
          <Breadcrumbs items={[{ name: "How it works", path: "/how-it-works" }]} />
          <h1 id="how-title" className="h1 mt-6 max-w-[14ch]">
            How it works
          </h1>
          <p className="lead mt-5 max-w-[56rem] text-muted">{HOW_IT_WORKS.statement}</p>
          <HelpCta />
        </Container>
      </Section>

      <Section labelledBy="offer" surface="ivory">
        <Container>
          <h2 id="offer" className="h2">
            What we offer
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(service.slug)}
                  className="group flex h-full flex-col border border-[color:var(--rule)] p-6 transition-colors hover:border-[color:var(--heading)]"
                >
                  <span className="small text-muted">{index === 0 ? "Main service" : "Supporting service"}</span>
                  <span className="card-title mt-3 block h3">{service.name}</span>
                  <span className="mt-3 block flex-1 text-body">{service.summary}</span>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                    Learn more
                    <ArrowRight
                      aria-hidden
                      size={18}
                      strokeWidth={1.5}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="process">
        <Container>
          <h2 id="process" className="h2">
            The process, step by step
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-[color:var(--line)] md:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((step, index) => (
              <li key={step.title} className="flex flex-col bg-obsidian p-6">
                <span className="font-mono text-sm text-gold">0{index + 1}</span>
                <h3 className="h3 mt-3">{step.title}</h3>
                <p className="mt-1 font-semibold text-body">{step.line}</p>
                <p className="mt-4 flex-1 text-muted">{step.happens}</p>
                <dl className="mt-6 grid gap-3 border-t border-line pt-4 text-[15px]">
                  <div>
                    <dt className="font-semibold text-body">You see</dt>
                    <dd className="text-muted">{step.see}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-body">You approve</dt>
                    <dd className="text-muted">{step.approve}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="scope" className="border-t border-line">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="scope" className="h2">
              How it&rsquo;s scoped
            </h2>
            <p className="mt-4 text-muted">You only commit to the audit. Build and operations are scoped after it.</p>
          </div>
          <ol className="divide-y divide-line border-y border-line lg:col-span-8">
            {ENGAGEMENTS.stages.map((stage, index) => (
              <li key={stage.id} className="grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline">
                <h3 className="h4 sm:col-span-5">
                  {index + 1}. {stage.name}
                </h3>
                <p className="text-muted sm:col-span-7">
                  {stage.shape}. {stage.delivers}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="always" surface="ivory">
        <Container>
          <h2 id="always" className="h2">
            What stays true on every project
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="border-t border-[color:var(--rule)] pt-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-muted">{item.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
