// ── Vaskodigama domain model ────────────────────────────────────────
// These types are shared by every data source. UI never touches a
// concrete dataset directly — it goes through TradeDataService so the
// mock source can be swapped for a live API later.

export type Region =
  | "South Asia"
  | "East Asia"
  | "Southeast Asia"
  | "Middle East"
  | "Europe"
  | "North America"
  | "Latin America"
  | "Africa"
  | "Oceania";

export type TradeFlow = "Import" | "Export";

export type ParticipantRole =
  | "Buyer"
  | "Supplier"
  | "Importer"
  | "Exporter";

export type SearchMode =
  | "Product"
  | "HS Code"
  | "Company"
  | "Buyer"
  | "Supplier"
  | "Importer"
  | "Exporter"
  | "Country";

export interface Country {
  slug: string;
  name: string;
  iso: string;
  region: Region;
  /** Normalised abstract coordinates (0–100) for node layouts. */
  x: number;
  y: number;
  importIndex: number; // 0–100 relative activity
  exportIndex: number; // 0–100 relative activity
  topProductGroup: string;
  /** Momentum of trade participation, percent change (demo). */
  momentum: number;
}

export interface Company {
  slug: string;
  name: string;
  role: ParticipantRole;
  countrySlug: string;
  productGroups: string[];
  activityIndex: number; // 0–100
}

export interface HsCode {
  code: string;
  description: string;
  productGroup: string;
}

export interface TradeRecord {
  id: string;
  date: string; // ISO yyyy-mm-dd
  hsCode: string;
  productGroup: string;
  product: string;
  exporterSlug: string;
  importerSlug: string;
  originSlug: string;
  destinationSlug: string;
  flow: TradeFlow;
  quantity: number;
  unit: string;
  valueUsd: number;
  port: string;
}

export type SignalKind =
  | "Demand Shift"
  | "Supply Change"
  | "Emerging Market"
  | "New Trade Route"
  | "Activity Concentration"
  | "Price Movement";

export interface MarketSignal {
  id: string;
  kind: SignalKind;
  productGroup: string;
  countrySlug: string;
  /** Percent change, signed (demo). */
  change: number;
  summary: string;
}

export interface TradeQuery {
  mode?: SearchMode;
  keyword?: string;
  countrySlug?: string;
  region?: Region;
  originSlug?: string;
  destinationSlug?: string;
  productGroup?: string;
  hsCode?: string;
  flow?: TradeFlow;
  minValue?: number;
  maxValue?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface TradeStats {
  recordCount: number;
  totalValue: number;
  buyers: number;
  suppliers: number;
  countries: number;
  averageValue: number;
}

export interface RankedItem {
  label: string;
  slug?: string;
  value: number;
  share: number; // 0–1
}

export interface MonthlyPoint {
  month: string; // yyyy-mm
  value: number;
  records: number;
}
