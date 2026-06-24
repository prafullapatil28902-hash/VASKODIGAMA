import { tradeData } from "@/lib/data/service";
import type { TradeRecord } from "@/lib/data/types";

// Trade Flow Network — an abstract node/edge field of the strongest
// origin→destination lanes. Not a world map; positions are the dataset's
// abstract coordinates. Pure SVG, Server-Component safe.
export function FlowNetwork({ records, max = 14 }: { records: TradeRecord[]; max?: number }) {
  const lanes = new Map<string, { from: string; to: string; value: number }>();
  for (const r of records) {
    if (r.originSlug === r.destinationSlug) continue;
    const key = `${r.originSlug}>${r.destinationSlug}`;
    const cur = lanes.get(key) ?? { from: r.originSlug, to: r.destinationSlug, value: 0 };
    cur.value += r.valueUsd;
    lanes.set(key, cur);
  }
  const top = [...lanes.values()].sort((a, b) => b.value - a.value).slice(0, max);
  const maxVal = Math.max(...top.map((l) => l.value), 1);

  const usedSlugs = new Set(top.flatMap((l) => [l.from, l.to]));
  const nodes = [...usedSlugs]
    .map((s) => tradeData.getCountry(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const W = 820;
  const H = 460;
  const px = (x: number) => 40 + (x / 100) * (W - 80);
  const py = (y: number) => 30 + (y / 100) * (H - 60);

  // node degree → size
  const degree = new Map<string, number>();
  for (const l of top) {
    degree.set(l.from, (degree.get(l.from) ?? 0) + 1);
    degree.set(l.to, (degree.get(l.to) ?? 0) + 1);
  }

  if (!top.length) return null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 280 }}>
      <defs>
        <linearGradient id="flow-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-azure)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {top.map((l, i) => {
        const a = tradeData.getCountry(l.from)!;
        const b = tradeData.getCountry(l.to)!;
        const x1 = px(a.x), y1 = py(a.y), x2 = px(b.x), y2 = py(b.y);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 30;
        const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
        const w = 0.8 + (l.value / maxVal) * 3.5;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#flow-edge)" strokeWidth={w} strokeLinecap="round" />
            <circle r="2.2" fill="var(--color-signal-bright)">
              <animateMotion dur={`${5 + (i % 5)}s`} repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
            </circle>
          </g>
        );
      })}
      {nodes.map((n) => {
        const size = 4 + (degree.get(n.slug) ?? 1) * 1.6;
        return (
          <g key={n.slug}>
            <circle cx={px(n.x)} cy={py(n.y)} r={size + 4} fill="var(--color-signal)" opacity="0.08" />
            <circle cx={px(n.x)} cy={py(n.y)} r={size} fill="var(--color-surface)" stroke="var(--color-signal)" strokeWidth="1.5" />
            <text x={px(n.x)} y={py(n.y) - size - 5} textAnchor="middle" fontSize="10" className="mono" fill="var(--color-ink-soft)">
              {n.iso}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
