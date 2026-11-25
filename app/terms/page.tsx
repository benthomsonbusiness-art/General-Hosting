import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { trademarkLines, usedAppSlugs } from "@/lib/used-apps";

const title = "Terms";
const description = "Placeholder terms for the Valentini Systems website. Not in effect.";

export const metadata = pageMetadata({ title, description, path: "/terms", noindex: true });

export default function TermsPage() {
  // Only apps a workflow actually draws, one line per owner.
  const marks = trademarkLines(usedAppSlugs(WORKFLOWS));
  return (
    <LegalFrame
      path="/terms"
      other={{ href: "/privacy", label: "Privacy" }}
      title="Terms"
      lede="These terms will govern use of the Valentini Systems website. Until the approved text is published, this page creates no obligation on either side."
    >
      <LegalSection heading="Using this site">
        <p>
          Browsing the site does not create a client relationship, a retainer, or any other
          engagement with Valentini Systems
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
          Text and images on the site belong to Valentini Systems or its licensors. Third-party product names and
          logos belong to their owners. They appear only to show the kinds of tools a workflow can connect to, and
          their use does not mean any of those companies is a client, partner or sponsor. The final terms will state
          what visitors may do with the site&apos;s own materials.
        </p>
      </LegalSection>
      {marks.length > 0 ? (
        <LegalSection heading="Third-party marks">
          <ul className="space-y-1">
            {marks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </LegalSection>
      ) : null}
      <LegalSection heading="Liability">
        <p>
          The final terms will set the limits that apply to use of the site. This placeholder is
          not those terms.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          Valentini Systems will replace this page with the approved terms and may update them
          later. The published date will appear here.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions about these terms go through the inquiry form. The final text
          will be the governing contact statement.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
