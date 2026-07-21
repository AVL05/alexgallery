"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import type { GalleryDictionary, PhotoDetailDictionary } from "@/types/dictionary";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function PhotoDetailNavigation({ dictionary, galleryDictionary }: { dictionary: PhotoDetailDictionary; galleryDictionary: GalleryDictionary }) {
  const { previous, next, hrefFor, preserveContext } = usePhotoDetailContext();
  const item = (photo: typeof previous, direction: "previous" | "next") => {
    const label = direction === "previous" ? dictionary.previous : dictionary.next;
    if (!photo) return <div className="photo-detail-nav-card is-disabled" aria-disabled="true"><span className="rv-label">{label}</span><span className="rv-meta mt-4">{direction === "previous" ? dictionary.noPrevious : dictionary.noNext}</span></div>;
    return <PhotoTransitionLink photoId={photo.id} rel={direction === "previous" ? "prev" : "next"} href={hrefFor(photo.id)} onBeforeNavigate={() => preserveContext(photo.id)} className="photo-detail-nav-card group" data-press-feedback {...getCursorTargetAttributes({ type: direction, contrast: "dark" })}>
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface)]"><Image src={photo.src} alt="" fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.015] group-focus-visible:scale-[1.015]" /></div>
      <span className="rv-label mt-5 flex items-center gap-2">{direction === "previous" && <ArrowLeft aria-hidden="true" className="size-4" />}{label}{direction === "next" && <ArrowRight aria-hidden="true" className="size-4" />}</span>
      <span className={`mt-3 block font-serif text-2xl leading-tight transition-transform duration-300 ${direction === "previous" ? "group-hover:-translate-x-1 group-focus-visible:-translate-x-1" : "group-hover:translate-x-1 group-focus-visible:translate-x-1"}`}>{photo.title}</span>
      <span className="rv-meta mt-3 block">{galleryDictionary.categories[photo.category]} / {photo.year}</span>
    </PhotoTransitionLink>;
  };
  return <nav aria-label={dictionary.navigationLabel} className="grid gap-6 md:grid-cols-2">{item(previous, "previous")}{item(next, "next")}</nav>;
}
