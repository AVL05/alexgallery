import { getDictionary } from '@/lib/dictionary'
import HomeClient from './home-client'

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'es' }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return {
    title: dict.seo.title,
    description: dict.seo.description,
    openGraph: {
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    }
  }
}

export default async function Page({ params }: { params: Promise<{ locale: 'en' | 'es' }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return <HomeClient dictionary={dictionary} locale={locale} />
}
