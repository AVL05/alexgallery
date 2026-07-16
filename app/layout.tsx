import type { Metadata, Viewport } from "next";
import { Manrope, Prata } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";
import { MotionDevelopmentTools } from "@/components/motion/development-tools";
import { IntroBootstrapScript } from "@/components/intro/intro-bootstrap-script";
import "./globals.css";

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://gallery.aleviclop.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "raw.vives | Visual Archive",
    template: "%s | raw.vives",
  },
  description:
    "Archivo visual de Alex Vicente: fotografía, viajes, naturaleza, ciudad, coches, escenas cotidianas y capturas digitales.",
  keywords: [
    "archivo visual",
    "fotografía",
    "Alex Vicente",
    "galería fotográfica",
    "capturas digitales",
    "fotografía de viajes",
    "fotografía urbana",
    "fotografía de naturaleza",
    "visual archive",
  ],
  authors: [{ name: "Alex Vicente" }],
  creator: "Alex Vicente",
  publisher: "Alex Vicente",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "raw.vives | Visual Archive by Alex Vicente",
    description:
      "Archivo global de fotografía, viajes, escenas urbanas, naturaleza y capturas digitales.",
    siteName: "raw.vives — Visual Archive",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Alex Vicente Visual Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "raw.vives | Visual Archive by Alex Vicente",
    description:
      "Explora un archivo visual global de fotos y capturas digitales.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${prata.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <IntroBootstrapScript />
      </head>
      <body className="relative bg-background font-sans text-foreground">
        <div className="noise-texture" aria-hidden="true" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${baseUrl}/#person`,
                  name: "Alex Vicente",
                  url: baseUrl,
                  image: `${baseUrl}/photos/optimized/original/14.webp`,
                  description:
                    "Personal visual archive by Alex Vicente, including photography, travel images, daily scenes, and digital captures.",
                  jobTitle: "Visual archivist",
                  sameAs: [
                    "https://instagram.com/aleexx_005/",
                    "mailto:alexviclop@gmail.com",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  url: baseUrl,
                  name: "Alex Vicente Visual Archive",
                  publisher: { "@id": `${baseUrl}/#person` },
                  inLanguage: ["es", "en"],
                },
                {
                  "@type": "ImageGallery",
                  "@id": `${baseUrl}/#gallery`,
                  name: "Alex Vicente Visual Archive",
                  description:
                    "Global visual archive of photography, travel scenes, nature, city images, and digital captures.",
                  creator: { "@id": `${baseUrl}/#person` },
                },
              ],
            }),
          }}
        />

        <Suspense fallback={null}>
          <MotionProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
            <MotionDevelopmentTools />
          </MotionProvider>
        </Suspense>
      </body>
    </html>
  );
}
