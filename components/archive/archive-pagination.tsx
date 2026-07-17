import type { GalleryDictionary } from "@/types/dictionary";

export function ArchivePagination({
  dictionary,
  visible,
  total,
  onLoadMore,
}: {
  dictionary: GalleryDictionary;
  visible: number;
  total: number;
  onLoadMore: () => void;
}) {
  const remaining = Math.max(0, total - visible);
  if (remaining === 0) return null;

  return (
    <div className="mt-14 border-y border-border py-8 text-center sm:mt-20 sm:py-10">
      <p className="rv-meta mb-5">
        {visible} / {total} · {remaining} {dictionary.remaining}
      </p>
      <button
        type="button"
        onClick={onLoadMore}
        data-press-feedback
        className="min-h-12 border border-[var(--color-border-strong)] px-7 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-accent hover:bg-[var(--color-hover)] hover:text-accent"
      >
        {dictionary.loadMore}
      </button>
    </div>
  );
}
