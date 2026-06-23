// ── TradeDataService ────────────────────────────────────────────────
// The single seam between UI and data. Components ONLY call this
// interface. Today it is backed by the deterministic mock dataset; to go
// live, implement `ApiTradeDataService` against a real endpoint and swap
// the export at the bottom — no UI changes required.

import {
  COMPANIES,
  COMPANY_BY_SLUG,
  COUNTRIES,
  COUNTRY_BY_SLUG,
  HS_CODES,
  MARKET_SIGNALS,
  PRODUCT_GROUPS,
  TRADE_RECORDS,
} from "./dataset";
import type {
  Company,
  Country,
  HsCode,
  MarketSignal,
  MonthlyPoint,
  RankedItem,
  Region,
  TradeQuery,
  TradeRecord,
  TradeStats,
} from "./types";

export interface TradeDataService {
  getCountries(): Country[];
  getCountry(slug: string): Country | undefined;
  getCompanies(): Company[];
  getCompany(slug: string): Company | undefined;
  getHsCodes(): HsCode[];
  getProductGroups(): string[];
  getSignals(query?: TradeQuery): MarketSignal[];
  queryRecords(query?: TradeQuery): TradeRecord[];
  getStats(query?: TradeQuery): TradeStats;
  getMonthlyTrend(query?: TradeQuery): MonthlyPoint[];
  getTopCountries(query: TradeQuery | undefined, dir: "origin" | "destination"): RankedItem[];
  getTopCompanies(query: TradeQuery | undefined, role: "exporter" | "importer"): RankedItem[];
  getTopProductGroups(query?: TradeQuery): RankedItem[];
}

class MockTradeDataService implements TradeDataService {
  getCountries() {
    return COUNTRIES;
  }
  getCountry(slug: string) {
    return COUNTRY_BY_SLUG.get(slug);
  }
  getCompanies() {
    return COMPANIES;
  }
  getCompany(slug: string) {
    return COMPANY_BY_SLUG.get(slug);
  }
  getHsCodes() {
    return HS_CODES;
  }
  getProductGroups() {
    return PRODUCT_GROUPS;
  }

  getSignals(query?: TradeQuery) {
    let signals = MARKET_SIGNALS;
    if (query?.productGroup) {
      signals = signals.filter((s) => s.productGroup === query.productGroup);
    }
    if (query?.countrySlug) {
      signals = signals.filter((s) => s.countrySlug === query.countrySlug);
    }
    if (query?.region) {
      signals = signals.filter(
        (s) => COUNTRY_BY_SLUG.get(s.countrySlug)?.region === query.region
      );
    }
    // Fall back to the full feed if a narrow filter empties it — the feed
    // should never be blank in a demo.
    return signals.length ? signals : MARKET_SIGNALS;
  }

  queryRecords(query: TradeQuery = {}) {
    const kw = query.keyword?.trim().toLowerCase();
    let rows = TRADE_RECORDS.filter((rec) => {
      if (query.productGroup && rec.productGroup !== query.productGroup) return false;
      if (query.hsCode && rec.hsCode !== query.hsCode) return false;
      if (query.flow && rec.flow !== query.flow) return false;
      if (query.originSlug && rec.originSlug !== query.originSlug) return false;
      if (query.destinationSlug && rec.destinationSlug !== query.destinationSlug) return false;
      if (query.countrySlug && rec.originSlug !== query.countrySlug && rec.destinationSlug !== query.countrySlug)
        return false;
      if (query.region) {
        const o = COUNTRY_BY_SLUG.get(rec.originSlug)?.region;
        const d = COUNTRY_BY_SLUG.get(rec.destinationSlug)?.region;
        if (o !== query.region && d !== query.region) return false;
      }
      if (query.minValue != null && rec.valueUsd < query.minValue) return false;
      if (query.maxValue != null && rec.valueUsd > query.maxValue) return false;
      if (query.startDate && rec.date < query.startDate) return false;
      if (query.endDate && rec.date > query.endDate) return false;
      if (kw) {
        const hay = [
          rec.product,
          rec.productGroup,
          rec.hsCode,
          COMPANY_BY_SLUG.get(rec.exporterSlug)?.name,
          COMPANY_BY_SLUG.get(rec.importerSlug)?.name,
          COUNTRY_BY_SLUG.get(rec.originSlug)?.name,
          COUNTRY_BY_SLUG.get(rec.destinationSlug)?.name,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
    if (query.limit) rows = rows.slice(0, query.limit);
    return rows;
  }

  getStats(query?: TradeQuery): TradeStats {
    const rows = this.queryRecords(query);
    const buyers = new Set(rows.map((r) => r.importerSlug));
    const suppliers = new Set(rows.map((r) => r.exporterSlug));
    const countries = new Set(rows.flatMap((r) => [r.originSlug, r.destinationSlug]));
    const totalValue = rows.reduce((sum, r) => sum + r.valueUsd, 0);
    return {
      recordCount: rows.length,
      totalValue,
      buyers: buyers.size,
      suppliers: suppliers.size,
      countries: countries.size,
      averageValue: rows.length ? Math.round(totalValue / rows.length) : 0,
    };
  }

  getMonthlyTrend(query?: TradeQuery): MonthlyPoint[] {
    const rows = this.queryRecords(query);
    const map = new Map<string, { value: number; records: number }>();
    for (const r of rows) {
      const month = r.date.slice(0, 7);
      const cur = map.get(month) ?? { value: 0, records: 0 };
      cur.value += r.valueUsd;
      cur.records += 1;
      map.set(month, cur);
    }
    return [...map.entries()]
      .map(([month, v]) => ({ month, ...v }))
      .sort((a, b) => (a.month < b.month ? -1 : 1));
  }

  private rank(
    rows: TradeRecord[],
    keyFn: (r: TradeRecord) => { label: string; slug?: string } | undefined,
    limit = 6
  ): RankedItem[] {
    const map = new Map<string, { label: string; slug?: string; value: number }>();
    for (const r of rows) {
      const k = keyFn(r);
      if (!k) continue;
      const id = k.slug ?? k.label;
      const cur = map.get(id) ?? { label: k.label, slug: k.slug, value: 0 };
      cur.value += r.valueUsd;
      map.set(id, cur);
    }
    const total = [...map.values()].reduce((s, v) => s + v.value, 0) || 1;
    return [...map.values()]
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((v) => ({ ...v, share: v.value / total }));
  }

  getTopCountries(query: TradeQuery | undefined, dir: "origin" | "destination") {
    const rows = this.queryRecords(query);
    return this.rank(rows, (r) => {
      const c = COUNTRY_BY_SLUG.get(dir === "origin" ? r.originSlug : r.destinationSlug);
      return c ? { label: c.name, slug: c.slug } : undefined;
    });
  }

  getTopCompanies(query: TradeQuery | undefined, role: "exporter" | "importer") {
    const rows = this.queryRecords(query);
    return this.rank(rows, (r) => {
      const c = COMPANY_BY_SLUG.get(role === "exporter" ? r.exporterSlug : r.importerSlug);
      return c ? { label: c.name, slug: c.slug } : undefined;
    });
  }

  getTopProductGroups(query?: TradeQuery) {
    const rows = this.queryRecords(query);
    return this.rank(rows, (r) => ({ label: r.productGroup }), 8);
  }
}

/*
 * Future live implementation. When a real backend exists, implement the
 * same interface and swap the singleton below.
 *
 * class ApiTradeDataService implements TradeDataService {
 *   constructor(private baseUrl: string) {}
 *   async queryRecords(query) {
 *     const res = await fetch(`${this.baseUrl}/records?` + toParams(query));
 *     return res.json();
 *   }
 *   // ...remaining methods call the API
 * }
 *
 * export const tradeData: TradeDataService =
 *   new ApiTradeDataService(process.env.NEXT_PUBLIC_TRADE_API_URL!);
 */

export const tradeData: TradeDataService = new MockTradeDataService();

// Re-export helper types for convenience at call sites.
export type { Region };
