import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://gallery.aleviclop.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Alex Vicente | Archivo visual",
    template: "%s | Alex Vicente Visual Archive",
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
    title: "Alex Vicente | Archivo visual",
    description:
      "Archivo global de fotografía, viajes, escenas urbanas, naturaleza y capturas digitales.",
    siteName: "Alex Vicente Visual Archive",
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
    title: "Alex Vicente | Archivo visual",
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
      className={`${playfair.variable} ${inter.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="font-sans antialiased relative bg-background text-foreground selection:bg-accent/30">
        <div className="noise-texture" />

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
          <div className="flex flex-col min-h-screen">{children}</div>
        </Suspense>
      </body>
    </html>
  );
}
