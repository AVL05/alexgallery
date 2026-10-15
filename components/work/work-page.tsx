import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { WorkEntry } from "@/components/work/work-entry";
import { resolveWorkEntryVariant } from "@/lib/photos/selectors";
import { workHref } from "@/lib/routes";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import { homeExperienceConfig } from "@/lib/home/experience";

// Dedicated /work page: the same curated selection as Selected Work in a
// slower, more spacious sequence. Entries are shared, not duplicated.
export function WorkPage({
  photos,
  locale,
  galleryDictionary,
  title,
  selectedCta,
  introduction,
}: {
  photos: NarrativePhoto[];
  locale: Locale;
  galleryDictionary: GalleryDictionary;
  title: string;
  selectedCta: string;
  introduction: string;
}) {
  const originHref = workHref(locale);
  return (
    <div id="work-top" className="pb-24 pt-32 lg:pb-36 lg:pt-40">
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            tone="page"
            eyebrow={`${String(photos.length).padStart(2, "0")} ${galleryDictionary.photoPlural}`}
            title={title}
            intro={introduction}
          />
        </Reveal>

        <PhotoMotionGroup groupKey={`work-${photos.map((photo) => photo.id).join("-")}`} className="mt-16 space-y-28 md:space-y-44 lg:mt-24 lg:space-y-56">
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
              ctaLabel={selectedCta}
              returnHref={originHref}
            />
          ))}
        </PhotoMotionGroup>
      </Container>
    </div>
  );
}
