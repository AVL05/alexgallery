import { MetadataRoute } from 'next'
import { photos } from '@/lib/gallery-data'
import { siteUrl } from '@/lib/site-config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['es', 'en']

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    sitemapEntries.push({
      url: `${siteUrl}/${locale}`,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          es: `${siteUrl}/es`,
          en: `${siteUrl}/en`,
          'x-default': `${siteUrl}/`,
        },
      },
    })

    // Individual Photo pages
    for (const photo of photos) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}/photo/${photo.id}`,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            es: `${siteUrl}/es/photo/${photo.id}`,
            en: `${siteUrl}/en/photo/${photo.id}`,
            'x-default': `${siteUrl}/es/photo/${photo.id}`,
          },
        },
      })
    }
  }

  // Root redirect entry
  sitemapEntries.push({
    url: `${siteUrl}/`,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: {
        es: `${siteUrl}/es`,
        en: `${siteUrl}/en`,
        'x-default': `${siteUrl}/`,
      },
    },
  })

  return sitemapEntries
}
