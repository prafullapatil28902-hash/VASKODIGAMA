"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { tradeData } from "@/lib/data/service";
import type { Country, Region } from "@/lib/data/types";
import { fmtPct } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const REGION_ORDER: Region[] = [
  "South Asia", "East Asia", "Southeast Asia", "Middle East", "Europe",
  "North America", "Latin America", "Africa", "Oceania",
];

export function CoverageMatrix() {
  const countries = tradeData.getCountries();
  const [region, setRegion] = useState<Region | "All">("All");
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const filtered = countries.filter((c) => {
      if (region !== "All" && c.region !== region) return false;
      if (kw && !c.name.toLowerCase().includes(kw) && !c.iso.toLowerCase().includes(kw)) return false;
      return true;
    });
    return REGION_ORDER.map((r) => ({ region: r, items: filtered.filter((c) => c.region === r) }))
      .filter((g) => g.items.length > 0);
  }, [countries, region, q]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      {/* filter bar */}
      <div className="panel sticky top-16 z-30 mb-6 flex flex-col gap-3 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-line bg-void/50 px-3.5">
          <Search size={15} className="text-dim" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search markets…"
            className="h-10 flex-1 bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Chip active={region === "All"} onClick={() => setRegion("All")}>All</Chip>
          {REGION_ORDER.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>
          ))}
        </div>
      </div>

      {grouped.map((g) => (
        <section key={g.region} className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-ink">{g.region}</h2>
            <span className="mono text-[11px] text-dim">{g.items.length} markets</span>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map((c) => <CountryCard key={c.slug} c={c} />)}
          </div>
        </section>
      ))}

      {grouped.length === 0 && (
        <div className="flex h-40 items-center justify-center text-sm text-muted">No markets match your search.</div>
      )}
    </div>
  );
}

function CountryCard({ c }: { c: Country }) {
  const up = c.momentum >= 0;
  return (
    <Link href={`/countries/${c.slug}`} className="panel panel-hover group flex flex-col p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-semibold text-ink">{c.name}</p>
          <p className="mono text-[11px] text-dim">{c.iso} · {c.region}</p>
        </div>
        <span className={cn("mono inline-flex items-center gap-0.5 text-[12px] font-semibold", up ? "text-up" : "text-down")}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{fmtPct(c.momentum)}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        <ActivityBar label="Import" value={c.importIndex} color="var(--color-azure)" />
        <ActivityBar label="Export" value={c.exportIndex} color="var(--color-signal)" />
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-wider text-dim">Top Group</p>
          <p className="text-[12px] text-ink-soft">{c.topProductGroup}</p>
        </div>
        <span className="mono text-[10px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
          Open <ArrowRight size={11} className="inline" />
        </span>
      </div>
      <div className="mt-3"><Badge tone="demo" /></div>
    </Link>
  );
}

function ActivityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="mono text-[10px] uppercase tracking-wider text-dim">{label}</span>
        <span className="mono text-[11px] text-muted">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "mono rounded-md px-2.5 py-1.5 text-[11px] transition-colors",
      active ? "bg-signal/15 text-signal" : "text-dim hover:text-muted"
    )}>{children}</button>
  );
}
