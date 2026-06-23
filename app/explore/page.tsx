import type { Metadata } from "next";
import { Workspace, type WorkspaceInitial } from "@/components/explore/workspace";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Research Workspace",
  description:
    "Conduct global trade research — search products, companies, buyers, suppliers, countries and HS codes in a terminal-grade workspace.",
};

export default async function ExplorePage({
  searchParams,
}: PageProps<"/explore">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const initial: Record<string, string> = {};
  const mode = first(sp.mode);
  if (mode) initial.mode = mode;
  const q = first(sp.q);
  if (q) initial.keyword = q;
  const pg = first(sp.productGroup);
  if (pg) initial.productGroup = pg;
  const country = first(sp.country);
  if (country) initial.originSlug = country;

  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5">Research Workspace</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Conduct trade research, not record browsing
              </h1>
              <p className="mt-1.5 max-w-2xl text-[14px] text-muted">
                Search modes, intelligence filters, market signals and trade
                records — a structured analyst workstation.
              </p>
            </div>
            <Badge tone="demo" dot />
          </div>
        </div>
      </div>

      <Workspace initial={initial as WorkspaceInitial} />
    </div>
  );
}
