import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { tradeData } from "@/lib/data/service";
import { fmtDate, fmtNum, fmtPct, fmtUsd } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { RankBars, TrendArea } from "@/components/charts";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return tradeData.getCountries().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/countries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const country = tradeData.getCountry(slug);
  return {
    title: country ? `${country.name} — Market Intelligence` : "Market",
    description: country
      ? `What is changing in ${country.name}: market movement, leading products, participants and signals.`
      : undefined,
  };
}

export default async function CountryPage({ params }: PageProps<"/countries/[slug]">) {
  const { slug } = await params;
  const country = tradeData.getCountry(slug);
  if (!country) notFound();

  const query = { countrySlug: slug };
  const stats = tradeData.getStats(query);
  const trend = tradeData.getMonthlyTrend(query);
  const topProducts = tradeData.getTopProductGroups(query);
  const topSuppliers = tradeData.getTopCompanies(query, "exporter");
  const topBuyers = tradeData.getTopCompanies(query, "importer");
  const signals = tradeData.getSignals({ countrySlug: slug });
  const records = tradeData.queryRecords({ countrySlug: slug, limit: 8 });
  const related = tradeData
    .getCountries()
    .filter((c) => c.region === country.region && c.slug !== slug)
    .slice(0, 4);

  const up = country.momentum >= 0;

  return (
    <div className="bg-grid">
      {/* Header */}
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link href="/countries" className="mono mb-3 inline-block text-[11px] uppercase tracking-wider text-dim hover:text-muted">
            ← Global Coverage Matrix
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="mono rounded-md border border-line bg-ink/[0.04] px-2 py-0.5 text-[12px] text-signal">{country.iso}</span>
                <span className="mono text-[12px] text-muted">{country.region}</span>
                <Badge tone="demo" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{country.name}</h1>
              <p className="mt-2 max-w-xl text-[15px] text-muted">
                What is changing in this market — movement, products, participants and opportunity signals.
              </p>
            </div>
            <ButtonLink href={`/explore?country=${slug}`} size="lg">
              Explore This Market <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
        {/* Market Snapshot */}
        <section>
          <h2 className="eyebrow mb-3">Market Snapshot</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Trade Records" value={fmtNum(stats.recordCount)} sub="Demonstration Data" />
            <Stat label="Trade Value" value={fmtUsd(stats.totalValue)} sub="Demonstration Data" />
            <Stat label="Suppliers" value={fmtNum(stats.suppliers)} sub="Active in view" />
            <Stat label="Buyers" value={fmtNum(stats.buyers)} sub="Active in view" />
            <div className="panel p-4">
              <p className="mono text-[10px] uppercase tracking-wider text-dim">Momentum</p>
              <p className={cn("mono mt-1.5 inline-flex items-center gap-1 text-2xl font-semibold", up ? "text-up" : "text-down")}>
                {up ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}{fmtPct(country.momentum)}
              </p>
              <p className="mt-1 text-[12px] text-muted">Opportunity indicator</p>
            </div>
          </div>
        </section>

        {/* Trade Movement + Products */}
        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Panel title="Trade Movement" meta={<Badge tone="demo" />}>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Gauge label="Import Activity" value={country.importIndex} color="var(--color-azure)" />
              <Gauge label="Export Activity" value={country.exportIndex} color="var(--color-signal)" />
            </div>
            <TrendArea data={trend} height={170} />
          </Panel>
          <Panel title="Leading Products" meta={<span className="mono text-[11px] text-dim">by value</span>}>
            <RankBars items={topProducts} accent="azure" />
          </Panel>
        </section>

        {/* Participants */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Leading Suppliers"><RankBars items={topSuppliers} /></Panel>
          <Panel title="Leading Buyers"><RankBars items={topBuyers} accent="violet" /></Panel>
        </section>

        {/* Country Signals */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="eyebrow">Country Signals</h2>
            <Badge tone="demo" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {signals.slice(0, 3).map((s) => {
              const sUp = s.change >= 0;
              return (
                <div key={s.id} className="panel p-4">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] uppercase tracking-wider text-signal">{s.kind}</span>
                    <span className={cn("mono text-[12px] font-semibold", sUp ? "text-up" : "text-down")}>{fmtPct(s.change)}</span>
                  </div>
                  <p className="mt-1 text-[14px] font-semibold text-ink">{s.productGroup}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft/80">{s.summary}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Records */}
        <Panel title="Recent Demonstration Records" meta={<Badge tone="sample" />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="mono border-b border-line text-[10px] uppercase tracking-wider text-dim">
                  <th className="px-4 py-2.5 font-medium">Record</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Product</th>
                  <th className="px-4 py-2.5 font-medium">Route</th>
                  <th className="px-4 py-2.5 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-ink/[0.025]">
                    <td className="mono px-4 py-2.5 text-[12px] text-signal">{r.id}</td>
                    <td className="mono px-4 py-2.5 text-muted">{fmtDate(r.date)}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{r.productGroup}</td>
                    <td className="px-4 py-2.5 text-muted">{tradeData.getCountry(r.originSlug)?.iso} → {tradeData.getCountry(r.destinationSlug)?.iso}</td>
                    <td className="mono px-4 py-2.5 text-right font-semibold text-ink">{fmtUsd(r.valueUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Related Markets */}
        <section>
          <h2 className="eyebrow mb-3">Related Markets · {country.region}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link key={c.slug} href={`/countries/${c.slug}`} className="panel panel-hover flex items-center justify-between p-4">
                <div>
                  <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                  <p className="mono text-[11px] text-dim">{c.iso}</p>
                </div>
                <ArrowRight size={15} className="text-dim" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="panel flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-xl font-semibold text-ink">Investigate {country.name} in the workspace</h3>
            <p className="mt-1 text-[14px] text-muted">Open the research workspace pre-filtered to this market.</p>
          </div>
          <ButtonLink href={`/explore?country=${slug}`} size="lg">Explore This Market <ArrowRight size={18} /></ButtonLink>
        </div>
      </div>
    </div>
  );
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="mono text-[10px] uppercase tracking-wider text-dim">{label}</span>
        <span className="mono text-[13px] font-semibold text-ink">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/[0.05]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
