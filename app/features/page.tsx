import type { Metadata } from "next";
import {
  Search, Radar, Compass, Network, Building2, Boxes, Hash, FileDown,
  Bookmark, Link2, Sparkles, BellRing, Plug, KeyRound, Database, Users,
  ShieldAlert, Contact, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features",
  description: "Demonstration capabilities available today, and planned capabilities on the roadmap.",
};

const DEMO = [
  { icon: Search, title: "Research Workspace", body: "Multi-mode search across products, companies, participants and countries." },
  { icon: Radar, title: "Global Intelligence Center", body: "Command-center dashboard with KPIs, signals and reactive charts." },
  { icon: Compass, title: "Coverage Matrix", body: "Compare 40 markets across regions by activity and momentum." },
  { icon: Network, title: "Country Intelligence", body: "Per-market movement, products, participants and signals." },
  { icon: Building2, title: "Buyer Discovery", body: "Surface buyers behind trade flows and trace their activity." },
  { icon: Building2, title: "Supplier Discovery", body: "Find suppliers by product, market and concentration." },
  { icon: Boxes, title: "Product Analysis", body: "Break trade down by product group with structured filters." },
  { icon: Hash, title: "HS Code Analysis", body: "Investigate classification-level trade activity." },
  { icon: FileDown, title: "CSV Export", body: "Export any record selection for offline analysis." },
  { icon: Bookmark, title: "Saved Searches", body: "Save and recall research configurations in your browser." },
  { icon: Link2, title: "Shareable URLs", body: "Share workspace state through URL parameters." },
];

const PLANNED = [
  { icon: Sparkles, title: "AI Summaries", body: "Natural-language synthesis of market activity and signals." },
  { icon: BellRing, title: "Trade Alerts", body: "Notifications when markets, products or participants shift." },
  { icon: Plug, title: "CRM Integrations", body: "Push discovered participants into your sales pipeline." },
  { icon: KeyRound, title: "API Access", body: "Programmatic access to the trade intelligence layer." },
  { icon: Database, title: "Enterprise Feeds", body: "High-volume, refreshed data feeds for teams." },
  { icon: Users, title: "Team Workspaces", body: "Shared research spaces with roles and collaboration." },
  { icon: ShieldAlert, title: "Risk Indicators", body: "Counterparty and concentration risk signals." },
  { icon: Contact, title: "Contact Discovery", body: "Decision-maker contact enrichment for participants." },
];

export default function FeaturesPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <p className="eyebrow mb-2">Features</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What works today, and what is planned
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-muted">
            Demonstration capabilities are live in this build. Planned
            capabilities are on the roadmap and clearly labelled.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-12 lg:px-8">
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-ink">Demonstration Capabilities</h2>
            <Badge tone="demo" dot />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO.map((f) => (
              <div key={f.title} className="panel panel-hover p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white/[0.03] text-signal">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-ink">Planned Capabilities</h2>
            <Badge tone="planned" dot />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLANNED.map((f) => (
              <div key={f.title} className="panel relative p-5 opacity-90">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber/20 bg-amber/5 text-amber">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{f.body}</p>
                <div className="mt-3"><Badge tone="planned" /></div>
              </div>
            ))}
          </div>
        </section>

        <div className="panel flex flex-col items-center gap-4 p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-xl font-semibold text-ink">Try the demonstration capabilities now</h3>
            <p className="mt-1 text-[14px] text-muted">No account required to explore the workspace.</p>
          </div>
          <ButtonLink href="/explore" size="lg">Open Research Workspace <ArrowRight size={18} /></ButtonLink>
        </div>
      </div>
    </div>
  );
}
