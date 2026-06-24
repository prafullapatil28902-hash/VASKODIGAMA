"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/cn";

function Swatch({ colors }: { colors: [string, string, string] }) {
  return (
    <span className="flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-line-strong">
      <span className="h-full w-1/2" style={{ background: colors[0] }} />
      <span className="h-full w-1/4" style={{ background: colors[1] }} />
      <span className="h-full w-1/4" style={{ background: colors[2] }} />
    </span>
  );
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div className="animate-rise absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-2xl">
          <p className="eyebrow px-2.5 py-2">Theme</p>
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                  active ? "bg-signal/10" : "hover:bg-ink/[0.05]"
                )}
              >
                <Swatch colors={t.swatch} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink">{t.label}</span>
                  <span className="block truncate text-[11px] text-muted">{t.description}</span>
                </span>
                {active && <Check size={15} className="shrink-0 text-signal" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
