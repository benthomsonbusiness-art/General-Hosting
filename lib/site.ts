export const SITE_NAME = "Valentini & Co.";
export const SITE_DOMAIN = "valentiniandco.com";
export const SITE_WWW = `www.${SITE_DOMAIN}`;
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const INQUIRY_EMAIL = `inquiries@${SITE_DOMAIN}`;
export const SITE_LOCALITY = "Bloomington, Indiana";

/** Exact public hosts. Add a hostname here only when it is this site. */
export const SITE_HOSTS = [SITE_DOMAIN, SITE_WWW] as const;

/** Exact preview hosts. Wildcard workers.dev origins are not allowed. */
export const PREVIEW_HOSTS = [
  "valentini-preview.benthomsonbusiness.workers.dev",
  "valentini-next.benthomsonbusiness.workers.dev",
] as const;

export const CTA_LABEL = "Request a workflow audit";
export const CTA_HREF = "/contact";
