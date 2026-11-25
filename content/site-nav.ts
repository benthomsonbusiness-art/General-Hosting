export type NavLink = { label: string; href: string };

export type NavItem = NavLink & {
  /** Path prefixes that mark the link as current. */
  match: string[];
};

/** Single source for the header, the mobile drawer and the footer. */
export const NAV: NavItem[] = [
  { label: "Workflows", href: "/workflows", match: ["/workflows"] },
  { label: "Services", href: "/services", match: ["/services"] },
  { label: "Insights", href: "/insights", match: ["/insights"] },
  { label: "About", href: "/about", match: ["/about"] },
];

/** Listed under the main items in the phone menu, which has no footer in view. */
export const DRAWER_LINKS: NavLink[] = [
  { label: "Industries", href: "/industries" },
  { label: "How we work", href: "/approach" },
  { label: "Contact", href: "/contact" },
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

/** Printed under the copyright line. Product names appear on the site only as example integrations. */
export const TRADEMARK_NOTE =
  "Product names and logos on this site belong to their owners and show example integrations only. Valentini & Co. is not affiliated with, sponsored by or endorsed by them.";
