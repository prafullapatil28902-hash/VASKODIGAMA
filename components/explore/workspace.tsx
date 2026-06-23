"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search, SlidersHorizontal, Table2, LayoutGrid, Telescope, Download,
  Save, RotateCcw, ArrowRight, Bookmark, Clock, ArrowUpRight, ArrowDownRight, X,
} from "lucide-react";
import { tradeData } from "@/lib/data/service";
import type { SearchMode, TradeFlow, TradeQuery, TradeRecord } from "@/lib/data/types";
import { fmtDate, fmtNum, fmtUsd, fmtPct } from "@/lib/format";
import { recordsToCsv, downloadCsv } from "@/lib/csv";
import { Badge } from "@/components/ui/badge";
import { IntelligenceDrawer } from "./intelligence-drawer";
import { cn } from "@/lib/cn";

const MODES: SearchMode[] = ["Product", "HS Code", "Company", "Buyer", "Supplier", "Importer", "Exporter", "Country"];
const REGIONS = ["South Asia", "East Asia", "Southeast Asia", "Middle East", "Europe", "North America", "Latin America", "Africa", "Oceania"];

type View = "research" | "table" | "card";

interface FilterState {
  mode: SearchMode;
  keyword: string;
  region: string;
  originSlug: string;
  destinationSlug: string;
  productGroup: string;
  hsCode: string;
  flow: string;
  minValue: string;
  maxValue: string;
  startDate: string;
  endDate: string;
}

const EMPTY: FilterState = {
  mode: "Product", keyword: "", region: "", originSlug: "", destinationSlug: "",
  productGroup: "", hsCode: "", flow: "", minValue: "", maxValue: "", startDate: "", endDate: "",
};

interface SavedSearch { name: string; state: FilterState }

export type WorkspaceInitial = Partial<FilterState>;

export function Workspace({ initial }: { initial: WorkspaceInitial }) {
  const [state, setState] = useState<FilterState>({ ...EMPTY, ...initial });
  const [view, setView] = useState<View>("research");
  const [selected, setSelected] = useState<TradeRecord | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const countries = tradeData.getCountries();
  const productGroups = tradeData.getProductGroups();
  const hsCodes = tradeData.getHsCodes();

  // localStorage-backed saved + recent searches (demo feature).
  useEffect(() => {
    // Hydrate browser-stored searches after mount (avoids SSR mismatch).
    try {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSaved(JSON.parse(localStorage.getItem("vkd.saved") || "[]"));
      setRecent(JSON.parse(localStorage.getItem("vkd.recent") || "[]"));
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch { /* ignore */ }
  }, []);

  const query = useMemo<TradeQuery>(() => ({
    mode: state.mode,
    keyword: state.keyword || undefined,
    region: (state.region || undefined) as TradeQuery["region"],
    originSlug: state.originSlug || undefined,
    destinationSlug: state.destinationSlug || undefined,
    productGroup: state.productGroup || undefined,
    hsCode: state.hsCode || undefined,
    flow: (state.flow || undefined) as TradeFlow | undefined,
    minValue: state.minValue ? Number(state.minValue) : undefined,
    maxValue: state.maxValue ? Number(state.maxValue) : undefined,
    startDate: state.startDate || undefined,
    endDate: state.endDate || undefined,
  }), [state]);

  const records = useMemo(() => tradeData.queryRecords(query), [query]);
  const stats = useMemo(() => tradeData.getStats(query), [query]);
  const signals = useMemo(() => tradeData.getSignals(query), [query]);

  const set = (patch: Partial<FilterState>) => setState((s) => ({ ...s, ...patch }));
  const reset = () => setState(EMPTY);

  const activeFilters = Object.entries(state).filter(
    ([k, v]) => v && k !== "mode" && k !== "keyword"
  ).length;

  const saveSearch = () => {
    const name = state.keyword || state.productGroup || `${state.mode} search`;
    const next = [{ name, state }, ...saved.filter((s) => s.name !== name)].slice(0, 8);
    setSaved(next);
    localStorage.setItem("vkd.saved", JSON.stringify(next));
  };

  const pushRecent = (kw: string) => {
    if (!kw.trim()) return;
    const next = [kw, ...recent.filter((r) => r !== kw)].slice(0, 6);
    setRecent(next);
    localStorage.setItem("vkd.recent", JSON.stringify(next));
  };

  const exportAll = () => downloadCsv("vaskodigama-records.csv", recordsToCsv(records));

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      {/* ── Workspace bar ─────────────────────────────── */}
      <div className="panel p-3">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => set({ mode: m })}
              className={cn(
                "mono rounded-md px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors",
                state.mode === m ? "bg-signal/15 text-signal" : "text-dim hover:text-muted"
              )}
            >
              {m}
            </button>
          ))}
          <span className="ml-auto"><Badge tone="demo" /></span>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-line bg-void/50 px-3.5">
            <Search size={16} className="text-dim" />
            <input
              value={state.keyword}
              onChange={(e) => set({ keyword: e.target.value })}
              onBlur={() => pushRecent(state.keyword)}
              placeholder={`Search ${state.mode.toLowerCase()}…`}
              className="h-11 flex-1 bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none"
            />
            {state.keyword && (
              <button onClick={() => set({ keyword: "" })} className="text-dim hover:text-ink"><X size={14} /></button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFiltersOpen((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-[13px] text-ink-soft hover:border-line-strong lg:hidden">
              <SlidersHorizontal size={14} /> Filters {activeFilters > 0 && <span className="mono text-signal">{activeFilters}</span>}
            </button>
            <button onClick={saveSearch} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-[13px] text-ink-soft hover:border-line-strong">
              <Save size={14} /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={exportAll} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-[13px] text-ink-soft hover:border-line-strong">
              <Download size={14} /> <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-[13px] text-ink-soft hover:border-line-strong">
              <RotateCcw size={14} /> <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {(recent.length > 0 || saved.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            {recent.length > 0 && (
              <span className="mono inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-dim"><Clock size={11} /> Recent</span>
            )}
            {recent.map((r) => (
              <button key={r} onClick={() => set({ keyword: r })} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted hover:text-ink">{r}</button>
            ))}
            {saved.length > 0 && (
              <span className="mono ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-dim"><Bookmark size={11} /> Saved</span>
            )}
            {saved.map((s) => (
              <button key={s.name} onClick={() => setState({ ...EMPTY, ...s.state })} className="rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-[11px] text-signal hover:bg-signal/20">{s.name}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body grid ─────────────────────────────────── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[244px_1fr] xl:grid-cols-[244px_1fr_288px]">
        {/* Filters */}
        <aside className={cn("space-y-4", filtersOpen ? "block" : "hidden lg:block")}>
          <FilterGroup title="Market Filters">
            <SelectField label="Region" value={state.region} onChange={(v) => set({ region: v })} options={REGIONS} />
            <SelectField label="Origin Country" value={state.originSlug} onChange={(v) => set({ originSlug: v })} options={countries.map((c) => ({ value: c.slug, label: c.name }))} />
            <SelectField label="Destination Country" value={state.destinationSlug} onChange={(v) => set({ destinationSlug: v })} options={countries.map((c) => ({ value: c.slug, label: c.name }))} />
          </FilterGroup>

          <FilterGroup title="Classification">
            <SelectField label="Product Category" value={state.productGroup} onChange={(v) => set({ productGroup: v })} options={productGroups} />
            <SelectField label="HS Code" value={state.hsCode} onChange={(v) => set({ hsCode: v })} options={hsCodes.map((h) => ({ value: h.code, label: `${h.code} · ${h.productGroup}` }))} />
          </FilterGroup>

          <FilterGroup title="Trade Filters">
            <SelectField label="Trade Flow" value={state.flow} onChange={(v) => set({ flow: v })} options={["Import", "Export"]} />
            <div className="grid grid-cols-2 gap-2">
              <NumField label="Min Value $" value={state.minValue} onChange={(v) => set({ minValue: v })} />
              <NumField label="Max Value $" value={state.maxValue} onChange={(v) => set({ maxValue: v })} />
            </div>
          </FilterGroup>

          <FilterGroup title="Time Filters">
            <div className="grid grid-cols-2 gap-2">
              <DateField label="Start" value={state.startDate} onChange={(v) => set({ startDate: v })} />
              <DateField label="End" value={state.endDate} onChange={(v) => set({ endDate: v })} />
            </div>
          </FilterGroup>
        </aside>

        {/* Results + insights */}
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat label="Records" value={fmtNum(stats.recordCount)} />
            <MiniStat label="Total Value" value={fmtUsd(stats.totalValue)} />
            <MiniStat label="Suppliers" value={fmtNum(stats.suppliers)} />
            <MiniStat label="Buyers" value={fmtNum(stats.buyers)} />
          </div>

          <div className="panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <h3 className="text-sm font-semibold text-ink">Trade Records <span className="mono ml-1 text-[12px] text-dim">{records.length}</span></h3>
              <div className="flex items-center gap-1 rounded-lg border border-line bg-void/40 p-0.5">
                <ViewBtn icon={Telescope} label="Research" active={view === "research"} onClick={() => setView("research")} />
                <ViewBtn icon={Table2} label="Table" active={view === "table"} onClick={() => setView("table")} />
                <ViewBtn icon={LayoutGrid} label="Card" active={view === "card"} onClick={() => setView("card")} />
              </div>
            </div>

            {records.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm text-muted">No records match the current filters.</p>
                <button onClick={reset} className="mono text-[12px] text-signal hover:underline">Reset filters</button>
              </div>
            ) : view === "research" ? (
              <ResearchView records={records.slice(0, 40)} onOpen={setSelected} />
            ) : view === "table" ? (
              <TableView records={records.slice(0, 60)} onOpen={setSelected} />
            ) : (
              <CardView records={records.slice(0, 36)} onOpen={setSelected} />
            )}

            {records.length > 40 && (
              <div className="border-t border-line px-4 py-3 text-center">
                <span className="mono text-[12px] text-dim">Showing top results · refine filters to narrow further</span>
              </div>
            )}
          </div>
        </div>

        {/* Market signals panel */}
        <aside className="space-y-3 xl:block">
          <div className="flex items-center justify-between">
            <h3 className="eyebrow">Market Signals</h3>
            <Badge tone="demo" />
          </div>
          {signals.slice(0, 5).map((s) => {
            const country = tradeData.getCountry(s.countrySlug);
            const up = s.change >= 0;
            return (
              <div key={s.id} className="panel panel-hover p-3.5">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] uppercase tracking-wider text-signal">{s.kind}</span>
                  <span className={cn("mono inline-flex items-center gap-0.5 text-[12px] font-semibold", up ? "text-up" : "text-down")}>
                    {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{fmtPct(s.change)}
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-semibold text-ink">{s.productGroup}</p>
                <p className="mono text-[11px] text-muted">{country?.name}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft/75">{s.summary}</p>
              </div>
            );
          })}
        </aside>
      </div>

      <IntelligenceDrawer record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ── Result views ────────────────────────────────────
function ResearchView({ records, onOpen }: { records: TradeRecord[]; onOpen: (r: TradeRecord) => void }) {
  return (
    <div className="divide-y divide-line">
      {records.map((r) => {
        const origin = tradeData.getCountry(r.originSlug);
        const dest = tradeData.getCountry(r.destinationSlug);
        const exporter = tradeData.getCompany(r.exporterSlug);
        const importer = tradeData.getCompany(r.importerSlug);
        return (
          <button key={r.id} onClick={() => onOpen(r)} className="group grid w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.025] md:grid-cols-[1.6fr_1.4fr_0.8fr]">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-ink">{r.product}</p>
              <p className="mono mt-0.5 text-[11px] text-dim">{r.productGroup} · HS {r.hsCode}</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <span className="truncate">{origin?.name}</span>
              <ArrowRight size={12} className="shrink-0 text-signal/70" />
              <span className="truncate">{dest?.name}</span>
              <span className="mono ml-2 hidden truncate text-[11px] text-dim lg:inline">{exporter?.name} → {importer?.name}</span>
            </div>
            <div className="flex items-center justify-between md:justify-end md:gap-3">
              <span className="mono text-[13px] font-semibold text-ink">{fmtUsd(r.valueUsd)}</span>
              <ArrowUpRight size={14} className="text-dim opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TableView({ records, onOpen }: { records: TradeRecord[]; onOpen: (r: TradeRecord) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead>
          <tr className="mono border-b border-line text-[10px] uppercase tracking-wider text-dim">
            <th className="px-4 py-2.5 font-medium">Record</th>
            <th className="px-4 py-2.5 font-medium">Date</th>
            <th className="px-4 py-2.5 font-medium">Product</th>
            <th className="px-4 py-2.5 font-medium">Route</th>
            <th className="px-4 py-2.5 font-medium">Flow</th>
            <th className="px-4 py-2.5 text-right font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {records.map((r) => (
            <tr key={r.id} onClick={() => onOpen(r)} className="cursor-pointer transition-colors hover:bg-white/[0.025]">
              <td className="mono px-4 py-2.5 text-[12px] text-signal">{r.id}</td>
              <td className="mono px-4 py-2.5 text-muted">{fmtDate(r.date)}</td>
              <td className="px-4 py-2.5"><span className="text-ink-soft">{r.productGroup}</span><span className="mono ml-1.5 text-[11px] text-dim">{r.hsCode}</span></td>
              <td className="px-4 py-2.5 text-muted">{tradeData.getCountry(r.originSlug)?.iso} → {tradeData.getCountry(r.destinationSlug)?.iso}</td>
              <td className="px-4 py-2.5"><span className="mono text-[11px] text-muted">{r.flow}</span></td>
              <td className="mono px-4 py-2.5 text-right font-semibold text-ink">{fmtUsd(r.valueUsd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ records, onOpen }: { records: TradeRecord[]; onOpen: (r: TradeRecord) => void }) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {records.map((r) => (
        <button key={r.id} onClick={() => onOpen(r)} className="panel panel-hover p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="mono text-[11px] text-signal">{r.id}</span>
            <span className="mono text-[11px] text-dim">{fmtDate(r.date)}</span>
          </div>
          <p className="mt-2 text-[14px] font-medium text-ink">{r.productGroup}</p>
          <p className="mono text-[11px] text-dim">HS {r.hsCode} · {r.flow}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] text-muted">{tradeData.getCountry(r.originSlug)?.iso} → {tradeData.getCountry(r.destinationSlug)?.iso}</span>
            <span className="mono text-[14px] font-semibold text-ink">{fmtUsd(r.valueUsd)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Field primitives ────────────────────────────────
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel p-4">
      <h4 className="eyebrow mb-3">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

type Opt = string | { value: string; label: string };
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Opt[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-line bg-void/50 px-2.5 text-[13px] text-ink focus:border-signal/50 focus:outline-none"
      >
        <option value="">All</option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder="—"
        className="h-9 w-full rounded-md border border-line bg-void/50 px-2.5 text-[13px] text-ink placeholder:text-dim focus:border-signal/50 focus:outline-none" />
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted">{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-line bg-void/50 px-2 text-[12px] text-ink [color-scheme:dark] focus:border-signal/50 focus:outline-none" />
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-3">
      <p className="mono text-[10px] uppercase tracking-wider text-dim">{label}</p>
      <p className="mono mt-1 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function ViewBtn({ icon: Icon, label, active, onClick }: { icon: typeof Table2; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors", active ? "bg-signal/15 text-signal" : "text-muted hover:text-ink")}>
      <Icon size={13} /> <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
