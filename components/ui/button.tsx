import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-signal text-void font-semibold hover:bg-[#5be9d6] shadow-[0_0_0_1px_rgba(52,224,200,0.4),0_8px_30px_-12px_rgba(52,224,200,0.7)]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-ink hover:bg-white/[0.07] hover:border-line-strong",
  ghost: "text-ink-soft hover:text-ink hover:bg-white/[0.05]",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-[15px] rounded-lg gap-2",
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...rest} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}
