"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Download, Copy, Share2, ArrowRight, Check } from "lucide-react";
import type { TradeRecord } from "@/lib/data/types";
import { tradeData } from "@/lib/data/service";
import { fmtDate, fmtNum, fmtUsd, fmtPct } from "@/lib/format";
import { recordsToCsv, downloadCsv } from "@/lib/csv";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

function Copyable({ label, onClick, done, icon: Icon }: { label: string; onClick: () => void; done: boolean; icon: typeof Copy }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      {done ? <Check size={14} className="text-up" /> : <Icon size={14} />}
      {done ? "Copied" : label}
    </button>
  );
}

export function IntelligenceDrawer({ record, onClose }: { record: TradeRecord | null; onClose: () => void }) {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (record) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [record, onClose]);

  if (!record) return null;

  const exporter = tradeData.getCompany(record.exporterSlug);
  const importer = tradeData.getCompany(record.importerSlug);
  const origin = tradeData.getCountry(record.originSlug);
  const destination = tradeData.getCountry(record.destinationSlug);
  const signals = tradeData.getSignals({ productGroup: record.productGroup });

  const copyRef = () => {
    navigator.clipboard?.writeText(record.id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 1600);
  };
  const share = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/explore?q=${record.id}` : record.id;
    navigator.clipboard?.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 1600);
  };
  const exportCsv = () => downloadCsv(`${record.id}.csv`, recordsToCsv([record]));

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-void/70 backdrop-blur-sm animate-rise" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-surface shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-line p-5">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="mono text-[11px] uppercase tracking-wider text-signal">Intelligence Record</span>
              <Badge tone="sample" />
            </div>
            <h3 className="mono text-lg font-semibold text-ink">{record.id}</h3>
            <p className="mt-0.5 text-[13px] text-muted">{fmtDate(record.date)} · {record.port}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-white/5 hover:text-ink" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Summary */}
          <div className="panel p-4">
            <p className="text-[15px] font-semibold text-ink">{record.product}</p>
            <p className="mono mt-0.5 text-[12px] text-muted">{record.productGroup} · HS {record.hsCode}</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Mini label="Value" value={fmtUsd(record.valueUsd)} />
              <Mini label="Quantity" value={`${fmtNum(record.quantity)}`} sub={record.unit} />
              <Mini label="Flow" value={record.flow} />
            </div>
          </div>

          {/* Route */}
          <Section title="Trade Route">
            <div className="flex items-center gap-3">
              <Endpoint slug={origin?.slug} name={origin?.name} region={origin?.region} role="Origin" />
              <ArrowRight size={16} className="shrink-0 text-signal" />
              <Endpoint slug={destination?.slug} name={destination?.name} region={destination?.region} role="Destination" />
            </div>
          </Section>

          {/* Participants */}
          <Section title="Participants">
            <div className="space-y-2">
              <Participant role="Exporter / Supplier" name={exporter?.name} />
              <Participant role="Importer / Buyer" name={importer?.name} />
            </div>
          </Section>

          {/* Related signals */}
          {signals.length > 0 && (
            <Section title="Related Market Signals">
              <div className="space-y-2">
                {signals.slice(0, 3).map((s) => (
                  <div key={s.id} className="rounded-lg border border-line bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[10px] uppercase tracking-wider text-signal">{s.kind}</span>
                      <span className={cn("mono text-[12px] font-semibold", s.change >= 0 ? "text-up" : "text-down")}>{fmtPct(s.change)}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-soft/80">{s.summary}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-line p-4">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-md bg-signal px-3 py-2 text-[13px] font-semibold text-void transition-colors hover:bg-[#5be9d6]">
            <Download size={14} /> Export to CSV
          </button>
          <Copyable label="Copy Reference" onClick={copyRef} done={copiedRef} icon={Copy} />
          <Copyable label="Share Record" onClick={share} done={copiedShare} icon={Share2} />
        </footer>
      </aside>
    </div>
  );
}

function Mini({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="mono text-[10px] uppercase tracking-wider text-dim">{label}</p>
      <p className="mono mt-0.5 text-[15px] font-semibold text-ink">{value}</p>
      {sub && <p className="mono text-[10px] text-muted">{sub}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow mb-2.5">{title}</h4>
      {children}
    </div>
  );
}

function Endpoint({ slug, name, region, role }: { slug?: string; name?: string; region?: string; role: string }) {
  const body = (
    <>
      <p className="mono text-[10px] uppercase tracking-wider text-dim">{role}</p>
      <p className="mt-0.5 text-[14px] font-semibold text-ink">{name ?? "—"}</p>
      <p className="text-[11px] text-muted">{region}</p>
    </>
  );
  return slug ? (
    <Link href={`/countries/${slug}`} className="panel panel-hover flex-1 p-3">{body}</Link>
  ) : (
    <div className="panel flex-1 p-3">{body}</div>
  );
}

function Participant({ role, name }: { role: string; name?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2.5">
      <span className="mono text-[11px] uppercase tracking-wider text-dim">{role}</span>
      <span className="text-[13px] font-medium text-ink">{name ?? "—"}</span>
    </div>
  );
}
