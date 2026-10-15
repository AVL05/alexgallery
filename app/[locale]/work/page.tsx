import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { WorkPage } from "@/components/work/work-page";
import { PageShell } from "@/components/ui/layout";
import { getDictionary, locales } from "@/lib/dictionary";
import { getNarrativePhotos } from "@/lib/home/selectors";
import imagesDataJson from "@/lib/images-data.json";
import { getClientImagesData } from "@/lib/images/client-data";
import { selectSelectedPhotos } from "@/lib/photos/selectors";
import { siteUrl, socialImage } from "@/lib/site-config";
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
  const title = dictionary.nav.work;
  return {
    title,
    description: dictionary.seo.description,
    alternates: { canonical: `/${locale}/work`, languages: { "es-ES": "/es/work", "en-US": "/en/work", "x-default": "/en/work" } },
    openGraph: { type: "website", locale: locale === "es" ? "es_ES" : "en_US", url: `/${locale}/work`, title, description: dictionary.seo.description, siteName: "raw.vives — Visual Archive", images: [socialImage] },
    twitter: { card: "summary_large_image", title, description: dictionary.seo.description, images: [socialImage.url] },
  };
}

export default async function WorkRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const photos = selectSelectedPhotos(getNarrativePhotos(clientImagesData, locale));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dictionary.nav.work,
    description: dictionary.seo.description,
    url: `${siteUrl}/${locale}/work`,
  };
  return (
    <PageShell as="div">
      <Navigation dictionary={dictionary.nav} currentLocale={locale} isHome={false} currentPath={`/${locale}/work`} />
      <main id="main-content" tabIndex={-1}>
        <WorkPage
          photos={photos}
          locale={locale}
          galleryDictionary={dictionary.gallery}
          title={dictionary.nav.work}
          selectedCta={dictionary.home.selected.cta}
          introduction={dictionary.home.selected.description}
        />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </PageShell>
  );
}
