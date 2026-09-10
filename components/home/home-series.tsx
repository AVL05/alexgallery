import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { resolveSeriesEntryVariant, SeriesEntry } from "@/components/series/series-entry";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { homeExperienceConfig } from "@/lib/home/experience";

export type HomeSeriesEntry = {
  series: LocalizedPhotoSeries;
  cover: NarrativePhoto;
};

export function HomeSeries({ entries, dictionary, locale }: {
  entries: HomeSeriesEntry[];
  dictionary: HomeDictionary;
  locale: Locale;
}) {
  return (
    <section id="series" className="rv-section bg-[var(--color-background-secondary)]">
      <Container>
        <Reveal>
          <SectionHeader
            as="h2"
            tone="page"
            title={dictionary.series.title}
          />
        </Reveal>

        <PhotoMotionGroup groupKey={`home-series-${entries.map(({ series }) => series.id).join("-")}`} className="mt-16 space-y-24 md:space-y-36 lg:mt-24 lg:space-y-44">
          {entries.map(({ series, cover }, index) => (
            <SeriesEntry
              key={series.id}
              series={series}
              cover={cover}
              locale={locale}
              index={index}
              total={entries.length}
              variant={resolveSeriesEntryVariant(index, entries.length)}
              prefetch={index === 0 ? homeExperienceConfig.prefetch.featuredSeries : homeExperienceConfig.prefetch.secondarySeries}
              photographsLabel={dictionary.series.photographs}
            />
          ))}
        </PhotoMotionGroup>

        <Reveal className="mt-20 border-t border-border pt-8 lg:mt-28">
          <Link href={`/${locale}/series`} className="rv-editorial-link">{dictionary.series.cta}<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Reveal>
      </Container>
    </section>
  );
}
