/** Client-safe half of the inquiry contract: constants, types and validation. */

export const PRACTICE_INTERESTS = [
  "Instant Booking",
  "Missed Call Text-back",
  "Appointment Reminders",
  "Not Sure Yet",
] as const;

export type PracticeInterest = (typeof PRACTICE_INTERESTS)[number];

/** What the form shows. The values above are stored and mapped from ?practice=, so they never change. */
export const PRACTICE_LABELS: Record<PracticeInterest, string> = {
  "Instant Booking": "Instant booking for web leads",
  "Missed Call Text-back": "Missed call text-back",
  "Appointment Reminders": "Appointment reminders",
  "Not Sure Yet": "Not sure yet",
};

export const HONEYPOT_FIELD = "fax_number";

export const INQUIRY_OFFLINE_ERROR = "The form is not working right now, so nothing was sent. Please try again later.";

/** Shown on /contact?sent=1 after a form post without JavaScript, and after a sent note. */
export const INQUIRY_SENT = "Your note was sent.";

/** Shown on /contact?sent=0 after a form post without JavaScript that did not go through. */
export const INQUIRY_NOT_SENT =
  "Your note was not sent. Check that every field is filled in, then try again. If it still fails, the form is not working right now.";

export type Inquiry = {
  fullName: string;
  email: string;
  companyRole: string;
  practice: PracticeInterest;
  note: string;
};

export type InquiryField = keyof Inquiry;

export type FieldErrors = Partial<Record<InquiryField, string>>;

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function practiceFromQuery(value: string | null | undefined): PracticeInterest {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "reminders") return "Appointment Reminders";
  if (normalized === "missed-calls") return "Missed Call Text-back";
  return "Instant Booking";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function isPractice(value: string): value is PracticeInterest {
  return (PRACTICE_INTERESTS as readonly string[]).includes(value);
}

export function validateInquiry(
  input: unknown,
): { ok: true; value: Inquiry } | { ok: false; fieldErrors: FieldErrors } {
  if (!isRecord(input)) {
    return {
      ok: false,
      fieldErrors: { fullName: "Enter your name." },
    };
  }

  const fieldErrors: FieldErrors = {};
  const fullName = singleLine(readString(input, "fullName"));
  const email = singleLine(readString(input, "email"));
  const companyRole = singleLine(readString(input, "companyRole"));
  const practiceRaw = readString(input, "practice");
  const practice = isPractice(practiceRaw) ? practiceRaw : null;
  const note = readString(input, "note");

  if (fullName.length < 2 || fullName.length > 100) {
    fieldErrors.fullName = "Enter your name.";
  }
  if (!EMAIL.test(email) || email.length > 254) {
    fieldErrors.email = "Enter a valid work email.";
  }
  if (companyRole.length < 2 || companyRole.length > 140) {
    fieldErrors.companyRole = "Enter your company and role.";
  }
  if (!practice) {
    fieldErrors.practice = "Choose what you need.";
  }
  if (note.length < 8 || note.length > 2000) {
    fieldErrors.note = "Describe the process in a sentence or two.";
  }

  if (!practice || Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: { fullName, email, companyRole, practice, note },
  };
}
