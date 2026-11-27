# v5 design: the operator's console

The site is a console for a back office. Dark, left-aligned, and exact. Gold appears only where a person approves.

## Thesis

A small firm builds automations for owner-led companies. Code does the routine work, a model handles judgment under a schema, and a person approves anything that leaves. The client owns the code, the accounts, and the logs.

The memorable element is the approval key: a gold control in the interface, and the gold push key in the photographs. The only autoplaying motion is the packet on the home stations line, which runs only when motion is on and stops at that key.

## Color

| Token | Value | Role |
|---|---|---|
| `--obsidian` | `#0B1F16` | Page background |
| `--well` | `#07140E` | Console wells and logs |
| `--forest` | `#133224` | Raised panels, header after scroll |
| `--ivory` | `#F7F4EC` | Primary text on dark; reading surfaces |
| `--ink` | `#1A1E1B` | Text on ivory |
| `--slate` | `#4F5752` | Secondary text on ivory |
| `--ivory-64` | `rgb(247 244 236 / 0.64)` | Secondary text on dark (about 7:1 on obsidian) |
| `--line` | `rgb(247 244 236 / 0.10)` | Hairline on dark |
| `--line-light` | `rgb(26 30 27 / 0.12)` | Hairline on ivory |
| `--gold` | `#C5A869` | Approval node on dark |
| `--gold-ink` | `#7D6128` | Approval node on ivory |
| `--error-dark` | `#E8A090` | Errors on obsidian (about 8:1) |
| `--error-light` | `#8A2E1B` | Errors on ivory |

The Temporant mark is an amber (#FFB547) rounded-square frame around a geometric T: ink crossbar (#F4F5FA on dark, #0E1024 on light) and a cyan (#38D6C4) stem that leans like a clock hand. Elsewhere, gold marks the approval node in a workflow drawing and the person station.

Primary actions are ivory on dark and obsidian on ivory. They are not gold.

## Type

Mona Sans for everything a person reads. IBM Plex Mono for machine output only: log lines, payloads, field values, the deliverable tree, and the "App: Operation" line under each step in a workflow drawing (it names the API call the step makes). The TEMPORANT wordmark is set in the sans (semibold, wide tracking) with an amber O.

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
- Lines are ivory at 0.48, 1.5px. Gold appears only on approval cards.
- The stage is horizontal when the canvas is at least 880px wide (up to five columns) or 1040px (six columns), and at least 680px for the compact variant used on home and the workflow index. Below that the same HTML becomes a vertical list. Nothing scrolls sideways.
- A caption under every drawing says it is an example with sample data and that product names and logos belong to their owners.

## Motion

One Motion switch in the header, labeled "Motion"; its checked state says whether it is on. The choice follows the system setting until the visitor changes it, then it is saved in `localStorage` and mirrored to `<html data-motion>`. Two things read it: the packet on the home stations line, which moves only when motion is on and stops at the approval key, and the workflow drawings, where hovering or focusing a step runs its dashed lines once (600ms, `--ease`). With motion off, the lines only brighten. With reduced motion, they brighten with no transition at all. Drawings have no ambient animation, and nothing draws itself on scroll. Other motion answers a click, a key, or a scroll position that changes meaning.

## Imagery

Photographs are precision hardware or empty workplaces. They are listed in `docs/image-shotlist.md`. Each image is used at most once on a page. The founder photograph is not generated.
