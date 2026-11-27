import { INDUSTRIES } from "@/content/industries";
import { ABOUT, APPROACH_PAGE, CONTACT, INDUSTRIES_HUB, SERVICES_HUB, WORKFLOWS_PAGE } from "@/content/pages";
import { SERVICES, serviceHref } from "@/content/services";
import { WORKFLOWS } from "@/content/workflows";
import { appName } from "@/lib/logos";
import type { SearchEntry } from "@/lib/search";
import { CTA_LABEL } from "@/lib/site";

// Generated once at build time.
export const dynamic = "force-static";

function entries(): SearchEntry[] {
  return [
    {
      url: "/services",
      title: "Services",
      type: "Page",
      summary: SERVICES_HUB.dek,
      keywords: "booking automation gyms fitness studios recruiting events landscaping home services",
    },
    {
      url: "/workflows",
      title: "Example workflows",
      type: "Page",
      summary: WORKFLOWS_PAGE.dek,
      keywords: "flowchart steps approval classes reminders",
    },
    {
      url: "/industries",
      title: "Industries",
      type: "Page",
      summary: INDUSTRIES_HUB.dek,
      keywords: "gyms fitness studios recruiting staffing events dj landscaping plumbing home services",
    },
    {
      url: "/testimonials",
      title: "Client testimonials",
      type: "Page",
      summary: "What clients say about the work.",
      keywords: "reviews clients blessinger",
    },
    {
      url: "/how-it-works",
      title: "How it works",
      type: "Page",
      summary: APPROACH_PAGE.dek,
      keywords: "how it works setup steps audit questions",
    },
    {
      url: "/about",
      title: "About the firm",
      type: "Page",
      summary: ABOUT.dek,
      keywords: "company morristown new jersey founder",
    },
    {
      url: "/contact",
      title: `Contact: ${CTA_LABEL}`,
      type: "Page",
      summary: CONTACT.dek,
      keywords: "email inquiry form consultation",
    },
    {
      url: "/privacy",
      title: "Privacy",
      type: "Page",
      summary: "Placeholder privacy notice. Not in effect.",
      keywords: "legal data",
    },
    { url: "/terms", title: "Terms", type: "Page", summary: "Placeholder terms. Not in effect.", keywords: "legal" },
    ...SERVICES.map(
      (item): SearchEntry => ({
        url: serviceHref(item.slug),
        title: item.name,
        type: "Service",
        summary: item.summary,
        keywords: [...item.keywords, ...item.areas.map((area) => area.title)].join(" "),
      }),
    ),
    ...INDUSTRIES.map(
      (item): SearchEntry => ({
        url: `/industries?industry=${item.slug}`,
        title: item.name,
        type: "Industry",
        summary: item.line,
        keywords: [...item.keywords, ...item.hours].join(" "),
      }),
    ),
    ...WORKFLOWS.map(
      (item): SearchEntry => ({
        url: `/workflows/${item.id}`,
        title: item.title,
        type: "Workflow",
        summary: item.summary,
        keywords: item.nodes
          .flatMap((node) => [
            node.label,
            ...(node.app ? [appName(node.app.app), ...node.app.alternatives] : []),
            ...(node.gate?.channelApp ? [appName(node.gate.channelApp)] : []),
            ...(node.attached ?? []).flatMap((tool) => [tool.label, appName(tool.app), ...tool.alternatives]),
          ])
          .join(" "),
      }),
    ),
  ];
}

export function GET() {
  return Response.json(entries());
}
