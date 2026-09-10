"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { Reveal } from "@/components/motion/reveal";
import { savePhotoReturn } from "@/lib/archive/context";
import { Container } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getArchiveSummary, getNarrativePhotos } from "@/lib/home/selectors";
import { homeCuration } from "@/lib/home/curation";
import { photoSizes } from "@/lib/images/sizes";
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
        <Reveal>
          <SectionHeader
            as="h2"
            tone="page"
            titleId="archive-preview-title"
            eyebrow={`${summary.total} ${galleryDictionary.photoPlural} · ${summary.startYear}–${summary.endYear}`}
            title={galleryDictionary.archive_label}
          />
        </Reveal>

        <div className="mt-14 columns-2 gap-5 md:columns-3 lg:columns-4 lg:mt-20">
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
              className="group mb-5 block break-inside-avoid"
              data-press-feedback
              {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
              aria-label={`${photo.title}, ${galleryDictionary.categories[photo.category]}, ${photo.year}`}
            >
              <NarrativeImage
                photo={photo}
                sizes={photoSizes.archivePreview}
                imageClassName="transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]"
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-lg leading-tight tracking-[-0.015em] text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground">
                  {photo.title}
                </h3>
                <span className="rv-meta shrink-0">{photo.year}</span>
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
