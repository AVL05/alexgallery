import { MetaItem, MetaList } from "@/components/ui/photo-meta";
import { photoSizes } from "@/lib/images/sizes";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import { getPhotoOrientation } from "@/lib/photo-detail/selectors";
import type { ArchivePhoto } from "@/lib/archive/types";
import { getSeriesHref, getSeriesPhotoHref } from "@/lib/series/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";

// Photo-essay primitives for /series/[slug]: hero, full/narrow images,
// diptychs and footer. Driven by each photo's ratio; shared infra only
// (aspect boxes, blur, sizes, reveals, series-context links).

export function SeriesHero({
  series,
  dictionary,
}: {
  series: LocalizedPhotoSeries;
  dictionary: SeriesDictionary;
}) {
  return (
    <header>
      <p className="rv-kicker">{dictionary.eyebrow} / {String(series.photoIds.length).padStart(2, "0")}</p>
      <h1 className="mt-8 max-w-[12ch] font-serif text-[clamp(3.2rem,9vw,9rem)] leading-[0.9] tracking-[-0.05em]">
        {series.title}
      </h1>
      <div className="mt-8 grid gap-8 md:grid-cols-12">
        <p className="text-lg leading-8 text-[var(--color-text-secondary)] md:col-span-7">{series.description}</p>
        <MetaList className="gap-4 border-t border-border pt-5 md:col-span-4 md:col-start-9">
          {series.period ? <MetaItem label={dictionary.period}>{series.period}</MetaItem> : null}
          {series.location ? <MetaItem label={dictionary.location}>{series.location}</MetaItem> : null}
          <MetaItem label={dictionary.photographs}>{String(series.photoIds.length).padStart(2, "0")}</MetaItem>
        </MetaList>
      </div>
    </header>
  );
}

export function EssayImage({
  photo,
  locale,
  slug,
  position,
  total,
  priority = false,
  size = "full",
}: {
  photo: ArchivePhoto;
  locale: Locale;
  slug: string;
  position: number;
  total: number;
  priority?: boolean;
  size?: "full" | "narrow";
}) {
  return (
    <article id={`series-photo-${photo.id}`} tabIndex={-1} data-series-photo data-series-index={position} className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-background">
      <PhotoTransitionLink photoId={photo.id} href={getSeriesPhotoHref(locale, photo.id, slug)} prefetch={false} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
        <figure className={size === "narrow" ? "mx-auto w-full max-w-3xl" : undefined}>
          <div data-photo-reveal={getPhotoRevealVariant({ ...photo, role: priority ? "featured" : undefined })} className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
            <Image data-photo-motion-media src={photo.src} alt={photo.alt || photo.description} fill priority={priority} loading={priority ? undefined : "lazy"} sizes={size === "narrow" ? photoSizes.editorialFeature : photoSizes.seriesEditorial} className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]" />
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-6 border-t border-border pt-4">
            <div><h2 className="font-serif text-xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent group-focus-visible:text-accent sm:text-2xl">{photo.title}</h2><p className="rv-meta mt-2">{photo.year}</p></div>
            <span className="rv-index" aria-label={`${position} / ${total}`}>{String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </figcaption>
        </figure>
      </PhotoTransitionLink>
    </article>
  );
}

export function EssayDiptych({
  photos,
  locale,
  slug,
  positions,
  total,
}: {
  photos: readonly ArchivePhoto[];
  locale: Locale;
  slug: string;
  positions: ReadonlyMap<number, number>;
  total: number;
}) {
  if (photos.length < 2) return null;
  const [first, second] = photos;
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-end lg:gap-14">
      {[first, second].map((photo) => (
        <article key={photo.id} id={`series-photo-${photo.id}`} tabIndex={-1} data-series-photo data-series-index={positions.get(photo.id) || 1} className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-background">
          <PhotoTransitionLink photoId={photo.id} href={getSeriesPhotoHref(locale, photo.id, slug)} prefetch={false} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
            <figure>
              <div data-photo-reveal={getPhotoRevealVariant({ ...photo, role: undefined })} className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
                <Image data-photo-motion-media src={photo.src} alt={photo.alt || photo.description} fill loading="lazy" sizes={photoSizes.essayDiptych} className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.92] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.92]" />
              </div>
              <figcaption className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
                <div><h2 className="font-serif text-lg leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent group-focus-visible:text-accent sm:text-xl">{photo.title}</h2><p className="rv-meta mt-2">{photo.year}</p></div>
                <span className="rv-index" aria-label={`${positions.get(photo.id) || 1} / ${total}`}>{String(positions.get(photo.id) || 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          </PhotoTransitionLink>
        </article>
      ))}
    </div>
  );
}

export function essaySingleSize(photo: Pick<ArchivePhoto, "width" | "height">): "full" | "narrow" {
  return getPhotoOrientation(photo) === "horizontal" ? "full" : "narrow";
}

export function SeriesFooter({
  locale,
  dictionary,
  nextSeries,
  nextCover,
}: {
  locale: Locale;
  dictionary: SeriesDictionary;
  nextSeries: LocalizedPhotoSeries | null;
  nextCover: ArchivePhoto | null;
}) {
  return (
    <>
      <section className="grid gap-8 border-y border-border py-12 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-3"><p className="rv-kicker">{dictionary.closingLabel}</p></div>
        <div className="md:col-span-8 md:col-start-5"><h2 className="max-w-[18ch] font-serif text-[clamp(2rem,4vw,4.5rem)] leading-tight tracking-[-0.035em]">{dictionary.closingTitle}</h2><div className="mt-8 flex flex-wrap gap-6"><Link href={`/${locale}/series`} className="rv-editorial-link"><ArrowLeft aria-hidden="true" className="size-4" />{dictionary.backToIndex}</Link><Link href={`/${locale}#gallery`} className="rv-editorial-link">{dictionary.exploreArchive}</Link></div></div>
      </section>

      {nextSeries && nextCover ? (
        <section className="mt-20 lg:mt-28" aria-labelledby="next-series-title">
          <p className="rv-kicker">{dictionary.nextSeries}</p>
          <Link href={getSeriesHref(locale, nextSeries.slug)} className="group mt-6 grid gap-8 md:grid-cols-12 md:items-end" data-press-feedback>
            <div className="relative overflow-hidden bg-[var(--color-surface)] md:col-span-7" style={{ aspectRatio: `${nextCover.width}/${nextCover.height}` }}><Image src={nextCover.src} alt={nextCover.alt || nextCover.description} fill loading="lazy" sizes={photoSizes.editorialFeature} className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.9] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.9]" /></div>
            <div className="md:col-span-5"><p className="rv-meta">{nextSeries.photoIds.length} {dictionary.photographs}</p><h2 id="next-series-title" className="mt-4 font-serif text-[clamp(2.2rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em]">{nextSeries.title}</h2><p className="mt-5 line-clamp-3 text-[var(--color-text-secondary)]">{nextSeries.description}</p><span className="rv-editorial-link mt-7">{dictionary.openSeries}<ArrowRight aria-hidden="true" className="size-4" /></span></div>
          </Link>
        </section>
      ) : null}
    </>
  );
}
