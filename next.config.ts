import type { NextConfig } from "next";
import { CANONICAL_SITE_URL, SITE_WWW } from "./lib/site";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // React's development debugger reconstructs stacks with eval. Production does not.
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // upgrade-insecure-requests turns the dev websocket into wss and breaks HMR.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // cacheComponents must stay off: with it on, pages return 500 on Cloudflare Workers via OpenNext.
  cacheComponents: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [480, 640, 800, 960, 1280, 1600, 1920, 2560],
    imageSizes: [240],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Code-level backup for www. Prefer a Cloudflare redirect rule once the domain exists.
      {
        source: "/:path*",
        has: [{ type: "host", value: SITE_WWW }],
        destination: `${CANONICAL_SITE_URL}/:path*`,
        permanent: true,
      },
      { source: "/approach", destination: "/how-it-works", permanent: true },
      { source: "/insights", destination: "/", permanent: true },
      { source: "/insights/:slug", destination: "/", permanent: true },
      {
        source: "/practices/meta-ads",
        destination: "/services",
        permanent: true,
      },
      // Sub-services and industries are sections of one page each.
      ...[
        "workflow-audit",
        "build-and-deploy",
        "retained-operations",
        "ai-agents-and-integrations",
        "reporting-and-data-pipelines",
      ].map((slug) => ({
        source: `/services/ai-workflow-automation/${slug}`,
        destination: "/how-it-works",
        permanent: true,
      })),
      { source: "/industries/:slug", destination: "/industries?industry=:slug", permanent: true },
      { source: "/practices/strategy", destination: "/services", permanent: true },
      { source: "/services/ai-workflow-automation", destination: "/services/instant-booking", permanent: true },
      { source: "/services/booking-automation", destination: "/services/instant-booking", permanent: true },
      { source: "/services/reminders-and-rescheduling", destination: "/services/reminders", permanent: true },
      { source: "/services/follow-up-and-reviews", destination: "/services", permanent: true },
      { source: "/services/meta-ads-consulting", destination: "/services", permanent: true },
      { source: "/services/strategy", destination: "/services", permanent: true },
      ...[
        "lead-triage",
        "proposal-ops",
        "client-onboarding",
        "daily-brief",
        "ap-intake",
        "support-routing",
        "meta-ads-reporting",
        "recruiting-screen",
        "marketplace-leads",
        "cancellation-waitlist",
        "estimate-follow-up",
        "review-requests",
        "maintenance-reminders",
      ].map((id) => ({ source: `/workflows/${id}`, destination: "/workflows", permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // TODO: When https://temporant.com is the live host, also send
          // Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
        ],
      },
    ];
  },
};

export default nextConfig;
