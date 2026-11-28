/** Client-safe half of the inquiry contract: constants, types and Zod schema validation. */
import { z } from "zod";

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
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const INQUIRY_OFFLINE_ERROR =
  "The form is not working right now, so nothing was sent. Please try again later.";

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

/** Strips C0/C1 control characters (except \n, \r, \t) and Unicode BiDi override characters. */
const UNSAFE_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g;

/** Collapses ASCII and Unicode line/paragraph breaks into single spaces to prevent header injection. */
const LINE_BREAKS = /[\r\n\t\u0085\u2028\u2029]+/g;

/** Forbids header-delimiter or display-name spoofing characters inside an email address. */
const SAFE_EMAIL_CHARS = /^[^\s<>",;\\()[\]]+$/;

export function practiceFromQuery(value: string | null | undefined): PracticeInterest {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "reminders") return "Appointment Reminders";
  if (normalized === "missed-calls") return "Missed Call Text-back";
  return "Instant Booking";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanMultiline(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFC").replace(UNSAFE_CHARS, "").replace(/[\u0085\u2028\u2029]/g, "\n").trim();
}

function cleanSingleLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFC").replace(UNSAFE_CHARS, "").replace(LINE_BREAKS, " ").trim();
}

export const inquirySchema = z.object({
  fullName: z
    .preprocess(cleanSingleLine, z.string().min(2, "Enter your name.").max(100, "Enter your name.")),
  email: z.preprocess(
    cleanSingleLine,
    z
      .string()
      .max(254, "Enter a valid work email.")
      .email("Enter a valid work email.")
      .regex(SAFE_EMAIL_CHARS, "Enter a valid work email."),
  ),
  companyRole: z.preprocess(
    cleanSingleLine,
    z.string().min(2, "Enter your company and role.").max(140, "Enter your company and role."),
  ),
  practice: z.preprocess(
    cleanSingleLine,
    z.enum(PRACTICE_INTERESTS, { message: "Choose what you need." }),
  ),
  note: z.preprocess(
    cleanMultiline,
    z
      .string()
      .min(8, "Describe the process in a sentence or two.")
      .max(2000, "Describe the process in a sentence or two."),
  ),
});

export function validateInquiry(
  input: unknown,
): { ok: true; value: Inquiry } | { ok: false; fieldErrors: FieldErrors } {
  if (!isRecord(input)) {
    return {
      ok: false,
      fieldErrors: { fullName: "Enter your name." },
    };
  }

  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as InquiryField | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: parsed.data,
  };
}
