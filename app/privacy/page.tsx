import type { Metadata } from "next";
import { LegalFrame, LegalLinks, LegalSection } from "@/components/legal-frame";
import { INQUIRY_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Placeholder privacy notice for the Valentini & Co. website. Not in effect.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalFrame
      kicker="Privacy"
      title="Privacy"
      lede="This notice will explain how Valentini & Co. handles information collected on this website. The sections below mark what the final text must cover."
    >
      <LegalSection heading="Information this site may collect">
        <p>
          The inquiry form asks for a name, a work email, a company and role, a practice interest,
          and a description of the workflow. The final notice will also cover ordinary technical
          data such as browser type and pages visited. This placeholder does not publish those
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
          through Resend. The final notice will name each recipient and the reason they receive it.
        </p>
      </LegalSection>
      <LegalSection heading="How long it is kept">
        <p>
          The final notice will state how long submissions and logs are kept, and when they are
          deleted.
        </p>
      </LegalSection>
      <LegalSection heading="Requests">
        <p>
          A contact for access, correction, and deletion requests will be published with the final
          notice. Write to {INQUIRY_EMAIL} in the meantime. No retention rule is in
          effect on this draft.
        </p>
      </LegalSection>
      <LegalLinks
        links={[
          { href: "/terms", label: "Terms" },
          { href: "/", label: "Home" },
        ]}
      />
    </LegalFrame>
  );
}
