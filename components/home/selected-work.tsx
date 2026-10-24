"use client";

import { PhotoMotionGroup } from "@/components/motion/photo-reveal";
import { Container } from "@/components/ui/layout";
import { WorkEntry } from "@/components/work/work-entry";
import { readPhotoReturn } from "@/lib/archive/context";
import { homeExperienceConfig } from "@/lib/home/experience";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import { useEffect, useRef } from "react";

export function SelectedWork({ photos, dictionary, galleryDictionary, locale, failImages, slowImages }: {
  photos: NarrativePhoto[];
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  locale: Locale;
  failImages?: boolean;
  slowImages?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = readPhotoReturn(locale);
    if (window.location.hash !== "#selected-work" || saved?.returnHref !== `/${locale}#selected-work`) return;
    const link = rootRef.current?.querySelector<HTMLAnchorElement>(`[data-exhibition-photo="${saved.photoId}"] a`);
    if (!link) return;
    // Wait for the route's hash scroll before restoring the photograph.
    const frame = window.requestAnimationFrame(() => {
      link.scrollIntoView({ block: "center", behavior: "instant" });
      link.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locale]);

  return (
    <section id="selected-work" ref={rootRef} aria-labelledby="selection-title" className="rv-section bg-background">
      <Container>
        <div className="rv-home-section-header">
          <h2 id="selection-title" className="rv-home-heading">{dictionary.selected.title}</h2>
          <p className="rv-body-sm max-w-[35ch]">{dictionary.selected.description}</p>
        </div>
        {photos.length === 0 ? <p className="rv-body py-12">{dictionary.selected.empty}</p> : (
          <PhotoMotionGroup groupKey={`home-selection-${photos.map(photo => photo.id).join("-")}`} className="rv-exhibition-grid">
            {photos.map((photo, index) => (
              <div key={photo.id} data-exhibition-photo={photo.id} className="rv-exhibition-print">
                <WorkEntry photo={photo} locale={locale} galleryDictionary={galleryDictionary} index={index} total={photos.length} variant="exhibition"
                  prefetch={homeExperienceConfig.prefetch.selectedWork} ctaLabel={dictionary.selected.cta} failImages={failImages} slowImages={slowImages} />
              </div>
            ))}
          </PhotoMotionGroup>
        )}
      </Container>
    </section>
  );
}
