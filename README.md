# Valentini & Co.

Editorial site for Valentini & Co. The flagship practice is AI Workflow Consulting. Meta Ads Consulting and Strategy have their own pages.

The photographs in `public/images/hero-architecture.jpg` and `public/images/systems-geometry.jpg` are 1280×720. They need replacements around 2560px wide before they are used full-bleed on large screens. Do not upscale the current files.

## Brand files

| Path | Use |
| --- | --- |
| `public/brand/logo.svg` | Large lockup. Hairline gold stroke. |
| `public/brand/logo-mark.svg` | Large monogram. Hairline gold stroke. |
| `app/icon.svg` | Favicon. Thicker filled gold stroke so the split V reads at small sizes. The header uses the same filled stroke. |

## Inquiry

`POST /api/inquiry` accepts a JSON body.

Fields: `fullName`, `email`, `companyRole`, `practice`, `note`. `fax_number` is a honeypot.

The route requires `Content-Type: application/json`, allows a missing `Origin` or the site's own origin (plus localhost and `*.workers.dev`), and limits each IP to 5 submissions in 10 minutes.

Environment variables:

- `WEBHOOK_URL` — receives each inquiry as JSON
- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM` — required when `RESEND_API_KEY` is set
- `INQUIRY_TO` or `RESEND_TO` — required when `RESEND_API_KEY` is set

In development, a valid inquiry is accepted when no delivery channel is configured. In production, that case returns 503 and the form shows the inquiry email.

For local development, put the values in `.env.local`. `.gitignore` already ignores `.env*`.

## Legal pages

`/privacy` and `/terms` are placeholders and are not indexed. Replace the copy with counsel-approved text before publication.
