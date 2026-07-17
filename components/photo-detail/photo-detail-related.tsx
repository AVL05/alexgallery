"use client";

import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import type { GalleryDictionary, PhotoDetailDictionary } from "@/types/dictionary";
import Image from "next/image";
import Link from "next/link";

export function PhotoDetailRelated({ dictionary, galleryDictionary }: { dictionary: PhotoDetailDictionary; galleryDictionary: GalleryDictionary }) {
  const { related, hrefFor, preserveContext } = usePhotoDetailContext();
  return <section aria-labelledby="related-title">
    <p className="rv-kicker">07 / 08</p>
    <div className="mt-4 grid gap-6 border-b border-border pb-8 md:grid-cols-2 md:items-end"><h2 id="related-title" className="rv-section-title">{dictionary.related}</h2><p className="max-w-md text-[var(--color-text-secondary)] md:justify-self-end">{dictionary.relatedDescription}</p></div>
    <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{related.map((photo) => <article key={photo.id}><Link href={hrefFor(photo.id)} onClick={() => preserveContext(photo.id)} className="group block"><div className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}><Image src={photo.src} alt={photo.alt || photo.description} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" /></div><h3 className="mt-4 font-serif text-xl leading-tight">{photo.title}</h3><p className="rv-meta mt-2">{galleryDictionary.categories[photo.category]} / {photo.year}</p></Link></article>)}</div>
  </section>;
}
