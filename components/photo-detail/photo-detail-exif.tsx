"use client";

import { MetaItem, MetaList } from "@/components/ui/photo-meta";
import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { getAvailableExif } from "@/lib/photo-detail/selectors";
import type { PhotoDetailDictionary } from "@/types/dictionary";

// Technical block fed only by real pipeline EXIF. Hidden when the photo has
// no EXIF data. Native disclosure keeps it accessible without libraries.
export function PhotoDetailExif({ dictionary }: { dictionary: PhotoDetailDictionary }) {
  const { current } = usePhotoDetailContext();
  const exif = getAvailableExif(current);
  const camera = [exif.make, exif.model].filter(Boolean).join(" ").trim();
  const rows: Array<{ label: string; value: string }> = [];
  if (camera) rows.push({ label: dictionary.camera, value: camera });
  if (exif.lensModel) rows.push({ label: dictionary.lens, value: String(exif.lensModel) });
  if (exif.fNumber !== undefined) rows.push({ label: dictionary.aperture, value: String(exif.fNumber) });
  if (exif.exposureTime) rows.push({ label: dictionary.shutter, value: String(exif.exposureTime) });
  if (exif.iso !== undefined) rows.push({ label: dictionary.iso, value: String(exif.iso) });
  if (rows.length === 0) return null;

  return (
    <details className="group mt-12 border-y border-border py-6 lg:mt-16">
      <summary className="rv-meta inline-flex min-h-11 cursor-pointer items-center gap-3 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="inline-block transition-transform duration-300 group-open:rotate-90">→</span>
        {dictionary.technicalData}
      </summary>
      <MetaList className="mt-6 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {rows.map((row) => (
          <MetaItem key={row.label} label={row.label} valueClassName="mt-2 font-mono text-xs text-[var(--color-text-secondary)]">
            {row.value}
          </MetaItem>
        ))}
      </MetaList>
    </details>
  );
}
