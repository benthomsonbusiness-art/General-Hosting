/**
 * App registry for workflow drawings.
 *
 * Product names may be printed freely to say what a workflow connects to. Logos are another
 * matter: most brands' published rules require written permission before a third party shows
 * their mark. Each entry therefore carries a permission status, and a mark is drawn only when
 * the status and LOGO_MODE allow it AND the official artwork file exists in public/logos/.
 * Everything else is drawn as the app name with a neutral glyph.
 *
 * Never recolor, redraw, outline or add effects to a mark. Artwork comes only from the brand's
 * own press kit or brand page, unaltered apart from SVGO cleanup.
 */

/** "cleared-only": draw marks only for cleared apps. "all": draw every app that has an artwork file. */
export const LOGO_MODE: "cleared-only" | "all" = "cleared-only";

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
  | "megaphone";

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
  | "storage";

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
};

const CHECKED = "2026-11-25";
const GOOGLE = "https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/";
const MICROSOFT = "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx";
const ASK = "Written permission needed before the mark is shown.";
const UNREAD = "Brand rules not yet read. Treat as text only until they are.";

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
  gmail: app("Gmail", "Google", "email", "mail", GOOGLE, ASK),
  googlecalendar: app("Google Calendar", "Google", "email", "calendar", GOOGLE, ASK),
  googledrive: app("Google Drive", "Google", "storage", "folder", GOOGLE, ASK),
  googlesheets: app("Google Sheets", "Google", "docs", "table", GOOGLE, ASK),
  googledocs: app("Google Docs", "Google", "docs", "document", GOOGLE, ASK),
  googleanalytics: app("Google Analytics", "Google", "ads", "chart", GOOGLE, ASK),
  googleads: app("Google Ads", "Google", "ads", "megaphone", GOOGLE, ASK),
  outlook: app("Outlook", "Microsoft", "email", "mail", MICROSOFT, ASK),
  teams: app("Microsoft Teams", "Microsoft", "chat", "message", MICROSOFT, ASK),
  excel: app("Microsoft Excel", "Microsoft", "docs", "table", MICROSOFT, ASK),
  slack: app("Slack", "Slack Technologies", "chat", "message", "https://slack.com/terms-of-service/slack-brand", ASK),
  zoom: app("Zoom", "Zoom Communications", "chat", "video", "https://brand.zoom.us/usage-legal/", ASK),
  hubspot: app("HubSpot", "HubSpot", "crm", "contacts", "https://www.hubspot.com/style-guide", UNREAD),
  salesforce: app(
    "Salesforce",
    "Salesforce",
    "crm",
    "contacts",
    "https://www.salesforce.com/company/legal/tmcusageguidelines/",
    "Published rules allow the product logo inside a flowchart, unaltered, with the line \"Salesforce is a trademark of Salesforce, Inc.\" Add the official file to use it.",
  ),
  pipedrive: app("Pipedrive", "Pipedrive", "crm", "contacts", "https://pipedrive.com/en/newsroom/press-kit", UNREAD),
  apollo: app("Apollo", "Apollo.io", "crm", "database", "https://www.apollo.io", UNREAD),
  notion: app("Notion", "Notion Labs", "docs", "document", "https://notion.notion.site/Press-Kit-e8c2e63336f045f4ab2fb4a17b4bbd63", UNREAD),
  airtable: app("Airtable", "Airtable", "docs", "table", "https://airtable.com/newsroom", UNREAD),
  docusign: app("Docusign", "Docusign", "docs", "signature", "https://www.docusign.com/IP/trademark-general", ASK),
  pandadoc: app("PandaDoc", "PandaDoc", "docs", "signature", "https://www.pandadoc.com", UNREAD),
  quickbooks: app("QuickBooks", "Intuit", "accounting", "card", "https://design.intuit.com/quickbooks/brand", UNREAD),
  xero: app("Xero", "Xero", "accounting", "card", "https://www.xero.com/uk/about/media/downloads", UNREAD),
  stripe: app("Stripe", "Stripe", "accounting", "card", "https://stripe.com/legal/marks", ASK),
  billcom: app("BILL", "BILL Holdings", "accounting", "card", "https://accountants.bill.com/articles/bill-logo-and-guidelines", UNREAD),
  ramp: app("Ramp", "Ramp", "accounting", "card", "https://ramp.com", UNREAD),
  zendesk: app("Zendesk", "Zendesk", "support", "ticket", "https://brandland.zendesk.com", UNREAD),
  intercom: app("Intercom", "Intercom", "support", "message", "https://www.intercom.com/press", UNREAD),
  asana: app("Asana", "Asana", "projects", "checklist", "https://asana.com/brand", UNREAD),
  clickup: app("ClickUp", "ClickUp", "projects", "checklist", "https://clickup.com/brand", UNREAD),
  monday: app("monday.com", "monday.com", "projects", "checklist", "https://monday.com/p/press-kit/", UNREAD),
  typeform: app("Typeform", "Typeform", "forms", "document", "https://www.typeform.com", UNREAD),
  calendly: app("Calendly", "Calendly", "forms", "calendar", "https://calendly.com/newsroom", UNREAD),
  meta: app("Meta Ads", "Meta Platforms", "ads", "megaphone", "https://www.meta.com/brand/resources/meta/company-brand/", ASK),
  shopify: app("Shopify", "Shopify", "commerce", "store", "https://www.shopify.com/brand-assets", ASK),
  gusto: app("Gusto", "Gusto", "hr", "people", "https://gusto.com", UNREAD),
  greenhouse: app("Greenhouse", "Greenhouse Software", "hr", "people", "https://brand.greenhouse.io/brand-portal/p/5", UNREAD),
  claude: app("Claude", "Anthropic", "ai", "sparkles", "https://www.anthropic.com/legal/trademark-guidelines", ASK),
  openai: app(
    "OpenAI",
    "OpenAI",
    "ai",
    "sparkles",
    "https://openai.com/brand/",
    "Published terms allow the official logo where a step uses OpenAI. Add the official file to use it.",
  ),
  dropbox: app("Dropbox", "Dropbox", "storage", "folder", "https://www.dropbox.com/branding", UNREAD),
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
