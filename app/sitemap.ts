import { MetadataRoute } from 'next'
import { photos } from '@/lib/gallery-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alexgallery.alexviclop.workers.dev/'

  // Standard routes
  const routes = [
    '',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  // You can add more specific photo routes here if you implement subpages
  /*
  const photoRoutes = photos.map((photo) => ({
    url: `${baseUrl}/gallery/${photo.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  */

  return [...routes]
}
