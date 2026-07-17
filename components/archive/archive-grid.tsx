import { ArchiveItem } from "@/components/archive/archive-item";
import { getArchiveItemVariant } from "@/lib/archive/selectors";
import type { ArchivePhoto, ArchiveState } from "@/lib/archive/types";
import type { GalleryDictionary, Locale } from "@/types/dictionary";

export function ArchiveGrid({
  photos,
  locale,
  state,
  dictionary,
}: {
  photos: ArchivePhoto[];
  locale: Locale;
  state: ArchiveState;
  dictionary: GalleryDictionary;
}) {
  return (
    <div id="archive-results" className="archive-grid pt-8" tabIndex={-1}>
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
