import { MetaItem, MetaList } from "@/components/ui/photo-meta";
import type { GalleryDictionary } from "@/types/dictionary";

export function ArchiveHeader({
  dictionary,
  startYear,
  endYear,
  categoryCount,
  as: Tag = "h2",
}: {
  dictionary: GalleryDictionary;
  startYear: string;
  endYear: string;
  categoryCount: number;
  as?: "h1" | "h2";
}) {
  return (
    <header className="grid gap-6 border-t border-border pt-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className="rv-kicker">{dictionary.eyebrow}</p>
        <Tag id="archive-title" className="rv-section-title mt-4 max-w-[16ch] text-[clamp(2.4rem,5vw,4.5rem)]">
          {dictionary.archive_label}
        </Tag>
        <p className="rv-body mt-4 max-w-2xl text-[var(--color-text-secondary)]">{dictionary.description}</p>
      </div>
      <MetaList className="border-y border-border lg:col-span-4">
        <MetaItem
          label={dictionary.periodLabel}
          className="py-5 pr-3"
          valueClassName="mt-3 font-mono text-xs text-[var(--color-text-secondary)]"
        >
          {startYear}—{endYear}
        </MetaItem>
        <MetaItem
          label={dictionary.categoriesLabel}
          className="border-l border-border py-5 pl-3"
          valueClassName="mt-2 font-serif text-3xl tabular-nums"
        >
          {categoryCount}
        </MetaItem>
      </MetaList>
    </header>
  );
}
