import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us what you want to understand — buyer, supplier, product, HS code, country or competitor research.",
};

export default function ContactPage() {
  return (
    <div className="bg-grid">
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <p className="eyebrow mb-2 text-center">Contact</p>
        <h1 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Tell us what you want to understand
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-muted">
          Describe your research question and we will show you how Vaskodigama
          would help you investigate it.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
