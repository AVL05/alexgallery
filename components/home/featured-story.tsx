import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { Reveal, StaggerGroup } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FeaturedStory({
  photo,
  dictionary,
  locale,
  failImages,
  slowImages,
}: {
  photo: NarrativePhoto;
  dictionary: HomeDictionary;
  locale: Locale;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  return (
    <section id="featured-story" className="rv-section bg-[var(--color-background-secondary)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={3} label={dictionary.chapterLabel} />
        </Reveal>
        <div className="mt-12 grid items-end gap-10 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <Link href={`/${locale}/photo/${photo.id}`} className="group block">
              <NarrativeImage
                photo={photo}
                sizes="(max-width: 1023px) 100vw, 58vw"
                failPrimary={failImages}
                slow={slowImages}
                imageClassName="transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.015] group-hover:brightness-[0.9]"
              />
            </Link>
          </Reveal>
          <StaggerGroup className="lg:col-span-5 lg:pl-8">
            <p data-motion-item className="rv-kicker">{dictionary.featured.label}</p>
            <h2 data-motion-item className="mt-5 max-w-[13ch] font-serif text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.98] tracking-[-0.04em]">
              {photo.title}
            </h2>
            <p data-motion-item className="mt-6 max-w-lg text-base leading-7 text-[var(--color-text-secondary)] md:text-lg md:leading-8">
              {photo.description}
            </p>
            <div data-motion-item className="rv-meta mt-7 flex gap-5">
              <span>{photo.category}</span><span>{photo.year}</span>
            </div>
            <Link data-motion-item href={`/${locale}/photo/${photo.id}`} className="rv-editorial-link mt-8">
              {dictionary.featured.cta}<ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
