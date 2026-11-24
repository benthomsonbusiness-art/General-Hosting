import type { Metadata } from "next";
import { LegalFrame, LegalLinks, LegalSection } from "@/components/legal-frame";

export const metadata: Metadata = {
  title: { absolute: "Terms — Valentini & Co." },
  description:
    "Placeholder terms for the Valentini & Co. website. Not in effect.",
};

export default function TermsPage() {
  return (
    <LegalFrame
      kicker="Terms"
      title="Terms"
      lede="These terms will govern use of the Valentini & Co. website. Until the approved text is published, this page creates no obligation on either side."
    >
      <LegalSection heading="Using this site">
        <p>
          Browsing the site does not create a client relationship, a retainer,
          or any other engagement with Valentini & Co.
        </p>
      </LegalSection>
      <LegalSection heading="Inquiries">
        <p>
          Sending an inquiry asks for a conversation. It does not reserve
          services, form a contract, or require a response.
        </p>
      </LegalSection>
      <LegalSection heading="Materials on the site">
        <p>
          Text, marks, and images on the site belong to Valentini & Co. or
          their licensors. The final terms will state what visitors may do with
          them.
        </p>
      </LegalSection>
      <LegalSection heading="Liability">
        <p>
          The final terms will set the limits that apply to use of the site.
          This placeholder is not those terms.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          Valentini & Co. will replace this page with the approved terms and
          may update them later. The published date will appear here.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          A contact for questions about these terms will be published with the
          final text.
        </p>
      </LegalSection>
      <LegalLinks
        links={[
          { href: "/privacy", label: "Privacy" },
          { href: "/", label: "Back" },
        ]}
      />
    </LegalFrame>
  );
}
