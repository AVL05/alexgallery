import { socialImage } from "@/lib/site-config";
import { getDictionary, locales } from "@/lib/dictionary";
import type { Locale } from "@/types/dictionary";
import type { Metadata } from "next";
import { LicenciasClient } from "./licencias-client";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es" ? "Licencias de fotografía" : "Photography licensing";
  const description =
    locale === "es"
      ? "Consulta el uso de una fotografía del archivo personal de Alex Vicente. Tipos de licencia y cómo preparar una solicitud."
      : "Ask about using a photograph from Alex Vicente's personal archive. License types and how to prepare a request.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/licencias`,
      languages: {
        "es-ES": "/es/licencias",
        "en-US": "/en/licencias",
        "x-default": "/en/licencias",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: `/${locale}/licencias`,
      title,
      description,
      siteName: "raw.vives — Visual Archive",
      images: [socialImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
  };
}

export default async function LicenciasRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return <LicenciasClient locale={locale} navigation={dictionary.nav} />;
}
