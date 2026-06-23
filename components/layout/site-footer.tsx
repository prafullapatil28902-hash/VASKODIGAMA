import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/explore", label: "Research Workspace" },
      { href: "/dashboard", label: "Global Intelligence Center" },
      { href: "/countries", label: "Global Coverage Matrix" },
      { href: "/features", label: "Features" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions#exporters", label: "For Exporters" },
      { href: "/solutions#importers", label: "For Importers" },
      { href: "/solutions#manufacturers", label: "For Manufacturers" },
      { href: "/solutions#consultants", label: "For Consultants" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
      { href: "/signup", label: "Create Account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-void/60">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              A trade intelligence operating system for discovering, comparing
              and investigating international trade activity.
            </p>
            <Badge tone="demo" dot />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vaskodigama · Navigate Global Trade with Clarity</p>
          <p className="mono">
            All figures, companies and records shown are demonstration data.
          </p>
        </div>
      </div>
    </footer>
  );
}
