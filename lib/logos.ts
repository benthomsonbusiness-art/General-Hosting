/**
 * App registry for workflow drawings.
 *
 * Product names may be printed freely to say what a workflow connects to. Logos are another
 * matter: most brands' published rules require written permission before a third party shows
 * their mark. Each entry therefore carries a permission status, and a mark is drawn only when
 * the status and LOGO_MODE allow it AND the artwork file exists in public/logos/.
 * Everything else is drawn as the app name with a neutral glyph.
 *
 * Never recolor, redraw, outline or add effects to a mark. The current files come from two CC0
 * npm sets (SVG Logos via @iconify-json/logos, and Simple Icons), unaltered apart from SVGO-style
 * cleanup; docs/logo-sources.md lists the source of every file. The CC0 license covers the
 * drawing, not the trademark: `status` still records whether the brand has given permission.
 * Swap in the brand's own press-kit file wherever one is obtained.
 */

/** "cleared-only": draw marks only for cleared apps. "all": draw every app that has an artwork file. */
export const LOGO_MODE: "cleared-only" | "all" = "all";

export const APP_SLUGS = [
  "gmail",
  "googlecalendar",
  "googledrive",
  "googlesheets",
  "googledocs",
  "googleanalytics",
  "googleads",
  "outlook",
  "teams",
  "excel",
  "slack",
  "zoom",
  "hubspot",
  "salesforce",
  "pipedrive",
  "apollo",
  "notion",
  "airtable",
  "docusign",
  "pandadoc",
  "quickbooks",
  "xero",
  "stripe",
  "billcom",
  "ramp",
  "zendesk",
  "intercom",
  "asana",
  "clickup",
  "monday",
  "typeform",
  "calendly",
  "meta",
  "shopify",
  "gusto",
  "greenhouse",
  "claude",
  "openai",
  "dropbox",
  "servicetitan",
  "jobber",
  "housecallpro",
  "callrail",
  "twilio",
  "angi",
  "thumbtack",
] as const;

export type AppSlug = (typeof APP_SLUGS)[number];

/** House glyphs for steps that are not a branded app. Never a logo. */
export const GLYPHS = ["code", "clock", "webhook", "form", "http"] as const;
export type Glyph = (typeof GLYPHS)[number];

export type LogoStatus = "cleared" | "requested" | "text-only";

export type FallbackGlyph =
  | "mail"
  | "calendar"
  | "folder"
  | "table"
  | "document"
  | "chart"
  | "message"
  | "video"
  | "contacts"
  | "card"
  | "signature"
  | "database"
  | "ticket"
  | "checklist"
  | "store"
  | "people"
  | "sparkles"
  | "megaphone"
  | "phone"
  | "wrench"
  | "star";

export type AppCategory =
  | "email"
  | "chat"
  | "crm"
  | "docs"
  | "accounting"
  | "support"
  | "projects"
  | "forms"
  | "ads"
  | "commerce"
  | "hr"
  | "ai"
  | "storage"
  | "fieldservice"
  | "phone"
  | "leads";

export type AppEntry = {
  /** Product name as the owner writes it. */
  name: string;
  /** Who owns the name and mark, for the /terms list. */
  owner: string;
  category: AppCategory;
  status: LogoStatus;
  /** How the status was set, or what would clear it. */
  note: string;
  /** The brand page read when the status was set. */
  guidelines: string;
  checkedOn: string;
  glyph: FallbackGlyph;
  /** The mark is near-black and unreadable on the dark disc: draw it on an ivory disc instead. */
  onLight?: true;
};

const CHECKED = "2026-11-25";
const GOOGLE = "https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/";
const MICROSOFT = "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx";
const ASK = "Written permission needed before the mark is shown.";
const UNREAD = "Brand rules not yet read. Treat as text only until they are.";

/** Where the artwork file came from. Package versions are recorded in docs/logo-sources.md. */
const svgLogos = (icon: string) =>
  `Artwork: SVG Logos set by Gil Barbara (npm @iconify-json/logos, CC0), icon "${icon}", a reproduction of the official mark, not the brand's own file.`;
const simpleIcons = (icon: string, hex: string) =>
  `Artwork: Simple Icons (npm simple-icons, CC0) path "${icon}" in its listed brand color ${hex}, a reproduction of the official single-color mark, not the brand's own file.`;
const NO_FILE = "No artwork file, so the name and glyph show.";

function app(
  name: string,
  owner: string,
  category: AppCategory,
  glyph: FallbackGlyph,
  guidelines: string,
  note: string,
  status: LogoStatus = "text-only",
): AppEntry {
  return { name, owner, category, status, note, guidelines, checkedOn: CHECKED, glyph };
}

export const APPS: Record<AppSlug, AppEntry> = {
  gmail: app("Gmail", "Google", "email", "mail", GOOGLE, `${svgLogos("google-gmail-2020")} ${ASK}`),
  googlecalendar: app("Google Calendar", "Google", "email", "calendar", GOOGLE, `${svgLogos("google-calendar-2020")} ${ASK}`),
  googledrive: app("Google Drive", "Google", "storage", "folder", GOOGLE, `${svgLogos("google-drive-2020")} ${ASK}`),
  googlesheets: app("Google Sheets", "Google", "docs", "table", GOOGLE, `Artwork: Wikimedia Commons "Google Sheets 2020 Logo.svg" (public domain), unaltered. ${ASK}`),
  googledocs: app("Google Docs", "Google", "docs", "document", GOOGLE, `${NO_FILE} Not in SVG Logos, and the mark is multicolor. ${ASK}`),
  googleanalytics: app("Google Analytics", "Google", "ads", "chart", GOOGLE, `${svgLogos("google-analytics")} ${ASK}`),
  googleads: app("Google Ads", "Google", "ads", "megaphone", GOOGLE, `${svgLogos("google-ads")} ${ASK}`),
  outlook: app("Outlook", "Microsoft", "email", "mail", MICROSOFT, `Artwork: @iconify-json/vscode-icons 1.2.100 "file-type-outlook" (MIT), unaltered. ${ASK}`),
  teams: app("Microsoft Teams", "Microsoft", "chat", "message", MICROSOFT, `${svgLogos("microsoft-teams")} ${ASK}`),
  excel: app("Microsoft Excel", "Microsoft", "docs", "table", MICROSOFT, `Artwork: @iconify-json/vscode-icons 1.2.100 "file-type-excel2" (MIT), unaltered. ${ASK}`),
  slack: app("Slack", "Slack Technologies", "chat", "message", "https://slack.com/terms-of-service/slack-brand", `${svgLogos("slack-icon")} ${ASK}`),
  zoom: app("Zoom", "Zoom Communications", "chat", "video", "https://brand.zoom.us/usage-legal/", `${svgLogos("zoom-icon")} ${ASK}`),
  hubspot: app(
    "HubSpot",
    "HubSpot",
    "crm",
    "contacts",
    "https://www.hubspot.com/style-guide",
    `${simpleIcons("hubspot", "#FF7A59")} SVG Logos has only the wide wordmark. ${UNREAD}`,
  ),
  salesforce: app(
    "Salesforce",
    "Salesforce, Inc.",
    "crm",
    "contacts",
    "https://www.salesforce.com/company/legal/tmcusageguidelines/",
    `${svgLogos("salesforce")} Published rules allow the product logo inside a flowchart, unaltered, with the line "Salesforce is a trademark of Salesforce, Inc." Replace with the official file from Salesforce to rely on that.`,
  ),
  pipedrive: app(
    "Pipedrive",
    "Pipedrive",
    "crm",
    "contacts",
    "https://pipedrive.com/en/newsroom/press-kit",
    `${NO_FILE} SVG Logos has only the wide wordmark and Simple Icons has no entry. ${UNREAD}`,
  ),
  apollo: app("Apollo", "Apollo.io", "crm", "database", "https://www.apollo.io", `${NO_FILE} Not in either source set. ${UNREAD}`),
  notion: app(
    "Notion",
    "Notion Labs",
    "docs",
    "document",
    "https://notion.notion.site/Press-Kit-e8c2e63336f045f4ab2fb4a17b4bbd63",
    `${svgLogos("notion-icon")} ${UNREAD}`,
  ),
  airtable: app("Airtable", "Airtable", "docs", "table", "https://airtable.com/newsroom", `${svgLogos("airtable")} ${UNREAD}`),
  docusign: app("Docusign", "Docusign", "docs", "signature", "https://www.docusign.com/IP/trademark-general", `${NO_FILE} Not in either source set. ${ASK}`),
  pandadoc: app("PandaDoc", "PandaDoc", "docs", "signature", "https://www.pandadoc.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  quickbooks: app(
    "QuickBooks",
    "Intuit",
    "accounting",
    "card",
    "https://design.intuit.com/quickbooks/brand",
    `Artwork: simple-icons 16.38.1 "quickbooks" path in #2CA01C over a white disc, which reproduces the two-color mark (green disc, white letters). ${UNREAD}`,
  ),
  xero: app("Xero", "Xero", "accounting", "card", "https://www.xero.com/uk/about/media/downloads", `${svgLogos("xero")} ${UNREAD}`),
  stripe: app(
    "Stripe",
    "Stripe",
    "accounting",
    "card",
    "https://stripe.com/legal/marks",
    `${simpleIcons("stripe", "#635BFF")} SVG Logos has only the wide wordmark. ${ASK}`,
  ),
  billcom: app(
    "BILL",
    "BILL Holdings",
    "accounting",
    "card",
    "https://accountants.bill.com/articles/bill-logo-and-guidelines",
    `${NO_FILE} Not in either source set. ${UNREAD}`,
  ),
  ramp: app("Ramp", "Ramp", "accounting", "card", "https://ramp.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  zendesk: {
    ...app("Zendesk", "Zendesk", "support", "ticket", "https://brandland.zendesk.com", `${svgLogos("zendesk-icon")} ${UNREAD}`),
    onLight: true,
  },
  intercom: app("Intercom", "Intercom", "support", "message", "https://www.intercom.com/press", `${svgLogos("intercom-icon")} ${UNREAD}`),
  asana: app("Asana", "Asana", "projects", "checklist", "https://asana.com/brand", `${svgLogos("asana-icon")} ${UNREAD}`),
  clickup: app("ClickUp", "ClickUp", "projects", "checklist", "https://clickup.com/brand", `${svgLogos("clickup-icon")} ${UNREAD}`),
  monday: app("monday.com", "monday.com", "projects", "checklist", "https://monday.com/p/press-kit/", `${svgLogos("monday-icon")} ${UNREAD}`),
  typeform: {
    ...app("Typeform", "Typeform", "forms", "document", "https://www.typeform.com", `${svgLogos("typeform-icon")} ${UNREAD}`),
    onLight: true,
  },
  calendly: app(
    "Calendly",
    "Calendly",
    "forms",
    "calendar",
    "https://calendly.com/newsroom",
    `${NO_FILE} Not in SVG Logos, and the current mark is more than one color. ${UNREAD}`,
  ),
  meta: app(
    "Meta Ads",
    "Meta Platforms",
    "ads",
    "megaphone",
    "https://www.meta.com/brand/resources/meta/company-brand/",
    `${svgLogos("meta-icon")} ${ASK}`,
  ),
  shopify: app("Shopify", "Shopify", "commerce", "store", "https://www.shopify.com/brand-assets", `${svgLogos("shopify")} ${ASK}`),
  gusto: app("Gusto", "Gusto", "hr", "people", "https://gusto.com", `${NO_FILE} Both source sets have only the wide wordmark. ${UNREAD}`),
  greenhouse: app(
    "Greenhouse",
    "Greenhouse Software",
    "hr",
    "people",
    "https://brand.greenhouse.io/brand-portal/p/5",
    `${simpleIcons("greenhouse", "#24A47F")} ${UNREAD}`,
  ),
  claude: app("Claude", "Anthropic", "ai", "sparkles", "https://www.anthropic.com/legal/trademark-guidelines", `${svgLogos("claude-icon")} ${ASK}`),
  openai: {
    ...app(
      "OpenAI",
      "OpenAI",
      "ai",
      "sparkles",
      "https://openai.com/brand/",
      `${svgLogos("openai-icon")} Published terms allow the official logo where a step uses OpenAI. Replace with the official file from OpenAI to rely on that.`,
    ),
    onLight: true,
  },
  dropbox: app("Dropbox", "Dropbox", "storage", "folder", "https://www.dropbox.com/branding", `${svgLogos("dropbox")} ${UNREAD}`),
  servicetitan: app("ServiceTitan", "ServiceTitan", "fieldservice", "wrench", "https://www.servicetitan.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  jobber: app("Jobber", "Jobber", "fieldservice", "wrench", "https://www.getjobber.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  housecallpro: app("Housecall Pro", "Housecall Pro", "fieldservice", "wrench", "https://www.housecallpro.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  callrail: app("CallRail", "CallRail", "phone", "phone", "https://www.callrail.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  twilio: app("Twilio", "Twilio", "phone", "message", "https://www.twilio.com/en-us/brand", `${svgLogos("twilio-icon")} ${UNREAD}`),
  angi: app("Angi", "Angi", "leads", "people", "https://www.angi.com", `${NO_FILE} Not in either source set. ${UNREAD}`),
  thumbtack: app("Thumbtack", "Thumbtack", "leads", "people", "https://www.thumbtack.com", `${simpleIcons("thumbtack", "#009FD9")} ${UNREAD}`),
};

export function isAppSlug(value: string): value is AppSlug {
  return (APP_SLUGS as readonly string[]).includes(value);
}

export function isGlyph(value: string): value is Glyph {
  return (GLYPHS as readonly string[]).includes(value);
}

/** Whether the mark may be drawn. The caller must also check that the artwork file exists. */
export function markAllowed(slug: AppSlug): boolean {
  return LOGO_MODE === "all" || APPS[slug].status === "cleared";
}

/** Display name for an app slug or glyph. Glyph steps name themselves in their operation line. */
export function appName(value: AppSlug | Glyph): string {
  if (isAppSlug(value)) return APPS[value].name;
  return { code: "Code", clock: "Schedule", webhook: "Webhook", form: "Web form", http: "HTTP" }[value];
}
