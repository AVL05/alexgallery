import { getDictionary, locales } from '@/lib/dictionary'
import { photos } from '@/lib/gallery-data'
import imagesData from '@/lib/images-data.json'
import { PhotoKeyboardNavigation } from '@/components/photo-keyboard-navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Container, PageShell } from '@/components/ui/layout'
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
  const dictionary = await getDictionary(locale)

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
    <PageShell>
      <PhotoKeyboardNavigation
        previousHref={previousHref}
        nextHref={nextHref}
        galleryHref={galleryHref}
      />
      <Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/photo/${id}`} />

      <Container className="pb-20 pt-32 sm:pt-36 lg:pb-28">
        <Link 
          href={galleryHref}
          className="rv-editorial-link group mb-10 sm:mb-12"
        >
          <ChevronLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{backText}</span>
        </Link>

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          {/* Main Image View */}
          <div className="lg:col-span-8">
            <div className="relative h-[62svh] min-h-[25rem] w-full overflow-hidden border border-border bg-[var(--color-surface)] sm:h-[70svh] lg:h-[76svh]">
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
          <div className="space-y-12 lg:col-span-4 lg:sticky lg:top-28">
            <div>
              <span className="rv-meta mb-5 block text-accent">
                {photo.category} // {photo.year}
              </span>
              <h1 className="rv-page-title mb-7">
                {photo.title}
              </h1>
              <p className="rv-intro">
                {photo.description}
              </p>
            </div>

            <nav
              aria-label={
                locale === 'es'
                  ? 'Navegación entre fotografías'
                  : 'Photo navigation'
              }
              className="space-y-0 border-t border-border"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href={previousHref}
                  rel="prev"
                  className="group min-h-28 border-b border-border py-5 pr-4 transition-colors hover:bg-[var(--color-hover)] sm:border-r lg:border-r-0 xl:border-r"
                >
                  <span className="rv-label mb-3 flex items-center gap-2 text-[var(--color-text-muted)] group-hover:text-accent">
                    <ArrowLeft aria-hidden="true" className="size-3.5" />
                    {previousText}
                  </span>
                  <span className="block font-serif text-lg leading-snug text-[var(--color-text-secondary)] group-hover:text-foreground">
                    {previousPhoto.title}
                  </span>
                </Link>

                <Link
                  href={nextHref}
                  rel="next"
                  className="group min-h-28 border-b border-border py-5 pl-4 text-right transition-colors hover:bg-[var(--color-hover)] lg:pl-0 xl:pl-4"
                >
                  <span className="rv-label mb-3 flex items-center justify-end gap-2 text-[var(--color-text-muted)] group-hover:text-accent">
                    {nextText}
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="block font-serif text-lg leading-snug text-[var(--color-text-secondary)] group-hover:text-foreground">
                    {nextPhoto.title}
                  </span>
                </Link>
              </div>

              <Link
                href={galleryHref}
                className="rv-editorial-link w-full justify-center border-b border-border py-4 no-underline"
              >
                <Grid3X3 aria-hidden="true" className="size-3.5" />
                {backText}
              </Link>

              <p className="rv-meta pt-4 text-center">
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
      </Container>
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </PageShell>
  )
}
