# HANDOFF — Valentini platform v2

Last updated: Nov 24, 2026 (ET) · Branch: `cursor/valentini-platform-v2` · Base: `1e42b44` (PR #4 head) · Agent: Claude Code
Build commit: `34782dd` (this file is committed after it)

## Status

- Milestone reached: M7 complete, M8 partly complete (see "Not done"). Work was finished under a time limit set by Ben.
- Build: lint ✅ · tsc ✅ · 51 unit tests ✅ · next build ✅ (44 pages static; only `/api/inquiry` is dynamic) · opennextjs-cloudflare build ✅ (1,324 KiB gzipped by `wrangler deploy --dry-run`; Free cap is 3 MiB)
- Deployed preview: not deployed — no Cloudflare credentials on this machine (`wrangler whoami` is logged out). Deploy pending.

## Done

- M0: deploy edits, OpenNext and wrangler config. `wrangler.jsonc` targets `valentini-next`, has no `account_id` (add it from `wrangler whoami` if needed).
- M1: tokens, type rebalance, mega-menu, mobile drawer, footer, CTA band, in-page index, search dialog.
- M2: `content/*` and `scripts/check-content.ts` (runs on prebuild).
- M3, M5: home, services hub, 3 services, 5 sub-services, industries hub and 6 pages, approach, about, contact, 404, error, legal.
- M4: `/workflows`, 8 `/workflows/[slug]`, home teaser. Run logic is a pure reducer in `lib/run-machine.ts` with unit tests.
- M6: insights hub with URL-synced filters, article template, 4 insights, `/search`, static `search-index.json`.
- M7: metadata, JSON-LD, sitemap, robots, redirects, D1 code path and migration.
- Carry-forward API fixes 1–3 (§14.1): loopback origins and X-Forwarded-Host are development only; www is allowed, indexable, and redirected to the bare host in `next.config.ts`; absolute URLs come from `SITE_URL`.

## Not done / next steps (in order)

1. Deploy to `valentini-next` (Sammy). Then check the preview with at most about 10 GETs and one POST (expect 503).
2. Open the PR into `cursor/valentini-editorial-site-7174` if it is not open yet. `gh` is not installed on this machine.
3. Screen-reader pass: VoiceOver or NVDA on Home, Workflows, Contact. Nobody has done this.
4. Screenshots are **not committed**. A full set (about 9 MB) was made locally and reviewed by eye, then left out of the repo.
5. Mobile LCP on service and sub-service heroes (see Known issues).
6. Copy read by Bruce, especially scope statements such as "we do not manage ads day to day" (Meta Ads FAQ), and the list of things each industry page says we won't automate.
7. Optional fifth insight, Turnstile, Workers Rate Limiting binding: not started.

## Decisions made (and why)

- Insight bodies are typed blocks, not MDX. MDX was not attempted: typed blocks add no dependency and the content check can read every string.
- Search: in-house scoring over a static JSON route. Meta copy must be 140–160 characters; the check enforces it.
- Images: custom loader (`lib/image-loader.ts`) to pre-sized WebP files, because the default optimizer needs a Cloudflare binding. Originals are kept and nothing is upscaled.
- `MotionRoot` now wraps only the visualizer (with LazyMotion), so content pages do not ship the animation engine. `reducedMotion="user"` is kept. Section reveals are a small CSS/observer component.
- Every human node is a gate, including the AP exception queue and the recruiting shortlist, with their own button labels.
- Low confidence ends a run as "Manual review". This is one status more than the prompt's list.
- `lib/inquiry.ts` was split: `inquiry-shared.ts` is the client-safe half.
- D1 `ip_hash` is stored only when `IP_HASH_SALT` is set, because a hash of an IP without a secret is reversible.
- Milestones M0–M7 landed in one build commit instead of one per milestone. This departs from §18.
- Article photos are hidden below 1024px. They are optional in the spec, and hiding them keeps mobile LCP on text.
- The workflow data is 42 KB, slightly over the prompt's "about 40 KB".

## Open decisions for Ben

1. Domain and mailbox. Default: placeholders in `lib/site.ts`.
2. Inquiry delivery (Resend or webhook). Default: none, so production returns 503.
3. Engagement model and timelines are PROPOSED in `content/engagements.ts`.
4. Ivory value. Default: `#F7F4EC`.
5. Small-size logo. Default: keep the tapered stroke.
6. Preview target. Default: new Worker `valentini-next`.
7. D1 and Turnstile. Default: D1 code path only, not provisioned; no Turnstile.
8. Legal entity name. Default: not printed.
9. Founder section. Default: none (empty slot in `app/about/page.tsx`).
10. Response-time promise. Default: none.
11. Photography: need 2560px versions and 4–6 more editorial photos. The same four photos repeat often.
12. PR target: the PR #4 branch, or a draft into `main`. Default: the PR #4 branch.

## Known issues / risks

- `og:image` and canonical URLs use valentiniandco.com, which does not resolve yet.
- `cf-connecting-ip` overwrite: **not verified.** Cloudflare's HTTP-headers page does not say what happens to a client-sent value, and the Error 1000 page only lists the header as a cause of a halted request. Test with one request and `wrangler tail` after deploy. If it can be spoofed, the in-memory limiter can be bypassed.
- Simulated mobile LCP is about 3.0 s on hero-photo pages (budget 2.5 s). Scores vary between runs on this laptop.
- Lighthouse SEO reads 66–69 locally. The only failing audit is `is-crawlable`, caused by the intentional noindex on non-production hosts.
- `npm audit`: 0 high or critical, 3 moderate, all in the dev-only OpenNext toolchain.
- **OneDrive:** the working copy is inside OneDrive, and `next build` started failing there with EPERM when it deletes `.next`. Final builds were made in a copy outside OneDrive. Move the clone out of OneDrive before building.
- Local production form testing needs `ALLOWED_ORIGINS=localhost`, since loopback origins are rejected in production.

## Verification log

- Unit tests (51): every gate holds against timers, Step and Start; reject, expire and low confidence stop before any send; API 200, 400, 403, 415, 422, 429, 502 and 503, honeypot, header injection.
- API on local `next start`: 415, 403 (evil and localhost), 422, honeypot 200, 503, 429 on the sixth request, `/api/inquire` 404.
- Local workerd (`opennextjs-cloudflare preview`): page types, sitemap, search index, image, 404, redirect, CSP and noindex headers all correct.
- Crawl (headless Chrome, 39 paths at 390/768/1280/1440): 0 console errors, 0 overflow, unique titles and descriptions, all og/twitter images present, 41 internal links resolve. axe-core WCAG 2.2 AA and best practices at 390 and 1440: 0 violations.
- Keyboard, scripted in headless Chrome: mega-menu, drawer, search, tabs, estimator, in-page index, gate focus (Approve → Reset), form errors and success. These are scripted checks, not a person using a screen reader.
- Reduced motion: no token, no reveals, Run uses step mode.
- Lighthouse (mobile, local): Accessibility 100, Best Practices 100 on 6 pages. Performance 84–100 across runs: Home 84–100, flagship 76–96, Workflows 100, industry 99, article 81–94, contact 100. First-load JS about 160 KB gzipped, plus about 50 KB of prefetch on pages that link to the explorer.

## How to run / deploy

- Node 22.18 or newer. `npm ci; npm run dev`
- `npm run check`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
- `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` (Worker: `valentini-next`)
- D1, optional: `npx wrangler d1 create valentini-inquiries`, uncomment the binding in `wrangler.jsonc`, then `npx wrangler d1 migrations apply valentini-inquiries --remote`. Query with `npx wrangler d1 execute valentini-inquiries --remote --command "SELECT created_at, practice, delivery_status FROM inquiries ORDER BY created_at DESC LIMIT 20"`
- Env vars (names only): WEBHOOK_URL, RESEND_API_KEY, RESEND_FROM, INQUIRY_TO, ALLOWED_ORIGINS (optional), IP_HASH_SALT (optional), INQUIRIES_DB binding (optional)
