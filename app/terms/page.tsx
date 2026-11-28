import { LegalFrame, LegalSection } from "@/components/layout/LegalFrame";
import { WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { trademarkLines, usedAppSlugs } from "@/lib/used-apps";

const title = "Terms";
const description =
  "Website terms of use for Temporant (temporant.com), covering site materials, booking audit inquiries, and third-party marks.";

export const metadata = pageMetadata({ title, description, path: "/terms", noindex: true });

export default function TermsPage() {
  const marks = trademarkLines(usedAppSlugs(WORKFLOWS));
  return (
    <LegalFrame
      path="/terms"
      other={{ href: "/privacy", label: "Privacy" }}
      title="Terms"
      lede="Effective November 2026. These terms govern your use of temporant.com."
    >
      <LegalSection heading="Using this site">
        <p>
          Browsing temporant.com is for informational purposes and does not create a client
          relationship, retainer, or service agreement with Temporant. Client work begins only
          under a separate written agreement signed by both sides.
        </p>
      </LegalSection>
      <LegalSection heading="Inquiries">
        <p>
          Requesting a booking audit asks for an introductory conversation. Submitting the form
          does not reserve capacity, form a contract, or obligate either party.
        </p>
      </LegalSection>
      <LegalSection heading="Materials on the site">
        <p>
          Text, graphics, and code created for this site belong to Temporant or its licensors.
          Third-party product names and logos belong to their respective owners. They appear solely
          to illustrate the software tools a workflow can connect with, and their appearance does
          not imply endorsement, partnership, or sponsorship.
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
      <LegalSection heading="No warranties and limitation of liability">
        <p>
          This website and example figures or calculators are provided as-is for general
          illustration without warranties of any kind. To the fullest extent permitted by law,
          Temporant is not liable for indirect or consequential damages arising from use of this
          website.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          Temporant may update these terms as the website evolves and will post the current
          effective date at the top of this page.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions about these terms can be sent to inquiries@temporant.com.
        </p>
      </LegalSection>
    </LegalFrame>
  );
}
