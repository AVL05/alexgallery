"use client";

import { categories, photos } from "@/lib/gallery-data";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";
import { memo, useCallback, useState } from "react";

// Performance-optimized Item  (Natural Aspect Ratio).
const PhotoItem = memo(
  ({
    photo,
    index,
    onClick,
  }: {
    photo: any;
    index: number;
    onClick: (p: any) => void;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
        className="mb-4 sm:mb-6 md:mb-8 break-inside-avoid group cursor-pointer"
        onClick={() => onClick(photo)}
      >
        <div className="relative overflow-hidden rounded-xl bg-card/10 border border-white/5 transition-all duration-500 hover:border-accent/40 active:scale-[0.98]">
          <img
            src={photo.image}
            alt={photo.title}
            className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.05]"
            loading="lazy"
          />

          {/* Modern Hover/Tap Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 sm:p-6">
            <p className="text-accent text-[8px] sm:text-[10px] font-black tracking-[0.3em] uppercase mb-1">
              {photo.category}
            </p>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-bold tracking-tighter leading-none">
              {photo.title}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  },
);

PhotoItem.displayName = "PhotoItem";

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(
    null,
  );

  const filteredPhotos =
    selectedCategory === "Todo"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const handleOpenPhoto = useCallback((photo: any) => {
    setSelectedPhoto(photo);
    // Prevent body scroll on mobile
    document.body.style.overflow = "hidden";
  }, []);

  const handleClosePhoto = useCallback(() => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
  }, []);

  return (
    <section
      id="gallery"
      className="bg-background py-16 md:py-32 lg:py-48 selection:bg-accent/30 overflow-x-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Dynamic Editorial Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 lg:mb-32 gap-10 md:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:max-w-3xl"
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-6 sm:mb-8">
              SELECCIÓN
              <br />
              <span className="text-accent italic font-serif lowercase block sm:inline">
                Personal
              </span>
            </h2>
            <div className="h-1 shadow-glow shadow-accent/50 w-16 sm:w-24 bg-accent" />
          </motion.div>

          {/* Neo-Nav with Horizontal Scroll on Mobile */}
          <motion.nav
            className="w-full lg:w-auto flex overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 gap-6 sm:gap-8 border-b border-white/5 pb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] sm:text-[11px] font-black tracking-[0.2em] whitespace-nowrap uppercase transition-all relative py-2 ${
                  selectedCategory === cat
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </motion.nav>
        </div>

        {/* Improved Responsive Masonry */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 md:gap-8 space-y-4 sm:space-y-6 md:space-y-8">
          {filteredPhotos.map((photo, index) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={index}
              onClick={handleOpenPhoto}
            />
          ))}
        </div>

        {/* Modal - Fully Optimized for Mobile/Tablet */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 z-[100] bg-background flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 250 }}
            >
              {/* Top Mobile Bar */}
              <div className="flex items-center justify-between p-5 md:p-8 lg:p-10 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <button
                  onClick={handleClosePhoto}
                  className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase hover:text-accent transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Volver
                </button>
                <div className="flex flex-col items-end">
                  <span className="text-accent text-[8px] sm:text-[10px] font-black tracking-widest uppercase">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-foreground text-xs sm:text-sm font-bold tracking-tighter truncate max-w-[150px] sm:max-w-none">
                    {selectedPhoto.title}
                  </span>
                </div>
              </div>

              {/* Responsive Visual Experience */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-[#050505]">
                {/* Image Focus Area */}
                <div className="flex-[2] relative flex items-center justify-center p-4 min-h-[50vh] lg:min-h-0 lg:h-full">
                  <motion.img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                </div>

                {/* Content Panel - Scrolls on Mobile */}
                <div className="flex-1 p-8 md:p-14 lg:p-20 flex flex-col justify-center items-start lg:h-full bg-background/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/5">
                  <div className="space-y-6 md:space-y-10 w-full">
                    <div className="space-y-3 sm:space-y-5">
                      <span className="text-accent text-[10px] font-mono uppercase tracking-[0.3em]">
                        {selectedPhoto.year} COLLECTION
                      </span>
                      <h3 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                        {selectedPhoto.title}
                      </h3>
                    </div>

                    <div className="h-0.5 w-12 bg-accent/30" />

                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                      {selectedPhoto.description}
                    </p>

                    <div className="pt-8 sm:pt-12 border-t border-white/10 w-full">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-card border border-white/10 flex items-center justify-center shrink-0">
                          <Camera className="h-4 w-4 sm:h-6 sm:h-6 text-accent opacity-60" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8px] sm:text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
                            Capture Specifications
                          </p>
                          <p className="text-xs sm:text-sm font-bold tracking-tight text-white/90">
                            Sony A7R IV · 35mm f/1.4 GM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
