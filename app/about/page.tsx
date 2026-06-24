import type { Metadata } from "next";
import { ArrowRight, Compass, Layers, Eye, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "Vaskodigama is a Trade Intelligence Operating System for navigating global trade information with clarity.",
};

const PRINCIPLES = [
  { icon: Compass, title: "Research over records", body: "We design for investigation and discovery — not database browsing." },
  { icon: Layers, title: "Structured intelligence", body: "Signals, markets, participants and products as one connected workspace." },
  { icon: Eye, title: "Clarity by default", body: "Dense information presented so decisions become obvious." },
  { icon: ShieldCheck, title: "Honest demonstration", body: "Every figure here is clearly labelled as demonstration data." },
];

export default function AboutPage() {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <p className="eyebrow mb-2">About</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            A Trade Intelligence Operating System
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
            Vaskodigama helps businesses navigate global trade information with
            clarity. It is a research environment for discovering, comparing and
            investigating international trade activity — built to feel like
            opening software, not visiting a website.
          </p>
          <div className="mt-5"><Badge tone="demo" dot /></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-12 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-7">
            <h2 className="eyebrow mb-3">Mission</h2>
            <p className="text-[18px] leading-relaxed text-ink-soft">
              Help businesses navigate global trade information with clarity —
              turning raw trade records into clear, comparable, decision-ready
              intelligence.
            </p>
          </div>
          <div className="panel p-7">
            <h2 className="eyebrow mb-3">What this is</h2>
            <p className="text-[15px] leading-relaxed text-muted">
              This build is a demonstration of the Vaskodigama experience: the
              workspace, intelligence center, coverage matrix and country
              intelligence — running on deterministic demonstration data. It
              shows how the product behaves, not live market figures.
            </p>
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-4">Principles</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="panel p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink/[0.03] text-signal">
                  <p.icon size={18} />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="panel flex flex-col items-center gap-4 p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-xl font-semibold text-ink">See the workspace for yourself</h3>
            <p className="mt-1 text-[14px] text-muted">Explore the demonstration build — no account required.</p>
          </div>
          <ButtonLink href="/explore" size="lg">Explore Trade Intelligence <ArrowRight size={18} /></ButtonLink>
        </div>
      </div>
    </div>
  );
}
