import { PhotoDetailActions } from "@/components/photo-detail/photo-detail-actions";
import { PhotoDetailBackLink } from "@/components/photo-detail/photo-detail-back-link";
import { PhotoDetailContextProvider } from "@/components/photo-detail/photo-detail-context";
import { PhotoDetailHeader } from "@/components/photo-detail/photo-detail-header";
import { PhotoDetailKeyboard } from "@/components/photo-detail/photo-detail-keyboard";
import { PhotoDetailMedia } from "@/components/photo-detail/photo-detail-media";
import { PhotoDetailNavigation } from "@/components/photo-detail/photo-detail-navigation";
import { PhotoDetailRelated } from "@/components/photo-detail/photo-detail-related";
import { PhotoDetailStory } from "@/components/photo-detail/photo-detail-story";
import { PhotoProcessDevelopmentTools } from "@/components/photo-process/photo-process-development-tools";
import { PhotoProcessSection } from "@/components/photo-process/photo-process-section";
import { Container } from "@/components/ui/layout";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { getPhotoOrientation } from "@/lib/photo-detail/selectors";
import { resolvePhotoProcess } from "@/lib/photo-process/selectors";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";

export function PhotoDetailPage({ locale, photoId, imagesData, dictionary }: { locale: Locale; photoId: number; imagesData: ImagesData; dictionary: Dictionary }) {
  const optimized = imagesData.images.find((image) => image.id === String(photoId));
  const photo = buildArchivePhotos(imagesData, locale).find((entry) => entry.id === photoId);
  const photoProcess = photo ? resolvePhotoProcess(photo) : null;
  const orientation = optimized ? getPhotoOrientation({ width: optimized.width, height: optimized.height }) : "vertical";
  return <PhotoDetailContextProvider locale={locale} currentId={photoId} imagesData={imagesData}>
    <PhotoDetailKeyboard />
    <main id="main-content" tabIndex={-1} className={`photo-detail photo-detail--${orientation} overflow-hidden pt-28 sm:pt-32`}>
      <Container>
        <PhotoDetailBackLink label={dictionary.photoDetail.back} className="mb-10" />
        <article>
          <div className="photo-detail-layout grid items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            <div className="lg:col-span-8"><PhotoDetailMedia dictionary={dictionary.photoDetail} /></div>
            <aside className="space-y-8 lg:sticky lg:top-28 lg:col-span-4"><PhotoDetailHeader dictionary={dictionary.photoDetail} galleryDictionary={dictionary.gallery} /><PhotoDetailActions dictionary={dictionary.photoDetail} imageHref={optimized?.src || `/photos/optimized/original/${photoId}.webp`} /></aside>
          </div>

          <section className="mt-20 grid gap-8 border-y border-border py-12 md:grid-cols-12 lg:mt-28 lg:py-20">
            <div className="md:col-span-3"><p className="rv-kicker">04 / 08</p><p className="rv-label mt-4 text-accent">{dictionary.photoDetail.storyLabel}</p></div>
            <div className="md:col-span-8 md:col-start-5"><PhotoDetailStory /></div>
          </section>

          {photoProcess ? <PhotoProcessSection process={photoProcess} locale={locale} dictionary={dictionary.photoProcess} /> : null}

          <section className="mt-20 lg:mt-28"><p className="rv-kicker mb-6">06 / 08</p><PhotoDetailNavigation dictionary={dictionary.photoDetail} galleryDictionary={dictionary.gallery} /></section>
          <div className="mt-24 lg:mt-36"><PhotoDetailRelated dictionary={dictionary.photoDetail} galleryDictionary={dictionary.gallery} /></div>
          <div className="flex flex-col items-start gap-6 border-t border-border py-16 sm:flex-row sm:items-center sm:justify-between lg:py-24"><PhotoDetailBackLink label={dictionary.photoDetail.back} /><p className="rv-meta">{dictionary.photoDetail.keyboardHelp}</p></div>
        </article>
      </Container>
      {process.env.NODE_ENV === "development" ? <PhotoProcessDevelopmentTools locale={locale} dictionary={dictionary.photoProcess} /> : null}
    </main>
  </PhotoDetailContextProvider>;
}
