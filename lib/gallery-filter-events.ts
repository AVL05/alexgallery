import type { GalleryFilter } from "@/types/photo";

export const GALLERY_FILTER_EVENT = "raw-vives:gallery-filter";

export function requestGalleryFilter(category: GalleryFilter) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<GalleryFilter>(GALLERY_FILTER_EVENT, { detail: category }),
  );
}
