"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { Reveal } from "@/components/motion/reveal";
import { savePhotoReturn } from "@/lib/archive/context";
import { defaultArchiveState } from "@/lib/archive/types";
import { serializeArchiveState } from "@/lib/archive/url";
import { Container } from "@/components/ui/layout";
import { getArchiveSummary, getNarrativePhotos } from "@/lib/home/selectors";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoHref } from "@/lib/photos";
import { archivePageHref } from "@/lib/routes";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

// Home preview of the archive (section #gallery): the whole archive as a
// contact sheet in catalogue order. Frames keep their proportions; a single
// readout line names the frame under the pointer or keyboard focus. The full
// instrument (search, filters, ordering) lives on /archive.
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
  const allPhotos = useMemo(() => getNarrativePhotos(imagesData, locale), [imagesData, locale]);
  const summary = getArchiveSummary();
  const [inspected, setInspected] = useState<number | null>(null);
  const current = inspected === null ? null : allPhotos[inspected];

  return (
    <section id="gallery" aria-labelledby="archive-preview-title" className="rv-section bg-[var(--color-background-secondary)]">
      <Container>
        <Reveal className="rv-home-section-header mb-8">
          <div>
            <p className="rv-slate">{summary.total} <span aria-hidden="true" className="rv-slate__rule" /> {summary.startYear}–{summary.endYear}</p>
            <h2 id="archive-preview-title" className="rv-home-heading mt-5">{galleryDictionary.archive_label}</h2>
          </div>
          <nav aria-label={galleryDictionary.categoriesLabel} className="flex flex-wrap gap-x-6 gap-y-0 md:justify-end">
            {summary.categories.map(({ category, count }) => (
              <Link key={category} href={`${archivePageHref(locale)}${serializeArchiveState({ ...defaultArchiveState, category })}`} prefetch={false} className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-foreground focus-visible:text-foreground">
                {galleryDictionary.categories[category]}<span className="font-mono text-[11px] text-[var(--color-text-muted)]">{pad(count)}</span>
              </Link>
            ))}
          </nav>
        </Reveal>

        <p aria-hidden="true" className="rv-sheet-readout">
          {current ? (
            <>
              <span className="rv-index text-foreground">{pad(inspected! + 1)}</span>
              <span className="text-foreground">{current.title}</span>
              <span>{galleryDictionary.categories[current.category]} · {current.year}</span>
            </>
          ) : (
            <span>{galleryDictionary.contactSheet}</span>
          )}
        </p>

        <ol className="rv-strip rv-strip--sheet" onPointerLeave={() => setInspected(null)}>
          {allPhotos.map((photo, index) => (
            <li key={photo.id} className="rv-strip__item" style={{ "--r": photo.width / photo.height, "--w": `${photo.width}px` } as CSSProperties}>
              <Link
                href={getPhotoHref(locale, photo.id)}
                prefetch={false}
                onPointerEnter={() => setInspected(index)}
                onFocus={() => setInspected(index)}
                onBlur={() => setInspected(null)}
                onClick={() => {
                  savePhotoReturn({
                    locale,
                    photoId: photo.id,
                    returnHref: `/${locale}#gallery`,
                    scrollY: window.scrollY,
                    savedAt: Date.now(),
                  });
                }}
                className="rv-sheet-frame group"
                data-press-feedback
                {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
                aria-label={`${pad(index + 1)}. ${photo.title}, ${galleryDictionary.categories[photo.category]}, ${photo.year}`}
              >
                <NarrativeImage
                  photo={photo}
                  sizes="(max-width: 767px) 34vw, 14vw"
                  imageClassName="transition-[filter] duration-300"
                />
                <span aria-hidden="true" className="rv-sheet-frame__number">{pad(index + 1)}</span>
              </Link>
            </li>
          ))}
        </ol>

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
