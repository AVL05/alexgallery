import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { SeriesIndexPage } from "@/components/series/series-index-page";
import { PageShell } from "@/components/ui/layout";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { getDictionary, locales } from "@/lib/dictionary";
import { photos } from "@/lib/gallery-data";
import imagesDataJson from "@/lib/images-data.json";
import { photoSeries } from "@/lib/series/config";
import { getPublishedSeries } from "@/lib/series/selectors";
import { assertValidPhotoSeries } from "@/lib/series/validation";
import { siteUrl } from "@/lib/site-config";
import type { Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import type { Metadata } from "next";

assertValidPhotoSeries(photoSeries, photos);
const imagesData = imagesDataJson as ImagesData;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const title = `${dictionary.series.indexTitle} — raw.vives`;
  return {
    title,
    description: dictionary.series.indexIntroduction,
    alternates: { canonical: `/${locale}/series`, languages: { "es-ES": "/es/series", "en-US": "/en/series", "x-default": "/en/series" } },
    openGraph: { type: "website", url: `/${locale}/series`, title, description: dictionary.series.indexIntroduction, siteName: "raw.vives — Visual Archive" },
    twitter: { card: "summary_large_image", title, description: dictionary.series.indexIntroduction },
  };
}

export default async function SeriesIndexRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const seriesList = getPublishedSeries();
  const archivePhotos = buildArchivePhotos(imagesData, locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dictionary.series.indexTitle,
    description: dictionary.series.indexIntroduction,
    url: `${siteUrl}/${locale}/series`,
    hasPart: seriesList.map((series) => ({ "@type": "CreativeWorkSeries", name: series.title[locale], url: `${siteUrl}/${locale}/series/${series.slug}` })),
  };
  return <PageShell><Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/series`} /><SeriesIndexPage locale={locale} dictionary={dictionary.series} seriesList={seriesList} photos={archivePhotos} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Footer currentLocale={locale} dictionary={dictionary.nav} /></PageShell>;
}
