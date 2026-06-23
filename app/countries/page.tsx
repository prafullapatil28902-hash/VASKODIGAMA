import type { Metadata } from "next";
import { CoverageMatrix } from "@/components/countries/coverage-matrix";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Global Coverage Matrix",
  description:
    "Compare global markets across regions by import activity, export activity and product participation.",
};

export default function CountriesPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5">Global Coverage Matrix</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Compare 40 markets, not isolated country cards
              </h1>
              <p className="mt-1.5 max-w-2xl text-[14px] text-muted">
                Markets grouped by region with import / export activity, leading
                product groups and opportunity momentum — designed for visual comparison.
              </p>
            </div>
            <Badge tone="demo" dot />
          </div>
        </div>
      </div>

      <CoverageMatrix />
    </div>
  );
}
