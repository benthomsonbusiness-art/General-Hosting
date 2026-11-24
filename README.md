# Valentini & Co.

Editorial site for Valentini & Co. The flagship practice is AI Workflow Consulting. Meta Ads Consulting and Strategy are active advisory practices with their own pages.

## Brand files

| Path | Use |
| --- | --- |
| `public/brand/logo.svg` | Stacked lockup: Split-V monogram and wordmark |
| `public/brand/logo-mark.svg` | Monogram only |
| `app/icon.svg` | Favicon, same monogram on forest |

## Inquiry

`POST /api/inquiry` and `POST /api/inquire` share one handler.

Fields: `fullName`, `email`, `companyRole`, `practice`, `note`. `fax_number` is a honeypot.

Environment variables, all optional for local and preview confirmation:

- `WEBHOOK_URL` — receives each inquiry as JSON
- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM` — required when `RESEND_API_KEY` is set
- `INQUIRY_TO` or `RESEND_TO` — required when `RESEND_API_KEY` is set

If no delivery channel is configured, a valid inquiry is still accepted so the confirmation state works.

For local development, put the values in `.env.local`. `.gitignore` already ignores `.env*`.

## Legal pages

`/privacy` and `/terms` are placeholders. Replace the copy with counsel-approved text before publication.
