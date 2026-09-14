import { getDictionary, locales } from "@/lib/dictionary";
import type { Locale } from "@/types/dictionary";
import type { Metadata } from "next";
import { LicenciasClient } from "./licencias-client";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es" ? "Licencias de fotografía — raw.vives" : "Photography licensing — raw.vives";
  const description =
    locale === "es"
      ? "Licencia una fotografía de Alex Vicente para uso personal, editorial o comercial. Tipos de licencia, proceso de solicitud y respuesta en 48-72 horas."
      : "License a photograph by Alex Vicente for personal, editorial or commercial use. License types, request process and reply within 48-72 hours.";
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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LicenciasRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return <LicenciasClient locale={locale} navigation={dictionary.nav} />;
}
