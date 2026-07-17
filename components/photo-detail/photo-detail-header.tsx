"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import type { GalleryDictionary, PhotoDetailDictionary } from "@/types/dictionary";

export function PhotoDetailHeader({ dictionary, galleryDictionary }: { dictionary: PhotoDetailDictionary; galleryDictionary: GalleryDictionary }) {
  const { current, index, total, isContextual } = usePhotoDetailContext();
  const indexText = dictionary.photoIndex.replace("{current}", String(index + 1).padStart(2, "0")).replace("{total}", String(total).padStart(2, "0"));
  return (
    <header className="photo-detail-header border-b border-border pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="rv-kicker text-accent">{galleryDictionary.categories[current.category]} / {current.year}</p>
        <p className="rv-index" aria-label={indexText}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
      </div>
      <p className="rv-meta mt-4">{isContextual ? dictionary.archiveContext : dictionary.globalContext}</p>
      <h1 className="mt-8 max-w-[13ch] font-serif text-[clamp(2.8rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-balance">{current.title}</h1>
    </header>
  );
}
