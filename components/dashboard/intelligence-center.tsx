"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Save, RotateCcw, Check } from "lucide-react";
import { tradeData } from "@/lib/data/service";
import type { TradeFlow, TradeQuery } from "@/lib/data/types";
import { COUNTRY_BY_SLUG } from "@/lib/data/dataset";
import { fmtNum, fmtUsd } from "@/lib/format";
import { recordsToCsv, downloadCsv } from "@/lib/csv";
import { RankBars, TrendArea, Heatmap } from "@/components/charts";
import { FlowNetwork } from "@/components/flow-network";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { cn } from "@/lib/cn";

const REGIONS = ["South Asia", "East Asia", "Southeast Asia", "Middle East", "Europe", "North America", "Latin America", "Africa", "Oceania"];
const REGION_SHORT: Record<string, string> = {
  "South Asia": "S.Asia", "East Asia": "E.Asia", "Southeast Asia": "SE.Asia", "Middle East": "M.East",
  "Europe": "Europe", "North America": "N.Am", "Latin America": "L.Am", "Africa": "Africa", "Oceania": "Oceania",
};
const TABS = ["Overview", "Markets", "Companies", "Products", "Trade Records"] as const;
type Tab = (typeof TABS)[number];

export function IntelligenceCenter() {
  const [productGroup, setProductGroup] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [countrySlug, setCountrySlug] = useState("");
  const [flow, setFlow] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tab, setTab] = useState<Tab>("Overview");
  const [savedAt, setSavedAt] = useState(false);

  const productGroups = tradeData.getProductGroups();
  const hsCodes = tradeData.getHsCodes();
  const countries = tradeData.getCountries();

  const query = useMemo<TradeQuery>(() => ({
    productGroup: productGroup || undefined,
    hsCode: hsCode || undefined,
    countrySlug: countrySlug || undefined,
    flow: (flow || undefined) as TradeFlow | undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [productGroup, hsCode, countrySlug, flow, startDate, endDate]);

  // Restore saved workspace (localStorage demo feature).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vkd.workspace") || "null");
      if (saved) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setProductGroup(saved.productGroup || "");
        setHsCode(saved.hsCode || "");
        setCountrySlug(saved.countrySlug || "");
        setFlow(saved.flow || "");
        setStartDate(saved.startDate || "");
        setEndDate(saved.endDate || "");
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch { /* ignore */ }
  }, []);

  const records = useMemo(() => tradeData.queryRecords(query), [query]);
  const stats = useMemo(() => tradeData.getStats(query), [query]);
  const trend = useMemo(() => tradeData.getMonthlyTrend(query), [query]);
  const signals = useMemo(() => tradeData.getSignals(query), [query]);

  const topOrigins = useMemo(() => tradeData.getTopCountries(query, "origin"), [query]);
  const topDests = useMemo(() => tradeData.getTopCountries(query, "destination"), [query]);
  const topSuppliers = useMemo(() => tradeData.getTopCompanies(query, "exporter"), [query]);
  const topBuyers = useMemo(() => tradeData.getTopCompanies(query, "importer"), [query]);
  const topProducts = useMemo(() => tradeData.getTopProductGroups(query), [query]);

  // Region × region relationship matrix.
  const regionMatrix = useMemo(() => {
    const idx = Object.fromEntries(REGIONS.map((r, i) => [r, i]));
    const m = REGIONS.map(() => REGIONS.map(() => 0));
    for (const r of records) {
      const o = COUNTRY_BY_SLUG.get(r.originSlug)?.region;
      const d = COUNTRY_BY_SLUG.get(r.destinationSlug)?.region;
      if (o && d) m[idx[o]][idx[d]] += r.valueUsd;
    }
    const max = Math.max(...m.flat(), 1);
    return m.map((row) => row.map((v) => v / max));
  }, [records]);

  // Product group × destination region opportunity heatmap.
  const productMatrix = useMemo(() => {
    const ridx = Object.fromEntries(REGIONS.map((r, i) => [r, i]));
    const pidx = Object.fromEntries(productGroups.map((p, i) => [p, i]));
    const m = productGroups.map(() => REGIONS.map(() => 0));
    for (const r of records) {
      const d = COUNTRY_BY_SLUG.get(r.destinationSlug)?.region;
      if (d) m[pidx[r.productGroup]][ridx[d]] += r.valueUsd;
    }
    const max = Math.max(...m.flat(), 1);
    return m.map((row) => row.map((v) => v / max));
  }, [records, productGroups]);

  const saveWorkspace = () => {
    localStorage.setItem("vkd.workspace", JSON.stringify({ productGroup, hsCode, countrySlug, flow, startDate, endDate }));
    setSavedAt(true);
    setTimeout(() => setSavedAt(false), 1600);
  };
  const reset = () => {
    setProductGroup(""); setHsCode(""); setCountrySlug(""); setFlow(""); setStartDate(""); setEndDate("");
  };
  const exportView = () => downloadCsv("intelligence-center-view.csv", recordsToCsv(records));

  const shortRegions = REGIONS.map((r) => REGION_SHORT[r]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      {/* Intelligence Controls */}
      <div className="panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="eyebrow">Intelligence Controls</h2>
          <span className="mono text-[10px] text-dim">Save Workspace · Browser Demo Feature</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Control label="Product"><Select value={productGroup} onChange={setProductGroup} options={productGroups} /></Control>
          <Control label="HS Code"><Select value={hsCode} onChange={setHsCode} options={hsCodes.map((h) => ({ value: h.code, label: h.code }))} /></Control>
          <Control label="Country"><Select value={countrySlug} onChange={setCountrySlug} options={countries.map((c) => ({ value: c.slug, label: c.name }))} /></Control>
          <Control label="Trade Flow"><Select value={flow} onChange={setFlow} options={["Import", "Export"]} /></Control>
          <Control label="Start Date"><DateInput value={startDate} onChange={setStartDate} /></Control>
          <Control label="End Date"><DateInput value={endDate} onChange={setEndDate} /></Control>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={saveWorkspace} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-ink-soft hover:border-line-strong">
            {savedAt ? <Check size={14} className="text-up" /> : <Save size={14} />}{savedAt ? "Saved to browser" : "Save Workspace"}
          </button>
          <button onClick={exportView} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-ink-soft hover:border-line-strong">
            <Download size={14} /> Export View
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-ink-soft hover:border-line-strong">
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Market Signals Module (mandatory, above charts) */}
      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="eyebrow">Market Signals</h2>
          <Badge tone="demo" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {signals.slice(0, 6).map((s) => {
            const up = s.change >= 0;
            return (
              <div key={s.id} className="panel panel-hover p-3.5">
                <p className="mono text-[10px] uppercase tracking-wider text-signal">{s.kind}</p>
                <p className="mt-1 text-[13px] font-semibold text-ink">{s.productGroup}</p>
                <p className="mono text-[11px] text-muted">{tradeData.getCountry(s.countrySlug)?.name}</p>
                <p className={cn("mono mt-1.5 text-[13px] font-semibold", up ? "text-up" : "text-down")}>{up ? "+" : ""}{s.change}%</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market Overview KPIs */}
      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Trade Records" value={fmtNum(stats.recordCount)} sub="Demonstration Data" />
        <Stat label="Trade Value" value={fmtUsd(stats.totalValue)} sub="Demonstration Data" />
        <Stat label="Buyers" value={fmtNum(stats.buyers)} sub="Demonstration Data" />
        <Stat label="Suppliers" value={fmtNum(stats.suppliers)} sub="Demonstration Data" />
        <Stat label="Countries" value={fmtNum(stats.countries)} sub="Demonstration Data" />
        <Stat label="Avg Record Value" value={fmtUsd(stats.averageValue)} sub="Demonstration Data" />
      </section>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("relative px-4 py-2.5 text-[13px] font-medium transition-colors", tab === t ? "text-ink" : "text-muted hover:text-ink-soft")}>
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-signal" />}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "Overview" && (
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <Panel title="Monthly Trade Value" meta={<Badge tone="demo" />}><TrendArea data={trend} /></Panel>
            <Panel title="Top Destination Markets"><RankBars items={topDests} /></Panel>
            <Panel title="Leading Product Groups"><RankBars items={topProducts} accent="azure" /></Panel>
            <Panel title="Top Origin Markets"><RankBars items={topOrigins} accent="violet" /></Panel>
          </div>
        )}

        {tab === "Markets" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Top Origin Markets"><RankBars items={topOrigins} accent="violet" /></Panel>
            <Panel title="Top Destination Markets"><RankBars items={topDests} /></Panel>
            <Panel title="Country Relationship Matrix" meta={<span className="mono text-[11px] text-dim">origin → destination</span>} className="lg:col-span-2">
              <Heatmap rows={shortRegions} cols={shortRegions} values={regionMatrix} />
            </Panel>
            <Panel title="Trade Flow Network" meta={<Badge tone="demo" />} className="lg:col-span-2">
              <FlowNetwork records={records} />
            </Panel>
          </div>
        )}

        {tab === "Companies" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Top Suppliers" meta={<span className="mono text-[11px] text-dim">by value</span>}><RankBars items={topSuppliers} /></Panel>
            <Panel title="Top Buyers" meta={<span className="mono text-[11px] text-dim">by value</span>}><RankBars items={topBuyers} accent="azure" /></Panel>
            <Panel title="Supplier Concentration" className="lg:col-span-2">
              <ConcentrationNote items={topSuppliers} label="suppliers" />
            </Panel>
          </div>
        )}

        {tab === "Products" && (
          <div className="grid gap-4">
            <Panel title="Leading Product Groups"><RankBars items={topProducts} accent="azure" /></Panel>
            <Panel title="Opportunity Heatmap" meta={<span className="mono text-[11px] text-dim">product × destination region</span>}>
              <Heatmap rows={productGroups} cols={shortRegions} values={productMatrix} />
            </Panel>
          </div>
        )}

        {tab === "Trade Records" && (
          <Panel title={`Trade Records (${records.length})`} meta={<button onClick={exportView} className="mono inline-flex items-center gap-1 text-[12px] text-signal hover:underline"><Download size={12} /> Export</button>} bodyClassName="p-0">
            <div className="max-h-[560px] overflow-auto">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead className="sticky top-0 bg-panel">
                  <tr className="mono border-b border-line text-[10px] uppercase tracking-wider text-dim">
                    <th className="px-4 py-2.5 font-medium">Record</th>
                    <th className="px-4 py-2.5 font-medium">Product</th>
                    <th className="px-4 py-2.5 font-medium">Route</th>
                    <th className="px-4 py-2.5 font-medium">Flow</th>
                    <th className="px-4 py-2.5 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {records.slice(0, 80).map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.025]">
                      <td className="mono px-4 py-2.5 text-[12px] text-signal">{r.id}</td>
                      <td className="px-4 py-2.5 text-ink-soft">{r.productGroup}</td>
                      <td className="px-4 py-2.5 text-muted">{tradeData.getCountry(r.originSlug)?.iso} → {tradeData.getCountry(r.destinationSlug)?.iso}</td>
                      <td className="mono px-4 py-2.5 text-[11px] text-muted">{r.flow}</td>
                      <td className="mono px-4 py-2.5 text-right font-semibold text-ink">{fmtUsd(r.valueUsd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function ConcentrationNote({ items, label }: { items: { label: string; share: number }[]; label: string }) {
  const top3 = items.slice(0, 3).reduce((s, i) => s + i.share, 0);
  return (
    <div className="space-y-3">
      <p className="text-[14px] text-ink-soft">
        The top 3 {label} account for{" "}
        <span className="mono font-semibold text-signal">{Math.round(top3 * 100)}%</span> of value in
        the current view — a {top3 > 0.6 ? "highly concentrated" : top3 > 0.4 ? "moderately concentrated" : "fragmented"} market.
      </p>
      <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.05]">
        {items.slice(0, 6).map((i, idx) => (
          <div key={i.label} style={{ width: `${i.share * 100}%`, background: ["#34e0c8", "#5b9dff", "#a78bff", "#f5b945", "#3ddc91", "#ff6b78"][idx] }} title={`${i.label}: ${Math.round(i.share * 100)}%`} />
        ))}
      </div>
    </div>
  );
}

// ── Controls ─────────────────────────────────────────
function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted">{label}</span>
      {children}
    </label>
  );
}
type Opt = string | { value: string; label: string };
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: Opt[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-line bg-void/50 px-2.5 text-[13px] text-ink focus:border-signal/50 focus:outline-none">
      <option value="">All</option>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}
function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-line bg-void/50 px-2 text-[12px] text-ink [color-scheme:dark] focus:border-signal/50 focus:outline-none" />;
}
