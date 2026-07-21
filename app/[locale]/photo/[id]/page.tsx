import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { PhotoDetailPage } from "@/components/photo-detail/photo-detail-page";
import { PageShell } from "@/components/ui/layout";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { getDictionary, locales } from "@/lib/dictionary";
import { photos } from "@/lib/gallery-data";
import imagesDataJson from "@/lib/images-data.json";
import { getClientImagesData } from "@/lib/images/client-data";
import { buildPhotoStructuredData, getCleanPhotoPath } from "@/lib/photo-detail/seo";
import type { Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const imagesData = imagesDataJson as ImagesData;
const clientImagesData = getClientImagesData(imagesData);

export function generateStaticParams() {
  return locales.flatMap((locale) => photos.map((photo) => ({ locale, id: String(photo.id) })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const photo = buildArchivePhotos(imagesData, locale).find((entry) => String(entry.id) === id);
  if (!photo) return { title: locale === "es" ? "Fotografía no encontrada" : "Photograph not found", robots: { index: false, follow: true } };
  const cleanPath = getCleanPhotoPath(locale, photo.id);
  const alternateLocale = locale === "es" ? "en" : "es";
  const title = locale === "es" ? `${photo.title} — Fotografía de Alex Vicente` : `${photo.title} — Photography by Alex Vicente`;
  return {
    title,
    description: photo.description,
    alternates: { canonical: cleanPath, languages: { "es-ES": `/es/photo/${photo.id}`, "en-US": `/en/photo/${photo.id}`, "x-default": `/en/photo/${photo.id}` } },
    openGraph: { type: "article", locale: locale === "es" ? "es_ES" : "en_US", alternateLocale: alternateLocale === "es" ? ["es_ES"] : ["en_US"], url: cleanPath, title, description: photo.description, siteName: "raw.vives — Visual Archive", images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt || photo.title }] },
    twitter: { card: "summary_large_image", title, description: photo.description, images: [photo.src] },
  };
}

export default async function PhotoPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const photo = buildArchivePhotos(imagesData, locale).find((entry) => String(entry.id) === id);
  if (!photo) notFound();
  const dictionary = await getDictionary(locale);
  const structuredData = buildPhotoStructuredData(photo, locale);
  return <PageShell>
    <Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/photo/${id}`} />
    <PhotoDetailPage locale={locale} photoId={photo.id} imagesData={clientImagesData} dictionary={dictionary} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <Footer currentLocale={locale} dictionary={dictionary.nav} />
  </PageShell>;
}
