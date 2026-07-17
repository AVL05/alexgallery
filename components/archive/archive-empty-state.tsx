import type { GalleryDictionary } from "@/types/dictionary";

export function ArchiveEmptyState({
  dictionary,
  onClear,
}: {
  dictionary: GalleryDictionary;
  onClear: () => void;
}) {
  return (
    <div className="border-y border-border py-20 text-center sm:py-28">
      <p className="rv-kicker">00 / 00</p>
      <h3 className="mx-auto mt-5 max-w-xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight tracking-[-0.03em]">
        {dictionary.emptyTitle}
      </h3>
      <p className="mx-auto mt-5 max-w-lg text-[var(--color-text-secondary)]">
        {dictionary.emptyDescription}
      </p>
      <button type="button" onClick={onClear} className="rv-editorial-link mt-8">
        {dictionary.clearFilters}
      </button>
    </div>
  );
}
