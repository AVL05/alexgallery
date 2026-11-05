import { Reveal } from "@/components/motion/reveal";
import { SeriesReel } from "@/components/series/series-reel";
import { Container } from "@/components/ui/layout";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { homeExperienceConfig } from "@/lib/home/experience";

export type HomeSeriesEntry = {
  series: LocalizedPhotoSeries;
  cover: NarrativePhoto;
  frames: NarrativePhoto[];
};

// Each series is a reel: a title card, then every frame of the series in its
// editorial order as a justified strip (see SeriesReel).
export function HomeSeries({ entries, dictionary, locale }: {
  entries: HomeSeriesEntry[];
  dictionary: HomeDictionary;
  locale: Locale;
}) {
  return (
    <section id="series" aria-labelledby="home-series-title" className="rv-section bg-[var(--color-background)]">
      <Container>
        <Reveal className="rv-home-section-header">
          <div>
            <p className="rv-slate">{String(entries.length).padStart(2, "0")} <span aria-hidden="true" className="rv-slate__rule" /> {dictionary.series.reel}</p>
            <h2 id="home-series-title" className="rv-home-heading mt-5">{dictionary.series.title}</h2>
          </div>
          <div className="grid justify-items-start gap-3 md:justify-items-end">
            <p className="rv-body-sm max-w-[36ch] md:text-right">{dictionary.series.description}</p>
            <Link href={`/${locale}/series`} className="rv-editorial-link">{dictionary.series.cta}<ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
        </Reveal>

        <ol className="grid gap-[clamp(4.5rem,10vw,9rem)]">
          {entries.map(({ series, frames }, index) => (
            <li key={series.id}>
              <SeriesReel
                series={series}
                frames={frames}
                index={index}
                locale={locale}
                photographsLabel={dictionary.series.photographs}
                openLabel={dictionary.series.open}
                prefetch={index === 0 ? homeExperienceConfig.prefetch.featuredSeries : homeExperienceConfig.prefetch.secondarySeries}
              />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
