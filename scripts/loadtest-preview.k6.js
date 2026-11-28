/**
 * Safe k6 stress-test profile for a SEPARATE Cloudflare preview Worker.
 *
 * SAFETY GUARDRAILS:
 * 1. Refuses to run against temporant.com or the live valentini-next production URL.
 * 2. Ramps 10 -> 50 -> 100 VUs over 3.5 minutes max (< 5 min cap).
 * 3. Aborts immediately if 5xx / unexpected error rate exceeds 5%.
 * 4. Expects the preview Worker to point WEBHOOK_URL at a mock sink (no real Resend emails).
 *
 * Usage:
 *   PREVIEW_URL=https://valentini-security-preview.<account>.workers.dev k6 run scripts/loadtest-preview.k6.js
 */
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const unexpectedErrors = new Rate("unexpected_errors");

const TARGET = (__ENV.PREVIEW_URL || "").replace(/\/+$/, "");
if (
  !TARGET ||
  TARGET.includes("temporant.com") ||
  TARGET.includes("valentini-next.benthomsonbusiness.workers.dev")
) {
  throw new Error(
    "Refusing to run: set PREVIEW_URL to an isolated Cloudflare preview Worker URL, never production.",
  );
}

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "60s", target: 50 },
    { duration: "60s", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    unexpected_errors: [{ threshold: "rate<0.05", abortOnFail: true, delayAbortEval: "10s" }],
    http_req_duration: ["p(95)<500", "p(99)<1000"],
  },
};

const ROUTES = ["/", "/services", "/workflows/missed-call-text-back", "/search-index.json"];

export default function runPreviewScenario() {
  const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  const pageRes = http.get(`${TARGET}${route}`);
  const pageOk = check(pageRes, {
    "page status is 200": (r) => r.status === 200,
  });
  unexpectedErrors.add(!pageOk);

  // 1 in 5 iterations also tests the inquiry endpoint (expects 200 on mocked webhook or 429 rate-limit)
  if (__ITER % 5 === 0) {
    const formRes = http.post(
      `${TARGET}/api/inquiry`,
      JSON.stringify({
        fullName: "Preview Load Test",
        email: "loadtest@preview.example.com",
        companyRole: "Preview Gym, Owner",
        practice: "Missed Call Text-back",
        note: "Automated k6 preview stress test against mocked webhook sink.",
        fax_number: "",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Origin: TARGET,
        },
      },
    );
    // 200 (mocked delivery) and 429 (expected rate-limit) are both healthy outcomes; 5xx is an error.
    const formHealthy = check(formRes, {
      "inquiry returns 200 or 429": (r) => r.status === 200 || r.status === 429,
    });
    unexpectedErrors.add(!formHealthy);
  }

  sleep(0.25);
}
