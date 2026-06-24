import { cn } from "@/lib/cn";

type BadgeTone = "demo" | "preview" | "sample" | "planned" | "draft" | "account" | "signal" | "neutral";

const TONES: Record<BadgeTone, string> = {
  demo: "border-signal/30 text-signal bg-signal/10",
  preview: "border-azure/30 text-azure bg-azure/10",
  sample: "border-violet/30 text-violet bg-violet/10",
  planned: "border-amber/30 text-amber bg-amber/10",
  draft: "border-down/30 text-down bg-down/10",
  account: "border-azure/30 text-azure bg-azure/10",
  signal: "border-signal/30 text-signal bg-signal/10",
  neutral: "border-line-strong text-muted bg-ink/5",
};

const LABELS: Partial<Record<BadgeTone, string>> = {
  demo: "Demonstration Data",
  preview: "Interface Preview",
  sample: "Sample Records",
  planned: "Planned Capability",
  draft: "Draft Legal Content",
  account: "Demo Account",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: BadgeTone;
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        TONES[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children ?? LABELS[tone] ?? "Demo"}
    </span>
  );
}
