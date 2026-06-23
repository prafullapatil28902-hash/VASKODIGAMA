import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Panel({
  title,
  meta,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("panel", className)}>
      {(title || meta) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
          {meta}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
