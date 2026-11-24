import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/nav/Breadcrumbs";
import type { Photo } from "@/content/services";
import { Section, type Surface } from "./Section";

/** Text on the left, a photo cut at the angle of the mark on the right. No empty half. */
export function HeroSplit({
  title,
  dek,
  photo,
  crumbs,
  actions,
  surface = "ivory",
  display = false,
}: {
  title: ReactNode;
  dek: string;
  photo: Photo;
  crumbs?: Crumb[];
  actions?: ReactNode;
  surface?: Surface;
  display?: boolean;
}) {
  return (
    <Section surface={surface} flush className="overflow-hidden">
      <div className={`grid lg:grid-cols-12 ${display ? "lg:min-h-[38rem]" : "lg:min-h-[30rem]"}`}>
        <div
          className={`flex flex-col justify-center px-5 py-12 md:px-8 md:py-16 lg:py-20 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] ${
            display ? "lg:col-span-7 lg:pr-10" : "lg:col-span-7 lg:pr-14"
          }`}
        >
          {crumbs ? <Breadcrumbs items={crumbs} className="mb-6" /> : null}
          <h1 className={display ? "display max-w-[13em]" : "h1 max-w-[16em]"}>{title}</h1>
          <p className="lead mt-6 max-w-[36rem] text-muted">{dek}</p>
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">{actions}</div> : null}
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

/** A solid forest block. `aside` fills the right side with useful content. */
export function HeroBlock({
  title,
  dek,
  crumbs,
  aside,
}: {
  title: string;
  dek: string;
  crumbs: Crumb[];
  aside?: ReactNode;
}) {
  return (
    <Section surface="forest" flush>
      <div className="wrap py-10 md:py-14 lg:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
            <h1 className="h1">{title}</h1>
            <p className="lead mt-5 max-w-[40rem] text-muted">{dek}</p>
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
      </div>
    </Section>
  );
}
