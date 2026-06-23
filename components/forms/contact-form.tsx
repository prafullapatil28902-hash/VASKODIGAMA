"use client";

import { useState } from "react";
import { z } from "zod";
import { Check, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  "Buyer Research", "Supplier Research", "Product Analysis", "HS Code Analysis",
  "Country Analysis", "Competitor Research", "Custom Data Requirement", "Pricing Inquiry", "Other",
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  organization: z.string().min(2, "Please enter your organization"),
  category: z.string().min(1, "Select a category"),
  message: z.string().min(12, "Tell us a little more (12+ characters)"),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    data.category = data.category ?? ""; // disabled placeholder may submit nothing
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as keyof Errors] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    // Mock submission only — nothing is sent anywhere.
    setDone(true);
  }

  if (done) {
    return (
      <div className="panel flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Check size={24} />
        </span>
        <h2 className="text-xl font-semibold text-ink">Request received</h2>
        <p className="max-w-md text-[14px] text-muted">
          This is a mock submission for the demonstration build — nothing was
          sent or stored. In a production version, our team would follow up on
          your research requirement.
        </p>
        <button onClick={() => setDone(false)} className="mono mt-1 text-[12px] text-signal hover:underline">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="panel space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} placeholder="Your full name" />
        <Field label="Email" name="email" type="email" error={errors.email} placeholder="you@company.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organization" name="organization" error={errors.organization} placeholder="Company or team" />
        <div>
          <Label>What do you want to understand?</Label>
          <select name="category" defaultValue="" className="h-10 w-full rounded-lg border border-line bg-void/50 px-3 text-[14px] text-ink focus:border-signal/50 focus:outline-none">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </div>
      </div>
      <div>
        <Label>Message</Label>
        <textarea name="message" rows={5} placeholder="Describe the market, product, participant or question you want to research…"
          className="w-full rounded-lg border border-line bg-void/50 px-3 py-2.5 text-[14px] text-ink placeholder:text-dim focus:border-signal/50 focus:outline-none" />
        {errors.message && <ErrorText>{errors.message}</ErrorText>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Badge tone="demo">Mock Submission</Badge>
        <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-[14px] font-semibold text-void transition-colors hover:bg-[#5be9d6]">
          <Send size={15} /> Send Request
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", error, placeholder }: { label: string; name: string; type?: string; error?: string; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input name={name} type={type} placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-void/50 px-3 text-[14px] text-ink placeholder:text-dim focus:border-signal/50 focus:outline-none" />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[12px] font-medium text-ink-soft">{children}</label>;
}
function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[12px] text-down">{children}</p>;
}
