"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import type { GalleryDictionary, PhotoDetailDictionary } from "@/types/dictionary";
import Image from "next/image";
import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function PhotoDetailRelated({ dictionary, galleryDictionary }: { dictionary: PhotoDetailDictionary; galleryDictionary: GalleryDictionary }) {
  const { current, related, hrefFor, preserveContext } = usePhotoDetailContext();
  return <section aria-labelledby="related-title">
    <p className="rv-kicker">07 / 08</p>
    <div className="mt-4 grid gap-6 border-b border-border pb-8 md:grid-cols-2 md:items-end"><h2 id="related-title" className="rv-section-title">{dictionary.related}</h2><p className="max-w-md text-[var(--color-text-secondary)] md:justify-self-end">{dictionary.relatedDescription}</p></div>
    <PhotoMotionGroup groupKey={`related-${current.id}`} className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{related.map((photo) => <article key={photo.id}><PhotoTransitionLink photoId={photo.id} href={hrefFor(photo.id)} onBeforeNavigate={() => preserveContext(photo.id)} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}><div data-photo-reveal="soft-scale" className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}><Image data-photo-motion-media src={photo.src} alt={photo.alt || photo.description} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]" /></div><h3 className="mt-4 font-serif text-xl leading-tight transition-colors group-hover:text-accent group-focus-visible:text-accent">{photo.title}</h3><p className="rv-meta mt-2">{galleryDictionary.categories[photo.category]} / {photo.year}</p></PhotoTransitionLink></article>)}</PhotoMotionGroup>
  </section>;
}
