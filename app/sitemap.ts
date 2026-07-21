import { MetadataRoute } from 'next'
import { photos } from '@/lib/gallery-data'
import { siteUrl } from '@/lib/site-config'
import { assertValidPhotoSeries } from '@/lib/series/validation'
import { getPublishedSeries } from '@/lib/series/selectors'
import { photoSeries } from '@/lib/series/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['es', 'en']
  const publishedSeries = getPublishedSeries()
  assertValidPhotoSeries(photoSeries, photos)

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
          'x-default': `${siteUrl}/en`,
        },
      },
    })

    sitemapEntries.push({
      url: `${siteUrl}/${locale}/series`,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          es: `${siteUrl}/es/series`,
          en: `${siteUrl}/en/series`,
          'x-default': `${siteUrl}/en/series`,
        },
      },
    })

    for (const series of publishedSeries) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}/series/${series.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            es: `${siteUrl}/es/series/${series.slug}`,
            en: `${siteUrl}/en/series/${series.slug}`,
            'x-default': `${siteUrl}/en/series/${series.slug}`,
          },
        },
      })
    }

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
            'x-default': `${siteUrl}/en/photo/${photo.id}`,
          },
        },
      })
    }
  }

  return sitemapEntries
}
