"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Featured intelligence nodes (per brand brief). Coordinates are in the
// SVG viewBox space below — an abstract signal field, not a world map.
type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  hint: string;
};

const NODES: Node[] = [
  { id: "us", label: "United States", x: 130, y: 150, size: 13, hint: "Demand hub · Pharma, Devices" },
  { id: "de", label: "Germany", x: 350, y: 90, size: 14, hint: "Demand rising · Pharma +14%" },
  { id: "ae", label: "UAE", x: 470, y: 230, size: 12, hint: "Re-export corridor · Food +9%" },
  { id: "in", label: "India", x: 560, y: 320, size: 16, hint: "Activity expanding · Machinery +8%" },
  { id: "vn", label: "Vietnam", x: 720, y: 200, size: 13, hint: "Export surge · Solar +11%" },
];

// Signal pathways between nodes (market relationships).
const LINKS: [string, string][] = [
  ["us", "de"],
  ["de", "ae"],
  ["ae", "in"],
  ["in", "vn"],
  ["de", "in"],
  ["us", "ae"],
  ["vn", "ae"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function curve(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 40;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function Constellation({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 820 420" className="h-full w-full" role="img" aria-label="Trade intelligence constellation showing relationships between India, Germany, United States, UAE and Vietnam">
        <defs>
          <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--color-signal)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-azure)" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor="var(--color-signal-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-signal-bright)" stopOpacity="0" />
          </radialGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* pathways */}
        {LINKS.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          const d = curve(na, nb);
          const dim = active && active !== a && active !== b;
          return (
            <g key={`${a}-${b}`} className="transition-opacity duration-300" style={{ opacity: dim ? 0.18 : 1 }}>
              <path d={d} fill="none" stroke="url(#link-grad)" strokeWidth="1.5" />
              <path
                d={d}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="1.4"
                strokeOpacity="0.5"
                strokeDasharray="3 8"
                style={{ animation: `dash-flow ${3 + (i % 3)}s linear infinite` }}
              />
              {/* travelling signal pulse */}
              <circle r="2.6" fill="var(--color-signal-bright)">
                <animateMotion
                  dur={`${4 + (i % 4)}s`}
                  repeatCount="indefinite"
                  path={d}
                  begin={`${i * 0.6}s`}
                />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${4 + (i % 4)}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
              </circle>
            </g>
          );
        })}

        {/* nodes */}
        {NODES.map((n, i) => {
          const isActive = active === n.id;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
              style={{ opacity: active && !isActive ? 0.45 : 1, transition: "opacity 0.3s" }}
            >
              {/* glow */}
              <circle cx={n.x} cy={n.y} r={n.size * 2.4} fill="url(#node-glow)" filter="url(#soft)" />
              {/* expanding ring */}
              <circle cx={n.x} cy={n.y} r={n.size} fill="none" stroke="var(--color-signal)" strokeWidth="1.2">
                <animate attributeName="r" values={`${n.size};${n.size * 2.8}`} dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </circle>
              {/* core */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.size * 0.55}
                fill={isActive ? "var(--color-signal-bright)" : "var(--color-signal)"}
                style={{ animation: `pulse-node ${2.4 + (i % 3) * 0.4}s ease-in-out infinite` }}
              />
              <circle cx={n.x} cy={n.y} r={n.size} fill="none" stroke="var(--color-signal-bright)" strokeOpacity="0.4" strokeWidth="1" />

              {/* label */}
              <text
                x={n.x}
                y={n.y - n.size - 10}
                textAnchor="middle"
                className="mono"
                fill={isActive ? "var(--color-ink)" : "var(--color-ink-soft)"}
                fontSize="12"
                fontWeight="600"
              >
                {n.label}
              </text>
              <text
                x={n.x}
                y={n.y + n.size + 18}
                textAnchor="middle"
                className="mono"
                fill="var(--color-muted)"
                fontSize="9"
                style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.3s" }}
              >
                {n.hint}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mono pointer-events-none absolute bottom-1 right-2 text-[10px] uppercase tracking-widest text-dim">
        Signal field · demonstration data
      </p>
    </div>
  );
}
