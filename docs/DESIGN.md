# v5 design: the operator's console

The site is a console for a back office. Dark, left-aligned, and exact. Gold appears only where a person approves.

## Thesis

A small firm builds automations for owner-led companies. Code does the routine work, a model handles judgment under a schema, and a person approves anything that leaves. The client owns the code, the accounts, and the logs.

The memorable element is the approval key: a gold control in the interface, and the gold push key in the photographs. The only autoplaying motion is the home console, which runs one lead-triage sample and waits at that key.

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
| `--gold` | `#C5A869` | Approve control on dark |
| `--gold-ink` | `#7D6128` | Approve control on ivory |
| `--error-dark` | `#E8A090` | Errors on obsidian (about 8:1) |
| `--error-light` | `#8A2E1B` | Errors on ivory |

The logo mark keeps its gold stroke. That geometry is unchanged. Everywhere else, gold is the Approve key.

Primary actions are ivory on dark and obsidian on ivory. They are not gold.

## Type

Mona Sans for everything a person reads. IBM Plex Mono for machine output only: log lines, payloads, field values, and the deliverable tree. Cormorant Garamond and the ampersand subset stay inside the wordmark.

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

## Motion

One Motion switch in the header. The choice follows the system setting until the visitor changes it, then it is saved in `localStorage`. The home console autoplays only when motion is on, and it stops at the gate. Reduced motion shows the inbox item and waits for a step. Other motion answers a click, a key, or a scroll position that changes meaning.

## Imagery

Photographs are precision hardware or empty workplaces. They are listed in `docs/image-shotlist.md`. Each image is used at most once on a page. The founder photograph is not generated.
