import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ServiceArt } from "@/components/graphics/ServiceArt";
import { SERVICES, serviceHref } from "@/content/services";

const SHORT: Record<string, string> = {
  "missed-calls": "Every missed call gets a text back in minutes.",
  "instant-booking": "Website leads get an open time and a booked spot fast.",
  reminders: "Recurring classes and appointments confirmed by text.",
};

/** The three services as clean architectural cards without floating pill tags or overlapping icon boxes. */
export function ServiceCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {SERVICES.map((service) => (
        <li key={service.slug} className="flex">
          <Link href={serviceHref(service.slug)} className="photo-card group">
            <span className="photo-card-img">
              <ServiceArt slug={service.slug} />
            </span>
            <span className="photo-card-body pt-5">
              <span className="card-title h3 block">{service.name}</span>
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
      ))}
    </ul>
  );
}
