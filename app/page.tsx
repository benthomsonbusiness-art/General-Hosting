import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { HomeOpening } from "@/components/home/HomeOpening";
import { HomePathSequence } from "@/components/home/HomePathSequence";
import { insightMeta } from "@/components/cards/Cards";
import { INSIGHT_TYPES, INSIGHTS } from "@/content/insights";
import { HOME } from "@/content/pages";
import { SERVICES, serviceHref } from "@/content/services";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} — AI Workflow Automation`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

export default function HomePage() {
  const lead = getWorkflow("lead-triage") ?? WORKFLOWS[0];
  const featureInsight = INSIGHTS[0];
  const secondaryServices = SERVICES.filter((item) => item.kind === "secondary");

  return (
    <>
      <HomeOpening lead={lead} />

      {/* Three workflows as full-bleed / asymmetric photographic scenes (never a 3-card grid) */}
      <section data-surface="light" aria-labelledby="scenes-heading" className="bg-paper">
        <div className="wrap pt-6 pb-8">
          <p className="font-mono text-[12px] tracking-[0.14em] text-slate uppercase">Where teams start</p>
          <h2 id="scenes-heading" className="h2 mt-2 max-w-[18ch] text-forest">
            Three manual bottlenecks worth replacing first
          </h2>
        </div>

        {/* Scene 1: Full-bleed dark-green envelope still life + floating cutout */}
        <article data-surface="dark" className="relative min-h-[28rem] overflow-hidden bg-obsidian text-ivory">
          <Image
            src="/images/wf-lead.jpg"
            alt="An open cream correspondence envelope on green wool baize with a folded sheet emerging in morning light."
            fill
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/92 via-obsidian/65 to-obsidian/20" />
          <div className="wrap relative grid min-h-[28rem] items-end gap-8 py-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-[12px] tracking-[0.14em] text-ivory/75 uppercase">01 · Inbound lead triage</p>
              <h3 className="mt-3 max-w-[16ch] font-display text-[clamp(2.1rem,3.8vw,3.6rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-ivory">
                {HOME.problems[0].q}
              </h3>
              <p className="mt-4 max-w-[30rem] text-ivory/85">
                {getWorkflow("lead-triage")?.summary}
              </p>
              <Link href="/workflows/lead-triage" className="arrow-link mt-6 min-h-11 items-center text-ivory">
                Watch inbound lead triage
              </Link>
            </div>
            <div className="hidden justify-end lg:col-span-5 lg:flex">
              <Image
                src="/images/cut-envelope.png"
                alt=""
                width={960}
                height={1200}
                sizes="220px"
                className="paper-cutout h-64 w-auto -rotate-6 object-contain"
              />
            </div>
          </div>
        </article>

        {/* Scene 2: Asymmetric bleeding invoice still life on near-white paper */}
        <article data-surface="light" className="relative overflow-hidden bg-paper py-16 text-ink lg:py-24">
          <div className="wrap grid items-center gap-10 lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <div className="relative aspect-[3/2] overflow-hidden bg-forest shadow-[0_28px_60px_-24px_rgb(19_50_36_/_0.35)]">
                <Image
                  src="/images/wf-invoice.jpg"
                  alt="Stacked ruled supplier invoices on green wood with one sheet pulled halfway out."
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -right-5 -bottom-6 hidden w-36 sm:block lg:w-44">
                <Image
                  src="/images/cut-invoice.png"
                  alt=""
                  width={960}
                  height={1200}
                  sizes="176px"
                  className="paper-cutout-light h-auto w-full rotate-6 object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-6">
              <p className="font-mono text-[12px] tracking-[0.14em] text-terracotta uppercase">02 · Accounts payable intake</p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.0] font-semibold tracking-[-0.03em] text-forest">
                {HOME.problems[1].q}
              </h3>
              <p className="mt-4 text-slate">{getWorkflow("ap-intake")?.summary}</p>
              <Link href="/workflows/ap-intake" className="arrow-link mt-6 min-h-11 items-center text-forest">
                Watch accounts payable intake
              </Link>
            </div>
          </div>
        </article>

        {/* Scene 3: Deep botanical baize table with folded brief & field notebook */}
        <article data-surface="dark" className="relative overflow-hidden bg-forest py-16 text-ivory lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-repeat opacity-45"
            style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
          />
          <div className="wrap relative grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-[12px] tracking-[0.14em] text-ivory/75 uppercase">03 · Executive daily brief</p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.0] font-semibold tracking-[-0.03em] text-ivory">
                {HOME.problems[2].q}
              </h3>
              <p className="mt-4 max-w-[30rem] text-ivory/85">{getWorkflow("daily-brief")?.summary}</p>
              <Link href="/workflows/daily-brief" className="arrow-link mt-6 min-h-11 items-center text-ivory">
                Watch the daily brief
              </Link>
            </div>
            <div className="relative flex min-h-[19rem] items-center justify-center lg:col-span-6">
              <div className="relative h-72 w-full max-w-[28rem]">
                <Image
                  src="/images/cut-notebook.png"
                  alt="Open green clothbound field notebook"
                  width={960}
                  height={1200}
                  sizes="260px"
                  className="paper-cutout absolute top-4 left-2 h-56 w-auto -rotate-6 object-contain sm:h-64"
                />
                <Image
                  src="/images/cut-letter.png"
                  alt="Folded archival brief sheet"
                  width={960}
                  height={1200}
                  sizes="220px"
                  className="paper-cutout absolute right-4 bottom-0 h-56 w-auto rotate-6 object-contain sm:h-64"
                />
              </div>
            </div>
          </div>
        </article>
      </section>

      <HomePathSequence />

      {/* Large insight feature + advisory practice links */}
      <section data-surface="light" aria-labelledby="insight" className="bg-paper py-20 text-ink lg:py-28">
        <div className="wrap grid items-end gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="insight" className="font-mono text-[12px] tracking-[0.14em] text-slate uppercase">
              Featured field note · {INSIGHT_TYPES[featureInsight.type]}
            </h2>
            <Link href={`/insights/${featureInsight.slug}`} className="group mt-5 block">
              <ViewTransition name={`insight-${featureInsight.slug}`} share="morph" default="none">
                <div className="relative aspect-[16/9] overflow-hidden bg-forest">
                  <Image
                    src={featureInsight.image.src}
                    alt={featureInsight.image.alt}
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    className="zoom object-cover"
                    style={{ objectPosition: featureInsight.image.position }}
                  />
                </div>
              </ViewTransition>
              <h3 className="card-title mt-6 max-w-[18ch] font-display text-[clamp(2rem,3.4vw,3.3rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-forest">
                {featureInsight.title}
              </h3>
              <p className="lead mt-3 max-w-[38rem] text-slate">{featureInsight.dek}</p>
              <p className="small mt-4 font-mono text-slate">{insightMeta(featureInsight)}</p>
            </Link>
          </div>

          <div className="border-t border-ink/15 pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="font-mono text-[12px] tracking-[0.14em] text-slate uppercase">Adjacent advisory</p>
            <ul className="mt-5 space-y-6">
              {secondaryServices.map((item) => (
                <li key={item.slug} className="border-b border-ink/12 pb-6 last:border-b-0 last:pb-0">
                  <Link href={serviceHref(item.slug)} className="group block">
                    <span className="card-title block font-display text-[2rem] leading-none font-semibold text-forest">
                      {item.name}
                    </span>
                    <span className="mt-2 block text-[15px] text-slate">{item.summary}</span>
                    <span className="arrow-link mt-3 text-[14px]">See the practice</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
