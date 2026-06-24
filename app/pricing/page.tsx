import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Pricing",
  description: "A pricing framework for Vaskodigama — Explorer, Growth and Enterprise tiers.",
};

const DIMENSIONS = ["Research Depth", "Coverage Scope", "Data Access", "Support Level"];

const PLANS = [
  {
    name: "Explorer",
    tagline: "For individual research and evaluation.",
    featured: false,
    values: ["Core workspace & signals", "Selected markets", "Demonstration records", "Community support"],
    cta: "Start Exploring",
    href: "/signup",
  },
  {
    name: "Growth",
    tagline: "For teams running active market research.",
    featured: true,
    values: ["Full workspace & dashboards", "All regions & markets", "Expanded record access", "Priority support"],
    cta: "Request Demonstration",
    href: "/contact",
  },
  {
    name: "Enterprise",
    tagline: "For organisations standardising on trade intelligence.",
    featured: false,
    values: ["Advanced research tooling", "Global coverage & feeds", "API & enterprise data", "Dedicated support"],
    cta: "Talk to Us",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center lg:px-8">
          <p className="eyebrow mb-2">Pricing</p>
          <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A framework, not a price list
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] text-muted">
            Plans are differentiated by research depth, coverage scope, data
            access and support — pricing is determined during demonstration.
          </p>
          <div className="mt-4 flex justify-center"><Badge tone="preview">Pricing Framework · Indicative</Badge></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "panel relative flex flex-col p-6",
                plan.featured && "border-signal/40 ring-1 ring-signal/20"
              )}
            >
              {plan.featured && (
                <span className="mono absolute -top-2.5 left-6 rounded-full border border-signal/40 bg-signal/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-signal">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-ink">{plan.name}</h2>
              <p className="mt-1 text-[13px] text-muted">{plan.tagline}</p>

              <div className="mt-5 space-y-3 border-t border-line pt-5">
                {DIMENSIONS.map((dim, i) => (
                  <div key={dim}>
                    <p className="mono text-[10px] uppercase tracking-wider text-dim">{dim}</p>
                    <p className="mt-0.5 flex items-start gap-2 text-[13px] text-ink-soft">
                      <Check size={14} className="mt-0.5 shrink-0 text-signal" />
                      {plan.values[i]}
                    </p>
                  </div>
                ))}
              </div>

              <ButtonLink
                href={plan.href}
                variant={plan.featured ? "primary" : "secondary"}
                size="md"
                className="mt-6 w-full"
              >
                {plan.cta} <ArrowRight size={16} />
              </ButtonLink>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[13px] text-dim">
          No currency values are shown — this is a structural framework for a demonstration product.
        </p>
      </div>
    </div>
  );
}
