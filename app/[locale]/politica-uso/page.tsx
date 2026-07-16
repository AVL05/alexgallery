import { PoliticaClient } from "./politica-client"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/types/dictionary"

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Condiciones de Uso y Copyright' : 'Terms of Use & Copyright',
    description: locale === 'es' 
      ? 'Información legal sobre los derechos de autor y condiciones de uso de las fotografías de Alex Vicente.' 
      : 'Legal information about copyright and terms of use for Alex Vicente\'s photography.',
    robots: { index: false } // Common practice for legal pages to avoid cluttering main search results, or keep true if desired.
  }
}

export default async function PoliticaUso({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  return <PoliticaClient locale={locale} navigation={dictionary.nav} />
}
