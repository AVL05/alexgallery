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
  const canonical = `/${locale}/politica-uso`
  return {
    title: locale === 'es' ? 'Condiciones de Uso y Copyright' : 'Terms of Use & Copyright',
    description: locale === 'es' 
      ? 'Información legal sobre los derechos de autor y condiciones de uso de las fotografías de Alex Vicente.' 
      : 'Legal information about copyright and terms of use for Alex Vicente\'s photography.',
    alternates: {
      canonical,
      languages: {
        'es-ES': '/es/politica-uso',
        'en-US': '/en/politica-uso',
        'x-default': '/es/politica-uso',
      },
    },
    openGraph: { locale: locale === 'es' ? 'es_ES' : 'en_US', url: canonical },
    robots: { index: false, follow: true },
  }
}

export default async function PoliticaUso({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  return <PoliticaClient locale={locale} navigation={dictionary.nav} />
}
