import { SectionMarker } from "@/components/home/section-marker";
import { Reveal, StaggerGroup } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { ArchiveSummary } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary } from "@/types/dictionary";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function ArchiveIndex({
  archive,
  dictionary,
  galleryDictionary,
}: {
  archive: ArchiveSummary;
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
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
