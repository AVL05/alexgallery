"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import type { GalleryDictionary, PhotoDetailDictionary } from "@/types/dictionary";

export function PhotoDetailHeader({ dictionary, galleryDictionary }: { dictionary: PhotoDetailDictionary; galleryDictionary: GalleryDictionary }) {
  const { current, index, total, contextType } = usePhotoDetailContext();
  const indexText = dictionary.photoIndex.replace("{current}", String(index + 1).padStart(2, "0")).replace("{total}", String(total).padStart(2, "0"));
  const contextLabel = contextType === "series" ? dictionary.seriesContext : contextType === "archive" ? dictionary.archiveContext : null;
  return (
    <header data-photo-motion-copy className="photo-detail-header border-b border-border pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="rv-slate">{galleryDictionary.categories[current.category]}<span aria-hidden="true" className="rv-slate__rule" />{current.year}</p>
        <p className="rv-index" aria-label={indexText}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
      </div>
      {contextLabel ? <p className="rv-meta mt-4">{contextLabel}</p> : null}
      <h1 className="rv-detail-title mt-5">{current.title}</h1>
    </header>
  );
}
