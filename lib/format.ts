/** Compact USD, e.g. $1.2M, $940K. Demo figures only. */
export function fmtUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

/** Grouped integer, e.g. 12,480. */
export function fmtNum(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

/** Signed percent, e.g. +14%, -6%. */
export function fmtPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

/** yyyy-mm → Mon 'YY */
export function fmtMonth(month: string): string {
  const [y, m] = month.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/** yyyy-mm-dd → 12 May 2025 */
export function fmtDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
