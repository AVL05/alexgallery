import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { SeriesPage } from "@/components/series/series-page";
import { PageShell } from "@/components/ui/layout";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { getDictionary, locales } from "@/lib/dictionary";
import { photos } from "@/lib/gallery-data";
import imagesDataJson from "@/lib/images-data.json";
import { photoSeries } from "@/lib/series/config";
import { getLocalizedSeries, getPublishedSeries, getSeriesBySlug, resolveSeriesCover } from "@/lib/series/selectors";
import { assertValidPhotoSeries } from "@/lib/series/validation";
import { siteUrl } from "@/lib/site-config";
import type { Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

assertValidPhotoSeries(photoSeries, photos);
const imagesData = imagesDataJson as ImagesData;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getPublishedSeries().map((series) => ({ locale, slug: series.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const rawSeries = getSeriesBySlug(slug);
  if (!rawSeries || rawSeries.status !== "published") return { title: locale === "es" ? "Serie no encontrada" : "Series not found", robots: { index: false, follow: true } };
  const series = getLocalizedSeries(rawSeries, locale);
  const cover = resolveSeriesCover(rawSeries, buildArchivePhotos(imagesData, locale));
  const title = `${series.title} — raw.vives`;
  return {
    title,
    description: series.description,
    alternates: { canonical: `/${locale}/series/${series.slug}`, languages: { "es-ES": `/es/series/${series.slug}`, "en-US": `/en/series/${series.slug}`, "x-default": `/es/series/${series.slug}` } },
    openGraph: { type: "article", locale: locale === "es" ? "es_ES" : "en_US", url: `/${locale}/series/${series.slug}`, title, description: series.description, siteName: "raw.vives — Visual Archive", images: cover ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt || cover.title }] : undefined },
    twitter: { card: "summary_large_image", title, description: series.description, images: cover ? [cover.src] : undefined },
  };
}

export default async function SeriesRoute({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const rawSeries = getSeriesBySlug(slug);
  if (!rawSeries || rawSeries.status !== "published") notFound();
  const dictionary = await getDictionary(locale);
  const archivePhotos = buildArchivePhotos(imagesData, locale);
  const series = getLocalizedSeries(rawSeries, locale);
  const cover = resolveSeriesCover(rawSeries, archivePhotos);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: series.title, description: series.description, url: `${siteUrl}/${locale}/series/${series.slug}`, primaryImageOfPage: cover ? { "@type": "ImageObject", contentUrl: `${siteUrl}${cover.src}`, caption: cover.alt || cover.title, width: cover.width, height: cover.height } : undefined, hasPart: rawSeries.photoIds.map((id) => ({ "@type": "ImageObject", url: `${siteUrl}/${locale}/photo/${id}` })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: dictionary.series.indexTitle, item: `${siteUrl}/${locale}/series` }, { "@type": "ListItem", position: 2, name: series.title, item: `${siteUrl}/${locale}/series/${series.slug}` }] },
    ],
  };
  return <PageShell><Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/series/${slug}`} /><SeriesPage locale={locale} dictionary={dictionary.series} rawSeries={rawSeries} photos={archivePhotos} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Footer currentLocale={locale} dictionary={dictionary.nav} /></PageShell>;
}
