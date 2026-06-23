import { Badge } from "@/components/ui/badge";

export interface LegalSection {
  heading: string;
  body: string;
}

export function LegalDoc({
  kicker,
  title,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-grid">
      <div className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
          <p className="eyebrow mb-2">{kicker}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="draft" dot />
            <span className="mono text-[11px] uppercase tracking-wider text-amber">Requires Legal Review</span>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        <div className="panel mb-8 border-amber/20 bg-amber/[0.04] p-4 text-[13px] leading-relaxed text-ink-soft">
          {intro}
        </div>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-[17px] font-semibold text-ink">
                <span className="mono mr-2 text-signal">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <p className="text-[14px] leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mono mt-12 border-t border-line pt-6 text-[12px] text-dim">
          This is draft placeholder content for a demonstration product. It is not legal advice and
          does not reference any specific jurisdiction. Review with qualified counsel before any
          production use.
        </p>
      </article>
    </div>
  );
}
