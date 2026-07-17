import type { ArchivePhoto } from "@/lib/archive/types";
import type { Locale } from "@/types/dictionary";
import { siteUrl } from "@/lib/site-config";

export function getCleanPhotoPath(locale: Locale, id: number) {
  return `/${locale}/photo/${id}`;
}

export function buildPhotoStructuredData(photo: ArchivePhoto, locale: Locale) {
  const cleanPath = getCleanPhotoPath(locale, photo.id);
  const cleanUrl = `${siteUrl}${cleanPath}`;
  const contentUrl = new URL(photo.src, siteUrl).toString();
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${cleanUrl}#image`,
    name: photo.title,
    description: photo.description,
    url: cleanUrl,
    contentUrl,
    thumbnailUrl: new URL(`/photos/optimized/800/${photo.id}.webp`, siteUrl).toString(),
    width: photo.width,
    height: photo.height,
    creator: { "@type": "Person", name: "Alex Vicente", url: siteUrl },
    copyrightHolder: { "@type": "Person", name: "Alex Vicente" },
    dateCreated: photo.year,
    genre: photo.category,
    inLanguage: locale,
  };
}
