import { getDictionary } from '@/lib/dictionary'
import HomeClient from './home-client'

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export default async function Page({ params }: { params: Promise<{ locale: 'en' | 'es' }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return <HomeClient dictionary={dictionary} locale={locale} />
}
