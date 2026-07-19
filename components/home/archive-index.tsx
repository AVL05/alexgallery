import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { Reveal, StaggerGroup } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { ArchiveSummary, NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function ArchiveIndex({
  archive,
  photos,
  dictionary,
  galleryDictionary,
  locale,
  failImages,
  slowImages,
}: {
  archive: ArchiveSummary;
  photos: NarrativePhoto[];
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  locale: Locale;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const description = dictionary.archive.description
    .replace("{startYear}", archive.startYear)
    .replace("{endYear}", archive.endYear);

  return (
    <section id="archive-index" className="rv-section bg-[var(--color-background-secondary)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={7} label={dictionary.chapterLabel} />
          <h2 className="mt-10 max-w-[12ch] font-serif text-[clamp(2.8rem,7vw,7.5rem)] leading-[0.94] tracking-[-0.05em]">{dictionary.archive.title}</h2>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg md:leading-8">{description}</p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              data-motion-item
              href={`/${locale}/photo/${photo.id}`}
              className="group block"
              data-press-feedback
              {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}
            >
              <NarrativeImage
                photo={photo}
                sizes="(max-width: 767px) 100vw, 50vw"
                failPrimary={failImages}
                slow={slowImages}
                className="border border-border transition-colors group-hover:border-[var(--color-border-strong)] group-focus-visible:border-accent"
                imageClassName="transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.012] group-hover:brightness-[0.9] group-focus-visible:scale-[1.012] group-focus-visible:brightness-[0.9]"
              />
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <h3 className="font-serif text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
                  {photo.title}
                </h3>
                <p className="rv-meta shrink-0">
                  {galleryDictionary.categories[photo.category]} / {photo.year}
                </p>
              </div>
            </Link>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-14 grid border-y border-border md:grid-cols-3">
          <div data-motion-item className="border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0">
            <p className="rv-meta">{dictionary.archive.photographs}</p>
            <p className="mt-4 font-serif text-6xl tracking-[-0.04em] md:text-7xl">{String(archive.total).padStart(2, "0")}</p>
          </div>
          <div data-motion-item className="border-b border-border py-8 md:border-b-0 md:border-r md:px-8">
            <p className="rv-meta">{dictionary.archive.categories}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
              {archive.categories.map(({ category, count }) => <li key={category} className="flex justify-between gap-4"><span>{galleryDictionary.categories[category]}</span><span className="font-mono">{String(count).padStart(2, "0")}</span></li>)}
            </ul>
          </div>
          <div data-motion-item className="py-8 md:pl-8">
            <p className="rv-meta">{dictionary.archive.years}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
              {archive.years.map(({ year, count }) => <li key={year} className="flex justify-between gap-4"><span>{year}</span><span className="font-mono">{String(count).padStart(2, "0")}</span></li>)}
            </ul>
          </div>
        </StaggerGroup>

        <Reveal className="mt-12">
          <Link href="#gallery" className="rv-editorial-link text-base" data-press-feedback {...getCursorTargetAttributes({ type: "explore" })}>{dictionary.archive.cta}<ArrowDown aria-hidden="true" className="size-4" /></Link>
        </Reveal>
      </Container>
    </section>
  );
}
