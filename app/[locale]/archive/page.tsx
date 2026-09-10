import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ArchivePage } from "@/components/archive/archive-page";
import { PageShell } from "@/components/ui/layout";
import { getDictionary, locales } from "@/lib/dictionary";
import imagesDataJson from "@/lib/images-data.json";
import { getClientImagesData } from "@/lib/images/client-data";
import { siteUrl } from "@/lib/site-config";
import type { Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import type { Metadata } from "next";

const imagesData = imagesDataJson as ImagesData;
const clientImagesData = getClientImagesData(imagesData);

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const title = `${dictionary.gallery.archive_label} — raw.vives`;
  return {
    title,
    description: dictionary.gallery.description,
    alternates: { canonical: `/${locale}/archive`, languages: { "es-ES": "/es/archive", "en-US": "/en/archive", "x-default": "/en/archive" } },
    openGraph: { type: "website", locale: locale === "es" ? "es_ES" : "en_US", url: `/${locale}/archive`, title, description: dictionary.gallery.description, siteName: "raw.vives — Visual Archive" },
    twitter: { card: "summary_large_image", title, description: dictionary.gallery.description },
  };
}

export default async function ArchiveRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dictionary.gallery.archive_label,
    description: dictionary.gallery.description,
    url: `${siteUrl}/${locale}/archive`,
  };
  return (
    <PageShell>
      <Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/archive`} />
      <div id="archive-top" className="pt-32 lg:pt-40">
        <ArchivePage dictionary={dictionary.gallery} locale={locale} imagesData={clientImagesData} sectionId="archive" topHref="#archive-top" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </PageShell>
  );
}
