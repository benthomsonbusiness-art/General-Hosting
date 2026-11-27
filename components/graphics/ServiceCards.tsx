import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { iconFor } from "@/components/graphics/Graphics";
import { ServiceArt } from "@/components/graphics/ServiceArt";
import { SERVICES, serviceHref } from "@/content/services";

/** One line per service; the service pages carry the detail. */
const SHORT: Record<string, string> = {
  "missed-calls": "Every missed call gets a text back in minutes.",
  "instant-booking": "Web leads get a time and a booked job, fast.",
  reminders: "Customers confirm by text. Fewer no-shows.",
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
                <ServiceArt slug={service.slug} />
                {index === 0 ? <span className="photo-card-tag">Main service</span> : null}
              </span>
              <span className="photo-card-body">
                <span className="g-icon relative -mt-6">
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
