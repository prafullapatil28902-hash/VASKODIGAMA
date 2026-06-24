import type { Metadata } from "next";
import { ArrowRight, Ship, Factory, ShoppingCart, ClipboardList, Briefcase } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Research journeys for exporters, importers, manufacturers, procurement teams and consultants.",
};

const JOURNEYS = [
  {
    id: "exporters",
    icon: Ship,
    role: "Exporters",
    goal: "Where is demand growing?",
    workflow: ["Product Search", "Market Comparison", "Buyer Discovery", "Opportunity Signals"],
    cta: "Find Potential Buyers",
    href: "/explore?mode=Buyer",
  },
  {
    id: "importers",
    icon: ShoppingCart,
    role: "Importers",
    goal: "Where can sourcing options be found?",
    workflow: ["Supplier Discovery", "Country Comparison", "Trade Analysis", "Market Signals"],
    cta: "Explore Suppliers",
    href: "/explore?mode=Supplier",
  },
  {
    id: "manufacturers",
    icon: Factory,
    role: "Manufacturers",
    goal: "Which markets are changing?",
    workflow: ["Demand Mapping", "Market Comparison", "Product Movement", "Signal Monitoring"],
    cta: "Analyze Market Demand",
    href: "/dashboard",
  },
  {
    id: "procurement",
    icon: ClipboardList,
    role: "Procurement",
    goal: "How concentrated is supply?",
    workflow: ["Supplier Discovery", "Concentration Analysis", "Country Comparison", "Activity Review"],
    cta: "Review Supplier Activity",
    href: "/dashboard",
  },
  {
    id: "consultants",
    icon: Briefcase,
    role: "Consultants",
    goal: "Build evidence-backed market reports.",
    workflow: ["Research Workspace", "Market Signals", "Coverage Matrix", "Exportable Evidence"],
    cta: "Open Research Workspace",
    href: "/explore",
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <p className="eyebrow mb-2">Solutions</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Research journeys, not marketing blocks
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-muted">
            Each role enters the workspace with a different question. These are
            the paths Vaskodigama is built to support.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-5 px-5 py-12 lg:px-8">
        {JOURNEYS.map((j, i) => (
          <section key={j.id} id={j.id} className="panel scroll-mt-24 p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink/[0.03] text-signal">
                    <j.icon size={20} />
                  </span>
                  <div>
                    <p className="mono text-[11px] uppercase tracking-wider text-dim">For {j.role}</p>
                    <h2 className="text-xl font-semibold text-ink">{j.goal}</h2>
                  </div>
                </div>
                <ButtonLink href={j.href} size="md" className="mt-2">
                  {j.cta} <ArrowRight size={16} />
                </ButtonLink>
              </div>

              <div>
                <p className="eyebrow mb-3">Workflow</p>
                <div className="flex flex-wrap items-center gap-2">
                  {j.workflow.map((step, si) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className="rounded-lg border border-line bg-ink/[0.02] px-3 py-2 text-[13px] text-ink-soft">
                        <span className="mono mr-1.5 text-signal">{String(si + 1).padStart(2, "0")}</span>
                        {step}
                      </span>
                      {si < j.workflow.length - 1 && <ArrowRight size={14} className="text-dim" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {i === 0 && <div className="mt-5"><Badge tone="demo" /></div>}
          </section>
        ))}

        <div className="panel flex flex-col items-center gap-4 p-10 text-center">
          <SectionHeading title="Bring your research question" description="Open the workspace and start investigating — every journey begins there." className="flex-col items-center text-center" />
          <ButtonLink href="/explore" size="lg">Open Research Workspace <ArrowRight size={18} /></ButtonLink>
        </div>
      </div>
    </div>
  );
}
