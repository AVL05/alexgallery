'use client'

import { categories, photos as basePhotos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import type { Photo } from '@/types/photo'
import { memo, useMemo, useState, useEffect, useRef } from 'react'
import Masonry from 'react-masonry-css'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { OptimizedImage } from './ui/optimized-image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// Combine static data with optimized image metadata
const photos: Photo[] = basePhotos.map(photo => {
  const optimized = imagesData.images.find(img => img.id === photo.id.toString())
  return {
    ...photo,
    ...optimized,
    src: optimized?.src || photo.image,
    // Ensure we use the optimized src
    image: optimized?.src || photo.image,
    // Fallback to title if description is missing
    alt: photo.description || photo.title
  } as Photo
})

const PhotoItem = memo(
  ({
    photo,
    index,
    onClick,
  }: {
    photo: Photo
    index: number
    onClick: () => void
  }) => {
    const itemRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
      gsap.fromTo(itemRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top bottom-=50px',
            toggleActions: 'play none none none'
          }
        }
      )
    }, { scope: itemRef })

    return (
      <div
        ref={itemRef}
        className="mb-4 sm:mb-6 md:mb-8 group cursor-pointer opacity-0"
        onClick={onClick}
        onMouseEnter={() => {
          // Preload on hover
          const img = new Image();
          img.src = (photo.src || photo.image) as string;
        }}
      >
        <div className="relative overflow-hidden bg-card/10 transition-all duration-500 active:scale-[0.98]">
          <OptimizedImage
            src={(photo.src || photo.image) as string} // Preference for optimized src
            width={photo.width || 800}
            height={photo.height || 600}
            alt={photo.alt || photo.description || photo.title}
            blurDataURL={photo.blurDataURL}
            priority={index < 4}
            className="w-full h-auto transition-all duration-1000 group-hover:scale-[1.03] group-hover:brightness-75 group-hover:contrast-125"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-in-out" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none text-white">
            <span className="text-[0.65rem] uppercase tracking-widest font-sans mix-blend-difference">
              {photo.category} — {photo.year}
            </span>
            <h3 className="text-sm font-bold uppercase tracking-tighter mix-blend-difference">
              {photo.title}
            </h3>
          </div>
        </div>
      </div>
    )
  }
)

PhotoItem.displayName = 'PhotoItem'

export function Gallery({ dictionary }: { dictionary: any }) {
  const [selectedCategory, setSelectedCategory] = useState('Todo')
  const [index, setIndex] = useState(-1)
  const headerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)

  const filteredPhotos = useMemo(() => {
    return selectedCategory === 'Todo'
      ? photos
      : photos.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  useGSAP(() => {
    // Header entrance
    gsap.from(headerRef.current, {
      opacity: 0,
      x: -30,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top bottom-=100px'
      }
    })

    // Nav entrance
    gsap.from(navRef.current, {
      opacity: 0,
      duration: 1,
      delay: 0.2,
      scrollTrigger: {
        trigger: navRef.current,
        start: 'top bottom-=100px'
      }
    })
  }, { scope: headerRef })

  // Active tab indicator animation
  useGSAP(() => {
    const activeBtn = navRef.current?.querySelector(`button[data-active="true"]`) as HTMLElement
    if (activeBtn && activeTabRef.current) {
      gsap.to(activeTabRef.current, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.4,
        ease: 'power2.inOut'
      })
    }
  }, [selectedCategory])

  // Preload next 2 images when lightbox index changes
  useEffect(() => {
    if (index >= 0) {
      const nextImages = filteredPhotos.slice(index + 1, index + 3);
      nextImages.forEach(p => {
        const img = new Image();
        img.src = (p.src || p.image) as string;
      });
    }
  }, [index, filteredPhotos]);

  // Preload first 4 images of the selected category
  useEffect(() => {
    const firstImages = filteredPhotos.slice(0, 4);
    firstImages.forEach(p => {
       const img = new Image();
       img.src = (p.src || p.image) as string;
    });
  }, [filteredPhotos]);

  const slides = useMemo(() => {
    return filteredPhotos.map(p => ({
      src: p.src as string,
      width: p.width,
      height: p.height,
      title: p.title,
      description: p.description,
      exif: p.exif
    }))
  }, [filteredPhotos])

  const masonryBreakpoints = {
    default: 4,
    1280: 3,
    1024: 2,
    640: 1
  }

  return (
    <section
      id="gallery"
      className="bg-background py-16 md:py-32 lg:py-48 selection:bg-accent/30 overflow-x-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 lg:mb-32 gap-10 md:gap-14">
          <div ref={headerRef} className="w-full lg:max-w-3xl">
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-6 sm:mb-8">
              {dictionary.title}
              <br />
              <span className="text-accent italic font-serif lowercase block sm:inline">
                {dictionary.subtitle}
              </span>
            </h2>
            <div className="h-1 shadow-glow shadow-accent/50 w-16 sm:w-24 bg-accent" />
          </div>

          {/* Category Filter */}
          <nav
            ref={navRef}
            className="w-full lg:w-auto flex overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 gap-6 sm:gap-8 border-b border-white/5 pb-4 relative"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                data-active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] sm:text-[11px] font-black tracking-[0.2em] whitespace-nowrap uppercase transition-all relative py-2 ${
                  selectedCategory === cat
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {dictionary.categories[cat] || cat}
              </button>
            ))}
            <div
              ref={activeTabRef}
              className="absolute bottom-0 left-0 h-0.5 bg-accent"
              style={{ width: 0 }}
            />
          </nav>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={masonryBreakpoints}
          className="flex -ml-4 w-auto sm:-ml-6 md:-ml-8"
          columnClassName="pl-4 sm:pl-6 md:pl-8 bg-clip-padding"
        >
          {filteredPhotos.map((photo, i) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setIndex(i)}
            />
          ))}
        </Masonry>

        {/* Lightbox */}
        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
          render={{
            slideFooter: ({ slide }: { slide: any }) => (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono tracking-widest text-white/80 uppercase">
                {slide.exif?.model && (
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] opacity-40">Camera</span>
                    <span>{slide.exif.model}</span>
                  </div>
                )}
                {slide.exif?.fNumber && (
                   <div className="flex flex-col items-center border-l border-white/10 pl-6">
                    <span className="text-[8px] opacity-40">Aperture</span>
                    <span>f/{slide.exif.fNumber}</span>
                  </div>
                )}
                {slide.exif?.iso && (
                   <div className="flex flex-col items-center border-l border-white/10 pl-6">
                    <span className="text-[8px] opacity-40">ISO</span>
                    <span>{slide.exif.iso}</span>
                  </div>
                )}
                {slide.exif?.exposureTime && (
                   <div className="flex flex-col items-center border-l border-white/10 pl-6">
                    <span className="text-[8px] opacity-40">Speed</span>
                    <span>{slide.exif.exposureTime}s</span>
                  </div>
                )}
              </div>
            )
          }}
        />
      </div>
    </section>
  )
}
