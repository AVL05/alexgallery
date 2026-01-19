import { AnimatedBackground } from "@/components/animated-background";

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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

export const metadata: Metadata = {
  title: {
    default: "Alex Vicente | Fotografía Profesional",
    template: "%s | Alex Vicente",
  },
  description:
    "Portafolio de fotografía profesional de Alex Vicente. Capturando paisajes, fauna, arquitectura y momentos únicos con una visión artística.",
  keywords: [
    "fotografía",
    "portafolio",
    "Alex Vicente",
    "paisajes",
    "fauna",
    "arquitectura",
    "fotógrafo",
  ],
  authors: [{ name: "Alex Vicente" }],
  creator: "Alex Vicente",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://alexvicente.es",
    title: "Alex Vicente - Galería Fotográfica",
    description:
      "Explora una colección única de momentos capturados a través de la lente. Paisajes, naturaleza y vida urbana.",
    siteName: "Alex Vicente Fotografía",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      scroll-behavior="smooth"
    >
      <body className="font-sans antialiased relative bg-background text-foreground selection:bg-accent/30">
        <AnimatedBackground />
        <Suspense fallback={null}>
          <div className="flex flex-col min-h-screen">{children}</div>
        </Suspense>
      </body>
    </html>
  );
}
