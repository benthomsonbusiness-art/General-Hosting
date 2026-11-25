# v4 design inventory

Mapped from branch `cursor/valentini-platform-v4` at `861307b`, before the v5 console replaced it. Use this to find leftovers. v5 tokens are in `docs/DESIGN.md`.

## Color tokens

Defined in `app/globals.css` `:root` and exposed through `@theme inline`.

| Token | Hex / value | Role in v4 |
|---|---|---|
| `--forest` | `#133224` | Headings on light, buttons hover, scene fills |
| `--obsidian` | `#0B1F16` | Dark bands, footer, some heroes |
| `--moss` | `#244B38` | Secondary green, stage field "gold" |
| `--ivory` | `#F7F4EC` | Text on dark, light chips |
| `--paper` | `#FCFBF7` | Default page background |
| `--stone` | `#EDE7DA` | Chips, payload wells |
| warm clay accent | `#A84B2E` | Accent labels, since removed |
| `--gold` | `#C5A869` | Primary buttons and some gates |
| `--gold-ink` | `#7D6128` | Gold text and stamps on light |
| `--ink` | `#1A1E1B` | Body text on light |
| `--slate` | `#4F5752` | Secondary text on light |
| `--ivory-70` | `rgb(247 244 236 / 0.74)` | Secondary text on dark |
| `--rule-light` | `rgb(26 30 27 / 0.14)` | Hairline on light |
| `--rule-dark` | `rgb(247 244 236 / 0.18)` | Hairline on dark |
| `--error` | `#8A2E1B` | Form errors |

Surface colors (`--body`, `--muted`, `--heading`, `--btn-fill`) switch in `[data-surface="light"|"dark"]`. Light was the default. Primary buttons were gold on both surfaces.

## Type

Loaded in `app/layout.tsx`.

| Family | CSS variable | Use |
|---|---|---|
| Bricolage Grotesque | display-face variable, `--font-display` | Headlines, optical size and width |
| IBM Plex Sans | `--font-plex`, `--font-sans` | Body, also italic |
| A coding mono, since removed | `--font-mono` | Eyebrows, meta, some labels |
| Cormorant Garamond | `--font-cormorant`, `--font-wordmark` | Logo wordmark only |
| Cormorant italic subset | `--font-ampersand` | Ampersand in the wordmark |

Sizes in `app/globals.css`: `.display` up to 6.75rem, `.h1` up to 5.25rem, `.h2` up to 3.6rem, `.h3` 1.25–1.5rem, body `clamp(1rem, …, 1.0625rem)` / 1.65, `.lead` up to 1.3rem, `.eyebrow` 0.75rem in small capitals.

## Space, radius, shadow

- `.wrap` max-width `82rem`. Gutters `1.25rem`, `2rem` from 48rem, `3rem` from 80rem.
- `.band` padding `4rem`, `5.5rem`, `6.5rem` at those breakpoints.
- `--header-h` `4rem`, `4.5rem` from 64rem.
- Every `--radius-*` token is `0`.
- Shadows: stage window `0 28px 56px -20px rgb(11 31 22 / 0.55)`, paper cutout drop shadows, header scroll shadow. No shared elevation scale.

## Motion

- `--ease-paper`: `cubic-bezier(0.22, 1, 0.36, 1)`.
- `.reveal-pending` / `.reveal-done` (`components/util/Reveal.tsx`): fade and rise. Unused by pages at v4 head, classes remain.
- `.zoom` scale 1.03. The old arrow link class appended an arrow glyph.
- Lab float keyframes drifted decorative pieces. Paper cutout filters added drop shadows.
- Scene classes: `.stage-fill`, `.stage-spin`, `.scene-rise`, `.scene-word`, `.scene-open`, `.scene-dot`, `.sx`, `.scene-mark`, `.scene-stamp`, `.scene-draw`, `.scene-tile`, `.scene-scan`. Gated by `[data-motion="on"]`.
- `short` variant: `(min-width: 64rem) and (max-height: 55rem)` tightens the workflow stage.
- Motion switches: header, mobile drawer, footer, and each workflow stage (`components/util/MotionSwitch.tsx`, `components/workflow/Stage.tsx`).

## Repeated components

| Pattern | Where |
|---|---|
| `SiteHeader`, `SiteFooter` | `components/layout/` |
| `Section`, `Container` | `components/layout/Section.tsx` |
| `CtaBand` | `components/layout/CtaBand.tsx` (defined, not mounted) |
| `BrandMark`, `BrandWordmark` | `components/brand/BrandMark.tsx` |
| `HomeOpening`, `HomePathSequence` | `components/home/` |
| `Stage`, `WorkflowExplorer`, `HeroPlayer` | `components/workflow/` |
| `ApproachStages`, `Estimator`, `IndustryPicker` | `components/content/` |
| Eyebrow in small capitals | about 59 label treatments |
| Arrow link class | about 29 uses |

## Imagery

Originals in `public/images/`, widths in `lib/image-loader.ts`, WebP in `public/images/sized/`. The v4 set was paper still lifes: workflow photos, industry photos, approach photos, cutout pngs, a green desk texture, a paper fiber texture, a falling-paper hero, and a gate macro. Shot list: `docs/image-shotlist.md`.
