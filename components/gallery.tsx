import { ArchivePage } from "@/components/archive/archive-page";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";

type GalleryProps = {
  dictionary: GalleryDictionary & { locale: Locale };
  imagesData: ImagesData;
};

export function Gallery({ dictionary, imagesData }: GalleryProps) {
  return <ArchivePage dictionary={dictionary} locale={dictionary.locale} imagesData={imagesData} />;
}
