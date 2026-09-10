import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { SeriesProgress } from "@/components/series/series-progress";
import { SeriesReturnFocus } from "@/components/series/series-return-focus";
import { SeriesDevelopmentTools } from "@/components/series/series-development-tools";
import { EssayDiptych, EssayImage, SeriesFooter, SeriesHero, essaySingleSize } from "@/components/series/series-essay";
import { Container } from "@/components/ui/layout";
import type { ArchivePhoto } from "@/lib/archive/types";
import {
  getLocalizedSeries,
  getNextSeries,
  resolveSeriesCover,
} from "@/lib/series/selectors";
import type { PhotoSeries, SeriesEditorialBlock } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";

function EssayBlock({ block, photos, positions, total, locale, slug }: {
  block: SeriesEditorialBlock;
  photos: Map<number, ArchivePhoto>;
  positions: Map<number, number>;
  total: number;
  locale: Locale;
  slug: string;
}) {
  const blockPhotos = block.photoIds.flatMap((id) => photos.get(id) ? [photos.get(id)!] : []);
  if (!blockPhotos.length) return null;
  if (block.layout === "diptych") {
    return <EssayDiptych photos={blockPhotos} locale={locale} slug={slug} positions={positions} total={total} />;
  }
  const photo = blockPhotos[0];
  return (
    <EssayImage
      photo={photo}
      locale={locale}
      slug={slug}
      position={positions.get(photo.id) || 1}
      total={total}
      size={essaySingleSize(photo)}
    />
  );
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
  const followingBlocks = rawSeries.blocks.slice(1);
  const nextRaw = getNextSeries(series.id);
  const nextSeries = nextRaw ? getLocalizedSeries(nextRaw, locale) : null;
  const nextCover = nextRaw ? resolveSeriesCover(nextRaw, photos) : null;
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden pb-24 pt-32 lg:pb-36 lg:pt-40">
      <SeriesReturnFocus />
      <SeriesDevelopmentTools />
      <Container>
        <SeriesHero series={series} dictionary={dictionary} />

        <SeriesProgress total={series.photoIds.length} label={dictionary.progressLabel} />

        {cover ? (
          <PhotoMotionGroup groupKey={`series-cover-${series.slug}`} editorial className="mt-14 lg:mt-20">
            <EssayImage photo={cover} locale={locale} slug={series.slug} position={positions.get(cover.id) || 1} total={series.photoIds.length} priority size={essaySingleSize(cover)} />
          </PhotoMotionGroup>
        ) : null}

        <PhotoMotionGroup groupKey={`series-sequence-${series.slug}`} className="mt-20 space-y-24 lg:mt-32 lg:space-y-40">
          {followingBlocks.map((block) => <EssayBlock key={`${block.layout}-${block.photoIds.join("-")}`} block={block} photos={byId} positions={positions} total={series.photoIds.length} locale={locale} slug={series.slug} />)}
        </PhotoMotionGroup>

        <div className="mt-24 lg:mt-40">
          <SeriesFooter locale={locale} dictionary={dictionary} nextSeries={nextSeries} nextCover={nextCover} />
        </div>
      </Container>
    </main>
  );
}
