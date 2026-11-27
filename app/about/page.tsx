import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { ABOUT } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the firm",
  description: ABOUT.metaDescription,
  path: "/about",
});

const FOUNDER_PHOTO = "/images/about-founder.jpg";

function hasFounderPhoto(): boolean {
  try {
    return existsSync(join(process.cwd(), "public", FOUNDER_PHOTO));
  } catch {
    return false;
  }
}

export default function AboutPage() {
  const photo = hasFounderPhoto();
  return (
    <>
      <Section labelledBy="about-title">
        <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ name: "About the firm", path: "/about" }]} />
            <h1 id="about-title" className="h1 mt-6">
              About Temporant
            </h1>
            <p className="lead mt-5 max-w-[38rem] text-muted">{ABOUT.dek}</p>
            <HelpCta />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-line lg:col-span-5">
            <Image
              src="/images/key-hero.jpg"
              alt="A copper push key set into a dark machined panel, waiting to be pressed."
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="founder">
        <Container className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {photo ? (
            <div className="lg:col-span-4">
              <HardwareFrame
                src={FOUNDER_PHOTO}
                alt="Ben Thomson, founder of Temporant"
                width={1600}
                height={2000}
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            </div>
          ) : null}
          <div className={photo ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-8"}>
            <h2 id="founder" className="h2">
              Ben Thomson
            </h2>
            <p className="mt-2 text-slate">Founder</p>
            <p className="measure mt-5 text-ink">{ABOUT.founder}</p>
            <p className="mt-6 text-slate">{ABOUT.where}</p>
            <Link href="/how-it-works" className="text-link mt-4 inline-flex min-h-11 items-center">
              See how we work →
            </Link>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
