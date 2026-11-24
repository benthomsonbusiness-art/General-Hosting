"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import {
  HONEYPOT_FIELD,
  PRACTICE_INTERESTS,
  practiceFromQuery,
  validateInquiry,
  type FieldErrors,
  type InquiryField,
  type PracticeInterest,
  INQUIRY_OFFLINE_ERROR,
} from "@/lib/inquiry";
import { INQUIRY_EMAIL } from "@/lib/site";

const FIELD_ORDER: InquiryField[] = ["fullName", "email", "companyRole", "practice", "note"];

type Status = "idle" | "submitting" | "success" | "error";

export function Diagnostic() {
  return (
    <section id="diagnostic" tabIndex={-1} className="bg-[#133224] text-[#F7F4EC] outline-none">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <div className="relative min-h-[420px] lg:col-span-5 lg:min-h-full">
          <Image
            src="/images/consultation-room.jpg"
            alt="A consultation room with forest-green paneling, a cognac leather chair, a limestone table, and linen curtains."
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-6 py-16 md:px-12 md:py-20 lg:col-span-7 lg:py-24">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">Private diagnostic</p>
          <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(2.6rem,4.4vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em]">
            Tell us where the work stalls.
          </h2>
          <p className="mt-6 max-w-[40rem] text-[16px] leading-7 text-[#F7F4EC]/75">
            One workflow, looked at properly: where data enters, where people wait, and which steps
            must never be a guess. We reply directly.
          </p>
          <Suspense fallback={<InquiryFields initialPractice="AI Workflow Consulting" />}>
            <InquiryFromQuery />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function InquiryFromQuery() {
  const params = useSearchParams();
  const practice = practiceFromQuery(params.get("practice"));
  return <InquiryFields key={practice} initialPractice={practice} />;
}

function InquiryFields({ initialPractice }: { initialPractice: PracticeInterest }) {
  const submitting = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [receivedName, setReceivedName] = useState("");
  const [practice, setPractice] = useState<PracticeInterest>(initialPractice);
  const [offline, setOffline] = useState(false);
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const draft = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      companyRole: String(formData.get("companyRole") ?? ""),
      practice,
      note: String(formData.get("note") ?? ""),
    };

    const parsed = validateInquiry(draft);
    if (!parsed.ok) {
      setErrors(parsed.fieldErrors);
      setFormError(null);
      setStatus("idle");
      const firstInvalid = FIELD_ORDER.find((field) => parsed.fieldErrors[field]);
      if (firstInvalid) form.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
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
          [HONEYPOT_FIELD]: String(formData.get(HONEYPOT_FIELD) ?? ""),
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;

      if (!response.ok || !body?.ok) {
        if (body?.fieldErrors) {
          setErrors(body.fieldErrors);
          const firstInvalid = FIELD_ORDER.find((field) => body.fieldErrors?.[field]);
          if (firstInvalid) form.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
        }
        setOffline(response.status === 503 || body?.error === INQUIRY_OFFLINE_ERROR);
        setFormError(body?.error ?? "The inquiry could not be sent. Try again in a moment.");
        setStatus("error");
        return;
      }

      setReceivedName(parsed.value.fullName.split(/\s+/)[0] ?? "");
      setStatus("success");
      form.reset();
      setPractice(initialPractice);
    } catch {
      setFormError("The inquiry could not be sent. Try again in a moment.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="mt-12 border-t border-[rgba(197,168,105,0.35)] pt-8">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">Received</p>
        <h3
          ref={thanksRef}
          tabIndex={-1}
          className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05] font-medium outline-none"
        >
          Thank you{receivedName ? `, ${receivedName}` : ""}.
        </h3>
        <p className="mt-5 max-w-md text-[16px] leading-7 text-[#F7F4EC]/75">
          The note is with Valentini &amp; Co. We read every inquiry and reply from{" "}
          <a className="underline decoration-[#C5A869] underline-offset-4" href={`mailto:${INQUIRY_EMAIL}`}>
            {INQUIRY_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={status === "submitting"} className="relative mt-12">
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Fax</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div
        className="grid gap-8"
        onInput={(event) => {
          const target = event.target;
          if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            clearField(target.name);
          }
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
            className={controlClass(Boolean(errors.fullName))}
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
            className={controlClass(Boolean(errors.email))}
          />
        </Field>
        <Field label="Company / Role" id="companyRole" error={errors.companyRole}>
          <input
            id="companyRole"
            name="companyRole"
            type="text"
            autoComplete="organization"
            required
            maxLength={140}
            aria-invalid={Boolean(errors.companyRole)}
            aria-describedby={errors.companyRole ? "companyRole-error" : undefined}
            className={controlClass(Boolean(errors.companyRole))}
          />
        </Field>
        <Field label="Practice interest" id="practice" error={errors.practice}>
          <select
            id="practice"
            name="practice"
            value={practice}
            required
            aria-invalid={Boolean(errors.practice)}
            aria-describedby={errors.practice ? "practice-error" : undefined}
            className={`${controlClass(Boolean(errors.practice))} appearance-none`}
            style={{ colorScheme: "dark" }}
            onChange={(event) => {
              setPractice(event.target.value as PracticeInterest);
              clearField("practice");
            }}
          >
            {PRACTICE_INTERESTS.map((interest) => (
              <option key={interest} value={interest} className="bg-[#133224] text-[#F7F4EC]">
                {interest}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="What's the problem you want looked at?"
          id="note"
          error={errors.note}
        >
          <textarea
            id="note"
            name="note"
            rows={5}
            required
            maxLength={2000}
            aria-invalid={Boolean(errors.note)}
            aria-describedby={errors.note ? "note-error" : undefined}
            className={`${controlClass(Boolean(errors.note))} min-h-32 resize-y`}
          />
        </Field>
      </div>

      {formError ? (
        <p role="alert" className="mt-6 text-sm text-[#F0C2B6]">
          {formError}{" "}
          {offline ? (
            <a className="underline decoration-[#C5A869] underline-offset-4" href={`mailto:${INQUIRY_EMAIL}`}>
              {INQUIRY_EMAIL}
            </a>
          ) : null}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-10 border border-[#C5A869] px-5 py-3.5 text-[11px] font-medium tracking-[0.16em] text-[#F7F4EC] uppercase transition-colors hover:bg-[#C5A869] hover:text-[#0B1F16] disabled:cursor-progress disabled:opacity-60"
      >
        {status === "submitting" ? "Sending" : "Request a Diagnostic"}
      </button>
    </form>
  );
}

function controlClass(invalid: boolean) {
  return `w-full border-0 border-b bg-transparent py-3 text-[15px] text-[#F7F4EC] outline-none placeholder:text-[#F7F4EC]/35 ${
    invalid ? "border-[#E7B2A4]" : "border-[#C5A869] focus-visible:border-[#F7F4EC]"
  }`;
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
      <label htmlFor={id} className="mb-1 block font-sans text-[12px] text-[#C5A869]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-[#F0C2B6]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
