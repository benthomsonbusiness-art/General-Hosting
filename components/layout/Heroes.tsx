import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/nav/Breadcrumbs";
import type { Photo } from "@/content/services";
import { Section, type Surface } from "./Section";

/** Text on the left, a photo cut at the angle of the mark on the right. */
export function HeroSplit({
  title,
  dek,
  photo,
  crumbs,
  actions,
  surface = "ivory",
}: {
  title: ReactNode;
  dek: string;
  photo: Photo;
  crumbs: Crumb[];
  actions?: ReactNode;
  surface?: Surface;
}) {
  return (
    <Section surface={surface} flush className="overflow-hidden">
      <div className="grid lg:min-h-[36rem] lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-12 md:px-8 md:py-16 lg:col-span-7 lg:py-20 lg:pr-14 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <Breadcrumbs items={crumbs} className="mb-7" />
          <h1 className="h1 max-w-[12em]">{title}</h1>
          <p className="lead mt-6 max-w-[32rem] text-muted">{dek}</p>
          {actions ? <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">{actions}</div> : null}
        </div>
        <div className="relative min-h-64 sm:min-h-80 lg:col-span-5 lg:min-h-full">
          <div className="cut-left absolute inset-0 bg-forest">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

/** A plain opening: one line, nothing else competing with it. */
export function HeroPlain({
  title,
  dek,
  crumbs,
  surface = "ivory",
}: {
  title: string;
  dek?: string;
  crumbs: Crumb[];
  surface?: Surface;
}) {
  return (
    <Section surface={surface} flush>
      <div className="wrap pt-10 pb-12 md:pt-14 md:pb-16">
        <Breadcrumbs items={crumbs} className="mb-7" />
        <h1 className="h1 max-w-[14em]">{title}</h1>
        {dek ? <p className="lead mt-5 max-w-[38rem] text-muted">{dek}</p> : null}
      </div>
    </Section>
  );
}
