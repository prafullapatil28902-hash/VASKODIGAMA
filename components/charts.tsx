import type { MonthlyPoint, RankedItem } from "@/lib/data/types";
import { fmtMonth, fmtUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

// All charts are hand-built SVG — no chart library. Pure render, safe in
// Server Components. Figures are demonstration data.

export function RankBars({ items, accent = "signal" }: { items: RankedItem[]; accent?: "signal" | "azure" | "violet" | "amber" }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const color = {
    signal: "var(--color-signal)",
    azure: "var(--color-azure)",
    violet: "var(--color-violet)",
    amber: "var(--color-amber)",
  }[accent];

  if (!items.length) return <Empty />;

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.slug ?? item.label} className="group">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="truncate text-[13px] text-ink-soft">{item.label}</span>
            <span className="mono shrink-0 text-[12px] text-muted">{fmtUsd(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                animationDelay: `${i * 60}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrendArea({ data, height = 200 }: { data: MonthlyPoint[]; height?: number }) {
  if (data.length < 2) return <Empty />;
  const w = 720;
  const h = height;
  const pad = { t: 16, r: 12, b: 26, l: 12 };
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const span = max - min || 1;

  const xy = data.map((d, i) => {
    const x = pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - (d.value - min) / span) * (h - pad.t - pad.b);
    return [x, y] as const;
  });

  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${xy[xy.length - 1][0].toFixed(1)} ${h - pad.b} L ${xy[0][0].toFixed(1)} ${h - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad.l} x2={w - pad.r} y1={pad.t + g * (h - pad.t - pad.b)} y2={pad.t + g * (h - pad.t - pad.b)} stroke="var(--color-line)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#trend-fill)" />
      <path d={line} fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {xy.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="var(--color-surface)" stroke="var(--color-signal)" strokeWidth="1.5" />
          {(i === 0 || i === data.length - 1 || i % 2 === 0) && (
            <text x={x} y={h - 8} textAnchor="middle" fontSize="10" className="mono" fill="var(--color-dim)">
              {fmtMonth(data[i].month)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** Opportunity heatmap — product groups × regions intensity grid. */
export function Heatmap({
  rows,
  cols,
  values,
}: {
  rows: string[];
  cols: string[];
  values: number[][]; // values[r][c] in 0..1
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid" style={{ gridTemplateColumns: `150px repeat(${cols.length}, 1fr)` }}>
          <div />
          {cols.map((c) => (
            <div key={c} className="mono px-1 pb-2 text-center text-[10px] uppercase tracking-wide text-dim">
              {c}
            </div>
          ))}
          {rows.map((row, r) => (
            <div key={row} className="contents">
              <div className="truncate py-1 pr-2 text-right text-[12px] text-ink-soft">{row}</div>
              {cols.map((c, ci) => {
                const v = values[r]?.[ci] ?? 0;
                return (
                  <div key={c} className="p-0.5">
                    <div
                      className="group relative flex h-9 items-center justify-center rounded-[5px] text-[10px] font-medium transition-transform hover:scale-[1.06]"
                      style={{
                        background: `color-mix(in srgb, var(--color-signal) ${Math.round((0.06 + v * 0.85) * 100)}%, transparent)`,
                        color: v > 0.5 ? "var(--color-on-signal)" : "var(--color-muted)",
                      }}
                      title={`${row} · ${c}: ${(v * 100).toFixed(0)} index`}
                    >
                      {Math.round(v * 100)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mini sparkline for cards. */
export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const w = 100;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / span) * h}`)
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-7 w-24", className)} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={up ? "var(--color-up)" : "var(--color-down)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Empty() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-line text-sm text-dim">
      No records match the current filters
    </div>
  );
}
