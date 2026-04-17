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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alexgallery.alexviclop.workers.dev'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Alex Vicente | Fotografía Profesional & Visual Storytelling',
    template: '%s | Alex Vicente Photography',
  },
  description:
    'Explora el portafolio de Alex Vicente López. Fotografía profesional especializada en paisajes, arquitectura y naturaleza. Capturando momentos únicos con precisión técnica y visión artística.',
  keywords: [
    'fotografía profesional',
    'portafolio fotográfico',
    'Alex Vicente López',
    'fotografía de paisajes',
    'fotografía de arquitectura',
    'fotógrafo de naturaleza',
    'fine art photography',
    'fotografía editorial',
    'España',
    'visual storytelling'
  ],
  authors: [{ name: 'Alex Vicente' }],
  creator: 'Alex Vicente',
  publisher: 'Alex Vicente',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'Alex Vicente | Portafolio de Fotografía Profesional',
    description: 'Colección curada de fotografía de paisajes, arquitectura y naturaleza. Momentos efímeros capturados con visión artística.',
    siteName: 'Alex Vicente Photography',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Alex Vicente Photography Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Vicente | Fotografía Profesional',
    description: 'Explora mi portafolio de fotografía y visual storytelling.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
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
      style={{ scrollBehavior: 'smooth' }}
    >
      <body className="font-sans antialiased relative bg-background text-foreground selection:bg-accent/30">
        <div className="mesh-bg">
          <div className="mesh-sphere" />
          <div className="mesh-sphere" style={{ animationDelay: '-5s', background: 'white', opacity: 0.05 }} />
          <div className="mesh-sphere" style={{ animationDelay: '-10s', left: 'auto', right: '-10%', top: '20%' }} />
        </div>
        <div className="noise-texture" />
        
        {/* Structured Data: Person & ProfessionalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${baseUrl}/#person`,
                  "name": "Alex Vicente",
                  "url": baseUrl,
                  "image": `${baseUrl}/photos/optimized/original/14.webp`,
                  "description": "Professional photographer specializing in landscapes, architecture, and nature.",
                  "jobTitle": "Photographer",
                  "sameAs": [
                    "https://instagram.com/aleexx_005/",
                    "mailto:alexviclop@gmail.com"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  "url": baseUrl,
                  "name": "Alex Vicente Photography",
                  "publisher": { "@id": `${baseUrl}/#person` },
                  "inLanguage": ["es", "en"]
                },
                {
                  "@type": "ImageGallery",
                  "@id": `${baseUrl}/#gallery`,
                  "name": "Alex Vicente Photography Collection",
                  "description": "Selected architectural and landscape photography works.",
                  "creator": { "@id": `${baseUrl}/#person` }
                }
              ]
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
