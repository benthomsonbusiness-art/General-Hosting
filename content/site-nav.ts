import { INDUSTRIES } from "./industries.ts";
import { INSIGHTS, INSIGHT_TYPES } from "./insights/index.ts";
import { SERVICES, SUB_SERVICES, serviceHref, subServiceHref, FLAGSHIP } from "./services.ts";
import { WORKFLOWS } from "./workflows.ts";

export type NavLink = { label: string; href: string; note?: string };

export type NavColumn = { heading: string; tag?: string; links: NavLink[]; more?: NavLink };

export type NavPanel = {
  id: string;
  label: string;
  /** Path prefix that marks the trigger as current. */
  match: string[];
  columns: NavColumn[];
  feature?: { heading: string; body: string; link: NavLink; image: string };
};

/** Single source for the mega-menu, the mobile drawer and the footer. */
export const NAV: NavPanel[] = [
  {
    id: "services",
    label: "Services",
    match: ["/services"],
    columns: [
      {
        heading: FLAGSHIP.name,
        tag: "Flagship",
        links: SUB_SERVICES.map((item) => ({ label: item.name, href: subServiceHref(item.slug) })),
        more: { label: "All AI workflow services", href: serviceHref(FLAGSHIP.slug) },
      },
      {
        heading: "Other practices",
        links: SERVICES.filter((item) => item.kind === "secondary").map((item) => ({
          label: item.name,
          href: serviceHref(item.slug),
        })),
        more: { label: "Services overview", href: "/services" },
      },
    ],
    feature: {
      heading: "Start here",
      body: "One to two weeks to map the work, with a ranked list of what to automate and what to leave alone.",
      link: { label: "Request a Workflow Audit", href: "/contact" },
      image: "/images/editorial-workspace.jpg",
    },
  },
  {
    id: "workflows",
    label: "Workflows",
    match: ["/workflows"],
    columns: [
      {
        heading: "Workflow blueprints",
        links: WORKFLOWS.map((item) => ({ label: item.title, href: `/workflows/${item.id}` })),
        more: { label: "Open the explorer", href: "/workflows" },
      },
    ],
  },
  {
    id: "industries",
    label: "Industries",
    match: ["/industries"],
    columns: [
      {
        heading: "Industries",
        links: INDUSTRIES.map((item) => ({ label: item.name, href: `/industries/${item.slug}` })),
        more: { label: "Where these workflows apply", href: "/industries" },
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    match: ["/insights"],
    columns: [
      {
        heading: "Latest",
        links: INSIGHTS.slice(0, 3).map((item) => ({
          label: item.title,
          href: `/insights/${item.slug}`,
          note: INSIGHT_TYPES[item.type],
        })),
        more: { label: "All insights", href: "/insights" },
      },
      {
        heading: "Browse by type",
        links: [
          { label: "Guides", href: "/insights?type=guide" },
          { label: "Blueprints", href: "/insights?type=blueprint" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    match: ["/about", "/approach", "/contact"],
    columns: [
      {
        heading: "The firm",
        links: [
          { label: "About the firm", href: "/about" },
          { label: "How we work", href: "/approach" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];

export const FOOTER: NavColumn[] = [
  {
    heading: "Services",
    links: [
      { label: FLAGSHIP.name, href: serviceHref(FLAGSHIP.slug) },
      ...SUB_SERVICES.map((item) => ({ label: item.name, href: subServiceHref(item.slug) })),
      ...SERVICES.filter((item) => item.kind === "secondary").map((item) => ({
        label: item.name,
        href: serviceHref(item.slug),
      })),
    ],
  },
  {
    heading: "Industries",
    links: INDUSTRIES.map((item) => ({ label: item.name, href: `/industries/${item.slug}` })),
  },
  {
    heading: "Insights & workflows",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Guides", href: "/insights?type=guide" },
      { label: "Blueprints", href: "/insights?type=blueprint" },
      { label: "Workflow explorer", href: "/workflows" },
    ],
  },
  {
    heading: "Firm",
    links: [
      { label: "About", href: "/about" },
      { label: "How we work", href: "/approach" },
      { label: "Contact", href: "/contact" },
      { label: "Search", href: "/search" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const POSITIONING =
  "AI workflow automation for owner-led companies, built inside the tools they already use.";
