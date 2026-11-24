# HANDOFF — Valentini platform v2

Last updated: Nov 24, 2026 (ET) · Branch: `cursor/valentini-platform-v2` · Base: `1e42b44` (PR #4 head) · Agent: Claude Code
Deployed commit: `ab5a4bb` (later commits change documentation only)

## v3 redesign (branch `cursor/valentini-platform-v3`, local, not pushed or deployed)

Ben asked for a whole redesign: minimalist, visual, interactive workflows. The sections below this one describe v2 and still apply to the API, deploy steps and open decisions.

- **Workflows:** each of the 8 has its own scene (`components/workflow/scenes/`), driven by the same reducer. Visitors pick a sample input (`content/scenarios.ts`), set the confidence threshold, edit the draft and decide at the gate. Step details moved to a side dialog.
- **Motion switch:** follows the OS setting by default; a visitor's choice is saved in localStorage only. Ben's laptop has reduced motion on, so v2 never animated for him.
- **Structure:** four menu links; six industry pages became one picker and five sub-services became sections of the flagship page. Old URLs redirect (308).
- **Departures from PROMPT.md, requested by Ben:** mega-menu, in-page indexes on service pages, service and industry filters on Insights, and the minimum word counts are gone. H2 is Cormorant. The "no three equal icon cards" rule is kept.
- **Words on screen at 1440px (v2 to v3):** Home 906 to 256, flagship 939 to 437, Approach 1,104 to 392, Workflows 616 to 199.
- **Checks:** 52 unit tests; crawl of every sitemap path at 4 widths with axe at 2; scripted behavior checks; Lighthouse Accessibility and Best Practices 100, Performance 95–100. Worker 1,303 KiB gzipped.
- **Known:** script transfer is about 210 KB per page including prefetch, over the 180 KB budget in PROMPT §16. Simulated mobile LCP on the flagship is 2.9 s. No screen-reader pass. No new photography. Less text may reduce search traffic. Screenshots in `docs/screenshots/v2` are the old design.
## Status

- Milestone reached: M8, except the human screen-reader pass and the business and audit reviews
- Build: lint ✅ · tsc ✅ · 51 unit tests ✅ · next build ✅ (44 pages static; only `/api/inquiry` is dynamic) · opennextjs-cloudflare build ✅ (1,324 KiB gzipped by `wrangler deploy --dry-run`; Free cap is 3 MiB)
- Deployed preview: https://valentini-next.benthomsonbusiness.workers.dev (new Worker `valentini-next`; `valentini-preview` was not touched) · PR: https://github.com/benthomsonbusiness-art/General-Hosting/pull/5

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

1. Bruce (business review) and Andy (audit) review the preview. Bruce should read scope statements such as "we do not manage ads day to day" (Meta Ads FAQ) and each industry page's "What we won't automate".
2. Screen-reader pass by a person: VoiceOver or NVDA on Home, Workflows, Contact. Nobody has done this. It is the one checklist item that could not be automated.
3. Ben answers the open decisions below. Inquiry delivery matters most: until a channel is configured, the form returns 503.
4. Optional, not started: fifth insight, Turnstile, Workers Rate Limiting binding. D1 is not provisioned.
## Decisions made (and why)

- Insight bodies are typed blocks, not MDX. MDX was not attempted: typed blocks add no dependency and the content check can read every string.
- Search: in-house scoring over a static JSON route. Meta copy must be 140–160 characters; the check enforces it.
- Images: custom loader (`lib/image-loader.ts`) to pre-sized WebP files, because the default optimizer needs a Cloudflare binding. Originals are kept and nothing is upscaled.
- `MotionRoot` now wraps only the visualizer (with LazyMotion), so content pages do not ship the animation engine. `reducedMotion="user"` is kept. Section reveals are a small CSS/observer component.
- Every human node is a gate, including the AP exception queue and the recruiting shortlist, with their own button labels.
- Low confidence ends a run as "Manual review". This is one status more than the prompt's list.
- `lib/inquiry.ts` was split: `inquiry-shared.ts` is the client-safe half.
- D1 `ip_hash` is stored only when `IP_HASH_SALT` is set, because a hash of an IP without a secret is reversible.
- The wordmark ampersand is a 0.9 KB subset of Cormorant Garamond Italic (`app/fonts`), so most pages skip the 39 KB italic file.
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
12. PR target: opened into the PR #4 branch. Say if a draft into `main` is preferred.

## Known issues / risks

- `og:image` and canonical URLs use valentiniandco.com, which does not resolve yet.
- `cf-connecting-ip`: **verified on the deployed Worker.** One request with a fake value was rejected by Cloudflare's edge with a 403 HTML page and never appeared in `wrangler tail`, so clients cannot spoof it there. `x-forwarded-for` is only a fallback when that header is absent.
- Mobile LCP on hero-photo pages: 1.8–1.9 s with throttling applied (inside the 2.5 s budget), 2.8–3.0 s in Lighthouse's simulated mode (over it). Simulation counts scripts that load before the image paints.
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
- Lighthouse (mobile, local, median of 3 after the font change): flagship 95, About 96, Home 100 simulated; 97–98 on all three with applied throttling. Before that change: Workflows 100, industry 99, contact 100, and Accessibility 100 and Best Practices 100 on 6 pages. First-load JS about 160 KB gzipped.
- Screenshots: `docs/screenshots/v2/` (12 pages at 4 widths, plus the waiting gate at 4 widths), downscaled, reduced motion on.
- Deployed preview: 10 GETs, all correct (one is the 308 redirect); one POST returned 503 with the CSP, X-Frame-Options and noindex headers; one browser load of /workflows ran to the gate, waited, and completed after a click with 0 console errors.

## How to run / deploy

- Node 22.18 or newer. `npm ci; npm run dev`
- `npm run check`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
- `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` (Worker: `valentini-next`)
- D1, optional: `npx wrangler d1 create valentini-inquiries`, uncomment the binding in `wrangler.jsonc`, then `npx wrangler d1 migrations apply valentini-inquiries --remote`. Query with `npx wrangler d1 execute valentini-inquiries --remote --command "SELECT created_at, practice, delivery_status FROM inquiries ORDER BY created_at DESC LIMIT 20"`
- Env vars (names only): WEBHOOK_URL, RESEND_API_KEY, RESEND_FROM, INQUIRY_TO, ALLOWED_ORIGINS (optional), IP_HASH_SALT (optional), INQUIRIES_DB binding (optional)
