import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Container } from "@/components/ui/layout";
import type { ArchivePhoto } from "@/lib/archive/types";
import {
  getLocalizedSeries,
  getSeriesHref,
  resolveSeriesCover,
} from "@/lib/series/selectors";
import type { PhotoSeries } from "@/lib/series/types";
import type { Locale, SeriesDictionary } from "@/types/dictionary";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <header className="border-t border-border pt-8">
          <p className="rv-kicker text-accent">{dictionary.eyebrow}</p>
          <h1 className="mt-8 max-w-[12ch] font-serif text-[clamp(3.2rem,8vw,8rem)] leading-[0.9] tracking-[-0.05em]">{dictionary.indexTitle}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]">{dictionary.indexIntroduction}</p>
        </header>

        <PhotoMotionGroup groupKey="series-index" className="mt-16 grid gap-12 md:grid-cols-12 md:gap-x-8 lg:mt-24">
          {seriesList.map((rawSeries, index) => {
            const series = getLocalizedSeries(rawSeries, locale);
            const cover = resolveSeriesCover(rawSeries, photos);
            if (!cover) return null;
            return (
              <article key={series.id} className={index === 0 ? "md:col-span-7" : "md:col-span-5"}>
                <Link href={getSeriesHref(locale, series.slug)} prefetch={index === 0} className="group block" data-press-feedback>
                  <div data-photo-reveal={cover.width > cover.height ? "mask-side" : cover.width < cover.height ? "mask-up" : "soft-scale"} className="relative overflow-hidden border border-border bg-[var(--color-surface)]" style={{ aspectRatio: `${cover.width}/${cover.height}` }}>
                    <Image data-photo-motion-media src={cover.src} alt={cover.alt || cover.description} fill sizes="(max-width: 767px) 100vw, 58vw" className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.9] group-focus-visible:scale-[1.025] group-focus-visible:brightness-[0.9]" />
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 border-t border-border pt-5">
                    <div>
                      <p className="rv-meta">{series.period ? `${series.period} / ` : ""}{series.photoIds.length} {dictionary.photographs}</p>
                      <h2 className="mt-3 font-serif text-[clamp(1.8rem,3vw,3.5rem)] leading-tight tracking-[-0.03em] transition-colors group-hover:text-accent group-focus-visible:text-accent">{series.title}</h2>
                    </div>
                    <ArrowUpRight aria-hidden="true" className="mt-1 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1" />
                  </div>
                  <p className="mt-4 max-w-xl leading-7 text-[var(--color-text-secondary)]">{series.description}</p>
                </Link>
              </article>
            );
          })}
        </PhotoMotionGroup>

        <div className="mt-20 border-t border-border pt-8">
          <Link href={`/${locale}#gallery`} className="rv-editorial-link">{dictionary.exploreArchive}</Link>
        </div>
      </Container>
    </main>
  );
}
