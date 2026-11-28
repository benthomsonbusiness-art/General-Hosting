# HANDOFF: High-tech optical console & bespoke signal graphics

Last updated: Nov 27, 2026 · Live branch: `main`

- **High-tech optical & machined hardware system (`app/globals.css`):** restored Temporant's signature warm ember stage lighting, precision engineering grid reticles (`.hero-stage`, `.hero-grid`), multi-layered volumetric console shadows, top-edge specular rim highlights, anodized coral-copper push-switches (`.copper-key`), tactile channel selector pills (`.tab-chip`), and illuminated range faders (`--range-pct`) while keeping zero AI copy slop or verbose subtext.
- **Hero Signal-to-Booking Console & Instrumented Goals (`HeroPhoneStage.tsx`, `app/page.tsx`):** built a 24-bar animated SVG spectrum waveform oscilloscope, matched calendar slot chips, interactive copper approval switch, 12-slot studio roster lock card, and 4 custom SVG telemetry micro-graphics (`80%`, `50%`, `5 hrs`, `100%`).
- **4-Beat Story Stage + Live Visual Artifacts (`FlowPlayer.tsx`):** added a connected 4-step signal progress rail and a dynamic right-hand `StoryArtifact` preview (incoming call waveform, calendar slot scanner, interactive phone approval gate, and confirmed class roster meter) synced with illuminated `FlowDiagram` nodes.
- **Triage Queue, Dual Oscilloscope Timeline, Ownership Vault, DJ Production Board & Calculator:** upgraded `QueuePanel.tsx`, the 6:15 p.m. `Without / With Temporant` SVG signal comparison, `RepoPanel.tsx`, `BookingPanel.tsx` (Blessinger Entertainment Thu–Sun DJ & event production board), `LeadLeakCalculator.tsx` (20-segment live recovery meter), `Stations.tsx`, `Graphics.tsx`, `ServiceArt.tsx`, and `Pickers.tsx`.

---

# HANDOFF: Gyms-first positioning, guided workflow story & anti-AI visual cleanup

Last updated: Nov 27, 2026 · Live branch: `main`

- **Gyms & multi-service positioning:** re-centered copy across Home, `/services`, `/workflows`, `/industries`, `/about`, `/contact`, and search around **gyms & niche fitness studios** first, alongside **recruiting & staffing**, **events & entertainment**, **landscaping**, and **plumbing & home services** (including recurring class and appointment reminders).
- **Anti-AI visual & subtext cleanup:** removed `<Sparkles>` / `<Bot>` icons, fake 3-dot window bars, uppercase micro-kickers, and duplicate disclaimers across `app/page.tsx`, `HeroPhoneStage`, `QueuePanel`, `RepoPanel`, `ScopeSteps`, `StepTrack`, and `IconCards`.
- **Guided 4-beat workflow story (`FlowPlayer`):** replaced the abstract timer bar with a step-by-step narrative (`1. Call missed -> 2. Reply drafted -> 3. You approve -> 4. Spot booked`) synced to `FlowDiagram` nodes and ending on a concrete booked result.
- **Blessinger DJ schedule & Missed Bookings calculator:** rebuilt `BookingPanel` around Blessinger Entertainment's actual event/DJ bookings, and updated `LeadLeakCalculator` to **Missed bookings** starting with **Gyms & studios**.

---

# HANDOFF: Ember palette

Last updated: Nov 27, 2026

- Replaced the blue/violet/pink Spectrum palette (owner found it too pink). Same token names. Logo gradient is now #FDE047, #F97316, #EF4444 on #140C08. `--gold` (approval) is red-orange #FF6B4A, `--cyan` (AI) is yellow #FDE047, `--violet`/`--violet-hi` are orange #F97316 / peach #FDBA74. Photos were desaturated to neutral charcoal; the approval key photo is copper.

---

# Earlier: Spectrum palette and waveform logo

Last updated: Nov 27, 2026

- **Logo:** a 7-bar voice waveform filled with one gradient (#3B82F6, #8B5CF6, #EC4899), plus the lowercase wordmark "temporant" with a gradient "o" (`.brand-gradient-text`). `components/brand/BrandMark.tsx`, `public/brand/logo.svg`, `public/brand/logo-mark.svg`. Favicon and apple icon use a 5-bar version on a dark tile so it reads at 16px. The share image `public/images/og-share.jpg` is the branded lockup.
- **Palette:** background #0B0D1C. Token names are unchanged: `--gold` is now pink #F472B6 (human approval only), `--cyan` is blue #6EA8FF (AI and automation). New: `--violet`, `--violet-hi`, `--brand-gradient`. Primary buttons hover to `--violet-hi`.
- The gradient fails 4.5:1 as text on light surfaces. Nothing uses a light wordmark today; if one is added, use a darker gradient (#1D4ED8, #6D28D9, #BE185D).

---

# Earlier: renamed to Temporant

Last updated: Nov 27, 2026

- **New name:** Temporant (from Latin *tempus*, time). Domain `temporant.com` (not registered yet), contact `inquiries@temporant.com`. All set in `lib/site.ts`; titles, JSON-LD, copy and tests follow it.
- **New logo:** amber rounded-square frame, geometric T with a white (navy on light) crossbar and a cyan stem angled like a clock hand. `components/brand/BrandMark.tsx`, `public/brand/logo.svg`, `public/brand/logo-mark.svg`, `app/icon.svg`. Wordmark TEMPORANT is now `font-sans`, semibold, wide tracking, amber O.
- **Unchanged on purpose:** Cloudflare worker `valentini-next`, preview hosts in `PREVIEW_HOSTS`, the webhook `source: "valentini-inquiry"` value (receivers may filter on it). Older sections below are historical.

---

# HANDOFF: three workflows, plain language

Last updated: Nov 27, 2026 · Live branch: `main`

- **Three workflows only:** missed-call-text-back, web-lead-booking, appointment-reminders. The other five redirect to /workflows.
- **Three services, one per workflow:** /services/missed-calls, /services/instant-booking, /services/reminders. Old service slugs redirect. Each service page shows its workflow drawing, what you get, setup steps, tools and questions.
- **Plain language everywhere:** short words, no trade or tech jargon (no CSR, dispatcher, runbook, repository, scoped). "Human in the loop" is kept for approval steps at Ben's request.
- **Removed:** SUB_SERVICES, Estimator, SubServiceScenes, StageDiagram.

---

# HANDOFF: pivot to booking automation for home service businesses

Last updated: Nov 26, 2026 · Live branch: `main` (Cloudflare Workers Builds production branch set to `main`)

- **Focus:** booking automation for home service businesses only. Meta ads, strategy and Insights are gone; old URLs redirect (`next.config.ts`).
- **Services:** `booking-automation` (flagship), `reminders-and-rescheduling`, `follow-up-and-reviews`. Each has a drawn graphic in `components/graphics/ServiceArt.tsx`.
- **Industries (trades):** hvac, plumbing, electrical, roofing, landscaping, cleaning. Photos in `components/content/Pickers.tsx` are reused brand photos, not trade photos.
- **Workflows:** missed-call-text-back, web-lead-booking, marketplace-leads, appointment-reminders, cancellation-waitlist, estimate-follow-up, review-requests, maintenance-reminders. Every customer text comes after a human step; old workflow URLs redirect to /workflows.
- **Apps added:** ServiceTitan, Jobber, Housecall Pro, CallRail, Angi (glyphs, no files); Twilio and Thumbtack (CC0 files, see `docs/logo-sources.md`).
- **Home figures** are design targets, labelled as such on the page.

---

# HANDOFF: Valentini Systems rename and workflow polish

Last updated: Nov 25, 2026 · Merged into `cursor/valentini-platform-v6` from `claude/peaceful-cannon-66jdb5`

- **Name and domain:** Valentini Systems, `valentinisystems.com` (`lib/site.ts`). Wordmark reads VALENTINI SYSTEMS; the V mark is unchanged. `public/brand/logo.svg` was redrawn with Cormorant Garamond 500 outlines. The ampersand font was removed.
- **Location:** Morristown, New Jersey (`SITE_LOCALITY`, About copy, JSON-LD).
- **Indexing:** the `X-Robots-Tag: noindex` header for non-production hosts was removed at Ben's request.
- **Workflow drawings:** every node and tool circle links to `/workflows/{id}#step-{node}` and the step opens on arrival (`OpenStepFromHash`). `SHOW_APP_LINE` and `SHOW_EXITS` in `layout.ts` are off: no "App: Operation" lines and no exit notes. No dot grid, no per-drawing caption. Cards, the approval key and a moving light on the spine (motion on only) are in `globals.css`.
- **Pages:** new `/testimonials` (reads `content/testimonials.ts`, empty state until real, permitted quotes exist). Services hub shows titles only. `HelpCta` puts a request button near the top of most pages; every page ends on the default closing band.
- **Header:** wordmark text hides between 1024 and 1279px so the five nav links fit.
- **Checks:** 155 tests, tsc, lint, build pass; no sideways scroll on 10 pages at 390, 768, 1024, 1280.

---

# HANDOFF — Valentini platform v6

Last updated: Nov 25, 2026 · Branch: `cursor/valentini-platform-v6` · Base: `cursor/valentini-platform-v5` (`584e19e`)

Spec: `/mnt/project-files/redesign/v6-flowcharts-logos-copy/VALENTINI-V6-PROMPT.md` (Claude project files) with appendices A to E.

- **Workflow drawings:** every workflow is drawn like Ben's reference: horizontal trigger, AI card with Model/Tools/Memory ports, rule cards with a Calls port, gold approval cards, results; dashed curves to round tool nodes; a label and an "App: Operation" line under every node; exits above the spine. Layout is `components/workflow/flow/layout.ts` (pure, tested); `FlowDiagram.tsx` renders it with no client JavaScript. Horizontal at 880px (5 columns) or 1040px (6), compact at 680px, vertical below. The old `Flowchart`, `ExampleFlow` and select box are gone; /workflows draws all eight.
- **Workflow data:** `content/workflows.ts` rebuilt. `tools`, `input`, `output`, `sampleMs` removed; nodes carry `app`, `attached`, `gate.channelApp`, `gate.operation`, `stopLabel`. Step tags are Trigger, Rule, AI, Approval, Result. The run engine and its tests are unchanged.
- **Logos:** Ben chose "Real logos now". `lib/logos.ts` has `LOGO_MODE = "all"`; 30 files in `public/logos/`, sources and licenses in `docs/logo-sources.md`. Every app's `status` is still `text-only` or `requested`: no brand has given written permission, and several brands' published rules require it. Set `LOGO_MODE = "cleared-only"` to fall back to names and icons. No file yet for Google Docs, Docusign, Calendly, BILL, Apollo, PandaDoc, Ramp, Pipedrive, Gusto.
- **Copy and fixes:** Appendix D copy applied; FAQ contrast fixed; form posts without JavaScript and shows a "not set up" notice until `NEXT_PUBLIC_INQUIRY_LIVE=1`; closing CTA on every page; nav, type scale, services, approach, about, industries fixes; trademark lines in the footer and /terms; `public/_headers` for caching.
- **Checks:** `npm run check`, `npm test` (155), `npx tsc --noEmit`, `npm run lint`, `npm run build` (33 pages) pass. 18 pages load with no sideways scroll at 1536, 1440, 1024, 768 and 390 wide.
- **Not done:** axe and Lighthouse on the deployed site; moving the Motion switch into the phone drawer; steps opened from a `#step-…` link don't expand by themselves.
- **Open for Ben:** engagement timelines (kept), founder photo (slot renders only when `public/images/about-founder.jpg` exists), inquiry delivery secrets.

---

# HANDOFF — Valentini platform v5

Last updated: Nov 25, 2026 (ET) · Branch: `cursor/valentini-platform-v5` · Base: `cursor/valentini-platform-v4` (`861307b`)

## v5 redesign (the operator's console)

The paper, pencil, and brass-stamp identity is gone. The site is a dark console. Gold is only the control a person presses to approve, plus the gold stroke that already lives in the logo.

- **What changed:** Tokens, Mona Sans, and IBM Plex Mono replace the v4 type and color system. Home is a working lead-triage console. Workflows, services, industries, approach, about, insights, contact, search, and legal pages use the same system. The hours estimator shows hours only. The inquiry form is the only contact channel. `lib/run-machine.ts` and `POST /api/inquiry` behavior are unchanged.
- **Commit:** `2845a42` is the redesign. The following commit is this note.
- **Deploy:** not deployed. `npx wrangler whoami` returned: "You are not authenticated. Please run `wrangler login`." No secrets were set. `valentini-preview` and `main` were not touched. The intended Worker is `valentini-next`.
- **Pull request:** https://github.com/benthomsonbusiness-art/General-Hosting/pull/7 into `cursor/valentini-platform-v4`. Do not merge without Ben.
- **Photographs:** 16 files in `public/images/`, prompts in `docs/image-shotlist.md`. None fell back to a coded panel. `about-founder.jpg` was not generated. About shows the name Ben Thomson and two sentences, with no portrait.
- **Checks that passed:** `npm run check`, `npm test` (53), `npm run lint`, `npx tsc --noEmit`, `npm run build` (33 pages). Removal patterns from the brief return nothing. Home no longer scrolls sideways at 390, 1440, or 1536.
- **Not verified here:** Cloudflare deploy, live headers, axe, Lighthouse, and a person using a keyboard or a screen reader. Review screenshots are outside the repo, one file per page at 1536×791, 1440×900, and 390×844, with motion off so the frames stay still.

---

# HANDOFF — Valentini platform v4

Last updated: Nov 25, 2026 (PT) · Branch: `cursor/valentini-platform-v4` · Base: `cursor/valentini-platform-v3` (`cd2292a`)

## v4 redesign (`paper becomes motion`)

Complete visual, typographic, photographic, and layout redesign built on Direction A ("paper becomes motion") while keeping all core logic, `lib/run-machine.ts`, `/api/inquiry`, tests, redirects, and SEO metadata intact.

- **Visual identity & typography:** Self-hosted Bricolage Grotesque (`opsz`, `wdth`, `wght`), IBM Plex Sans, and a coding mono via `next/font/google`, reserving Cormorant Garamond strictly for `BrandWordmark`. Dropped `#EDE7DA` (`bg-stone`) section bands, diagonal slanted polygons, and decorative gold; introduced `--paper` (`#FCFBF7`), `--moss` (`#244B38`), and a warm clay accent (`#A84B2E`), restricting `#C5A869` gold to human approval gates and primary buttons.
- **Photography and cutouts (`public/images/`, `docs/image-shotlist.md`):** All **30** custom assets (falling-paper hero, gate macro, green desk texture, paper fiber texture, 8 alpha PNG cutouts, all 8 workflow photos, all 6 vertical industry still lifes, and all 4 aligned table photos) are generated, resized into `public/images/sized/*.webp` (`157` files via `scripts/resize-images.mjs` + `sharp`), registered in `lib/image-loader.ts`, and wired across all pages.
- **Pages & interactive updates:** Rebuilt Home (`HomeOpening`, scroll-sorted lanes, 3 full-bleed workflow scenes, `HomePathSequence`), Workflows (`Stage`, `WorkflowExplorer` tactile image strips + ViewTransition morphs), Services hub & detail pages (`SubServiceScenes`, `StageDiagram` without slants, `Estimator` with a live responsive stacked-paper volume meter), Industries (`Pickers` 6 expanding vertical photographic columns preserving `?industry=` and arrow keys), How We Work (`ApproachStages` 4-state sticky walnut-table photo crossfade), About monograph, Insights magazine spread (`InsightExplorer` + ViewTransition cover morph into articles), and split-screen Contact. Deleted temporary `/lab` routes (`app/lab`, `components/lab`).
- **Verification (`cursor/valentini-platform-v4`):**
  - `npm run check`: passed (8 workflows, 8 services, 6 industries, 4 insights; zero banned copy across `app/`, `components/`, and `content/`).
  - `npm test`: 53/53 passed (0 failed, 0 skipped).
  - `npm run lint` & `npx tsc --noEmit`: clean after `npx next typegen`.
  - `npm run build`: clean (33/33 pages static/SSG; `/api/inquiry` dynamic).
  - `npx opennextjs-cloudflare build`: succeeded cleanly.
  - Live deployment verified on `valentini-next.benthomsonbusiness.workers.dev` via Cloudflare Workers Builds (`cursor/valentini-platform-v4`).

---

# HANDOFF — Valentini platform v2

Last updated: Nov 24, 2026 (ET) · Branch: `cursor/valentini-platform-v2` · Base: `1e42b44` (PR #4 head) · Agent: Claude Code
Deployed commit: `ab5a4bb` (later commits change documentation only)

## Workflow stage (after v3, same branch; pushed and deployed to `valentini-next`, deployed commit `51b00b8`)

Ben found the v3 player off and chose an approach based on Lindy's layout and Ramp's storytelling. Layout and pacing were borrowed; no artwork, copy or logos were.

- **Files:** `components/workflow/Stage.tsx` (window, status, gate), `WorkflowExplorer.tsx` (list, step caption, "Change the sample" panel), `HeroPlayer.tsx`, `hooks.ts` (`usePlayer`), `scenes/*`, `content/windows.ts`. `WorkflowPlayer`, `Track`, `MotionRoot` and the `framer-motion` dependency are gone.
- **Playback:** with motion on, a run starts by itself when the stage is in view, can be paused, and waits at every gate. It moves keyboard focus only after the visitor has acted on that run. With motion off, nothing autoplays and Start is step mode. The reducer in `lib/run-machine.ts` is unchanged.
- **Controls:** 11 at rest (about 22 in v3). Samples, threshold, step-through, expiry and step details sit behind one disclosure.
- **Checks (local):** 53 unit tests; 76 scripted behavior checks; axe on every workflow at start and at its stop, at 390 and 1440 (36 runs, 0 violations); crawl clean; Lighthouse Performance 96–100, Accessibility and Best Practices 100. Scripts 178–192 KB per page including prefetch. Fits without scrolling at 1536x791, 1440x900 and 1366x657.
- **Deployed checks:** 3 GETs correct (two pages, one 308 redirect; noindex and CSP present). One browser run of Accounts payable waited at both gates and finished after two clicks, with no third-party requests. No POST this time, because the API did not change.
- **Known:** on phones, Accounts payable grows about 50px at its first gate because its two button labels stack. The "Laptop fit" and 1366x657 notes below describe the previous player.

## v3 redesign (branch `cursor/valentini-platform-v3`, pushed and deployed to `valentini-next`)

The preview URL below now serves v3. PR #5 contains v2 only. v3 is PR #6 (https://github.com/benthomsonbusiness-art/General-Hosting/pull/6), based on the v2 branch, so merge #5 first. `valentini-preview` and `main` were not touched.

Ben asked for a whole redesign: minimalist, visual, interactive workflows. The sections below this one describe v2 and still apply to the API, deploy steps and open decisions.

- **Workflows:** each of the 8 has its own scene (`components/workflow/scenes/`), driven by the same reducer. Visitors pick a sample input (`content/scenarios.ts`), set the confidence threshold, edit the draft and decide at the gate. Step details moved to a side dialog.
- **Motion switch:** follows the OS setting by default; a visitor's choice is saved in localStorage only. Ben's laptop has reduced motion on, so v2 never animated for him.
- **Structure:** four menu links; six industry pages became one picker and five sub-services became sections of the flagship page. Old URLs redirect (308).
- **Departures from PROMPT.md, requested by Ben:** mega-menu, in-page indexes on service pages, service and industry filters on Insights, and the minimum word counts are gone. H2 is Cormorant. The "no three equal icon cards" rule is kept.
- **Words on screen at 1440px (v2 to v3):** Home 906 to 256, flagship 939 to 437, Approach 1,104 to 392, Workflows 616 to 199.
- **Checks:** 52 unit tests; crawl of every sitemap path at 4 widths with axe at 2; scripted behavior checks; Lighthouse Accessibility and Best Practices 100, Performance 95–100. Worker 1,303 KiB gzipped.
- **Laptop fit:** the `short` variant in `app/globals.css` tightens the player when the window is at least 1024px wide and at most 880px tall. Run and the gate buttons are on screen without scrolling for all 8 workflows at 1536x791, 1440x789 and 1440x900. At 1366x657 they need a scroll.
- **Deployed checks (first v3 deploy):** 6 GETs (pages, script, two 308 redirects, 404) and headers correct; one POST with an empty body returned 422 with field errors; one browser run reached the gate, waited, and finished after a click, with no site errors and no third-party requests. The laptop fit was deployed after that and checked with one GET.
- **Caching:** hashed files under `/_next/static` are served with `max-age=0, must-revalidate`, because there is no `public/_headers`. Not changed yet.
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
- Keyboard, scripted in headless Chrome: mega-menu, drawer, search, tabs, estimator, in-page index, gate focus (Approve, then Reset), form errors and success. These are scripted checks, not a person using a screen reader.
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
