"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { useMotion } from "@/components/motion/motion-provider";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { motionEase, shouldShowMotionMarkers } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";
import type { NarrativePhoto } from "@/lib/home/selectors";
import type { GalleryDictionary, HomeDictionary, Locale } from "@/types/dictionary";
import Link from "next/link";
import { useRef } from "react";

export function ExpansivePhoto({
  photo,
  dictionary,
  galleryDictionary,
  locale,
  failImages,
  forceReducedMotion,
  slowImages,
}: {
  photo: NarrativePhoto;
  dictionary: HomeDictionary;
  galleryDictionary: GalleryDictionary;
  locale: Locale;
  failImages?: boolean;
  forceReducedMotion?: boolean;
  slowImages?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { isTouchDevice, prefersReducedMotion } = useMotion();
  const reducedMotion = prefersReducedMotion || forceReducedMotion;

  useGSAP(() => {
    const root = rootRef.current;
    const media = root?.querySelector<HTMLElement>("[data-expansive-media]");
    if (!root || !media || reducedMotion || isTouchDevice) {
      if (media) gsap.set(media, { clearProps: "transform,willChange" });
      return;
    }

    const clearWillChange = applyTemporaryWillChange(media, "transform");
    const tween = gsap.fromTo(media, { scale: 0.82 }, {
      scale: 1,
      ease: motionEase.linear,
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        end: "bottom bottom",
        scrub: 0.75,
        markers: shouldShowMotionMarkers(),
        onLeave: clearWillChange,
        onLeaveBack: clearWillChange,
      },
    });

    return () => {
      clearWillChange();
      tween.kill();
    };
  }, { dependencies: [isTouchDevice, reducedMotion], scope: rootRef, revertOnUpdate: true });

  return (
    <section ref={rootRef} id="expansive-image" className="relative bg-[var(--color-background)] lg:min-h-[145svh]">
      <div className="rv-section lg:sticky lg:top-0 lg:flex lg:min-h-[100svh] lg:items-center">
        <Container className="w-full">
          <Reveal className="mb-10 flex items-end justify-between border-t border-border pt-8 md:mb-12">
            <div>
              <SectionMarker current={4} label={dictionary.chapterLabel} />
              <p className="rv-kicker mt-5">{dictionary.expansive.label}</p>
            </div>
            <p className="rv-meta hidden sm:block">{galleryDictionary.categories[photo.category]} / {photo.year}</p>
          </Reveal>
          <div data-expansive-media className="origin-center">
            <Link href={`/${locale}/photo/${photo.id}`} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
              <NarrativeImage
                photo={photo}
                sizes="100vw"
                failPrimary={failImages}
                slow={slowImages}
                className="border border-border"
                imageClassName="transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.01] group-hover:brightness-90 group-focus-visible:scale-[1.01] group-focus-visible:brightness-90"
              />
            </Link>
            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
              <h2 className="font-serif text-[clamp(1.8rem,4vw,4rem)] leading-none tracking-[-0.03em]">{photo.title}</h2>
              <Link href={`/${locale}/photo/${photo.id}`} className="rv-editorial-link shrink-0" data-press-feedback {...getCursorTargetAttributes({ type: "view" })}>{dictionary.expansive.cta}</Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
