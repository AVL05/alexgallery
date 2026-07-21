"use client";

import { ArchiveItem } from "@/components/archive/archive-item";
import { useArchivePhotoMotion } from "@/hooks/use-archive-photo-motion";
import { getArchiveItemVariant } from "@/lib/archive/selectors";
import type { ArchivePhoto, ArchiveState } from "@/lib/archive/types";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import { useRef } from "react";

export function ArchiveGrid({
  photos,
  locale,
  state,
  dictionary,
  collectionKey,
}: {
  photos: ArchivePhoto[];
  locale: Locale;
  state: ArchiveState;
  dictionary: GalleryDictionary;
  collectionKey: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useArchivePhotoMotion({
    scope: rootRef,
    collectionKey,
    visibleIds: photos.map((photo) => photo.id),
  });

  return (
    <div ref={rootRef} id="archive-results" className="archive-grid pt-8" tabIndex={-1}>
      {photos.map((photo, index) => (
        <ArchiveItem
          key={photo.id}
          photo={photo}
          index={index}
          variant={getArchiveItemVariant(photo, index)}
          locale={locale}
          state={state}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}
