"use client";

import type {
  ArchiveItemVariant,
  ArchivePhoto,
  ArchiveState,
} from "@/lib/archive/types";
import { saveArchiveContext } from "@/lib/archive/context";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import { ArrowUpRight } from "lucide-react";
import { serializeArchiveState } from "@/lib/archive/url";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const fallbackImage = "/photos/optimized/800/1.webp";

export function ArchiveItem({
  photo,
  index,
  variant,
  locale,
  state,
  dictionary,
}: {
  photo: ArchivePhoto;
  index: number;
  variant: ArchiveItemVariant;
  locale: Locale;
  state: ArchiveState;
  dictionary: GalleryDictionary;
}) {
  const [source, setSource] = useState(photo.src);
  const [imageFailed, setImageFailed] = useState(false);
  const href = `/${locale}/photo/${photo.id}${serializeArchiveState(state)}`;
  const sizes =
    variant === "featured" || variant === "panorama"
      ? "(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 62vw"
      : "(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 31vw";

  const persistContext = () => {
    const archiveHref = `${window.location.pathname}${window.location.search}#gallery`;
    saveArchiveContext({
      locale,
      photoId: photo.id,
      archiveHref,
      scrollY: window.scrollY,
      state,
      savedAt: Date.now(),
    });
  };

  return (
    <article
      id={`archive-photo-${photo.id}`}
      className={`archive-item archive-item--${variant}`}
      data-archive-item
      data-photo-id={photo.id}
    >
      <Link
        href={href}
        onClick={persistContext}
        className="group block"
        aria-label={`${photo.title}, ${dictionary.categories[photo.category]}, ${photo.year}`}
      >
        <figure>
          <div
            className="archive-item__media relative overflow-hidden border border-border bg-[var(--color-surface)] transition-colors duration-300 group-hover:border-[var(--color-border-strong)] group-focus-visible:border-accent"
            style={{
              aspectRatio: `${photo.width}/${photo.height}`,
              viewTransitionName: `archive-photo-${photo.id}`,
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
                className="object-cover brightness-[0.96] transition-[transform,filter] duration-500 ease-[var(--ease-standard)] group-hover:scale-[1.012] group-hover:brightness-[0.9]"
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
            <span className="archive-item__index absolute left-3 top-3 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white/75">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <figcaption className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-t border-border pt-4">
            <h3 className="font-serif text-[clamp(1.25rem,2vw,1.8rem)] leading-tight tracking-[-0.02em] text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground">
              {photo.title}
            </h3>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 size-4 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            />
            <p className="rv-meta col-span-2 flex flex-wrap items-center gap-x-3">
              <span>{dictionary.categories[photo.category]}</span>
              <span aria-hidden="true">/</span>
              <span>{photo.year}</span>
            </p>
          </figcaption>
        </figure>
      </Link>
    </article>
  );
}
