import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Draft privacy notice for the Vaskodigama demonstration product. Requires legal review.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Privacy Notice"
      intro="Draft Legal Content — placeholder text for a demonstration product. No real personal data is collected or processed by this build, and the content below has not been reviewed by counsel."
      sections={[
        { heading: "Scope", body: "This draft notice describes, in placeholder terms, how a future production version of Vaskodigama might handle information. In the current demonstration build, no account is real and no personal data is stored on a server." },
        { heading: "Demonstration Data", body: "All companies, records, figures and signals shown in the product are deterministic demonstration data. They do not represent real organisations, shipments or commercial activity." },
        { heading: "Browser Storage", body: "Saved searches and saved workspaces are stored locally in your browser for convenience. They are never transmitted to a server in this demonstration build and can be cleared by clearing your browser storage." },
        { heading: "Forms", body: "Contact, sign-in and sign-up forms in this build perform mock submissions for demonstration only. Submitted values are not sent anywhere or retained." },
        { heading: "Future Processing", body: "A production release would describe lawful bases, data retention, sub-processors and user rights. Those details are intentionally omitted here and must be drafted with qualified legal counsel." },
        { heading: "Contact", body: "Questions about this draft notice can be raised through the contact page. Responses in this build are illustrative only." },
      ]}
    />
  );
}
