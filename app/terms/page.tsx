import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Terms",
  description: "Draft terms for the Vaskodigama demonstration product. Requires legal review.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Terms of Use"
      intro="Draft Legal Content — placeholder text for a demonstration product. These terms are illustrative, reference no jurisdiction, and have not been reviewed by counsel."
      sections={[
        { heading: "Demonstration Product", body: "Vaskodigama, as presented in this build, is a demonstration of a trade intelligence interface. It is provided for evaluation and illustration only, without warranty of any kind." },
        { heading: "No Reliance", body: "Nothing in this build constitutes commercial, trade, legal or financial advice. All data is demonstration data and must not be relied upon for real decisions." },
        { heading: "Acceptable Use", body: "You agree to use the demonstration in a lawful manner and not to misrepresent the demonstration data as real trade records." },
        { heading: "Intellectual Property", body: "The Vaskodigama name, interface and visual identity shown here are part of the demonstration. Production licensing terms would be defined separately." },
        { heading: "Availability", body: "The demonstration may change or be withdrawn at any time. No uptime or continuity commitment is made for this build." },
        { heading: "Governing Terms", body: "Production terms — including governing law, liability and dispute resolution — are intentionally omitted and must be drafted with qualified legal counsel before any commercial release." },
      ]}
    />
  );
}
