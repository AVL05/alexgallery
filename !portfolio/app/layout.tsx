import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aleviclop.vercel.app";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Alex Vicente López - Portfolio",
    template: "%s | Alex Vicente López",
  },
  description:
    "Desarrollador Web | Fotógrafo Creativo | Diseñador Digital. Transformo ideas en experiencias digitales únicas.",
  generator: "v0.app",
  keywords: [
    "Desarrollador Web",
    "Portfolio",
    "Fotógrafo",
    "Diseño Digital",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Alex Vicente López", url: SITE_URL }],
  openGraph: {
    title: "Alex Vicente López - Portfolio",
    description:
      "Desarrollador Web | Fotógrafo Creativo | Diseñador Digital. Transformo ideas en experiencias digitales únicas.",
    url: SITE_URL,
    siteName: "Alex Vicente López",
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Alex Vicente López — Portfolio",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Vicente López - Portfolio",
    description:
      "Desarrollador Web | Fotógrafo Creativo | Diseñador Digital. Transformo ideas en experiencias digitales únicas.",
    images: [`${SITE_URL}/og-image.svg`],
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
  alternates: { canonical: SITE_URL },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
