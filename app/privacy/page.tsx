import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { pageMetadata } from "@/lib/seo";

const title = "Privacy";
const description =
  "Privacy notice for Temporant: what the booking audit form collects, how inquiries are delivered, and how to request deletion.";

export const metadata = pageMetadata({ title, description, path: "/privacy", noindex: true });

export default function PrivacyPage() {
  return (
    <LegalFrame
      path="/privacy"
      other={{ href: "/terms", label: "Terms" }}
      title="Privacy"
      lede="Effective November 2026. This notice explains what information Temporant collects on temporant.com, how it is used, and how to contact us about your data."
    >
      <LegalSection heading="Information this site collects">
        <p>
          The booking audit form collects your name, work email, company and role, which workflow
          you need, and your note about where bookings slip (including optional business type or
          weekly missed-lead estimates prefilled from the calculator). For spam and abuse protection,
          the form includes a hidden honeypot field, checks your network address in memory to enforce
          a short ten-minute rate limit, and when enabled verifies a Cloudflare Turnstile anti-bot
          token. Standard edge request metadata such as browser headers and pages visited are
          processed by Cloudflare to serve and protect the site.
        </p>
      </LegalSection>
      <LegalSection heading="How it is used">
        <p>
          Submissions are used only to review and reply to your inquiry, prevent automated spam or
          abuse, and operate the site. Temporant does not sell or rent visitor information.
        </p>
      </LegalSection>
      <LegalSection heading="Who receives it">
        <p>
          When configured, the inquiry route forwards your submission over HTTPS to our internal
          notification webhook and sends plain-text email through Resend using your work email as
          the reply-to address. If optional inquiry storage is enabled on Cloudflare D1, the
          submission is saved alongside its delivery status and, when a salt secret is configured,
          a daily rotating SHA-256 hash of the network address (never the raw IP address). When
          Turnstile is enabled, Cloudflare processes the challenge token to block automated bots.
        </p>
      </LegalSection>
      <LegalSection heading="How long it is kept">
        <p>
          In-memory rate-limit counters expire ten minutes after the request. Inquiry messages and
          any stored inquiry records are retained only as long as reasonably needed to reply, manage
          an active client relationship, or meet legal obligations, and are deleted earlier upon
          verified request.
        </p>
      </LegalSection>
      <LegalSection heading="Requests">
        <p>
          To request access to, correction of, or deletion of an inquiry you submitted, email
          inquiries@temporant.com from the address used on the form.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
