"use client";

import { FormEvent, useRef, useState } from "react";
import {
  PRIMARY_FOCUSES,
  validateInquiry,
  type FieldErrors,
  type InquiryField,
} from "@/lib/inquiry";

const FIELD_ORDER: InquiryField[] = [
  "fullName",
  "email",
  "studioName",
  "cityState",
  "websiteOrInstagram",
  "primaryFocus",
  "note",
];

const sansStyle = {
  fontFamily: 'var(--font-inter, Inter), Inter, system-ui, sans-serif',
} as const;

const serifStyle = {
  fontFamily: 'var(--font-cormorant, "Cormorant Garamond"), Georgia, serif',
} as const;

const controlClass =
  "w-full rounded-[2px] border border-[#133224]/30 bg-[#F7F4EC] px-3.5 py-3.5 font-[inherit] text-[15px] text-[#133224] outline-none transition-colors placeholder:text-[#133224]/45 focus:border-[#C5A869]";

type Status = "idle" | "submitting" | "success" | "error";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] text-[#7A3E2E]">
      {message}
    </p>
  );
}

export default function InquiryForm() {
  const submitting = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [receivedName, setReceivedName] = useState("");

  function clearFieldError(name: string) {
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
      studioName: String(formData.get("studioName") ?? ""),
      cityState: String(formData.get("cityState") ?? ""),
      websiteOrInstagram: String(formData.get("websiteOrInstagram") ?? ""),
      primaryFocus: String(formData.get("primaryFocus") ?? ""),
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
      const response = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.value,
          fax_number: String(formData.get("fax_number") ?? ""),
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
        setFormError(body?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setReceivedName(parsed.value.fullName.split(/\s+/)[0] ?? "");
      setStatus("success");
      form.reset();
    } catch {
      setFormError("We could not reach the studio. Please try again.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section
      id="inquire"
      aria-labelledby="inquire-heading"
      className="border-t border-[#C5A869] bg-[#EFEADF] px-6 py-24 text-[#133224] sm:px-10"
      style={sansStyle}
    >
      <div className="mx-auto max-w-[720px]">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#C5A869]">
          Inquire
        </p>

        {status === "success" ? (
          <div role="status" className="border-t border-[#C5A869] pt-8">
            <h2
              id="inquire-heading"
              className="text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.05]"
              style={serifStyle}
            >
              Thank you{receivedName ? `, ${receivedName}` : ""}.
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-7">
              Your note is with Valentini & Co. We review each inquiry personally and will write back shortly.
            </p>
          </div>
        ) : (
          <>
            <h2
              id="inquire-heading"
              className="text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.05]"
              style={serifStyle}
            >
              Tell us about the studio
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-7">
              A short note is enough. We reply personally.
            </p>

            <form
              noValidate
              onSubmit={onSubmit}
              aria-busy={status === "submitting"}
              className="relative mt-12 grid gap-6"
              onInput={(event) => {
                const target = event.target;
                if (
                  target instanceof HTMLInputElement ||
                  target instanceof HTMLTextAreaElement ||
                  target instanceof HTMLSelectElement
                ) {
                  clearFieldError(target.name);
                }
              }}
            >
              <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="fax_number">Fax</label>
                <input
                  id="fax_number"
                  name="fax_number"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    className={`${controlClass} ${errors.fullName ? "border-[#7A3E2E]" : ""}`}
                  />
                  <FieldError id="fullName-error" message={errors.fullName} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${controlClass} ${errors.email ? "border-[#7A3E2E]" : ""}`}
                  />
                  <FieldError id="email-error" message={errors.email} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="studioName" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                    Studio Name
                  </label>
                  <input
                    id="studioName"
                    name="studioName"
                    type="text"
                    autoComplete="organization"
                    required
                    maxLength={120}
                    aria-invalid={Boolean(errors.studioName)}
                    aria-describedby={errors.studioName ? "studioName-error" : undefined}
                    className={`${controlClass} ${errors.studioName ? "border-[#7A3E2E]" : ""}`}
                  />
                  <FieldError id="studioName-error" message={errors.studioName} />
                </div>
                <div>
                  <label htmlFor="cityState" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                    City & State
                  </label>
                  <input
                    id="cityState"
                    name="cityState"
                    type="text"
                    autoComplete="address-level2"
                    required
                    maxLength={120}
                    aria-invalid={Boolean(errors.cityState)}
                    aria-describedby={errors.cityState ? "cityState-error" : undefined}
                    className={`${controlClass} ${errors.cityState ? "border-[#7A3E2E]" : ""}`}
                  />
                  <FieldError id="cityState-error" message={errors.cityState} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="websiteOrInstagram"
                  className="mb-2 block text-[11px] uppercase tracking-[0.16em]"
                >
                  Website or Instagram <span className="tracking-normal text-[#133224]/55">(optional)</span>
                </label>
                <input
                  id="websiteOrInstagram"
                  name="websiteOrInstagram"
                  type="text"
                  autoComplete="url"
                  maxLength={200}
                  aria-invalid={Boolean(errors.websiteOrInstagram)}
                  aria-describedby={errors.websiteOrInstagram ? "websiteOrInstagram-error" : undefined}
                  className={`${controlClass} ${errors.websiteOrInstagram ? "border-[#7A3E2E]" : ""}`}
                />
                <FieldError id="websiteOrInstagram-error" message={errors.websiteOrInstagram} />
              </div>

              <div>
                <label htmlFor="primaryFocus" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                  Primary Focus
                </label>
                <select
                  id="primaryFocus"
                  name="primaryFocus"
                  required
                  defaultValue=""
                  aria-invalid={Boolean(errors.primaryFocus)}
                  aria-describedby={errors.primaryFocus ? "primaryFocus-error" : undefined}
                  className={`${controlClass} ${errors.primaryFocus ? "border-[#7A3E2E]" : ""}`}
                >
                  <option value="">Select a focus</option>
                  {PRIMARY_FOCUSES.map((focus) => (
                    <option key={focus} value={focus}>
                      {focus}
                    </option>
                  ))}
                </select>
                <FieldError id="primaryFocus-error" message={errors.primaryFocus} />
              </div>

              <div>
                <label htmlFor="note" className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
                  Brief Note <span className="tracking-normal text-[#133224]/55">(optional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={5}
                  maxLength={2000}
                  aria-invalid={Boolean(errors.note)}
                  aria-describedby={errors.note ? "note-error" : undefined}
                  className={`${controlClass} min-h-36 resize-y ${errors.note ? "border-[#7A3E2E]" : ""}`}
                />
                <FieldError id="note-error" message={errors.note} />
              </div>

              {formError ? (
                <p role="alert" className="text-sm text-[#7A3E2E]">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="justify-self-start rounded-[2px] border border-transparent bg-[#133224] px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-[#F7F4EC] transition-colors hover:border-[#C5A869] hover:bg-[#0D2419] disabled:cursor-progress disabled:opacity-70"
              >
                {status === "submitting" ? "Sending" : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
