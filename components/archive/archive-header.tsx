import type { GalleryDictionary } from "@/types/dictionary";

export function ArchiveHeader({
  dictionary,
  total,
  startYear,
  endYear,
  categoryCount,
}: {
  dictionary: GalleryDictionary;
  total: number;
  startYear: string;
  endYear: string;
  categoryCount: number;
}) {
  const eyebrow = dictionary.eyebrow.replace(
    "{total}",
    String(total).padStart(3, "0"),
  );
  return (
    <header className="grid gap-10 border-t border-border pt-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className="rv-kicker">{eyebrow}</p>
        <h2 id="archive-title" className="rv-section-title mt-5 max-w-[12ch] text-[clamp(3rem,7vw,7rem)]">
          {dictionary.archive_label}
        </h2>
        <p className="rv-intro mt-6 max-w-2xl">{dictionary.description}</p>
      </div>
      <dl className="grid grid-cols-3 border-y border-border lg:col-span-4">
        <div className="py-5 pr-3">
          <dt className="rv-meta">{dictionary.photographsLabel}</dt>
          <dd className="mt-2 font-serif text-3xl tabular-nums">{total}</dd>
        </div>
        <div className="border-l border-border px-3 py-5">
          <dt className="rv-meta">{dictionary.periodLabel}</dt>
          <dd className="mt-3 font-mono text-xs text-[var(--color-text-secondary)]">
            {startYear}—{endYear}
          </dd>
        </div>
        <div className="border-l border-border py-5 pl-3">
          <dt className="rv-meta">{dictionary.categoriesLabel}</dt>
          <dd className="mt-2 font-serif text-3xl tabular-nums">{categoryCount}</dd>
        </div>
      </dl>
    </header>
  );
}
