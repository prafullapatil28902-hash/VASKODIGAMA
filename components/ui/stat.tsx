import { cn } from "@/lib/cn";

export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel p-4", className)}>
      <p className="mono text-[10px] uppercase tracking-wider text-dim">{label}</p>
      <p className="mono mt-1.5 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-[12px] text-muted">{sub}</p>}
    </div>
  );
}
