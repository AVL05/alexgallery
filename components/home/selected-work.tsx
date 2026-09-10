import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { WorkEntry } from "@/components/work/work-entry";
import { resolveWorkEntryVariant } from "@/lib/photos/selectors";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import { homeExperienceConfig } from "@/lib/home/experience";

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
        <Reveal>
          <SectionHeader
            as="h2"
            tone="page"
            eyebrow={`${String(photos.length).padStart(2, "0")} ${galleryDictionary.photoPlural}`}
            title={dictionary.selected.title}
          />
        </Reveal>

        {photos.length === 0 ? (
          <p className="mt-16 border-y border-border py-12 text-[var(--color-text-secondary)]">{dictionary.selected.empty}</p>
        ) : (
          <PhotoMotionGroup groupKey={`selected-${photos.map((photo) => photo.id).join("-")}`} className="mt-16 space-y-24 md:space-y-36 lg:mt-24 lg:space-y-44">
            {photos.map((photo, index) => (
              <WorkEntry
                key={photo.id}
                photo={photo}
                locale={locale}
                galleryDictionary={galleryDictionary}
                index={index}
                total={photos.length}
                variant={resolveWorkEntryVariant(photo, index, photos.length)}
                prefetch={homeExperienceConfig.prefetch.selectedWork}
                ctaLabel={dictionary.selected.cta}
                failImages={failImages}
                slowImages={slowImages}
              />
            ))}
          </PhotoMotionGroup>
        )}
      </Container>
    </section>
  );
}
