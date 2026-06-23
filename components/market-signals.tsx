import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { tradeData } from "@/lib/data/service";
import type { MarketSignal, TradeQuery } from "@/lib/data/types";
import { fmtPct } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

function SignalCard({ signal }: { signal: MarketSignal }) {
  const country = tradeData.getCountry(signal.countrySlug);
  const up = signal.change >= 0;
  return (
    <div className="panel panel-hover group relative overflow-hidden p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="mono text-[10px] uppercase tracking-wider text-signal">{signal.kind}</span>
        <span
          className={cn(
            "mono inline-flex items-center gap-0.5 text-[13px] font-semibold",
            up ? "text-up" : "text-down"
          )}
        >
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {fmtPct(signal.change)}
        </span>
      </div>
      <p className="text-[15px] font-semibold text-ink">{signal.productGroup}</p>
      <p className="mono mt-0.5 text-[12px] text-muted">{country?.name ?? signal.countrySlug}</p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft/80">{signal.summary}</p>
      <div className="mt-3">
        <Badge tone="demo" />
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-signal/5 blur-2xl transition-opacity group-hover:bg-signal/10" />
    </div>
  );
}

export function MarketSignals({
  query,
  limit = 6,
  columns = "lg:grid-cols-3",
}: {
  query?: TradeQuery;
  limit?: number;
  columns?: string;
}) {
  const signals = tradeData.getSignals(query).slice(0, limit);
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", columns)}>
      {signals.map((s) => (
        <SignalCard key={s.id} signal={s} />
      ))}
    </div>
  );
}
