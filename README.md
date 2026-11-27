# Temporant

Multi-page site for Temporant: booking automation for service businesses (missed call text-back, instant booking for web leads, appointment reminders). Read `HANDOFF.md` for status, decisions and deploy steps.

Copy lives in `content/`. `npm run check` validates it (also runs before every build), `npm test` covers the run state machine and the inquiry API. After changing a photo, run `node scripts/resize-images.mjs` and update `lib/image-loader.ts`. Node 22.18 or newer is required.

The photographs in `public/images/hero-architecture.jpg` and `public/images/systems-geometry.jpg` are 1280×720. They need replacements around 2560px wide before they are used full-bleed on large screens. Do not upscale the current files.

## Brand files

| Path | Use |
| --- | --- |
| `public/brand/logo.svg` | Large lockup: 7-bar gradient waveform over the lowercase wordmark. |
| `public/brand/logo-mark.svg` | Waveform mark alone, transparent background. |
| `app/icon.svg` | Favicon: a 5-bar waveform on a dark tile so it reads at 16px. |

## Inquiry

`POST /api/inquiry` accepts a JSON body.

Fields: `fullName`, `email`, `companyRole`, `practice`, `note`. `fax_number` is a honeypot.

The route requires `Content-Type: application/json`. It allows a missing `Origin`, a same-origin request, loopback hosts outside production only, the hosts in `SITE_HOSTS`, the exact hosts in `PREVIEW_HOSTS`, and extra hosts in the optional `ALLOWED_ORIGINS` env var (comma-separated hosts or origins). The in-memory limit is 5 submissions in 10 minutes, keyed on `cf-connecting-ip` and then `X-Forwarded-For`.

Environment variables:

- `WEBHOOK_URL` — receives each inquiry as JSON
- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM` — required when `RESEND_API_KEY` is set
- `IP_HASH_SALT` — optional, enables the durable rate check when D1 is bound
- `INQUIRY_TO` or `RESEND_TO` — required when `RESEND_API_KEY` is set

In development, a valid inquiry is accepted when no delivery channel is configured. In production, that case returns 503 and the form shows the inquiry email.

For local development, put the values in `.env.local`. `.gitignore` already ignores `.env*`.

## Legal pages

`/privacy` and `/terms` are placeholders and are not indexed. Replace the copy with counsel-approved text before publication.
