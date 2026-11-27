"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  HONEYPOT_FIELD,
  INQUIRY_NOT_SENT,
  INQUIRY_SENT,
  PRACTICE_INTERESTS,
  PRACTICE_LABELS,
  practiceFromQuery,
  validateInquiry,
  type FieldErrors,
  type InquiryField,
  type PracticeInterest,
} from "@/lib/inquiry-shared";
import { CTA_LABEL } from "@/lib/site";

const FIELD_ORDER: InquiryField[] = ["fullName", "email", "companyRole", "practice", "note"];
const FALLBACK_ERROR = "The inquiry could not be sent.";

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  return (
    <Suspense fallback={<InquiryFields initialPractice="Booking Automation" />}>
      <InquiryFromQuery />
    </Suspense>
  );
}

/** ?practice= preselects the service. ?sent=1 or ?sent=0 is where a form post without JavaScript lands. */
function InquiryFromQuery() {
  const params = useSearchParams();
  const practice = practiceFromQuery(params.get("practice"));
  const sent = params.get("sent");
  return (
    <InquiryFields
      key={`${practice}-${sent}`}
      initialPractice={practice}
      initialStatus={sent === "1" ? "success" : sent === "0" ? "error" : "idle"}
    />
  );
}

function InquiryFields({
  initialPractice,
  initialStatus = "idle",
}: {
  initialPractice: PracticeInterest;
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

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.value,
          [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
        }),
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
      <div className="border-t-2 border-forest pt-7">
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
          <Field label="Where do jobs slip away?" id="note" error={errors.note}>
            <textarea
              id="note"
              name="note"
              rows={6}
              required
              maxLength={2000}
              aria-invalid={Boolean(errors.note)}
              aria-describedby={errors.note ? "note-error" : undefined}
              className="field min-h-36 resize-y"
            />
          </Field>
        </div>
      </div>

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
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-forest">
        {label}
        <span className="font-normal text-slate"> (required)</span>
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
