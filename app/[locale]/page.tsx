import { getDictionary, locales } from '@/lib/dictionary'
import type { Locale } from '@/types/dictionary'
import type { ImagesData } from '@/types/photo'
import imagesDataJson from '@/lib/images-data.json'
import { getClientImagesData } from '@/lib/images/client-data'
import HomeClient from './home-client'

const imagesData = imagesDataJson as ImagesData
const clientImagesData = getClientImagesData(imagesData)

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: dict.seo.title,
    description: dict.seo.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es-ES': '/es',
        'en-US': '/en',
        'x-default': '/',
      },
    },
    openGraph: {
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: `/${locale}`,
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return <HomeClient dictionary={dictionary} locale={locale} imagesData={clientImagesData} />
}
