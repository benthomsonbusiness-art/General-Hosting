# v5 design: the operator's console

The site is a console for a back office. Dark, left-aligned, and exact. Pink (the `--gold` token) appears only where a person approves.

## Thesis

A small firm builds automations for owner-led companies. Code does the routine work, a model handles judgment under a schema, and a person approves anything that leaves. The client owns the code, the accounts, and the logs.

The memorable element is the approval key: a gold control in the interface, and the gold push key in the photographs. The only autoplaying motion is the packet on the home stations line, which runs only when motion is on and stops at that key.

## Color

Spectrum palette. Token names are kept from earlier palettes so classes stay stable.

| Token | Value | Role |
|---|---|---|
| `--obsidian` | `#0B0D1C` | Page background |
| `--well` | `#070814` | Console wells and logs |
| `--forest` | `#14172E` | Raised panels, header after scroll |
| `--card-top` / `--card-bottom` / `--card-hover` | `#1B1F3D` / `#10132A` / `#232850` | Card gradients |
| `--ivory` | `#F5F6FB` | Primary text on dark; reading surfaces |
| `--ink` | `#0B0D1C` | Text on ivory |
| `--slate` | `#4A4F6E` | Secondary text on ivory |
| `--ivory-64` | `#A6A9C2` | Secondary text on dark |
| `--gold` | `#F472B6` (pink) | Human approval only |
| `--gold-ink` | `#BE185D` | Approval on light surfaces |
| `--cyan` | `#6EA8FF` (blue) | AI and automation |
| `--cyan-ink` | `#1D4ED8` | AI on light surfaces |
| `--violet` / `--violet-hi` | `#8B5CF6` / `#C4B5FD` | Brand accents, button hover, chips |
| `--brand-gradient` | `#3B82F6` → `#8B5CF6` → `#EC4899` | Logo and wordmark "o" only |
| `--error-dark` / `--error-light` | `#E8A090` / `#8A2E1B` | Errors on dark / light |

The Temporant mark is a 7-bar voice waveform filled with the brand gradient (a phone call turning into a booking). The favicon uses 5 bars on a dark tile so it reads at 16px. The gradient is not used as text on light surfaces (it fails 4.5:1 there).

Primary actions are ivory on dark and obsidian on ivory, hovering to `--violet-hi`. They are not pink.

## Type

Mona Sans for everything a person reads. IBM Plex Mono for machine output only: log lines, payloads, field values, the deliverable tree, and the "App: Operation" line under each step in a workflow drawing (it names the API call the step makes). The wordmark is lowercase "temporant" in the sans, semibold, with a gradient "o".

| Style | Settings |
|---|---|
| Display | width 115, weight 620, tracking -0.03em, line-height 0.98, `clamp(2.6rem, 1.6rem + 4.2vw, 6rem)` |
| H2 | width 110, weight 600, tracking -0.02em, `clamp(1.9rem, 1.3rem + 2.2vw, 3.25rem)` |
| H3 | width 105, weight 600, 1.25 to 1.5rem |
| Body | width 100, weight 400, 17px / 1.6, measure 68ch |
| Lead | 20px / 1.5 |

Sentence case. No capital-letter labels. No italic word inside a headline.

## Layout and shape

12 columns, max width 84rem. Gutters 20px, 32px, and 48px. Everything is left-aligned. Sections change by background (obsidian, forest, ivory) or one hairline.

Console windows are 8px. Buttons and inputs are 6px. The Approve key is 6px with a 1px inner highlight. Everything else is square. One soft shadow sits under console windows.

Circles mark a tool or port in a workflow drawing. They are a shape, not a radius.

## Workflow drawings

One component draws every workflow: `components/workflow/flow/` (`layout.ts` is the pure, tested layout; `FlowDiagram.tsx` renders it on the server with no client JavaScript; `AppMark.tsx` draws an app's mark or a neutral glyph).

- The canvas is a console window: `--well`, an inner 1px `--line` hairline, 8px radius, a 16px dot grid at ivory 0.14 (none below 640px). It spans the full content width; text and links sit above or below it, never beside it.
- The spine runs left to right. Trigger, rule and result cards are 64px squares in `--forest` with a 0.16 ivory border and the app's mark. The AI card is 208 by 64 with its label inside and no glyph. The approval card is the Approve key: gold, 6px, a person-check glyph, and never a third-party mark.
- Under each card: the label (13px Mona Sans 500) and the mono line (12px Plex Mono, `--ivory-64`). Approval cards add the approver role.
- Tools hang below the AI card's Model and Tools ports, and below a rule step's Calls port, as 40px circles on dashed S-curves. Exits rise above the spine as dashed stubs with one muted line. Two outputs after one approval stack in the last column.
- Lines are ivory at 0.48, 1.5px. Pink (`--gold`) appears only on approval cards.
- The stage is horizontal when the canvas is at least 880px wide (up to five columns) or 1040px (six columns), and at least 680px for the compact variant used on home and the workflow index. Below that the same HTML becomes a vertical list. Nothing scrolls sideways.
- A caption under every drawing says it is an example with sample data and that product names and logos belong to their owners.

## Motion

One Motion switch in the header, labeled "Motion"; its checked state says whether it is on. The choice follows the system setting until the visitor changes it, then it is saved in `localStorage` and mirrored to `<html data-motion>`. Two things read it: the packet on the home stations line, which moves only when motion is on and stops at the approval key, and the workflow drawings, where hovering or focusing a step runs its dashed lines once (600ms, `--ease`). With motion off, the lines only brighten. With reduced motion, they brighten with no transition at all. Drawings have no ambient animation, and nothing draws itself on scroll. Other motion answers a click, a key, or a scroll position that changes meaning.

## Imagery

Photographs are precision hardware or empty workplaces. They are listed in `docs/image-shotlist.md`. Each image is used at most once on a page. The founder photograph is not generated.
