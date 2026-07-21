"use client";

import { NarrativeImage } from "@/components/home/narrative-image";
import { SectionMarker } from "@/components/home/section-marker";
import { useMotion } from "@/components/motion/motion-provider";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { motionEase, shouldShowMotionMarkers } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { photoMotionConfig, photoMotionTokens } from "@/lib/motion/photo-motion";
import { usePhotoMotionRuntime } from "@/hooks/use-photo-motion-runtime";
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
  const runtime = usePhotoMotionRuntime();
  const reducedMotion = prefersReducedMotion || forceReducedMotion;

  useGSAP(() => {
    const root = rootRef.current;
    const media = root?.querySelector<HTMLElement>("[data-expansive-media]");
    const overlay = root?.querySelector<HTMLElement>("[data-expansive-overlay]");
    const metadata = root?.querySelector<HTMLElement>("[data-expansive-meta]");
    const motionDisabled = !runtime.enabled || !runtime.gsap || !runtime.scrollTrigger || !photoMotionConfig.scrubs;
    if (!root || !media || reducedMotion || isTouchDevice || motionDisabled) {
      if (media) gsap.set(media, { clearProps: "clipPath,borderRadius,transform,willChange" });
      if (overlay) gsap.set(overlay, { clearProps: "opacity" });
      if (metadata) gsap.set(metadata, { clearProps: "opacity,transform" });
      return;
    }

    const clearWillChange = applyTemporaryWillChange(media, "transform, clip-path");
    gsap.set(media, {
      scale: photoMotionTokens.expansive.startScale,
      clipPath: `inset(${photoMotionTokens.expansive.inset}% round ${photoMotionTokens.expansive.radius}px)`,
      borderRadius: photoMotionTokens.expansive.radius,
    });
    if (overlay) gsap.set(overlay, { opacity: 0.28 });
    if (metadata) gsap.set(metadata, { opacity: 0, y: 12 });
    const timeline = gsap.timeline({
      defaults: { ease: motionEase.linear },
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        end: "bottom bottom",
        scrub: photoMotionTokens.expansive.scrub,
        markers: shouldShowMotionMarkers(),
        onLeave: clearWillChange,
        onLeaveBack: clearWillChange,
      },
    });
    timeline.to(media, { scale: 1, clipPath: "inset(0% round 0px)", borderRadius: 0 }, 0);
    if (overlay) timeline.to(overlay, { opacity: 0.08 }, 0);
    if (metadata) timeline.to(metadata, { opacity: 1, y: 0 }, 0.58);

    return () => {
      clearWillChange();
      timeline.kill();
    };
  }, { dependencies: [isTouchDevice, reducedMotion, runtime.enabled, runtime.gsap, runtime.scrollTrigger], scope: rootRef, revertOnUpdate: true });

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
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <div data-expansive-media className="relative origin-center overflow-hidden">
              <Link href={`/${locale}/photo/${photo.id}`} className="group block" data-press-feedback {...getCursorTargetAttributes({ type: "view", contrast: "dark" })}>
                <NarrativeImage
                  photo={photo}
                  sizes="100vw"
                  failPrimary={failImages}
                  slow={slowImages}
                  imageClassName="transition-[transform,filter,opacity] duration-500 group-hover:scale-[1.015] group-hover:brightness-90 group-focus-visible:scale-[1.015] group-focus-visible:brightness-90"
                />
                <span data-expansive-overlay aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" />
              </Link>
            </div>
            <div data-expansive-meta className="rv-container mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
              <h2 className="font-serif text-[clamp(1.8rem,4vw,4rem)] leading-none tracking-[-0.03em]">{photo.title}</h2>
              <Link href={`/${locale}/photo/${photo.id}`} className="rv-editorial-link shrink-0" data-press-feedback {...getCursorTargetAttributes({ type: "view" })}>{dictionary.expansive.cta}</Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
