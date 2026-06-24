import Link from "next/link";
import { ArrowRight, Compass, Network, Radar, Search, Building2, Boxes } from "lucide-react";
import { Constellation } from "@/components/constellation";
import { HeroSearch } from "@/components/hero-search";
import { MarketSignals } from "@/components/market-signals";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading, Panel } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { RankBars, TrendArea } from "@/components/charts";
import { tradeData } from "@/lib/data/service";
import { fmtNum, fmtUsd } from "@/lib/format";

export default function HomePage() {
  const stats = tradeData.getStats();
  const trend = tradeData.getMonthlyTrend();
  const topCountries = tradeData.getTopCountries(undefined, "destination").slice(0, 5);
  const topProducts = tradeData.getTopProductGroups().slice(0, 5);

  return (
    <div className="bg-grid">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:py-20">
          <div className="animate-rise">
            <div className="mb-5 inline-flex items-center gap-2">
              <Badge tone="signal" dot>Trade Intelligence OS</Badge>
              <span className="mono text-[11px] text-dim">v1 · demonstration build</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Turn global trade records into{" "}
              <span className="text-gradient">clear business decisions</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
              Search products, companies, buyers, suppliers, countries and HS
              Codes through a structured intelligence workspace designed for
              global trade research — not a database, a research environment.
            </p>

            <div className="mt-7 max-w-xl">
              <HeroSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href="/explore" size="lg">
                Explore Trade Intelligence <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Request Demonstration
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="panel relative overflow-hidden p-3">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="mono text-[11px] uppercase tracking-widest text-muted">
                  Trade Intelligence Constellation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-up" />
                  <span className="mono text-[10px] text-dim">live signal feed</span>
                </span>
              </div>
              <Constellation className="aspect-[820/420] w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Market Signals ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Market Signals"
          title="What the market is doing right now"
          description="An analyst-style intelligence feed surfacing demand shifts, supply changes and emerging routes across markets."
        >
          <Badge tone="demo" />
        </SectionHeading>
        <div className="mt-8">
          <MarketSignals limit={6} />
        </div>
      </section>

      {/* ── Capabilities band ────────────────────────────── */}
      <section className="border-y border-line bg-void/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeading
            eyebrow="The workspace"
            title="An analyst workstation, not a results page"
            description="Every surface is built for investigation — discover participants, compare markets and trace product movement."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="panel panel-hover group flex flex-col gap-3 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink/[0.03] text-signal">
                  <c.icon size={18} />
                </span>
                <h3 className="text-[15px] font-semibold text-ink">{c.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted">{c.body}</p>
                <span className="mono mt-auto inline-flex items-center gap-1 pt-2 text-[11px] uppercase tracking-wider text-signal opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard preview ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Global Intelligence Center"
          title="A command center for market movement"
          description="Demonstration view of the dashboard — KPIs, monthly trade value and ranked markets, all reactive to your research filters."
        >
          <ButtonLink href="/dashboard" variant="secondary" size="sm">
            Open Intelligence Center <ArrowRight size={14} />
          </ButtonLink>
        </SectionHeading>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <Stat label="Trade Records" value={fmtNum(stats.recordCount)} sub="Demonstration Data" />
          <Stat label="Trade Value" value={fmtUsd(stats.totalValue)} sub="Demonstration Data" />
          <Stat label="Active Markets" value={fmtNum(stats.countries)} sub="Origin & destination" />
          <Stat label="Avg Record Value" value={fmtUsd(stats.averageValue)} sub="Across all records" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Panel
            title="Monthly Trade Value"
            meta={<Badge tone="demo" />}
          >
            <TrendArea data={trend} />
          </Panel>
          <div className="grid gap-4">
            <Panel title="Top Destination Markets" meta={<span className="mono text-[11px] text-dim">by value</span>}>
              <RankBars items={topCountries} />
            </Panel>
          </div>
        </div>
        <div className="mt-4">
          <Panel title="Leading Product Groups" meta={<span className="mono text-[11px] text-dim">by value</span>}>
            <RankBars items={topProducts} accent="azure" />
          </Panel>
        </div>
      </section>

      {/* ── Differentiation / CTA ────────────────────────── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="panel relative overflow-hidden p-10 text-center lg:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-40 bg-grid" />
            <div className="relative">
              <p className="eyebrow mb-3">Navigate global trade with clarity</p>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Open the research workspace and start investigating markets
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted">
                A structured intelligence environment for exporters, importers,
                manufacturers, procurement teams and consultants.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/explore" size="lg">
                  Explore Trade Intelligence <ArrowRight size={18} />
                </ButtonLink>
                <ButtonLink href="/solutions" variant="secondary" size="lg">
                  See solution journeys
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CAPS = [
  { title: "Research Workspace", body: "Search across product, HS code, company, buyer, supplier and country in one terminal-grade workspace.", href: "/explore", icon: Search },
  { title: "Global Intelligence Center", body: "A market command center with KPIs, trend analysis and intelligence feeds.", href: "/dashboard", icon: Radar },
  { title: "Global Coverage Matrix", body: "Compare 40 markets across regions by import, export and product participation.", href: "/countries", icon: Compass },
  { title: "Country Intelligence", body: "Understand what is changing in a market — movement, products, participants and signals.", href: "/countries", icon: Network },
  { title: "Buyer & Supplier Discovery", body: "Surface participants behind trade flows and trace their activity over time.", href: "/explore", icon: Building2 },
  { title: "Product & HS Code Analysis", body: "Break down trade by product group and classification with structured filters.", href: "/explore", icon: Boxes },
];
