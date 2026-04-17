import { photos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Camera, Layers, Zap, Image as ImageIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const locales = ['en', 'es']
  const params = []

  for (const locale of locales) {
    for (const photo of photos) {
      params.push({
        locale,
        id: photo.id.toString(),
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { id, locale } = await params
  const photo = photos.find(p => p.id.toString() === id)
  
  if (!photo) return {}

  const title = locale === 'es' ? `${photo.title} | Fotografía de Alex Vicente` : `${photo.title} | Photography by Alex Vicente`
  
  return {
    title,
    description: photo.description,
    openGraph: {
      title,
      description: photo.description,
      images: [
        {
          url: `/photos/optimized/original/${photo.id}.webp`,
          width: 1200,
          height: 630,
          alt: photo.title,
        },
      ],
    },
  }
}

export default async function PhotoPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { id, locale } = await params
  const photo = photos.find(p => p.id.toString() === id)
  const optimized = imagesData.images.find(img => img.id === id)

  if (!photo) notFound()

  const backText = locale === 'es' ? 'Volver a la galería' : 'Back to Gallery'

  return (
    <main className="min-h-screen bg-black text-white py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-accent transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">{backText}</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Main Image View */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[4/5] md:aspect-auto md:h-[70vh] w-full overflow-hidden rounded-sm bg-white/5 border border-white/10">
              <Image
                src={`/photos/optimized/original/${photo.id}.webp`}
                alt={photo.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </div>

          {/* Photo Details */}
          <div className="space-y-12">
            <div>
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                {photo.category} // {photo.year}
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
                {photo.title}
              </h1>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                {photo.description}
              </p>
            </div>

            {/* Technical Data Card */}
            {optimized?.exif && Object.keys(optimized.exif).length > 0 && (
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-4">
                  Metadata
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {(optimized.exif as any).model && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent/60">
                        <Camera className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Camera</span>
                      </div>
                      <p className="text-sm font-mono text-white/80">{(optimized.exif as any).model}</p>
                    </div>
                  )}
                  {(optimized.exif as any).fNumber && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent/60">
                        <Layers className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Aperture</span>
                      </div>
                      <p className="text-sm font-mono text-white/80">f/{(optimized.exif as any).fNumber}</p>
                    </div>
                  )}
                  {(optimized.exif as any).exposureTime && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent/60">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Shutter</span>
                      </div>
                      <p className="text-sm font-mono text-white/80">{(optimized.exif as any).exposureTime}s</p>
                    </div>
                  )}
                  {(optimized.exif as any).iso && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent/60">
                        <ImageIcon className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sensitivity</span>
                      </div>
                      <p className="text-sm font-mono text-white/80">ISO {(optimized.exif as any).iso}</p>
                    </div>
                  )}
                </div>

                {optimized.histogram && (
                  <div className="pt-4">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Histogram</span>
                     </div>
                     <div className="flex items-end gap-[2px] h-12 w-full">
                        {optimized.histogram.map((val, i) => (
                           <div key={i} className="flex-1 bg-accent/40 rounded-t-[1px]" style={{ height: `${val}%` }} />
                        ))}
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Structured Data: Image + Breadcrumbs */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "ImageObject",
                      "contentUrl": `/photos/optimized/original/${photo.id}.webp`,
                      "name": photo.title,
                      "description": photo.description,
                      "author": { "@type": "Person", "name": "Alex Vicente" },
                      "datePublished": photo.year,
                      "genre": photo.category,
                    },
                    {
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": locale === 'es' ? 'Inicio' : 'Home',
                          "item": `/${locale}`
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": photo.category,
                          "item": `/${locale}#gallery`
                        },
                        {
                          "@type": "ListItem",
                          "position": 3,
                          "name": photo.title,
                          "item": `/${locale}/photo/${photo.id}`
                        }
                      ]
                    }
                  ]
                }),
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
