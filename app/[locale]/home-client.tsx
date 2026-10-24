"use client";

import { Contact } from "@/components/contact";
import { FaqSection } from "@/components/faq/faq-section";
import { ArchivePreview } from "@/components/archive/archive-preview";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HomeNarrative } from "@/components/home/home-narrative";
import { Navigation } from "@/components/navigation";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";

export default function HomeClient({
  dictionary,
  locale,
  imagesData,
}: {
  dictionary: Dictionary;
  locale: Locale;
  imagesData: ImagesData;
}) {
  return (
    <div className="relative">
      <Navigation dictionary={dictionary.nav} currentLocale={locale} />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative min-h-screen"
      >
        <Hero
          dictionary={dictionary.hero}
          imagesData={imagesData}
          entryReady
          locale={locale}
        />
        <HomeNarrative
          dictionary={dictionary}
          locale={locale}
          imagesData={imagesData}
          archiveSection={<ArchivePreview locale={locale} galleryDictionary={dictionary.gallery} ctaLabel={dictionary.home.archive.cta} imagesData={imagesData} />}
          contactSection={<><Contact dictionary={dictionary.contact} locale={locale} /><FaqSection dictionary={dictionary.faq} /></>}
        />
      </main>
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </div>
  );
}
