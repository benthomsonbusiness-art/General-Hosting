import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { pageMetadata } from "@/lib/seo";

const title = "Privacy";
const description = "Placeholder privacy notice for the Temporant website. Not in effect.";

export const metadata = pageMetadata({ title, description, path: "/privacy", noindex: true });

export default function PrivacyPage() {
  return (
    <LegalFrame
      path="/privacy"
      other={{ href: "/terms", label: "Terms" }}
      title="Privacy"
      lede="This draft notice describes how the Temporant website handles inquiry submissions and technical request data while the final legal policy awaits owner approval."
    >
      <LegalSection heading="Information this site collects">
        <p>
          The booking audit form collects your name, work email, company and role, which workflow
          you need, and your note about where bookings slip (including optional business type or
          weekly missed-lead estimates prefilled from the calculator). For spam and abuse protection,
          the form also includes a hidden honeypot field, checks your network address in memory to
          enforce a short ten-minute rate limit, and when enabled verifies a Cloudflare Turnstile
          anti-bot token. Standard edge request metadata such as browser headers and pages visited
          are processed by Cloudflare to serve the site.
        </p>
      </LegalSection>
      <LegalSection heading="How it is used">
        <p>
          Submissions are used solely to review and reply to your inquiry, prevent automated spam
          or abuse, and operate the site. The published notice will set out the final governing
          statement of permitted uses.
        </p>
      </LegalSection>
      <LegalSection heading="Who receives it">
        <p>
          When configured, the inquiry route forwards your submission over HTTPS to a private
          webhook and sends plain-text notification email through Resend using your work email as
          the reply-to address. If optional inquiry storage is enabled on Cloudflare D1, the
          submission is saved alongside its delivery status and, when a salt secret is configured,
          a daily rotating SHA-256 hash of the network address (never the raw IP address). When
          Turnstile is enabled, Cloudflare processes the challenge token to block automated bots.
        </p>
      </LegalSection>
      <LegalSection heading="How long it is kept">
        <p>
          In-memory rate-limit counters expire ten minutes after the request. Retention schedules
          for email inbox threads, webhook logs, and optional D1 records are to be confirmed by the
          owner before final publication: [retention period].
        </p>
      </LegalSection>
      <LegalSection heading="Requests">
        <p>
          A dedicated address for access, correction, and deletion requests will be published with
          the final policy. Until then, contact inquiries@temporant.com or use the contact form.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
