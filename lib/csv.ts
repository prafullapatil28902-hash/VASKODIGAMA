import type { TradeRecord } from "./data/types";
import { COMPANY_BY_SLUG, COUNTRY_BY_SLUG } from "./data/dataset";

/** Build a CSV string from trade records (demonstration export). */
export function recordsToCsv(records: TradeRecord[]): string {
  const headers = [
    "Record ID",
    "Date",
    "HS Code",
    "Product Group",
    "Product",
    "Exporter",
    "Importer",
    "Origin",
    "Destination",
    "Trade Flow",
    "Quantity",
    "Unit",
    "Value (USD)",
    "Port",
  ];
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = records.map((r) =>
    [
      r.id,
      r.date,
      r.hsCode,
      r.productGroup,
      r.product,
      COMPANY_BY_SLUG.get(r.exporterSlug)?.name ?? r.exporterSlug,
      COMPANY_BY_SLUG.get(r.importerSlug)?.name ?? r.importerSlug,
      COUNTRY_BY_SLUG.get(r.originSlug)?.name ?? r.originSlug,
      COUNTRY_BY_SLUG.get(r.destinationSlug)?.name ?? r.destinationSlug,
      r.flow,
      r.quantity,
      r.unit,
      r.valueUsd,
      r.port,
    ]
      .map(esc)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

/** Trigger a browser download of a CSV string. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
