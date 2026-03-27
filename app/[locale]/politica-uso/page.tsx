import { PoliticaClient } from "./politica-client"

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export default async function PoliticaUso({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <PoliticaClient locale={locale} />
}
