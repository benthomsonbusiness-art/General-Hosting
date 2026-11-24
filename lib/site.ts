export const SITE_DOMAIN = "valentiniandco.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const INQUIRY_EMAIL = `inquiries@${SITE_DOMAIN}`;

/** Exact public hosts. Add a hostname here only when it is this site. */
export const SITE_HOSTS = [SITE_DOMAIN] as const;

/** Exact preview hosts. Wildcard workers.dev origins are not allowed. */
export const PREVIEW_HOSTS = ["valentini-preview.benthomsonbusiness.workers.dev"] as const;
