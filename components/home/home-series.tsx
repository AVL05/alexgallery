import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { SeriesEntry } from "@/components/series/series-entry";
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
        <Reveal className="rv-home-section-header border-t border-border pt-6">
          <h2 className="rv-home-heading">{dictionary.series.title}</h2>
          <Link href={`/${locale}/series`} className="rv-editorial-link">{dictionary.series.cta}<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Reveal>

        <PhotoMotionGroup groupKey={`home-series-${entries.map(({ series }) => series.id).join("-")}`} className="grid items-start gap-x-12 gap-y-16 md:grid-cols-12 lg:gap-y-28">
          {entries.map(({ series, cover }, index) => (
            <div key={series.id} className={`min-w-0 ${index === 0 ? "md:col-span-12" : "md:col-span-5 md:col-start-2 last:md:col-start-8 last:md:pt-28"}`}>
              <SeriesEntry
                series={series}
                cover={cover}
                locale={locale}
                index={index}
                total={entries.length}
                variant={index === 0 ? "offset-right" : "centered"}
                prefetch={index === 0 ? homeExperienceConfig.prefetch.featuredSeries : homeExperienceConfig.prefetch.secondarySeries}
                photographsLabel={dictionary.series.photographs}
              />
            </div>
          ))}
        </PhotoMotionGroup>

      </Container>
    </section>
  );
}
