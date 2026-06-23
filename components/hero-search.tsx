"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

const MODES = ["Product", "HS Code", "Company", "Country"] as const;

export function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof MODES)[number]>("Product");
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (value.trim()) params.set("q", value.trim());
    router.push(`/explore?${params.toString()}`);
  }

  return (
    <div className="panel p-2.5">
      <div className="mb-2.5 flex flex-wrap gap-1 px-1">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "mono rounded-md px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors",
              mode === m ? "bg-signal/15 text-signal" : "text-dim hover:text-muted"
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-line bg-void/50 px-3.5">
          <Search size={16} className="text-dim" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Search ${mode.toLowerCase()}… e.g. Pharmaceutical Ingredients`}
            className="h-11 flex-1 bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-lg bg-signal px-5 text-sm font-semibold text-void transition-colors hover:bg-[#5be9d6]"
        >
          Research
        </button>
      </form>
    </div>
  );
}
