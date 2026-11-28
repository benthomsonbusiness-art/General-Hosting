"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  HONEYPOT_FIELD,
  INQUIRY_NOT_SENT,
  INQUIRY_SENT,
  PRACTICE_INTERESTS,
  PRACTICE_LABELS,
  TURNSTILE_FIELD,
  practiceFromQuery,
  validateInquiry,
  type FieldErrors,
  type InquiryField,
  type PracticeInterest,
} from "@/lib/inquiry-shared";
import { CTA_LABEL } from "@/lib/site";

const FIELD_ORDER: InquiryField[] = ["fullName", "email", "companyRole", "practice", "note"];
const FALLBACK_ERROR = "The inquiry could not be sent.";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  return (
    <Suspense fallback={<InquiryFields initialPractice="Instant Booking" />}>
      <InquiryFromQuery />
    </Suspense>
  );
}

const BUSINESS_NAMES: Record<string, string> = {
  gyms: "Gym or fitness studio",
  recruiting: "Recruiting and staffing",
  events: "Events and entertainment",
  landscaping: "Lawn and landscaping",
  plumbing: "Plumbing and home services",
  appointments: "Studio or local service",
};

function starterNote(trade: string | null, missed: string | null): string {
  const cleanType = trade ? (BUSINESS_NAMES[trade.toLowerCase()] ?? trade.slice(0, 40)) : "";
  const count = missed ? Number.parseInt(missed, 10) : Number.NaN;
  const parts: string[] = [];
  if (cleanType) parts.push(`Business: ${cleanType}.`);
  if (Number.isFinite(count) && count > 0 && count <= 200) {
    parts.push(`Roughly ${count} missed calls or slow web leads a week.`);
  }
  return parts.join(" ");
}

/** ?practice= preselects the service. ?trade= and ?missed= prefill a starter note from the calculator. */
function InquiryFromQuery() {
  const params = useSearchParams();
  const practice = practiceFromQuery(params.get("practice"));
  const sent = params.get("sent");
  const initialNote = starterNote(params.get("trade"), params.get("missed"));
  return (
    <InquiryFields
      key={`${practice}-${sent}-${initialNote}`}
      initialPractice={practice}
      initialNote={initialNote}
      initialStatus={sent === "1" ? "success" : sent === "0" ? "error" : "idle"}
    />
  );
}

function InquiryFields({
  initialPractice,
  initialNote = "",
  initialStatus = "idle",
}: {
  initialPractice: PracticeInterest;
  initialNote?: string;
  initialStatus?: Status;
}) {
  const submitting = useRef(false);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(initialStatus === "error" ? INQUIRY_NOT_SENT : null);
  const [receivedName, setReceivedName] = useState("");
  const [practice, setPractice] = useState<PracticeInterest>(initialPractice);
  const thanksRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") thanksRef.current?.focus();
  }, [status]);

  function clearField(name: string) {
    if (!FIELD_ORDER.includes(name as InquiryField)) return;
    setErrors((current) => {
      if (!current[name as InquiryField]) return current;
      const next = { ...current };
      delete next[name as InquiryField];
      return next;
    });
  }

  function showFieldErrors(form: HTMLFormElement, fieldErrors: FieldErrors) {
    setErrors(fieldErrors);
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) form.querySelector<HTMLElement>(`#${first}`)?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = validateInquiry({
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      companyRole: String(data.get("companyRole") ?? ""),
      practice,
      note: String(data.get("note") ?? ""),
    });
    if (!parsed.ok) {
      setFormError(null);
      setStatus("idle");
      showFieldErrors(form, parsed.fieldErrors);
      return;
    }

    setErrors({});
    setFormError(null);
    submitting.current = true;
    setStatus("submitting");

    const payloadBody: Record<string, string> = {
      ...parsed.value,
      [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
    };
    const turnstileToken = data.get(TURNSTILE_FIELD);
    if (typeof turnstileToken === "string" && turnstileToken.length > 0) {
      payloadBody[TURNSTILE_FIELD] = turnstileToken;
    }

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;

      if (!response.ok || !body?.ok) {
        if (body?.fieldErrors) showFieldErrors(form, body.fieldErrors);
        setFormError(body?.error ?? FALLBACK_ERROR);
        setStatus("error");
        return;
      }

      setReceivedName(parsed.value.fullName.split(/\s+/)[0] ?? "");
      setStatus("success");
    } catch {
      setFormError(FALLBACK_ERROR);
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="border-t-2 border-heading pt-7">
        <h2 ref={thanksRef} tabIndex={-1} className="h2 outline-none">
          Thank you{receivedName ? `, ${receivedName}` : ""}.
        </h2>
        <p className="mt-4 max-w-[34rem]">{INQUIRY_SENT}</p>
      </div>
    );
  }

  const sending = status === "submitting";

  return (
    <form method="post" action="/api/inquiry" noValidate onSubmit={onSubmit} aria-busy={sending} className="relative">
      {TURNSTILE_SITE_KEY ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      ) : null}

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Fax</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div
        className="grid gap-6 sm:grid-cols-2"
        onInput={(event) => {
          const target = event.target;
          if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) clearField(target.name);
        }}
      >
        <Field label="Name" id="fullName" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="field"
          />
        </Field>
        <Field label="Work email" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="field"
          />
        </Field>
        <Field label="Company and role" id="companyRole" error={errors.companyRole}>
          <input
            id="companyRole"
            name="companyRole"
            type="text"
            autoComplete="organization"
            required
            maxLength={140}
            aria-invalid={Boolean(errors.companyRole)}
            aria-describedby={errors.companyRole ? "companyRole-error" : undefined}
            className="field"
          />
        </Field>
        <Field label="What do you need?" id="practice" error={errors.practice}>
          <select
            id="practice"
            name="practice"
            value={practice}
            required
            aria-invalid={Boolean(errors.practice)}
            aria-describedby={errors.practice ? "practice-error" : undefined}
            className="field"
            onChange={(event) => {
              setPractice(event.target.value as PracticeInterest);
              clearField("practice");
            }}
          >
            {PRACTICE_INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {PRACTICE_LABELS[interest]}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Where do bookings slip?" id="note" error={errors.note}>
            <textarea
              id="note"
              name="note"
              rows={6}
              required
              maxLength={2000}
              defaultValue={initialNote}
              aria-invalid={Boolean(errors.note)}
              aria-describedby={errors.note ? "note-error" : undefined}
              className="field min-h-36 resize-y"
            />
          </Field>
        </div>
      </div>

      {TURNSTILE_SITE_KEY ? (
        <div className="mt-6">
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
        </div>
      ) : null}

      <div role="alert">
        {formError ? (
          <p className="mt-6 border-l-2 border-error pl-4 text-error">{formError}</p>
        ) : null}
      </div>

      <button type="submit" aria-disabled={sending} className="btn btn-primary mt-8 w-full sm:w-auto">
        {sending ? "Sending…" : CTA_LABEL}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-heading">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[14px] font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
