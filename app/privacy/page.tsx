import type { Metadata } from "next";
import { LegalFrame, LegalLinks, LegalSection } from "@/components/legal-frame";

export const metadata: Metadata = {
  title: { absolute: "Privacy — Valentini & Co." },
  description:
    "Placeholder privacy notice for the Valentini & Co. website. Not in effect.",
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
          The final notice will describe information submitted through the
          inquiry form, and ordinary technical data such as browser type and
          pages visited. This placeholder does not list those fields.
        </p>
      </LegalSection>
      <LegalSection heading="How it is used">
        <p>
          Submissions are meant to be used to respond to an inquiry and to
          operate the site. The published notice will be the statement of
          permitted uses.
        </p>
      </LegalSection>
      <LegalSection heading="Who receives it">
        <p>
          The inquiry route can forward a submission to an n8n webhook and send
          mail through Resend. The final notice will name each recipient and
          the reason they receive it.
        </p>
      </LegalSection>
      <LegalSection heading="How long it is kept">
        <p>
          The final notice will state how long submissions and logs are kept,
          and when they are deleted.
        </p>
      </LegalSection>
      <LegalSection heading="Requests">
        <p>
          A contact for access, correction, and deletion requests will be
          published with the final notice. No address is in effect on this
          draft.
        </p>
      </LegalSection>
      <LegalLinks
        links={[
          { href: "/terms", label: "Terms" },
          { href: "/", label: "Back" },
        ]}
      />
    </LegalFrame>
  );
}
