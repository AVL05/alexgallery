"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { MetaItem, MetaList } from "@/components/ui/photo-meta";
import { savePhotoReturn } from "@/lib/archive/context";
import { photoSizes } from "@/lib/images/sizes";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import { getPhotoHref } from "@/lib/photos";
import type { WorkEntryVariant } from "@/lib/photos/selectors";
import { getLocalizedSeries, getSeriesForPhoto } from "@/lib/series/selectors";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import Link from "next/link";

// Editorial entry for Selected Work (home) and the /work route. Layout
// variants are resolved server-side via resolveWorkEntryVariant.
const entrySizes: Record<WorkEntryVariant, string> = {
  "offset-right": photoSizes.archiveFeature,
  "offset-left": photoSizes.archiveFeature,
  narrow: photoSizes.workNarrow,
  panorama: photoSizes.fullBleed,
};

const entryFigureClass: Record<WorkEntryVariant, string> = {
  "offset-right": "md:col-start-5 md:col-span-8",
  "offset-left": "md:col-start-1 md:col-span-8",
  narrow: "mx-auto w-full max-w-md",
  panorama: "",
};

const entryMetaClass: Record<WorkEntryVariant, string> = {
  "offset-right": "md:col-start-1 md:col-span-3 md:row-start-1 md:self-end",
  "offset-left": "md:col-start-10 md:col-span-3 md:row-start-1 md:self-end",
  narrow: "mx-auto w-full max-w-md",
  panorama: "",
};

export function WorkEntry({
  photo,
  locale,
  galleryDictionary,
  index,
  total,
  variant,
  prefetch,
  ctaLabel,
  returnHref,
  failImages,
  slowImages,
}: {
  photo: NarrativePhoto;
  locale: Locale;
  galleryDictionary: GalleryDictionary;
  index: number;
  total: number;
  variant: WorkEntryVariant;
  prefetch?: boolean;
  ctaLabel: string;
  returnHref?: string;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const rawSeries = getSeriesForPhoto(photo.id);
  const series = rawSeries ? getLocalizedSeries(rawSeries, locale) : null;
  const split = variant === "offset-right" || variant === "offset-left";
  const captureReturn = () => {
    savePhotoReturn({
      locale,
      photoId: photo.id,
      returnHref: returnHref ?? `/${locale}#selected-work`,
      scrollY: window.scrollY,
      savedAt: Date.now(),
    });
  };

  return (
    <article>
      <Link
        href={getPhotoHref(locale, photo.id)}
        prefetch={prefetch}
        onClick={captureReturn}
        className="group block"
        data-press-feedback
        {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
        aria-label={`${photo.title}, ${galleryDictionary.categories[photo.category]}, ${photo.year}`}
      >
        <div className={split ? "grid gap-8 md:grid-cols-12 md:items-end" : undefined}>
          <figure className={entryFigureClass[variant]}>
            <NarrativeImage
              photo={photo}
              sizes={entrySizes[variant]}
              failPrimary={failImages}
              slow={slowImages}
              motionVariant={getPhotoRevealVariant({ ...photo, role: "selected" })}
              imageClassName="transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]"
            />
            {!split && (
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-serif leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent ${variant === "panorama" ? "text-[clamp(1.8rem,3vw,3rem)]" : "text-[clamp(1.4rem,2.4vw,2.1rem)]"}`}>
                    {photo.title}
                  </h3>
                  <span className="rv-index shrink-0">{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
                </div>
                <p className="rv-meta mt-3 flex flex-wrap items-center gap-x-3">
                  <span>{galleryDictionary.categories[photo.category]}</span>
                  <span aria-hidden="true">/</span>
                  <span>{photo.year}</span>
                  {series ? <><span aria-hidden="true">/</span><span>{galleryDictionary.seriesLabel}: {series.title}</span></> : null}
                </p>
              </figcaption>
            )}
          </figure>
          {split && (
            <div className={entryMetaClass[variant]}>
              <p className="rv-index">{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</p>
              <h3 className="mt-4 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent">
                {photo.title}
              </h3>
              <MetaList className="mt-6 gap-5 border-t border-border pt-5 md:grid-cols-1">
                <MetaItem label={galleryDictionary.categoriesLabel}>
                  {galleryDictionary.categories[photo.category]}
                </MetaItem>
                <MetaItem label={galleryDictionary.yearLabel}>{photo.year}</MetaItem>
                {series ? <MetaItem label={galleryDictionary.seriesLabel}>{series.title}</MetaItem> : null}
              </MetaList>
            </div>
          )}
        </div>
        <span className="sr-only">{ctaLabel}</span>
      </Link>
    </article>
  );
}
