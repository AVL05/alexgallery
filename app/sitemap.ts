import { MetadataRoute } from 'next'
import { photos } from '@/lib/gallery-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alexgallery.alexviclop.workers.dev'
  const locales = ['es', 'en']
  const routes = ['', '/politica-uso']

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    // Main pages
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.7,
      })
    }

    // Individual Photo pages
    for (const photo of photos) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/photo/${photo.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // Root redirect entry
  sitemapEntries.push({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1.0,
  })

  return sitemapEntries
}
