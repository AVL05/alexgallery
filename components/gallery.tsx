'use client'

import { categories, photos as basePhotos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import type { Photo } from '@/types/photo'
import { useMemo, useState, useRef } from 'react'
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutGrid, 
  MousePointer2, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Layers, 
  Zap, 
  Image as ImageIcon 
} from 'lucide-react'

const photos: Photo[] = basePhotos.map(photo => {
  const optimized = imagesData.images.find(img => img.id === photo.id.toString())
  return {
    ...photo,
    ...optimized,
    src: optimized?.src || photo.image,
    image: optimized?.src || photo.image,
    alt: photo.description || photo.title,
    histogram: (optimized as any)?.histogram
  } as Photo
})

export function Gallery({ dictionary }: { dictionary: any }) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('Todo')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(true)
  const [index, setIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const visibleCollection = useMemo(() => {
    return showFeaturedOnly ? photos.filter((photo) => photo.featured) : photos
  }, [showFeaturedOnly])

  const filteredPhotos = useMemo(() => {
    return selectedCategory === 'Todo'
      ? visibleCollection
      : visibleCollection.filter((p) => p.category === selectedCategory)
  }, [selectedCategory, visibleCollection])

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <section 
      id="gallery" 
      className="bg-black py-24 md:py-32 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      } as any}
    >
      {/* Luz ambiental suave */}
      <div className="absolute inset-0 pointer-events-none opacity-10 transition-opacity duration-500"
           style={{
             background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.12) 0%, transparent 38%)`
           }} />

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
             <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent">
              {showFeaturedOnly ? dictionary.collection_label : dictionary.archive_label}
             </h2>
             <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">
              {dictionary.selected_works} // {filteredPhotos.length} {dictionary.items}
             </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            <div className="flex bg-white/[0.03] p-1 rounded-sm border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => {
                    setShowFeaturedOnly(true)
                    setSelectedCategory('Todo')
                  }}
                  className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${showFeaturedOnly ? 'bg-white text-black' : 'text-white/35 hover:text-white/70'}`}
                >
                    {dictionary.collection_label}
                </button>
                <button
                  onClick={() => {
                    setShowFeaturedOnly(false)
                    setSelectedCategory('Todo')
                  }}
                  className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${!showFeaturedOnly ? 'bg-white text-black' : 'text-white/35 hover:text-white/70'}`}
                >
                    {dictionary.archive_label}
                </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex bg-white/[0.03] p-1 rounded-sm border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/25 hover:text-white/60'}`}
                  title={dictionary.view_grid}
                >
                    <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-sm transition-all ${viewMode === 'table' ? 'bg-white text-black' : 'text-white/25 hover:text-white/60'}`}
                  title={dictionary.view_table}
                >
                    <MousePointer2 size={14} />
                </button>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-3 max-w-2xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] sm:tracking-[0.22em] transition-all relative py-2 ${
                    selectedCategory === cat ? 'text-white' : 'text-white/25 hover:text-white/55'
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

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-6 md:gap-x-10"
            >
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/${dictionary.locale || 'es'}/photo/${photo.id}`}
                    className="gallery-item group cursor-pointer space-y-4 relative block"
                    onClick={(e: React.MouseEvent) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        setIndex(i)
                      }
                    }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-white/5 rounded-none border border-white/10 group-hover:border-white/35 transition-all duration-500 shadow-none">
                      <Image
                        src={(photo.src || photo.image) as string}
                        alt={photo.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-[1.025] brightness-95 group-hover:brightness-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i < 4}
                      />
                      
                      {/* Histograma Decorativo */}
                      <div className="absolute top-4 left-4 text-[10px] font-mono text-white/50 bg-black/35 backdrop-blur-md px-2 py-1 rounded-sm group-hover:text-white transition-colors">
                          {String(i + 1).padStart(3, '0')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/65 group-hover:text-white transition-colors">
                          {photo.title}
                      </h3>
                      <div className="flex justify-between items-center text-[8px] font-mono text-white/25 group-hover:text-white/45 transition-colors uppercase">
                          <span>{photo.category}</span>
                          <span>{photo.year}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[75vh] relative border border-white/5 rounded-3xl bg-neutral-950/30 backdrop-blur-sm overflow-hidden p-10 cursor-crosshair"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
              
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  drag
                  dragMomentum={false}
                  initial={{ 
                    x: (i % 4) * 200 + Math.random() * 50, 
                    y: Math.floor(i / 4) * 250 + Math.random() * 50,
                    rotate: Math.random() * 20 - 10 
                  }}
                  className="absolute w-48 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl cursor-grab active:cursor-grabbing hover:z-50 transition-shadow active:shadow-accent/20"
                >
                   <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-2 pointer-events-none">
                     <Image 
                     src={photo.src as string} 
                     alt={photo.title} 
                     fill 
                     className="object-cover" 
                     sizes="12rem"
                   />
                     {/* Mini Histograma en Mesa de Luz */}
                     {photo.histogram && (
                        <div className="absolute top-2 right-2 flex items-end gap-[1px] h-4 opacity-40">
                          {photo.histogram.map((val, idx) => (
                            <div key={idx} className="w-[1px] bg-white" style={{ height: `${val}%` }} />
                          ))}
                        </div>
                     )}
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter truncate max-w-[80%]">{photo.title}</span>
                      <button onClick={() => setIndex(i)} className="text-white/20 hover:text-accent transition-colors"><Maximize2 size={10} /></button>
                   </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none pointer-events-none"
              >
                  <MousePointer2 size={20} className="animate-bounce text-accent" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">{dictionary.light_table_hint}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
              onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all group z-50 pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 text-white/30 group-hover:text-white transition-all transform group-hover:-translate-x-0.5" />
            </button>
          ),
          buttonNext: () => (
            <button
              onClick={() => setIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all group z-50 pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
            </button>
          ),
          slideFooter: ({ slide }) => {
            const exif = (slide as any).exif;
            if (!exif || Object.keys(exif).length === 0) return null;

            return (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-none z-50">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-8 shadow-2xl flex items-center justify-center gap-6 md:gap-10 pointer-events-auto overflow-x-auto no-scrollbar">
                  {exif.model && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Camera className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">{exif.model}</span>
                    </div>
                  )}
                  {exif.fNumber && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Layers className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">f/{exif.fNumber}</span>
                    </div>
                  )}
                  {exif.exposureTime && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">{exif.exposureTime}s</span>
                    </div>
                  )}
                   {exif.iso && (
                    <div className="flex items-center gap-2 shrink-0 border-l border-white/10 pl-6 md:pl-10">
                      <ImageIcon className="w-3.5 h-3.5 text-accent/80" />
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest italic">ISO {exif.iso}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .98)" }
        }}
      />
    </section>
  )
}
