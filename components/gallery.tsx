"use client";

import { categories, photos as basePhotos } from "@/lib/gallery-data";
import imagesData from "@/lib/images-data.json";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { GalleryFilter, ImagesData, Photo } from "@/types/photo";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  Zap,
} from "lucide-react";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

type GalleryProps = {
  dictionary: GalleryDictionary & { locale: Locale };
};

const optimizedImages = imagesData as ImagesData;

const photos: Photo[] = basePhotos.map((photo) => {
  const optimized = optimizedImages.images.find(
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
});

export function Gallery({ dictionary }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryFilter>("Todo");
  const [index, setIndex] = useState(-1);

  const filteredPhotos = useMemo(() => {
    return selectedCategory === "Todo"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);
  }, [selectedCategory]);

  const slides = useMemo(() => {
    return filteredPhotos.map((photo) => ({
      src: photo.src as string,
      width: photo.width,
      height: photo.height,
      title: photo.title,
      description: photo.description,
      exif: photo.exif,
    }));
  }, [filteredPhotos]);

  return (
    <section
      id="gallery"
      className="bg-black py-24 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent">
              {dictionary.archive_label}
            </h2>
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
              {dictionary.selected_works} // {filteredPhotos.length}{" "}
              {dictionary.items}
            </span>
          </div>

          <div>
            <nav className="flex flex-wrap gap-x-5 gap-y-3 max-w-2xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  aria-label={`${dictionary.categories[cat] || cat}: ${dictionary.view_grid}`}
                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] sm:tracking-[0.22em] transition-all relative py-2 ${
                    selectedCategory === cat
                      ? "text-white"
                      : "text-white/45 hover:text-white/70"
                  }`}
                >
                  {dictionary.categories[cat] || cat}
                  {selectedCategory === cat && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 w-full h-px bg-white"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-6 md:gap-x-10"
        >
          {filteredPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: Math.min(i, 8) * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <Link
                href={`/${dictionary.locale || "es"}/photo/${photo.id}`}
                className="gallery-item group cursor-pointer space-y-4 relative block"
                onClick={(e: React.MouseEvent) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    setIndex(i);
                  }
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5 rounded-none border border-white/10 group-hover:border-white/35 transition-all duration-500 shadow-none">
                  <Image
                    src={(photo.src || photo.image) as string}
                    alt={photo.alt || photo.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-[1.025] brightness-95 group-hover:brightness-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 4}
                    placeholder={photo.blurDataURL ? "blur" : undefined}
                    blurDataURL={photo.blurDataURL}
                  />

                  <div className="absolute top-4 left-4 text-[10px] font-mono text-white/50 bg-black/35 backdrop-blur-md px-2 py-1 rounded-sm group-hover:text-white transition-colors">
                    {String(i + 1).padStart(3, "0")}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/65 group-hover:text-white transition-colors">
                    {photo.title}
                  </h3>
                  <div className="flex justify-between items-center text-[8px] font-mono text-white/45 group-hover:text-white/65 transition-colors uppercase">
                    <span>{photo.category}</span>
                    <span>{photo.year}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

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
              aria-label="Previous image"
              onClick={() =>
                setIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all group z-50 pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 text-white/30 group-hover:text-white transition-all transform group-hover:-translate-x-0.5" />
            </button>
          ),
          buttonNext: () => (
            <button
              type="button"
              aria-label="Next image"
              onClick={() =>
                setIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all group z-50 pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
            </button>
          ),
          slideFooter: ({ slide }) => {
            const exif = (slide as { exif?: Photo["exif"] }).exif;
            if (!exif || Object.keys(exif).length === 0) return null;

            return (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-none z-50">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-8 shadow-2xl flex items-center justify-center gap-6 md:gap-10 pointer-events-auto overflow-x-auto no-scrollbar">
                  {exif.model && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Camera className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
                        {exif.model}
                      </span>
                    </div>
                  )}
                  {exif.fNumber && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Layers className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
                        f/{exif.fNumber}
                      </span>
                    </div>
                  )}
                  {exif.exposureTime && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
                        {exif.exposureTime}s
                      </span>
                    </div>
                  )}
                  {exif.iso && (
                    <div className="flex items-center gap-2 shrink-0 border-l border-white/10 pl-6 md:pl-10">
                      <ImageIcon className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest italic">
                        ISO {exif.iso}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          },
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .98)" },
        }}
      />
    </section>
  );
}
