'use client'

import { categories, photos } from '@/lib/gallery-data'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback, useState } from 'react'

// Performance-optimized Item  (Natural Aspect Ratio).
const PhotoItem = memo(
  ({
    photo,
    index,
    onClick,
  }: {
    photo: any
    index: number
    onClick: (p: any) => void
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
        className="mb-4 sm:mb-6 md:mb-8 break-inside-avoid group cursor-pointer"
        onClick={() => onClick(photo)}
      >
        <div className="relative overflow-hidden bg-card/10 border-0 transition-all duration-500 active:scale-[0.98]">
          <img
            src={photo.image}
            alt={photo.title}
            className="w-full h-auto transition-all duration-1000 group-hover:scale-[1.03] group-hover:brightness-75 group-hover:contrast-125"
            loading="lazy"
          />

          {/* Modern Minimal Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-in-out" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none text-white">
            <span className="text-[0.65rem] uppercase tracking-widest font-sans mix-blend-difference">
              Shoot {index < 9 ? `0${index + 1}` : index + 1}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }
)

PhotoItem.displayName = 'PhotoItem'

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('Todo')
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(
    null
  )

  const filteredPhotos =
    selectedCategory === 'Todo'
      ? photos
      : photos.filter((p) => p.category === selectedCategory)

  const handleOpenPhoto = useCallback((photo: any) => {
    setSelectedPhoto(photo)
    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden'
  }, [])

  const handleClosePhoto = useCallback(() => {
    setSelectedPhoto(null)
    document.body.style.overflow = 'auto'
  }, [])

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
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
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
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 250 }}
            >
              {/* Top Minimal Bar */}
              <div className="absolute top-0 left-0 right-0 p-5 md:p-8 flex justify-between items-start z-20 mix-blend-difference pointer-events-none">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-xs tracking-[0.3em] font-sans uppercase">
                    {selectedPhoto.title}
                  </span>
                  <span className="text-white/60 text-[10px] tracking-[0.2em] font-sans uppercase">
                    {selectedPhoto.category}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClosePhoto}
                className="absolute top-5 md:top-8 right-5 md:right-8 z-30 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
              >
                Cerrar
              </button>

              {/* Pure Lightroom Experience */}
              <div className="flex-1 w-full h-full flex items-center justify-center p-4 md:p-12">
                <motion.img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
