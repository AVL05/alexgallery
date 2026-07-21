import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { NarrativePhoto } from "@/lib/home/selectors";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import { getPhotoRevealVariant } from "@/lib/motion/photo-motion";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={7} label={dictionary.chapterLabel} />
          <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
            <h2 className="max-w-[12ch] font-serif text-[clamp(2.8rem,7vw,7.5rem)] leading-[0.94] tracking-[-0.05em] md:col-span-8">{dictionary.series.title}</h2>
            <p className="max-w-md text-base leading-7 text-[var(--color-text-secondary)] md:col-span-4">{dictionary.series.description}</p>
          </div>
        </Reveal>

        <PhotoMotionGroup groupKey={`home-series-${entries.map(({ series }) => series.id).join("-")}`} className="mt-14 grid gap-10 md:grid-cols-12">
          {entries.map(({ series, cover }, index) => (
            <article key={series.id} className={index === 0 ? "md:col-span-5" : index === 1 ? "md:col-span-7 md:mt-20" : "md:col-span-5 md:col-start-8"}>
              <Link href={`/${locale}/series/${series.slug}`} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "explore", contrast: "dark" })}>
                <NarrativeImage photo={cover} sizes="(max-width: 767px) 100vw, 50vw" motionVariant={getPhotoRevealVariant({ ...cover, role: "index" })} className="border border-border transition-colors group-hover:border-[var(--color-border-strong)] group-focus-visible:border-accent" imageClassName="transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.9] group-focus-visible:scale-[1.025] group-focus-visible:brightness-[0.9]" />
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-4 border-t border-border pt-4">
                  <div><p className="rv-meta">{series.photoIds.length} {dictionary.series.photographs}</p><h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent group-focus-visible:text-accent">{series.title}</h3></div>
                  <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
                </div>
              </Link>
            </article>
          ))}
        </PhotoMotionGroup>

        <Reveal className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-8">
          <Link href={`/${locale}/series`} className="rv-editorial-link">{dictionary.series.cta}<ArrowRight aria-hidden="true" className="size-4" /></Link>
          <Link href="#gallery" className="rv-editorial-link">{dictionary.series.archiveCta}</Link>
        </Reveal>
      </Container>
    </section>
  );
}
