# Logo sources

Every file in `public/logos/` and where it came from. All files were taken from npm packages (brand sites were not reachable from the build container), cleaned with a small script (kept `viewBox`; stripped scripts, event attributes, images, foreignObject, external hrefs, comments, metadata, titles; prefixed gradient, mask and clip ids with the slug; collapsed whitespace). Colors and shapes are unaltered. `salesforce.svg` also had its coordinates rounded to one decimal place to fit the 6 KB limit; a side-by-side render showed no visible change.

The CC0 license covers these drawings, not the trademarks. Permission to show each mark is tracked separately by `status` in `lib/logos.ts`, and none is cleared yet. Replace a file with the brand's own press-kit artwork whenever one is obtained.

Simple Icons files are a single path filled with the brand color listed in that package; they are used only for brands whose mark is one flat color and whose square mark is missing from SVG Logos.

| File | Source package | Icon | Version | License | Brand guidelines |
|---|---|---|---|---|---|
| `airtable.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `airtable` | 1.2.21 | CC0-1.0 | https://airtable.com/newsroom |
| `asana.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `asana-icon` | 1.2.21 | CC0-1.0 | https://asana.com/brand |
| `claude.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `claude-icon` | 1.2.21 | CC0-1.0 | https://www.anthropic.com/legal/trademark-guidelines |
| `clickup.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `clickup-icon` | 1.2.21 | CC0-1.0 | https://clickup.com/brand |
| `dropbox.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `dropbox` | 1.2.21 | CC0-1.0 | https://www.dropbox.com/branding |
| `gmail.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `google-gmail-2020` | 1.2.21 | CC0-1.0 | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ |
| `googleads.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `google-ads` | 1.2.21 | CC0-1.0 | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ |
| `googleanalytics.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `google-analytics` | 1.2.21 | CC0-1.0 | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ |
| `googlecalendar.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `google-calendar-2020` | 1.2.21 | CC0-1.0 | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ |
| `googledrive.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `google-drive-2020` | 1.2.21 | CC0-1.0 | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ |
| `greenhouse.svg` | simple-icons | `greenhouse`, fill #24A47F | 16.38.1 | CC0-1.0 | https://brand.greenhouse.io/brand-portal/p/5 |
| `hubspot.svg` | simple-icons | `hubspot`, fill #FF7A59 | 16.38.1 | CC0-1.0 | https://www.hubspot.com/style-guide |
| `intercom.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `intercom-icon` | 1.2.21 | CC0-1.0 | https://www.intercom.com/press |
| `meta.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `meta-icon` | 1.2.21 | CC0-1.0 | https://www.meta.com/brand/resources/meta/company-brand/ |
| `monday.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `monday-icon` | 1.2.21 | CC0-1.0 | https://monday.com/p/press-kit/ |
| `notion.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `notion-icon` | 1.2.21 | CC0-1.0 | https://notion.notion.site/Press-Kit-e8c2e63336f045f4ab2fb4a17b4bbd63 |
| `openai.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `openai-icon` | 1.2.21 | CC0-1.0 | https://openai.com/brand/ |
| `salesforce.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `salesforce` | 1.2.21 | CC0-1.0 | https://www.salesforce.com/company/legal/tmcusageguidelines/ |
| `shopify.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `shopify` | 1.2.21 | CC0-1.0 | https://www.shopify.com/brand-assets |
| `slack.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `slack-icon` | 1.2.21 | CC0-1.0 | https://slack.com/terms-of-service/slack-brand |
| `stripe.svg` | simple-icons | `stripe`, fill #635BFF | 16.38.1 | CC0-1.0 | https://stripe.com/legal/marks |
| `teams.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `microsoft-teams` | 1.2.21 | CC0-1.0 | https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx |
| `typeform.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `typeform-icon` | 1.2.21 | CC0-1.0 | https://www.typeform.com |
| `xero.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `xero` | 1.2.21 | CC0-1.0 | https://www.xero.com/uk/about/media/downloads |
| `zendesk.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `zendesk-icon` | 1.2.21 | CC0-1.0 | https://brandland.zendesk.com |
| `zoom.svg` | @iconify-json/logos (SVG Logos by Gil Barbara) | `zoom-icon` | 1.2.21 | CC0-1.0 | https://brand.zoom.us/usage-legal/ |
| `googlesheets.svg` | Wikimedia Commons | `Google Sheets 2020 Logo.svg` | n/a | Public domain | https://partnermarketinghub.withgoogle.com/brands/google/ |
| `outlook.svg` | @iconify-json/vscode-icons | `file-type-outlook` | 1.2.100 | MIT | https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx |
| `excel.svg` | @iconify-json/vscode-icons | `file-type-excel2` | 1.2.100 | MIT | https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx |
| `quickbooks.svg` | simple-icons, over a white disc | `quickbooks`, fill #2CA01C | 16.38.1 | CC0-1.0 | https://design.intuit.com/quickbooks/brand |

## Drawn on a light disc

`openai`, `typeform` and `zendesk` are near-black and unreadable on the dark `#133224` disc. Neither source set has a light or tile variant, so their entries carry `onLight: true` and the renderer should give them an ivory disc. `intercom` and `notion` use their own app-tile variants and read on the dark disc.

## No file

These apps show the name and glyph:

| App | Why |
|---|---|
| apollo | Not in either package. SVG Logos `apollostack` is Apollo GraphQL, a different company. |
| docusign, pandadoc, billcom, ramp | Not in either package. |
| googledocs | Not in SVG Logos; the Commons file could not be retrieved. |
| calendly | Not in SVG Logos; the current mark uses more than one color. |
| pipedrive | SVG Logos has only the wide wordmark; not in Simple Icons. |
| gusto | Both packages have only the wide wordmark. |
