"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/explore", label: "Research Workspace" },
  { href: "/dashboard", label: "Intelligence Center" },
  { href: "/countries", label: "Coverage" },
  { href: "/solutions", label: "Solutions" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "text-ink bg-white/[0.06]"
                  : "text-muted hover:text-ink hover:bg-white/[0.04]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <ButtonLink href="/explore" size="sm">
            Open Workspace
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-white/5 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive(item.href) ? "text-ink bg-white/[0.06]" : "text-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-line pt-4">
              <ButtonLink href="/login" variant="secondary" size="sm" className="flex-1">
                Sign in
              </ButtonLink>
              <ButtonLink href="/explore" size="sm" className="flex-1">
                Open Workspace
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
