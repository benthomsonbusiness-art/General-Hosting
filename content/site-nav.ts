export type NavLink = { label: string; href: string };

export type NavItem = NavLink & {
  /** Path prefixes that mark the link as current. */
  match: string[];
};

/** Single source for the header, the mobile drawer and the footer. */
export const NAV: NavItem[] = [
  { label: "Workflows", href: "/workflows", match: ["/workflows"] },
  { label: "Services", href: "/services", match: ["/services", "/industries"] },
  { label: "Insights", href: "/insights", match: ["/insights"] },
  { label: "About", href: "/about", match: ["/about", "/approach"] },
];

export const FOOTER: NavLink[] = [
  { label: "Workflows", href: "/workflows" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
  { label: "How we work", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Search", href: "/search" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const POSITIONING =
  "AI workflow automation for owner-led companies, built inside the tools they already use.";
