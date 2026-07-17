"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { Reveal, StaggerGroup } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { requestGalleryFilter } from "@/lib/gallery-filter-events";
import { getCategoryArchiveHref } from "@/lib/archive/url";
import type { HomeChapter } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary } from "@/types/dictionary";
import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function VisualChapters({
  chapters,
  dictionary,
  galleryDictionary,
  failImages,
  slowImages,
  locale,
}: {
  chapters: HomeChapter[];
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  failImages?: boolean;
  slowImages?: boolean;
  locale: "es" | "en";
}) {
  const [activeCategory, setActiveCategory] = useState(chapters[0]?.category);
  const activeChapter = chapters.find((chapter) => chapter.category === activeCategory) ?? chapters[0];

  return (
    <section id="visual-chapters" className="rv-section bg-[var(--color-background-secondary)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={5} label={dictionary.chapterLabel} />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <h2 className="max-w-[13ch] font-serif text-[clamp(2.7rem,6vw,6.5rem)] leading-[0.95] tracking-[-0.045em] lg:col-span-8">{dictionary.chapters.title}</h2>
            <p className="max-w-md self-end text-base leading-7 text-[var(--color-text-secondary)] lg:col-span-4">{dictionary.chapters.description}</p>
          </div>
        </Reveal>

        {chapters.length === 0 ? (
          <p className="mt-16 border-y border-border py-12 text-[var(--color-text-secondary)]">{dictionary.chapters.empty}</p>
        ) : (
          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start">
            {activeChapter && (
              <Reveal className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block">
                <NarrativeImage photo={activeChapter.photo} sizes="42vw" failPrimary={failImages} slow={slowImages} className="border border-border" />
              </Reveal>
            )}
            <StaggerGroup className="border-t border-border lg:col-span-7 lg:col-start-7">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.category}
                  data-motion-item
                  href={getCategoryArchiveHref(locale, chapter.category)}
                  onMouseEnter={() => setActiveCategory(chapter.category)}
                  onFocus={() => setActiveCategory(chapter.category)}
                  onClick={() => requestGalleryFilter(chapter.category)}
                  data-press-feedback
                  {...getCursorTargetAttributes({ type: "explore" })}
                  className="group grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border py-6 transition-colors hover:bg-[var(--color-hover)] focus-visible:bg-[var(--color-hover)] sm:min-h-32 sm:gap-6 sm:px-3"
                >
                  <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-[clamp(1.7rem,3.5vw,3.5rem)] leading-none tracking-[-0.03em] transition-colors group-hover:text-accent group-focus-visible:text-accent">
                      {galleryDictionary.categories[chapter.category]}
                    </span>
                    <span className="mt-2 hidden max-w-lg text-sm text-[var(--color-text-muted)] sm:block">
                      {dictionary.chapters.descriptions[chapter.category]}
                    </span>
                    <span className="rv-meta mt-3 block">{String(chapter.count).padStart(2, "0")}</span>
                  </span>
                  <ArrowDownRight aria-hidden="true" className="size-5 text-[var(--color-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:translate-y-1 group-focus-visible:text-accent" />
                  <NarrativeImage photo={chapter.photo} sizes="(max-width: 1023px) 100vw, 1px" failPrimary={failImages} slow={slowImages} className="col-span-3 mt-2 lg:hidden" />
                </Link>
              ))}
            </StaggerGroup>
          </div>
        )}
      </Container>
    </section>
  );
}
