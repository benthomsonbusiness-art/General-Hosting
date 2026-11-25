import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { iconFor } from "@/components/graphics/Graphics";
import { SERVICES, serviceHref } from "@/content/services";

/** One line per service; the service pages carry the detail. */
const SHORT: Record<string, string> = {
  "ai-workflow-automation": "Automate the work that eats your week.",
  "meta-ads-consulting": "Ads with tracking you can trust.",
  strategy: "Decide what to fix first.",
};

/** The three services as photo cards. Used on /services and /how-it-works. */
export function ServiceCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {SERVICES.map((service, index) => {
        const Icon = iconFor(service.name, index);
        return (
          <li key={service.slug} className="flex">
            <Link href={serviceHref(service.slug)} className="photo-card group">
              <span className="photo-card-img">
                <Image
                  src={service.photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: service.photo.position }}
                />
                {index === 0 ? <span className="photo-card-tag">Main service</span> : null}
              </span>
              <span className="photo-card-body">
                <span className="g-icon -mt-12">
                  <Icon aria-hidden size={22} strokeWidth={1.5} />
                </span>
                <span className="card-title h3 mt-2 block">{service.name}</span>
                <span className="text-muted">{SHORT[service.slug] ?? service.summary}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold">
                  Learn more
                  <ArrowRight
                    aria-hidden
                    size={18}
                    strokeWidth={1.5}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
