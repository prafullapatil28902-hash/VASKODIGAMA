import type { Metadata } from "next";
import { IntelligenceCenter } from "@/components/dashboard/intelligence-center";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Global Intelligence Center",
  description:
    "A market command center — KPIs, market signals, relationship matrices and trade-flow networks across global markets.",
};

export default function DashboardPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5">Global Intelligence Center</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                What is happening in the market
              </h1>
              <p className="mt-1.5 max-w-2xl text-[14px] text-muted">
                A command center for market movement — signals first, then the
                evidence behind them. Everything reacts to your controls.
              </p>
            </div>
            <Badge tone="demo" dot />
          </div>
        </div>
      </div>

      <IntelligenceCenter />
    </div>
  );
}
