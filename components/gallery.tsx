"use client";

import { categories, photos as basePhotos } from "@/lib/gallery-data";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { GalleryFilter, ImagesData, Photo } from "@/types/photo";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PhotoIndex } from "@/components/ui/metadata";
import { useMotion } from "@/components/motion/motion-provider";
import { useBatchReveal } from "@/hooks/use-batch-reveal";
import { Reveal } from "@/components/motion/reveal";
import { GALLERY_FILTER_EVENT } from "@/lib/gallery-filter-events";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

type GalleryProps = {
  dictionary: GalleryDictionary & { locale: Locale };
  imagesData: ImagesData;
};

const breakpointCols = {
  default: 3,
  1024: 2,
  640: 1,
};

export function Gallery({ dictionary, imagesData }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryFilter>("Todo");
  const [index, setIndex] = useState(-1);
  const galleryRef = useRef<HTMLElement>(null);
  const { lockScroll, refreshScrollTriggers } = useMotion();

  const photos: Photo[] = useMemo(
    () =>
      basePhotos.map((photo) => {
        const optimized = imagesData.images.find(
          (img) => img.id === photo.id.toString(),
        );
        return {
          ...photo,
          ...optimized,
          src: optimized?.src || photo.image,
          image: optimized?.src || photo.image,
          alt: photo.description || photo.title,
          width: optimized?.width ?? 1200,
          height: optimized?.height ?? 1600,
        } as Photo;
      }),
    [imagesData],
  );

  const filteredPhotos = useMemo(() => {
    return selectedCategory === "Todo"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);
  }, [selectedCategory, photos]);

  const slides = useMemo(() => {
    return filteredPhotos.map((photo) => ({
      src: photo.src as string,
      width: photo.width,
      height: photo.height,
      title: photo.title,
      description: photo.description,
    }));
  }, [filteredPhotos]);

  useBatchReveal(galleryRef, "[data-gallery-reveal]", selectedCategory);

  useEffect(() => {
    if (index < 0) return;
    return lockScroll("gallery-lightbox");
  }, [index, lockScroll]);

  useEffect(() => {
    const handleRequestedFilter = (event: Event) => {
      const category = (event as CustomEvent<GalleryFilter>).detail;
      if (!(categories as readonly GalleryFilter[]).includes(category)) return;
      setSelectedCategory(category);
      setIndex(-1);
      window.requestAnimationFrame(refreshScrollTriggers);
    };

    window.addEventListener(GALLERY_FILTER_EVENT, handleRequestedFilter);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, handleRequestedFilter);
  }, [refreshScrollTriggers]);

  return (
    <section
      ref={galleryRef}
      id="gallery"
      className="rv-section overflow-hidden bg-[var(--color-background-secondary)]"
    >
      <Container className="relative z-10">
        <Reveal className="mb-12 flex flex-col gap-8 border-b border-border pb-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="rv-kicker">Visual Archive</p>
            <h2 className="rv-section-title">
              {dictionary.archive_label}
            </h2>
            <span className="rv-meta">
              {dictionary.selected_works} // {filteredPhotos.length}{" "}
              {dictionary.items}
            </span>
          </div>

          <div>
            <nav
              aria-label={dictionary.view_grid}
              className="flex max-w-2xl flex-wrap gap-x-5 gap-y-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  aria-label={`${dictionary.categories[cat] || cat}: ${dictionary.view_grid}`}
                  type="button"
                  className={`relative inline-flex min-h-11 min-w-11 items-center justify-center py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-[11px] sm:tracking-[0.18em] ${
                    selectedCategory === cat
                      ? "text-accent"
                      : "text-[var(--color-text-muted)] hover:text-foreground"
                  }`}
                >
                  {dictionary.categories[cat] || cat}
                  {selectedCategory === cat && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-full bg-accent"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </Reveal>

        <Masonry
          breakpointCols={breakpointCols}
          className="masonry-grid"
          columnClassName="masonry-col"
        >
          {filteredPhotos.map((photo, i) => (
            <div
              key={photo.id}
              data-gallery-reveal
            >
              <Link
                href={`/${dictionary.locale || "es"}/photo/${photo.id}`}
                className="gallery-item group relative block space-y-4"
                onClick={(e: React.MouseEvent) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    setIndex(i);
                  }
                }}
              >
                <div
                  className="relative overflow-hidden border border-border bg-[var(--color-surface)] transition-colors duration-300 group-hover:border-[var(--color-border-strong)] group-focus-visible:border-accent"
                  style={{ aspectRatio: `${photo.width}/${photo.height}` }}
                >
                  <Image
                    src={(photo.src || photo.image) as string}
                    alt={photo.alt || photo.title}
                    fill
                    className="object-cover brightness-[0.96] transition-[transform,filter] duration-500 ease-[var(--ease-standard)] group-hover:scale-[1.018] group-hover:brightness-[0.88]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder={photo.blurDataURL ? "blur" : undefined}
                    blurDataURL={photo.blurDataURL}
                    onLoad={refreshScrollTriggers}
                  />

                  <PhotoIndex
                    value={i + 1}
                    className="absolute left-3 top-3 bg-black/65 px-2 py-1 text-white/70 transition-colors group-hover:text-accent sm:left-4 sm:top-4"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl leading-tight tracking-[-0.015em] text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground sm:text-2xl">
                    {photo.title}
                  </h3>
                  <div className="rv-meta flex items-center justify-between transition-colors group-hover:text-accent">
                    <span>{photo.category}</span>
                    <span>{photo.year}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Masonry>
      </Container>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions]}
        carousel={{
          preload: 2,
        }}
        render={{
          buttonPrev: () => (
            <button
              type="button"
              aria-label={dictionary.locale === "es" ? "Imagen anterior" : "Previous image"}
              onClick={() =>
                setIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
              }
              className="group pointer-events-auto absolute left-3 top-1/2 z-50 flex size-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition-colors hover:border-white/40 hover:bg-black sm:left-6 sm:size-12"
            >
              <ChevronLeft aria-hidden="true" className="size-5 text-white/70 transition-colors group-hover:text-white" />
            </button>
          ),
          buttonNext: () => (
            <button
              type="button"
              aria-label={dictionary.locale === "es" ? "Imagen siguiente" : "Next image"}
              onClick={() =>
                setIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
              }
              className="group pointer-events-auto absolute right-3 top-1/2 z-50 flex size-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition-colors hover:border-white/40 hover:bg-black sm:right-6 sm:size-12"
            >
              <ChevronRight aria-hidden="true" className="size-5 text-white/70 transition-colors group-hover:text-white" />
            </button>
          ),
        }}
        styles={{
          container: { backgroundColor: "rgba(8, 8, 8, .98)" },
        }}
      />
    </section>
  );
}
