"use client";

import { useState } from "react";

/** Plain links and the clipboard. No third-party share scripts. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const link = "text-link inline-flex min-h-11 items-center text-[15px]";
  return (
    <div data-print="hide" className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-1 border-t border-rule pt-5">
      <p className="font-semibold text-forest">Share</p>
      <button type="button" className={link} onClick={copy}>
        <span aria-live="polite">
          {state === "copied" ? "Link copied" : state === "failed" ? "Copy failed" : "Copy link"}
        </span>
      </button>
      <a
        className={link}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        className={link}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
      >
        Email
      </a>
    </div>
  );
}
