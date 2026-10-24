"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { Reveal } from "@/components/motion/reveal";
import { savePhotoReturn } from "@/lib/archive/context";
import { defaultArchiveState } from "@/lib/archive/types";
import { serializeArchiveState } from "@/lib/archive/url";
import { Container } from "@/components/ui/layout";
import { getArchiveSummary, getNarrativePhotos } from "@/lib/home/selectors";
import { homeCuration } from "@/lib/home/curation";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoHref } from "@/lib/photos";
import { selectArchivePreviewPhotos } from "@/lib/photos/selectors";
import { archivePageHref } from "@/lib/routes";
import { getPublishedSeries } from "@/lib/series/selectors";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Home preview of the archive (section #gallery): compact editorial masonry
// with a stable deterministic pick. The full experience lives on /archive.
export function ArchivePreview({
  locale,
  galleryDictionary,
  ctaLabel,
  imagesData,
}: {
  locale: Locale;
  galleryDictionary: GalleryDictionary;
  ctaLabel: string;
  imagesData: ImagesData;
}) {
  const allPhotos = getNarrativePhotos(imagesData, locale);
  const summary = getArchiveSummary();
  const preview = selectArchivePreviewPhotos(
    allPhotos,
    [
      homeCuration.heroPhotoId,
      ...homeCuration.selectedPhotoIds,
      ...getPublishedSeries().map((series) => series.coverPhotoId),
    ],
    8,
  );

  return (
    <section id="gallery" aria-labelledby="archive-preview-title" className="rv-section bg-[var(--color-background)]">
      <Container>
        <Reveal className="rv-home-section-header mb-6 border-t border-border pt-6">
          <h2 id="archive-preview-title" className="rv-home-heading">{galleryDictionary.archive_label}</h2>
          <p className="text-xs tabular-nums text-[var(--color-text-secondary)]">{summary.total} {galleryDictionary.photoPlural} · {summary.startYear}–{summary.endYear}</p>
        </Reveal>

        <nav aria-label={galleryDictionary.categoriesLabel} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border pb-4">
          {summary.categories.map(({ category, count }) => (
            <Link key={category} href={`${archivePageHref(locale)}${serializeArchiveState({ ...defaultArchiveState, category })}`} prefetch={false} className="inline-flex min-h-11 items-center gap-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-foreground">
              {galleryDictionary.categories[category]}<span className="font-mono text-[10px] text-[var(--color-text-muted)]">{String(count).padStart(2, "0")}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-10 columns-1 gap-6 min-[480px]:columns-2 md:columns-3 lg:columns-4">
          {preview.map((photo) => (
            <Link
              key={photo.id}
              href={getPhotoHref(locale, photo.id)}
              prefetch={false}
              onClick={() => {
                savePhotoReturn({
                  locale,
                  photoId: photo.id,
                  returnHref: `/${locale}#gallery`,
                  scrollY: window.scrollY,
                  savedAt: Date.now(),
                });
              }}
              className="group mb-8 block break-inside-avoid"
              data-press-feedback
              {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
              aria-label={`${photo.title}, ${galleryDictionary.categories[photo.category]}, ${photo.year}`}
            >
              <NarrativeImage
                photo={photo}
                sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                imageClassName="transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]"
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-[13px] leading-relaxed text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground">
                  {photo.title}
                </h3>
                <span className="shrink-0 text-xs tabular-nums text-[var(--color-text-secondary)]">{photo.year}</span>
              </div>
            </Link>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-border pt-8 lg:mt-20">
          <Link href={archivePageHref(locale)} className="rv-editorial-link">
            {ctaLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
