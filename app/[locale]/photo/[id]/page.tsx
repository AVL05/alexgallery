import { locales } from '@/lib/dictionary'
import { photos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import { PhotoKeyboardNavigation } from '@/components/photo-keyboard-navigation'
import type { Locale } from '@/types/dictionary'
import type { ImagesData } from '@/types/photo'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Grid3X3,
} from 'lucide-react'
import { notFound } from 'next/navigation'

const optimizedImages = imagesData as ImagesData;

export async function generateStaticParams() {
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

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale, id: string }> }) {
  const { id, locale } = await params
  const photo = photos.find(p => p.id.toString() === id)
  const optimized = optimizedImages.images.find(img => img.id === id)
  
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
          url: optimized?.src || `/photos/optimized/original/${photo.id}.webp`,
          width: 1200,
          height: 630,
          alt: photo.title,
        },
      ],
    },
  }
}

export default async function PhotoPage({ params }: { params: Promise<{ locale: Locale, id: string }> }) {
  const { id, locale } = await params
  const photoIndex = photos.findIndex(p => p.id.toString() === id)
  const photo = photos[photoIndex]
  const optimized = optimizedImages.images.find(img => img.id === id)

  if (!photo) notFound()

  const backText = locale === 'es' ? 'Volver a la galería' : 'Back to Gallery'
  const previousText = locale === 'es' ? 'Anterior' : 'Previous'
  const nextText = locale === 'es' ? 'Siguiente' : 'Next'
  const keyboardText =
    locale === 'es'
      ? 'Usa flecha izquierda, flecha derecha o Escape.'
      : 'Use left arrow, right arrow, or Escape.'
  const previousPhoto = photos[(photoIndex - 1 + photos.length) % photos.length]
  const nextPhoto = photos[(photoIndex + 1) % photos.length]
  const galleryHref = `/${locale}#gallery`
  const previousHref = `/${locale}/photo/${previousPhoto.id}`
  const nextHref = `/${locale}/photo/${nextPhoto.id}`

  return (
    <main className="min-h-screen bg-black text-white py-20 px-6">
      <PhotoKeyboardNavigation
        previousHref={previousHref}
        nextHref={nextHref}
        galleryHref={galleryHref}
      />

      <div className="container mx-auto max-w-6xl">
        <Link 
          href={galleryHref}
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
                src={optimized?.src || `/photos/optimized/original/${photo.id}.webp`}
                alt={photo.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
                placeholder={optimized?.blurDataURL ? "blur" : undefined}
                blurDataURL={optimized?.blurDataURL}
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

            <nav
              aria-label={
                locale === 'es'
                  ? 'Navegación entre fotografías'
                  : 'Photo navigation'
              }
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={previousHref}
                  rel="prev"
                  className="group min-h-24 border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <span className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35 group-hover:text-accent">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {previousText}
                  </span>
                  <span className="block text-sm font-bold uppercase leading-snug tracking-normal text-white/75 group-hover:text-white">
                    {previousPhoto.title}
                  </span>
                </Link>

                <Link
                  href={nextHref}
                  rel="next"
                  className="group min-h-24 border border-white/10 bg-white/[0.03] p-4 text-right transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <span className="mb-3 flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35 group-hover:text-accent">
                    {nextText}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="block text-sm font-bold uppercase leading-snug tracking-normal text-white/75 group-hover:text-white">
                    {nextPhoto.title}
                  </span>
                </Link>
              </div>

              <Link
                href={galleryHref}
                className="flex items-center justify-center gap-3 border border-white/10 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/45 transition-colors hover:border-white/30 hover:text-white"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                {backText}
              </Link>

              <p className="text-center text-[10px] font-mono uppercase tracking-widest text-white/25">
                {keyboardText}
              </p>
            </nav>

            {/* Structured Data: Image + Breadcrumbs */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "ImageObject",
                      "contentUrl": optimized?.src || `/photos/optimized/original/${photo.id}.webp`,
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
