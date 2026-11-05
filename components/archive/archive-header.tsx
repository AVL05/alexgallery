import type { GalleryDictionary } from "@/types/dictionary";

// Archive title card: same grammar as the series films (slate, display
// title, description and a short facts roll), tuned to sit above the tools.
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
    <header className="rv-titlecard rv-titlecard--compact">
      <p className="rv-slate">{dictionary.eyebrow}</p>
      <Tag id="archive-title" className="rv-titlecard__title">
        {dictionary.archive_label}
      </Tag>
      <div className="rv-titlecard__body">
        <p className="rv-titlecard__description">{dictionary.description}</p>
        <dl className="rv-credits__roll mt-0 max-md:hidden">
          <div><dt>{dictionary.periodLabel}</dt><dd className="tabular-nums">{startYear}–{endYear}</dd></div>
          <div><dt>{dictionary.categoriesLabel}</dt><dd className="tabular-nums">{String(categoryCount).padStart(2, "0")}</dd></div>
        </dl>
      </div>
    </header>
  );
}
