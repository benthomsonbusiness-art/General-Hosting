import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { HelpCta } from "@/components/layout/HelpCta";
import { ClosingCta } from "@/components/layout/ClosingCta";
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

/** The founder photograph is never generated. The slot appears only once the real file is added. */
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
        <Container>
          <Breadcrumbs items={[{ name: "About the firm", path: "/about" }]} />
          <h1 id="about-title" className="h1 mt-6">
            About the firm
          </h1>
          <p className="lead measure mt-5 text-muted">{ABOUT.dek}</p>
          <HelpCta />
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="founder">
        <Container className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {photo ? (
            <div className="lg:col-span-4">
              <HardwareFrame
                src={FOUNDER_PHOTO}
                alt="Ben Thomson, founder of Valentini Systems"
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
            <p className="mt-8 text-slate">{ABOUT.where}</p>
            <Link href="/approach" className="text-link mt-2 inline-flex min-h-11 items-center">
              How we work
            </Link>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
