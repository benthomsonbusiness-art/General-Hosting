# General-Hosting

Valentini & Co. website.

## Brand files

Drop the final logo files in `/public/brand/`. Next.js serves files in `public/` from the site root, so `public/brand/logo.svg` is available at `/brand/logo.svg`.

| Path | Use |
| --- | --- |
| `public/brand/logo.svg` | Primary wordmark |
| `public/brand/logo-mark.svg` | Monogram, when it is a separate file |
| `public/brand/favicon.ico` | Browser icon |

Prefer SVG for the wordmark. Do not commit design-tool source files or temporary exports.

## Inquiry environment

`/api/inquire` reads two environment variables:

- `WEBHOOK_URL` — the n8n webhook URL that receives each inquiry.
- `RESEND_API_KEY` — the Resend API key used to send the inquiry email.

For local development, put them in `.env.local` at the project root. Next.js loads that file on the server. `.gitignore` already ignores `.env*`, so the values stay out of git.

```
WEBHOOK_URL=https://your-n8n-host/webhook/your-webhook-id
RESEND_API_KEY=re_your_key
```

Set the same names in the deployment environment. Restart `npm run dev` after changing `.env.local`.

## Legal pages

`/privacy` and `/terms` are placeholders. Replace the copy with counsel-approved text before publication.
