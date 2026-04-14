'use client'

import { categories, photos as basePhotos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import type { Photo } from '@/types/photo'
import { useMemo, useState, useRef } from 'react'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const photos: Photo[] = basePhotos.map(photo => {
  const optimized = imagesData.images.find(img => img.id === photo.id.toString())
  return {
    ...photo,
    ...optimized,
    src: optimized?.src || photo.image,
    image: optimized?.src || photo.image,
    alt: photo.description || photo.title
  } as Photo
})

export function Gallery({ dictionary }: { dictionary: any }) {
  const [selectedCategory, setSelectedCategory] = useState('Todo')
  const [index, setIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredPhotos = useMemo(() => {
    return selectedCategory === 'Todo'
      ? photos
      : photos.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

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

  useGSAP(() => {
    gsap.from('.gallery-item', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom-=100px',
            toggleActions: 'play none none none'
        }
    })
  }, { scope: containerRef, dependencies: [filteredPhotos] })

  return (
    <section id="gallery" className="bg-black py-24 md:py-40">
      <div className="container mx-auto px-6">
        {/* Minimalist Filter Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8 border-b border-white/5 pb-10">
          <div className="flex flex-col gap-2">
             <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent">Archive.024</h2>
             <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">Selected Works // {filteredPhotos.length} Items</span>
          </div>

          <nav className="flex flex-wrap gap-x-12 gap-y-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-3 ${
                  selectedCategory === cat ? 'text-accent' : 'text-white/20 hover:text-white/40'
                }`}
              >
                {dictionary.categories[cat] || cat}
                {selectedCategory === cat && (
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_var(--accent)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Compact & Sophisticated Index Grid */}
        <div 
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12"
        >
          {filteredPhotos.map((photo, i) => (
            <div 
              key={photo.id}
              className="gallery-item group cursor-pointer space-y-4"
              onClick={() => setIndex(i)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white/5 rounded-sm border border-white/5 group-hover:border-accent/40 transition-colors shadow-none group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <Image
                  src={(photo.src || photo.image) as string}
                  alt={photo.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-110 group-hover:contrast-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {/* Visual Index Number */}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/60 bg-black/40 backdrop-blur-md px-2 py-1 rounded-sm group-hover:text-accent transition-colors">
                    {String(i + 1).padStart(3, '0')}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                    {photo.title}
                </h3>
                <div className="flex justify-between items-center text-[8px] font-mono text-white/10 group-hover:text-white/30 transition-colors uppercase">
                    <span>{photo.category}</span>
                    <span>{photo.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </section>
  )
}
