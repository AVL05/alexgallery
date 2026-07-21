import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { PhotoTransitionLink } from "@/components/motion/photo-transition-link";
import { SeriesProgress } from "@/components/series/series-progress";
import { SeriesReturnFocus } from "@/components/series/series-return-focus";
import { SeriesDevelopmentTools } from "@/components/series/series-development-tools";
import { Container } from "@/components/ui/layout";
import type { ArchivePhoto } from "@/lib/archive/types";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import {
  getLocalizedSeries,
  getNextSeries,
  getSeriesHref,
  getSeriesPhotoHref,
  resolveSeriesCover,
} from "@/lib/series/selectors";
import type { PhotoSeries, SeriesEditorialBlock } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function SeriesPhoto({ photo, position, total, locale, slug, priority = false }: {
  photo: ArchivePhoto;
  position: number;
  total: number;
  locale: Locale;
  slug: string;
  priority?: boolean;
}) {
  return (
    <article id={`series-photo-${photo.id}`} tabIndex={-1} data-series-photo data-series-index={position} className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-background">
      <PhotoTransitionLink photoId={photo.id} href={getSeriesPhotoHref(locale, photo.id, slug)} prefetch={false} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
        <figure>
          <div data-photo-reveal={getPhotoRevealVariant({ ...photo, role: priority ? "featured" : undefined })} className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
            <Image data-photo-motion-media src={photo.src} alt={photo.alt || photo.description} fill priority={priority} loading={priority ? undefined : "lazy"} sizes="(max-width: 767px) 100vw, (max-width: 1439px) 84vw, 76rem" className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.92] group-focus-visible:scale-[1.025] group-focus-visible:brightness-[0.92]" />
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-6 border-t border-border pt-4">
            <div><h2 className="font-serif text-xl leading-tight tracking-[-0.02em] sm:text-2xl">{photo.title}</h2><p className="rv-meta mt-2">{photo.year}</p></div>
            <span className="rv-index" aria-label={`${position} / ${total}`}>{String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </figcaption>
        </figure>
      </PhotoTransitionLink>
    </article>
  );
}

function SeriesBlock({ block, photos, positions, total, locale, slug, blockIndex }: {
  block: SeriesEditorialBlock;
  photos: Map<number, ArchivePhoto>;
  positions: Map<number, number>;
  total: number;
  locale: Locale;
  slug: string;
  blockIndex: number;
}) {
  const blockPhotos = block.photoIds.flatMap((id) => photos.get(id) ? [photos.get(id)!] : []);
  if (!blockPhotos.length) return null;
  if (block.layout === "diptych") {
    return <div className="grid gap-8 md:grid-cols-2 md:items-end">{blockPhotos.map((photo) => <SeriesPhoto key={photo.id} photo={photo} position={positions.get(photo.id) || 1} total={total} locale={locale} slug={slug} />)}</div>;
  }
  const alignment = blockIndex % 3 === 1 ? "max-w-6xl" : blockIndex % 3 === 2 ? "ml-auto max-w-5xl" : "mx-auto max-w-[76rem]";
  return <div className={alignment}><SeriesPhoto photo={blockPhotos[0]} position={positions.get(blockPhotos[0].id) || 1} total={total} locale={locale} slug={slug} /></div>;
}

export function SeriesPage({ locale, dictionary, rawSeries, photos }: {
  locale: Locale;
  dictionary: SeriesDictionary;
  rawSeries: PhotoSeries;
  photos: readonly ArchivePhoto[];
}) {
  const series = getLocalizedSeries(rawSeries, locale);
  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const positions = new Map(series.photoIds.map((id, index) => [id, index + 1]));
  const cover = resolveSeriesCover(rawSeries, photos);
  const openingBlock = rawSeries.blocks[0];
  const followingBlocks = rawSeries.blocks.slice(1);
  const nextRaw = getNextSeries(series.id);
  const nextSeries = nextRaw ? getLocalizedSeries(nextRaw, locale) : null;
  const nextCover = nextRaw ? resolveSeriesCover(nextRaw, photos) : null;
  const progressLabel = dictionary.progressLabel.replace("{total}", String(series.photoIds.length)).replace("{title}", series.title);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden pb-24 pt-32 lg:pb-36 lg:pt-40">
      <SeriesReturnFocus />
      <SeriesDevelopmentTools />
      <Container>
        <header className="grid gap-8 border-t border-border pt-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="rv-kicker text-accent">{dictionary.eyebrow} / {String(series.photoIds.length).padStart(2, "0")}</p>
            <h1 className="mt-8 max-w-[11ch] font-serif text-[clamp(3.2rem,8vw,8rem)] leading-[0.9] tracking-[-0.05em]">{series.title}</h1>
          </div>
          <div className="md:col-span-4">
            <p className="text-base leading-7 text-[var(--color-text-secondary)]">{series.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
              {series.period ? <div><dt className="rv-meta">{dictionary.period}</dt><dd className="mt-2 text-sm">{series.period}</dd></div> : null}
              {series.location ? <div><dt className="rv-meta">{dictionary.location}</dt><dd className="mt-2 text-sm">{series.location}</dd></div> : null}
            </dl>
          </div>
        </header>

        <SeriesProgress total={series.photoIds.length} label={progressLabel} />

        {cover && openingBlock ? (
          <PhotoMotionGroup groupKey={`series-cover-${series.slug}`} editorial className="mt-14 lg:mt-20">
            <SeriesPhoto photo={cover} position={positions.get(cover.id) || 1} total={series.photoIds.length} locale={locale} slug={series.slug} priority />
          </PhotoMotionGroup>
        ) : null}

        <PhotoMotionGroup groupKey={`series-sequence-${series.slug}`} className="mt-20 space-y-24 lg:mt-32 lg:space-y-40">
          {followingBlocks.map((block, index) => <SeriesBlock key={`${block.layout}-${block.photoIds.join("-")}`} block={block} photos={byId} positions={positions} total={series.photoIds.length} locale={locale} slug={series.slug} blockIndex={index + 1} />)}
        </PhotoMotionGroup>

        <section className="mt-24 grid gap-8 border-y border-border py-12 md:grid-cols-12 lg:mt-40 lg:py-20">
          <div className="md:col-span-3"><p className="rv-kicker">{dictionary.closingLabel}</p></div>
          <div className="md:col-span-8 md:col-start-5"><h2 className="max-w-[18ch] font-serif text-[clamp(2rem,4vw,4.5rem)] leading-tight tracking-[-0.035em]">{dictionary.closingTitle}</h2><div className="mt-8 flex flex-wrap gap-6"><Link href={`/${locale}/series`} className="rv-editorial-link"><ArrowLeft aria-hidden="true" className="size-4" />{dictionary.backToIndex}</Link><Link href={`/${locale}#gallery`} className="rv-editorial-link">{dictionary.exploreArchive}</Link></div></div>
        </section>

        {nextSeries && nextCover ? (
          <section className="mt-20 lg:mt-28" aria-labelledby="next-series-title">
            <p className="rv-kicker">{dictionary.nextSeries}</p>
            <Link href={getSeriesHref(locale, nextSeries.slug)} className="group mt-6 grid gap-8 md:grid-cols-12 md:items-end" data-press-feedback>
              <div className="relative overflow-hidden bg-[var(--color-surface)] md:col-span-7" style={{ aspectRatio: `${nextCover.width}/${nextCover.height}` }}><Image src={nextCover.src} alt={nextCover.alt || nextCover.description} fill loading="lazy" sizes="(max-width: 767px) 100vw, 58vw" className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.015] group-hover:brightness-[0.9] group-focus-visible:scale-[1.015] group-focus-visible:brightness-[0.9]" /></div>
              <div className="md:col-span-5"><p className="rv-meta">{nextSeries.photoIds.length} {dictionary.photographs}</p><h2 id="next-series-title" className="mt-4 font-serif text-[clamp(2.2rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em]">{nextSeries.title}</h2><p className="mt-5 line-clamp-3 text-[var(--color-text-secondary)]">{nextSeries.description}</p><span className="rv-editorial-link mt-7">{dictionary.openSeries}<ArrowRight aria-hidden="true" className="size-4" /></span></div>
            </Link>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
