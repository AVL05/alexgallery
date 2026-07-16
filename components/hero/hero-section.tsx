"use client";

import { Container } from "@/components/ui/layout";
import { HeroContent } from "@/components/hero/hero-content";
import { HeroMedia, type HeroImageState } from "@/components/hero/hero-media";
import { useHeroMotion } from "@/components/hero/use-hero-motion";
import { useMotion } from "@/components/motion/motion-provider";
import { getHeroArchiveFacts, getHeroImages } from "@/lib/hero/config";
import {
  HERO_PREVIEW_EVENT,
  reportHeroState,
  type HeroPreviewOptions,
} from "@/lib/hero/development";
import type { HeroDictionary } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function HeroSection({
  dictionary,
  imagesData,
  entryReady,
}: {
  dictionary: HeroDictionary;
  imagesData: ImagesData;
  entryReady: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { primary, fallback } = useMemo(() => getHeroImages(imagesData), [imagesData]);
  const facts = useMemo(() => getHeroArchiveFacts(), []);
  const { prefersReducedMotion, isTouchDevice } = useMotion();
  const [preview, setPreview] = useState<HeroPreviewOptions>({});
  const [replayKey, setReplayKey] = useState(0);
  const [imageState, setImageState] = useState<HeroImageState>("loading");
  const imageStateRef = useRef<HeroImageState>("loading");
  const phaseRef = useRef<"waiting" | "playing" | "settled">("waiting");
  const durationRef = useRef(0);

  const reportPhase = useCallback(
    (phase: "waiting" | "playing" | "settled", duration: number) => {
      phaseRef.current = phase;
      durationRef.current = duration;
      reportHeroState({ ...preview, phase, imageState: imageStateRef.current, duration });
    },
    [preview],
  );

  const handleImageState = useCallback((state: HeroImageState) => {
    imageStateRef.current = state;
    setImageState(state);
  }, []);

  useHeroMotion({
    scope: rootRef,
    entryReady,
    replayKey,
    prefersReducedMotion,
    isTouchDevice,
    forceReducedMotion: preview.reducedMotion === true,
    finalState: preview.finalState === true,
    onPhaseChange: reportPhase,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handlePreview = (event: Event) => {
      const options = (event as CustomEvent<HeroPreviewOptions>).detail ?? {};
      setPreview(options);
      setReplayKey((value) => value + 1);
    };
    window.addEventListener(HERO_PREVIEW_EVENT, handlePreview);
    return () => window.removeEventListener(HERO_PREVIEW_EVENT, handlePreview);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      reportHeroState({
        ...preview,
        phase: phaseRef.current,
        imageState,
        duration: durationRef.current,
      });
    }
  }, [entryReady, imageState, preview]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative min-h-[100svh] h-[100dvh] overflow-hidden bg-background text-foreground"
      data-hero
      data-entry-ready={entryReady}
      data-image-state={imageState}
    >
      <HeroMedia
        primary={primary}
        fallback={fallback}
        alt={dictionary.imageAlt}
        slowImage={preview.slowImage === true}
        failImage={preview.failImage === true}
        onStateChange={handleImageState}
      />
      <Container className="relative z-10 h-full">
        <HeroContent dictionary={dictionary} facts={facts} />
      </Container>
    </section>
  );
}
