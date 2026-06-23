// ── Deterministic demonstration dataset ─────────────────────────────
// Everything here is generated from fixed inputs with a seeded PRNG, so
// the output is byte-for-byte identical on every run. No runtime
// randomness. All figures are illustrative ("Demonstration Data").

import type {
  Company,
  Country,
  HsCode,
  MarketSignal,
  TradeRecord,
  Region,
} from "./types";

/** mulberry32 — tiny deterministic PRNG seeded once. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PRODUCT_GROUPS = [
  "Pharmaceutical Ingredients",
  "Medical Devices",
  "Food Ingredients",
  "Coffee Beans",
  "Industrial Chemicals",
  "Solar Components",
  "Automotive Components",
  "Packaging Materials",
  "Electronic Assemblies",
  "Cotton Fabrics",
  "Engineering Machinery",
  "Electrical Motors",
];

export const HS_CODES: HsCode[] = [
  { code: "2941.90", description: "Active pharmaceutical ingredients, other", productGroup: "Pharmaceutical Ingredients" },
  { code: "2933.59", description: "Heterocyclic compounds, pharmaceutical grade", productGroup: "Pharmaceutical Ingredients" },
  { code: "9018.90", description: "Medical instruments & appliances", productGroup: "Medical Devices" },
  { code: "9021.10", description: "Orthopaedic & fracture appliances", productGroup: "Medical Devices" },
  { code: "2106.90", description: "Food preparations, not elsewhere specified", productGroup: "Food Ingredients" },
  { code: "1701.99", description: "Refined cane or beet sugar", productGroup: "Food Ingredients" },
  { code: "0901.21", description: "Coffee, roasted, not decaffeinated", productGroup: "Coffee Beans" },
  { code: "0901.11", description: "Coffee, not roasted, not decaffeinated", productGroup: "Coffee Beans" },
  { code: "2807.00", description: "Sulphuric acid; oleum", productGroup: "Industrial Chemicals" },
  { code: "2815.11", description: "Sodium hydroxide, solid", productGroup: "Industrial Chemicals" },
  { code: "8541.43", description: "Photovoltaic cells assembled in modules", productGroup: "Solar Components" },
  { code: "8708.99", description: "Motor vehicle parts, other", productGroup: "Automotive Components" },
  { code: "8708.30", description: "Brakes & servo-brakes; parts", productGroup: "Automotive Components" },
  { code: "4819.10", description: "Cartons & boxes of corrugated paper", productGroup: "Packaging Materials" },
  { code: "3923.21", description: "Sacks & bags of polymers of ethylene", productGroup: "Packaging Materials" },
  { code: "8534.00", description: "Printed circuit assemblies", productGroup: "Electronic Assemblies" },
  { code: "8542.31", description: "Electronic integrated circuits, processors", productGroup: "Electronic Assemblies" },
  { code: "5208.52", description: "Woven cotton fabrics, printed", productGroup: "Cotton Fabrics" },
  { code: "8479.89", description: "Machines with individual functions, other", productGroup: "Engineering Machinery" },
  { code: "8501.52", description: "AC motors, multi-phase, 0.75–75 kW", productGroup: "Electrical Motors" },
];

type RawCountry = [name: string, iso: string, region: Region, x: number, y: number];

const RAW_COUNTRIES: RawCountry[] = [
  // South Asia
  ["India", "IN", "South Asia", 66, 58],
  ["Bangladesh", "BD", "South Asia", 71, 56],
  ["Sri Lanka", "LK", "South Asia", 68, 66],
  ["Pakistan", "PK", "South Asia", 62, 50],
  // East Asia
  ["China", "CN", "East Asia", 78, 46],
  ["Japan", "JP", "East Asia", 90, 44],
  ["South Korea", "KR", "East Asia", 86, 45],
  ["Taiwan", "TW", "East Asia", 84, 52],
  // Southeast Asia
  ["Vietnam", "VN", "Southeast Asia", 80, 60],
  ["Thailand", "TH", "Southeast Asia", 77, 62],
  ["Indonesia", "ID", "Southeast Asia", 82, 72],
  ["Malaysia", "MY", "Southeast Asia", 78, 68],
  ["Singapore", "SG", "Southeast Asia", 79, 70],
  ["Philippines", "PH", "Southeast Asia", 87, 60],
  // Middle East
  ["United Arab Emirates", "AE", "Middle East", 56, 54],
  ["Saudi Arabia", "SA", "Middle East", 52, 53],
  ["Qatar", "QA", "Middle East", 55, 53],
  ["Oman", "OM", "Middle East", 57, 56],
  ["Turkey", "TR", "Middle East", 48, 42],
  // Europe
  ["Germany", "DE", "Europe", 40, 30],
  ["Netherlands", "NL", "Europe", 38, 28],
  ["France", "FR", "Europe", 36, 33],
  ["United Kingdom", "GB", "Europe", 34, 27],
  ["Italy", "IT", "Europe", 42, 37],
  ["Spain", "ES", "Europe", 32, 38],
  ["Poland", "PL", "Europe", 44, 29],
  ["Switzerland", "CH", "Europe", 40, 34],
  // North America
  ["United States", "US", "North America", 16, 40],
  ["Canada", "CA", "North America", 16, 26],
  ["Mexico", "MX", "North America", 12, 50],
  // Latin America
  ["Brazil", "BR", "Latin America", 24, 72],
  ["Argentina", "AR", "Latin America", 22, 84],
  ["Chile", "CL", "Latin America", 18, 82],
  ["Colombia", "CO", "Latin America", 19, 64],
  // Africa
  ["South Africa", "ZA", "Africa", 46, 82],
  ["Egypt", "EG", "Africa", 50, 48],
  ["Kenya", "KE", "Africa", 52, 68],
  ["Nigeria", "NG", "Africa", 40, 62],
  // Oceania
  ["Australia", "AU", "Oceania", 88, 82],
  ["New Zealand", "NZ", "Oceania", 95, 88],
];

const rnd = mulberry32(20240617);

export const COUNTRIES: Country[] = RAW_COUNTRIES.map(([name, iso, region, x, y], i) => ({
  slug: slug(name),
  name,
  iso,
  region,
  x,
  y,
  importIndex: Math.round(35 + rnd() * 64),
  exportIndex: Math.round(35 + rnd() * 64),
  topProductGroup: PRODUCT_GROUPS[(i * 5 + 3) % PRODUCT_GROUPS.length],
  momentum: Math.round((rnd() * 30 - 9) * 10) / 10,
}));

const countryBySlug = new Map(COUNTRIES.map((c) => [c.slug, c]));

type RawCompany = [name: string, role: Company["role"], country: string, groups: number[]];

const RAW_COMPANIES: RawCompany[] = [
  ["Meridian BioTrade", "Exporter", "India", [0, 1]],
  ["Northstar Industrial", "Supplier", "Germany", [10, 11]],
  ["Bluehaven Foods", "Importer", "United Arab Emirates", [2, 3]],
  ["Arclight Medical", "Supplier", "United States", [2 - 1, 3 - 2]],
  ["TerraNova Exports", "Exporter", "Vietnam", [5, 8]],
  ["Eastbridge Engineering", "Supplier", "South Korea", [10, 8]],
  ["Pacifica Electronics", "Exporter", "Taiwan", [8, 11]],
  ["Harborline Chemical", "Supplier", "Netherlands", [4, 0]],
  ["Crestfield Textiles", "Exporter", "Bangladesh", [9, 7]],
  ["Solstice Consumer Products", "Buyer", "United Kingdom", [7, 2]],
  ["Vanta Pharmaceuticals", "Supplier", "Switzerland", [0, 1]],
  ["Orion Components", "Exporter", "China", [6, 8]],
  ["Lumen Solar", "Supplier", "Vietnam", [5, 11]],
  ["Granite Packaging", "Buyer", "Mexico", [7, 9]],
  ["Cobalt Motors", "Importer", "Germany", [6, 11]],
  ["Sablefield Agro", "Exporter", "Brazil", [3, 2]],
  ["Vertex Devices", "Buyer", "Japan", [1, 8]],
  ["Halcyon Coffee", "Exporter", "Colombia", [3, 2]],
  ["Ironwood Machinery", "Supplier", "Italy", [10, 6]],
  ["Nimbus Assemblies", "Importer", "Singapore", [8, 11]],
];

export const COMPANIES: Company[] = RAW_COMPANIES.map(([name, role, country, groups]) => ({
  slug: slug(name),
  name,
  role,
  countrySlug: slug(country),
  productGroups: groups.map((g) => PRODUCT_GROUPS[((g % PRODUCT_GROUPS.length) + PRODUCT_GROUPS.length) % PRODUCT_GROUPS.length]),
  activityIndex: Math.round(40 + rnd() * 59),
}));

const exporters = COMPANIES.filter((c) => c.role === "Exporter" || c.role === "Supplier");
const importers = COMPANIES.filter((c) => c.role === "Importer" || c.role === "Buyer");
// Ensure both pools are non-empty for record generation.
const exporterPool = exporters.length ? exporters : COMPANIES;
const importerPool = importers.length ? importers : COMPANIES;

const PORTS = [
  "Nhava Sheva", "Hamburg", "Rotterdam", "Los Angeles", "Jebel Ali",
  "Busan", "Shanghai", "Singapore", "Chennai", "Antwerp", "Santos", "Mundra",
];

const UNITS: Record<string, string> = {
  "Pharmaceutical Ingredients": "kg",
  "Medical Devices": "units",
  "Food Ingredients": "MT",
  "Coffee Beans": "bags",
  "Industrial Chemicals": "MT",
  "Solar Components": "panels",
  "Automotive Components": "units",
  "Packaging Materials": "cartons",
  "Electronic Assemblies": "units",
  "Cotton Fabrics": "rolls",
  "Engineering Machinery": "units",
  "Electrical Motors": "units",
};

function buildRecords(): TradeRecord[] {
  const r = mulberry32(987654321);
  const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  const records: TradeRecord[] = [];

  for (let i = 0; i < 120; i++) {
    const hs = HS_CODES[Math.floor(r() * HS_CODES.length)];
    const exporter = pick(exporterPool);
    let importer = pick(importerPool);
    if (importer.slug === exporter.slug) importer = pick(importerPool);

    const origin = countryBySlug.get(exporter.countrySlug)!;
    let destination = pick(COUNTRIES);
    if (destination.slug === origin.slug) destination = pick(COUNTRIES);

    // Date spread across 12 months ending 2025-05.
    const monthIdx = Math.floor(r() * 12); // 0..11
    const year = monthIdx < 7 ? 2024 : 2025;
    const month = ((monthIdx + 5) % 12) + 1; // start 2024-06
    const day = 1 + Math.floor(r() * 27);
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const quantity = Math.round((200 + r() * 9800) / 5) * 5;
    const unitVal = 40 + r() * 960;
    const valueUsd = Math.round((quantity * unitVal) / 100) * 100;

    records.push({
      id: `VKD-${String(100000 + i)}`,
      date,
      hsCode: hs.code,
      productGroup: hs.productGroup,
      product: hs.description,
      exporterSlug: exporter.slug,
      importerSlug: importer.slug,
      originSlug: origin.slug,
      destinationSlug: destination.slug,
      flow: r() > 0.5 ? "Export" : "Import",
      quantity,
      unit: UNITS[hs.productGroup] ?? "units",
      valueUsd,
      port: pick(PORTS),
    });
  }
  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const TRADE_RECORDS: TradeRecord[] = buildRecords();

// Curated, human-readable market signals (analyst-style, demo).
export const MARKET_SIGNALS: MarketSignal[] = [
  { id: "sig-1", kind: "Demand Shift", productGroup: "Pharmaceutical Ingredients", countrySlug: "germany", change: 14, summary: "Demand rising in Germany as buyers diversify API sourcing away from single-origin supply." },
  { id: "sig-2", kind: "Supply Change", productGroup: "Solar Components", countrySlug: "vietnam", change: 11, summary: "Export activity increasing in Vietnam; module assembly capacity coming online." },
  { id: "sig-3", kind: "Emerging Market", productGroup: "Food Ingredients", countrySlug: "united-arab-emirates", change: 9, summary: "New sourcing opportunities identified in UAE re-export corridors." },
  { id: "sig-4", kind: "Activity Concentration", productGroup: "Engineering Machinery", countrySlug: "india", change: 8, summary: "Import activity expanding in India across automation and process equipment." },
  { id: "sig-5", kind: "New Trade Route", productGroup: "Coffee Beans", countrySlug: "colombia", change: 7, summary: "Emerging Colombia → Southeast Asia lane shows repeated shipment cadence." },
  { id: "sig-6", kind: "Price Movement", productGroup: "Industrial Chemicals", countrySlug: "netherlands", change: -6, summary: "Unit values softening in Netherlands caustic soda flows quarter-over-quarter." },
  { id: "sig-7", kind: "Demand Shift", productGroup: "Electronic Assemblies", countrySlug: "taiwan", change: 12, summary: "Buyer interest concentrating around Taiwan PCB assembly suppliers." },
  { id: "sig-8", kind: "Supply Change", productGroup: "Cotton Fabrics", countrySlug: "bangladesh", change: 10, summary: "Bangladesh woven fabric exporters widening destination spread." },
];

export const COUNTRY_BY_SLUG = countryBySlug;
export const COMPANY_BY_SLUG = new Map(COMPANIES.map((c) => [c.slug, c]));
export const HS_BY_CODE = new Map(HS_CODES.map((h) => [h.code, h]));
