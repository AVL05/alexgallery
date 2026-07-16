import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { Reveal, StaggerGroup } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import Link from "next/link";

const selectedLayout = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-5",
  "md:col-span-7 md:mt-16",
  "md:col-span-7",
  "md:col-span-5 md:mt-20",
  "md:col-span-5",
  "md:col-span-7 md:mt-12",
] as const;

export function SelectedWork({
  photos,
  dictionary,
  galleryDictionary,
  locale,
  failImages,
  slowImages,
}: {
  photos: NarrativePhoto[];
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  locale: Locale;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  return (
    <section id="selected-work" className="rv-section bg-[var(--color-background)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={6} label={dictionary.chapterLabel} />
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <h2 className="font-serif text-[clamp(2.7rem,6vw,6.5rem)] leading-none tracking-[-0.045em] md:col-span-8">{dictionary.selected.title}</h2>
            <p className="max-w-md self-end text-base leading-7 text-[var(--color-text-secondary)] md:col-span-4">{dictionary.selected.description}</p>
          </div>
        </Reveal>

        {photos.length === 0 ? (
          <p className="mt-16 border-y border-border py-12 text-[var(--color-text-secondary)]">{dictionary.selected.empty}</p>
        ) : (
          <StaggerGroup className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-24 lg:gap-x-10">
            {photos.map((photo, index) => (
              <article key={photo.id} data-motion-item className={selectedLayout[index % selectedLayout.length]}>
                <Link href={`/${locale}/photo/${photo.id}`} className="group block">
                  <NarrativeImage
                    photo={photo}
                    sizes="(max-width: 767px) 100vw, 58vw"
                    failPrimary={failImages}
                    slow={slowImages}
                    className="border border-border transition-colors group-hover:border-[var(--color-border-strong)]"
                    imageClassName="transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.018] group-hover:brightness-[0.88]"
                  />
                  <div className="mt-5 flex items-start justify-between gap-4 border-t border-border pt-4">
                    <div>
                      <h3 className="font-serif text-xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent sm:text-2xl">{photo.title}</h3>
                      <p className="rv-meta mt-2">{galleryDictionary.categories[photo.category]} / {photo.year}</p>
                    </div>
                    <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="sr-only">{dictionary.selected.cta}</span>
                </Link>
              </article>
            ))}
          </StaggerGroup>
        )}
      </Container>
    </section>
  );
}
