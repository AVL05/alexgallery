import { MetadataRoute } from 'next'
import { photos } from '@/lib/gallery-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gallery.aleviclop.dev'
  const locales = ['es', 'en']
  const routes = ['', '/politica-uso'] as const

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    // Main pages
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.7,
        alternates: {
          languages: {
            es: `${baseUrl}/es${route}`,
            en: `${baseUrl}/en${route}`,
            'x-default': route === '' ? `${baseUrl}/` : `${baseUrl}/es${route}`,
          },
        },
      })
    }

    // Individual Photo pages
    for (const photo of photos) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/photo/${photo.id}`,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            es: `${baseUrl}/es/photo/${photo.id}`,
            en: `${baseUrl}/en/photo/${photo.id}`,
            'x-default': `${baseUrl}/es/photo/${photo.id}`,
          },
        },
      })
    }
  }

  // Root redirect entry
  sitemapEntries.push({
    url: `${baseUrl}/`,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/`,
      },
    },
  })

  return sitemapEntries
}
