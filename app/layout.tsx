import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import type React from 'react'
import { Suspense } from 'react'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Alex Vicente | Fotografía Profesional',
    template: '%s | Alex Vicente',
  },
  description:
    'Portafolio de fotografía profesional de Alex Vicente. Capturando paisajes, fauna, arquitectura y momentos únicos con una visión artística.',
  keywords: [
    'fotografía',
    'portafolio',
    'Alex Vicente',
    'paisajes',
    'fauna',
    'arquitectura',
    'fotógrafo',
  ],
  authors: [{ name: 'Alex Vicente' }],
  creator: 'Alex Vicente',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://alexgallery.alexviclop.workers.dev',
    title: 'Alex Vicente - Galería Fotográfica',
    description:
      'Explora una colección única de momentos capturados a través de la lente. Paisajes, naturaleza y vida urbana.',
    siteName: 'Alex Vicente Fotografía',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable}`}
      scroll-behavior="smooth"
    >
      <body className="font-sans antialiased relative bg-background text-foreground selection:bg-accent/30">
        <div className="mesh-bg">
          <div className="mesh-sphere" />
          <div className="mesh-sphere" style={{ animationDelay: '-5s', background: 'white', opacity: 0.05 }} />
          <div className="mesh-sphere" style={{ animationDelay: '-10s', left: 'auto', right: '-10%', top: '20%' }} />
        </div>
        <div className="noise-texture" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Alex Vicente",
              "url": "https://alexgallery.alexviclop.workers.dev",
              "jobTitle": "Professional Photographer",
              "description": "Official photography portfolio of Alex Vicente López. Exploring landscapes, architecture, and nature through high-end visual storytelling.",
              "sameAs": [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "name": "Photography Selection",
              "description": "Highlights of personal photography by Alex Vicente.",
              "creator": {
                "@type": "Person",
                "name": "Alex Vicente",
              },
            }),
          }}
        />
        <Suspense fallback={null}>
          <div className="flex flex-col min-h-screen">{children}</div>
        </Suspense>
      </body>
    </html>
  )
}
