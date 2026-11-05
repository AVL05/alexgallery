import { archivePageHref } from "@/lib/routes";
import { photoSizes } from "@/lib/images/sizes";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import { getPhotoOrientation } from "@/lib/photo-detail/selectors";
import type { ArchivePhoto } from "@/lib/archive/types";
import { getSeriesPhotoHref } from "@/lib/series/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { SeriesReel, seriesNumerals } from "@/components/series/series-reel";

// Photo-essay primitives for /series/[slug]: an opening title card, projected
// single frames and diptychs, the end card and the next reel. Frames are never
// cropped and never projected taller than the viewport.

const pad = (value: number) => String(value).padStart(2, "0");

export function SeriesHero({
  series,
  dictionary,
  index,
}: {
  series: LocalizedPhotoSeries;
  dictionary: SeriesDictionary;
  index: number;
}) {
  return (
    <header className="rv-titlecard">
      <p className="rv-slate">
        <span>{dictionary.eyebrow}</span>
        <span aria-hidden="true" className="rv-slate__rule" />
        <span>{seriesNumerals[index] ?? index + 1}</span>
      </p>
      <h1 className="rv-titlecard__title">{series.title}</h1>
      <div className="rv-titlecard__body">
        <p className="rv-titlecard__description">{series.description}</p>
        <dl className="rv-credits__roll mt-0">
          {series.period ? <div><dt>{dictionary.period}</dt><dd>{series.period}</dd></div> : null}
          {series.location ? <div><dt>{dictionary.location}</dt><dd>{series.location}</dd></div> : null}
          <div><dt>{dictionary.photographs}</dt><dd className="tabular-nums">{pad(series.photoIds.length)}</dd></div>
        </dl>
      </div>
    </header>
  );
}

function EssayCaption({ photo, position, total, compact = false }: { photo: ArchivePhoto; position: number; total: number; compact?: boolean }) {
  return (
    <figcaption className="rv-essay-caption">
      <span aria-hidden="true" className="rv-essay-caption__number">{pad(position)}</span>
      <div className="min-w-0">
        <h2 className={`rv-essay-caption__title ${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}>{photo.title}</h2>
        <p className="rv-meta mt-2">{photo.year}</p>
      </div>
      <span className="rv-index" aria-label={`${position} / ${total}`}>{pad(position)} / {pad(total)}</span>
    </figcaption>
  );
}

function EssayPrint({ photo, priority, sizes, height }: { photo: ArchivePhoto; priority?: boolean; sizes: string; height: string }) {
  return (
    <div
      className="rv-essay-print"
      style={{ "--print-ratio": photo.width / photo.height, "--print-width": `${photo.width * 1.15}px`, "--print-height": height } as CSSProperties}
    >
      <div data-photo-reveal={getPhotoRevealVariant({ ...photo, role: priority ? "featured" : undefined })} className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
        <Image data-photo-motion-media src={photo.src} alt={photo.alt || photo.description} fill priority={priority} loading={priority ? undefined : "lazy"} sizes={sizes} className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
      </div>
    </div>
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
    <article id={`series-photo-${photo.id}`} tabIndex={-1} data-series-photo data-series-index={position} className="rv-essay-frame outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-background">
      <PhotoTransitionLink photoId={photo.id} href={getSeriesPhotoHref(locale, photo.id, slug)} prefetch={false} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
        <figure className={size === "narrow" ? "rv-essay-figure rv-essay-figure--narrow" : "rv-essay-figure"}>
          <EssayPrint photo={photo} priority={priority} sizes={size === "narrow" ? photoSizes.editorialFeature : photoSizes.seriesEditorial} height="82svh" />
          <EssayCaption photo={photo} position={position} total={total} />
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
    <div className="rv-essay-diptych grid md:grid-cols-2">
      {[first, second].map((photo) => (
        <article key={photo.id} id={`series-photo-${photo.id}`} tabIndex={-1} data-series-photo data-series-index={positions.get(photo.id) || 1} className="rv-essay-frame outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-background">
          <PhotoTransitionLink photoId={photo.id} href={getSeriesPhotoHref(locale, photo.id, slug)} prefetch={false} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
            <figure className="rv-essay-figure">
              <EssayPrint photo={photo} sizes={photoSizes.essayDiptych} height="72svh" />
              <EssayCaption photo={photo} position={positions.get(photo.id) || 1} total={total} compact />
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
  nextFrames,
  nextIndex,
}: {
  locale: Locale;
  dictionary: SeriesDictionary;
  nextSeries: LocalizedPhotoSeries | null;
  nextFrames: readonly ArchivePhoto[];
  nextIndex: number;
}) {
  return (
    <>
      <section className="rv-endcard" aria-labelledby="series-closing-title">
        <p className="rv-slate justify-center">{dictionary.closingLabel}</p>
        <h2 id="series-closing-title" className="rv-endcard__title">{dictionary.closingTitle}</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <Link href={`/${locale}/series`} className="rv-editorial-link"><ArrowLeft aria-hidden="true" className="size-4" />{dictionary.backToIndex}</Link>
          <Link href={archivePageHref(locale)} className="rv-editorial-link">{dictionary.exploreArchive}</Link>
        </div>
      </section>

      {nextSeries && nextFrames.length ? (
        <section className="mt-20 lg:mt-28" aria-labelledby="next-series-title">
          <p className="rv-slate mb-6">{dictionary.nextSeries}</p>
          <SeriesReel
            series={nextSeries}
            frames={nextFrames}
            index={nextIndex}
            locale={locale}
            photographsLabel={dictionary.photographs}
            openLabel={dictionary.openSeries}
            headingAs="h2"
            headingId="next-series-title"
          />
        </section>
      ) : null}
    </>
  );
}
