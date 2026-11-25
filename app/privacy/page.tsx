import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { pageMetadata } from "@/lib/seo";

const title = "Privacy";
const description = "Placeholder privacy notice for the Valentini & Co. website. Not in effect.";

export const metadata = pageMetadata({ title, description, path: "/privacy", noindex: true });

export default function PrivacyPage() {
  return (
    <LegalFrame
      path="/privacy"
      other={{ href: "/terms", label: "Terms" }}
      title="Privacy"
      lede="This notice will explain how Valentini & Co. handles information collected on this website. The sections below mark what the final text must cover."
    >
      <LegalSection heading="Information this site may collect">
        <p>
          The inquiry form asks for a name, a work email, a company and role, a practice interest,
          and a description of the workflow. The final notice will also cover ordinary technical
          data such as browser type and pages visited. The site saves one motion setting in your browser, and it is not sent anywhere. This placeholder does not publish those
          details as a policy.
        </p>
      </LegalSection>
      <LegalSection heading="How it is used">
        <p>
          Submissions are meant to be used to reply to an inquiry and to operate the site. The
          published notice will be the statement of permitted uses.
        </p>
      </LegalSection>
      <LegalSection heading="Who receives it">
        <p>
          When configured, the inquiry route can forward a submission to a webhook and send mail
          through Resend. If inquiry storage is switched on, the submission is also saved in a Cloudflare D1 database together with its delivery status and, when configured, a one-way hash of the network address that changes daily. The final notice will name each recipient and the reason they receive it.
        </p>
      </LegalSection>
      <LegalSection heading="How long it is kept">
        <p>
          The retention period for stored submissions is to be confirmed: [retention period]. The final notice will state how long submissions and logs are kept, and when they are
          deleted.
        </p>
      </LegalSection>
      <LegalSection heading="Requests">
        <p>
          A contact for access, correction, and deletion requests will be published with the final
          notice. Until then, use the inquiry form. No retention rule is in
          effect on this draft.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
