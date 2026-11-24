import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { pageMetadata } from "@/lib/seo";
import { INQUIRY_EMAIL } from "@/lib/site";

const title = "Terms";
const description = "Placeholder terms for the Valentini & Co. website. Not in effect.";

export const metadata = pageMetadata({ title, description, path: "/terms", noindex: true });

export default function TermsPage() {
  return (
    <LegalFrame
      path="/terms"
      other={{ href: "/privacy", label: "Privacy" }}
      title="Terms"
      lede="These terms will govern use of the Valentini & Co. website. Until the approved text is published, this page creates no obligation on either side."
    >
      <LegalSection heading="Using this site">
        <p>
          Browsing the site does not create a client relationship, a retainer, or any other
          engagement with Valentini &amp; Co.
        </p>
      </LegalSection>
      <LegalSection heading="Inquiries">
        <p>
          Requesting a workflow audit or a consultation asks for a conversation. It does not reserve services, form
          a contract, or require a response.
        </p>
      </LegalSection>
      <LegalSection heading="Materials on the site">
        <p>
          Text, marks, and images on the site belong to Valentini &amp; Co. or their licensors. The
          final terms will state what visitors may do with them.
        </p>
      </LegalSection>
      <LegalSection heading="Liability">
        <p>
          The final terms will set the limits that apply to use of the site. This placeholder is
          not those terms.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          Valentini &amp; Co. will replace this page with the approved terms and may update them
          later. The published date will appear here.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions about these terms can be sent to {INQUIRY_EMAIL}. The final text
          will be the governing contact statement.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
