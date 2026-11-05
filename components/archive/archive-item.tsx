"use client";

import type {
  ArchiveItemVariant,
  ArchivePhoto,
  ArchiveState,
} from "@/lib/archive/types";
import { saveArchiveContext, savePhotoReturn } from "@/lib/archive/context";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import { serializeArchiveState } from "@/lib/archive/url";
import Image from "next/image";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { type CSSProperties, useState } from "react";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { homeExperienceConfig } from "@/lib/home/experience";
import { getLocalizedSeries, getSeriesForPhoto } from "@/lib/series/selectors";

const fallbackImage = "/photos/optimized/800/1.webp";

export function ArchiveItem({
  photo,
  index,
  variant,
  locale,
  state,
  dictionary,
  sectionHash = "#gallery",
}: {
  photo: ArchivePhoto;
  index: number;
  variant: ArchiveItemVariant;
  locale: Locale;
  state: ArchiveState;
  dictionary: GalleryDictionary;
  sectionHash?: string;
}) {
  const [source, setSource] = useState(photo.src);
  const [imageFailed, setImageFailed] = useState(false);
  const rawSeries = getSeriesForPhoto(photo.id);
  const series = rawSeries ? getLocalizedSeries(rawSeries, locale) : null;
  const href = `/${locale}/photo/${photo.id}${serializeArchiveState(state)}`;
  const sizes =
    variant === "featured" || variant === "panorama"
      ? "(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 62vw"
      : "(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 31vw";

  const persistContext = () => {
    const archiveHref = `${window.location.pathname}${window.location.search}${sectionHash}`;
    saveArchiveContext({
      locale,
      photoId: photo.id,
      archiveHref,
      scrollY: window.scrollY,
      state,
      savedAt: Date.now(),
    });
    savePhotoReturn({
      locale,
      photoId: photo.id,
      returnHref: archiveHref,
      scrollY: window.scrollY,
      savedAt: Date.now(),
    });
  };

  return (
    <article
      id={`archive-photo-${photo.id}`}
      className={`archive-item archive-item--${variant} rv-strip__item`}
      style={{ "--r": photo.width / photo.height, "--w": `${photo.width}px` } as CSSProperties}
      data-archive-item
      data-photo-id={photo.id}
    >
      <PhotoTransitionLink
        photoId={photo.id}
        href={href}
        prefetch={homeExperienceConfig.prefetch.archiveItems}
        onBeforeNavigate={persistContext}
        className="group block"
        data-press-feedback
        {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
        aria-label={`${photo.title}, ${dictionary.categories[photo.category]}, ${photo.year}`}
      >
        <figure>
          <div
            className="archive-item__media relative overflow-hidden bg-[var(--color-surface)]"
            style={{
              aspectRatio: `${photo.width}/${photo.height}`,
            }}
          >
            {!imageFailed ? (
              <Image
                src={source}
                alt={photo.alt || photo.description || photo.title}
                fill
                loading="lazy"
                decoding="async"
                sizes={sizes}
                placeholder={photo.blurDataURL && source === photo.src ? "blur" : undefined}
                blurDataURL={photo.blurDataURL}
                className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                onError={() => {
                  if (source !== fallbackImage) setSource(fallbackImage);
                  else setImageFailed(true);
                }}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[var(--color-surface)] px-6 text-center">
                <span className="rv-meta">{dictionary.imageError}</span>
              </div>
            )}
          </div>
          <figcaption className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
            <span className="archive-item__index rv-index pt-0.5">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-sm leading-snug text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
              {photo.title}
            </h3>
            <p className="col-start-2 flex flex-wrap items-center gap-x-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              <span>{dictionary.categories[photo.category]}</span>
              <span aria-hidden="true">·</span>
              <span>{photo.year}</span>
            </p>
            {series ? <p className="col-start-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{dictionary.seriesLabel}: {series.title}</p> : null}
          </figcaption>
        </figure>
      </PhotoTransitionLink>
    </article>
  );
}
