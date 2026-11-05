import { archivePageHref } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import type { ArchivePhoto } from "@/lib/archive/types";
import {
  getLocalizedSeries,
  resolveSeriesPhotos,
} from "@/lib/series/selectors";
import type { PhotoSeries } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import Link from "next/link";
import { SeriesReel } from "@/components/series/series-reel";

export function SeriesIndexPage({
  locale,
  dictionary,
  seriesList,
  photos,
}: {
  locale: Locale;
  dictionary: SeriesDictionary;
  seriesList: readonly PhotoSeries[];
  photos: readonly ArchivePhoto[];
}) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden pb-24 pt-32 lg:pb-36 lg:pt-40">
      <Container>
        <SectionHeader
          eyebrow={dictionary.eyebrow}
          title={dictionary.indexTitle}
          intro={dictionary.indexIntroduction}
        />

        <ol className="mt-10 grid gap-[clamp(4.5rem,10vw,9rem)] lg:mt-14">
          {seriesList.map((rawSeries, index) => {
            const series = getLocalizedSeries(rawSeries, locale);
            const frames = resolveSeriesPhotos(rawSeries, photos);
            if (!frames.length) return null;
            return (
              <li key={series.id}>
                <SeriesReel
                  series={series}
                  frames={frames}
                  index={index}
                  locale={locale}
                  photographsLabel={dictionary.photographs}
                  openLabel={dictionary.openSeries}
                  prefetch={index === 0}
                  headingAs="h2"
                  priority={index === 0}
                />
              </li>
            );
          })}
        </ol>

        <div className="mt-20 border-t border-border pt-8">
          <Link href={archivePageHref(locale)} className="rv-editorial-link">{dictionary.exploreArchive}</Link>
        </div>
      </Container>
    </main>
  );
}
