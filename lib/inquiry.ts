export const PRIMARY_FOCUSES = [
  "Meta Ads + AI Lead Automation",
  "AI Lead Follow-Up & Booking Systems",
  "Meta Ads Acquisition",
  "Executive KPI & Growth Advisory",
] as const;

export type PrimaryFocus = (typeof PRIMARY_FOCUSES)[number];

export type Inquiry = {
  fullName: string;
  email: string;
  studioName: string;
  cityState: string;
  websiteOrInstagram?: string;
  primaryFocus: PrimaryFocus;
  note?: string;
};

export type InquiryField = keyof Inquiry;

export type FieldErrors = Partial<Record<InquiryField, string>>;

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

function isPrimaryFocus(value: string): value is PrimaryFocus {
  return (PRIMARY_FOCUSES as readonly string[]).includes(value);
}

function isWebsiteOrHandle(value: string): boolean {
  if (value.length > 200 || /[\s<>]/.test(value)) return false;
  if (/^@[A-Za-z0-9._]{1,30}$/.test(value)) return true;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateInquiry(
  input: unknown,
): { ok: true; value: Inquiry } | { ok: false; fieldErrors: FieldErrors } {
  if (!isRecord(input)) {
    return {
      ok: false,
      fieldErrors: { fullName: "Enter your full name." },
    };
  }

  const fieldErrors: FieldErrors = {};
  const fullName = readString(input, "fullName");
  const email = readString(input, "email");
  const studioName = readString(input, "studioName");
  const cityState = readString(input, "cityState");
  const websiteOrInstagram = readString(input, "websiteOrInstagram");
  const primaryFocusRaw = readString(input, "primaryFocus");
  const primaryFocus = isPrimaryFocus(primaryFocusRaw) ? primaryFocusRaw : null;
  const note = readString(input, "note");

  if (fullName.length < 2 || fullName.length > 100) {
    fieldErrors.fullName = "Enter your full name.";
  }
  if (!EMAIL.test(email) || email.length > 254) {
    fieldErrors.email = "Enter a valid email.";
  }
  if (studioName.length < 2 || studioName.length > 120) {
    fieldErrors.studioName = "Enter the studio name.";
  }
  if (cityState.length < 2 || cityState.length > 120) {
    fieldErrors.cityState = "Enter the city and state.";
  }
  if (websiteOrInstagram && !isWebsiteOrHandle(websiteOrInstagram)) {
    fieldErrors.websiteOrInstagram = "Enter a website, domain, or @handle.";
  }
  if (!primaryFocus) {
    fieldErrors.primaryFocus = "Select a primary focus.";
  }
  if (note.length > 2000) {
    fieldErrors.note = "Keep the note under 2000 characters.";
  }

  if (!primaryFocus || Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const value: Inquiry = {
    fullName,
    email,
    studioName,
    cityState,
    primaryFocus,
  };
  if (websiteOrInstagram) value.websiteOrInstagram = websiteOrInstagram;
  if (note) value.note = note;
  return { ok: true, value };
}
