import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * V⌖ — the Vaskodigama intelligence coordinate marker.
 * A "V" fused with a crosshair / coordinate reticle. No ships, no globes.
 */
export function CoordinateMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="vkd-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-signal)" />
          <stop offset="100%" stopColor="var(--color-azure)" />
        </linearGradient>
      </defs>
      {/* reticle ring */}
      <circle cx="20" cy="20" r="17" fill="none" stroke="url(#vkd-mark)" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* crosshair ticks */}
      <g stroke="url(#vkd-mark)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6">
        <line x1="20" y1="1.5" x2="20" y2="6.5" />
        <line x1="20" y1="33.5" x2="20" y2="38.5" />
        <line x1="1.5" y1="20" x2="6.5" y2="20" />
        <line x1="33.5" y1="20" x2="38.5" y2="20" />
      </g>
      {/* the V */}
      <path
        d="M11 12 L20 27 L29 12"
        fill="none"
        stroke="url(#vkd-mark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* coordinate centre point */}
      <circle cx="20" cy="20" r="2" fill="var(--color-signal)" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <CoordinateMark className="transition-transform group-hover:rotate-90 duration-500" />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Vaskodigama
          </span>
          <span className="mono text-[9px] uppercase tracking-[0.28em] text-dim">
            Trade Intelligence OS
          </span>
        </span>
      )}
    </Link>
  );
}
